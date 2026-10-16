/**
 * Grava, de uma vez só, todos os áudios que o app fala — palavras dos fonemas,
 * vocabulário, trava-línguas, frases sociais e palavras da memória. Os arquivos
 * viram public/audio/<slug>.mp3 e entram no commit: em produção o app só baixa
 * o mp3, sem depender da voz instalada no aparelho e sem chave de API no site.
 *
 * Dois provedores, os dois de graça:
 *
 *   ElevenLabs (voz quase real, precisa de chave e gasta créditos)
 *     export ELEVENLABS_API_KEY=sk_...
 *     bun run audio -- --provedor=elevenlabs --listar-vozes
 *     bun run audio -- --provedor=elevenlabs --voz=<id_da_voz>
 *
 *   Edge / Microsoft (neural, sem chave e sem limite — bom para recomeçar)
 *     bun run audio -- --listar-vozes
 *     bun run audio -- --voz=pt-BR-AntonioNeural
 *
 * Outras opções: --forcar regrava o que já existe; --so=frases|palavras limita
 * o lote (útil para gastar crédito só onde a voz importa mais);
 * --atualizar-lista só reescreve src/lib/data/audios.ts a partir da pasta.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

import { phonemes } from "../src/lib/data/phonemes";
import { categories } from "../src/lib/data/vocabulary";
import { tongueTwisters } from "../src/lib/data/tongueTwisters";
import { socialPhrases } from "../src/lib/data/socialSkills";
import { memoryWords } from "../src/lib/data/memoryWords";
import { slugDeTexto } from "../src/lib/voz";

const RAIZ = path.resolve(import.meta.dirname, "..");
const PASTA_AUDIO = path.join(RAIZ, "public", "audio");
const ARQUIVO_LISTA = path.join(RAIZ, "src", "lib", "data", "audios.ts");

const VOZ_EDGE_PADRAO = "pt-BR-ThalitaMultilingualNeural";
/** Modelo do ElevenLabs que fala português com naturalidade. */
const MODELO_ELEVEN = "eleven_multilingual_v2";
/** Frase de teste usada na tela Personalizar. */
const FRASE_TESTE = "Oi! Eu sou a voz que vai falar com você.";

function argumento(nome: string) {
  const prefixo = `--${nome}=`;
  return process.argv.find((a) => a.startsWith(prefixo))?.slice(prefixo.length);
}
const temFlag = (nome: string) => process.argv.includes(`--${nome}`);

interface Texto {
  texto: string;
  /** "palavras" = palavra solta; "frases" = trava-língua ou frase social. */
  tipo: "palavras" | "frases";
}

/** Todo texto que alguma tela manda falar, sem repetições. */
function textosDoApp(): Texto[] {
  const porSlug = new Map<string, Texto>();
  const add = (texto: string, tipo: Texto["tipo"]) => {
    const limpo = texto.trim();
    if (!limpo) return;
    const slug = slugDeTexto(limpo);
    if (!porSlug.has(slug)) porSlug.set(slug, { texto: limpo, tipo });
  };

  for (const fonema of phonemes) {
    for (const w of fonema.words) add(w.word, "palavras");
    // Botão "ouvir as sílabas" da tela de fonemas.
    add(`${fonema.letter}a, ${fonema.letter}e, ${fonema.letter}i`, "palavras");
  }
  for (const categoria of categories) {
    for (const item of categoria.items) {
      add(item.name, "palavras");
      for (const parte of item.parts) add(parte.name, "palavras");
    }
  }
  for (const t of tongueTwisters) add(t.text, "frases");
  for (const f of socialPhrases) add(f.text, "frases");
  for (const m of memoryWords) add(m.word, "palavras");
  add(FRASE_TESTE, "frases");

  return [...porSlug.values()];
}

// ---------------------------------------------------------------- provedores

interface Provedor {
  nome: string;
  voz: string;
  gravar: (texto: string, destinoSemExtensao: string) => Promise<void>;
}

async function provedorEdge(): Promise<Provedor> {
  const voz = argumento("voz") ?? VOZ_EDGE_PADRAO;
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voz, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  return {
    nome: "Edge (Microsoft)",
    voz,
    gravar: async (texto, destino) => {
      // O texto entra num SSML: escapamos o que quebraria o XML.
      const seguro = texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      await tts.toFile(destino, seguro);
    },
  };
}

function chaveEleven() {
  const chave = process.env.ELEVENLABS_API_KEY;
  if (!chave) {
    throw new Error(
      "Falta a chave: export ELEVENLABS_API_KEY=sk_... (pegue em elevenlabs.io → perfil → API keys)",
    );
  }
  return chave;
}

async function provedorEleven(): Promise<Provedor> {
  const chave = chaveEleven();
  const voz =
    argumento("voz") ?? process.env.ELEVENLABS_VOICE_ID ?? (await primeiraVozEleven(chave));
  return {
    nome: `ElevenLabs (${MODELO_ELEVEN})`,
    voz,
    gravar: async (texto, destino) => {
      const resposta = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voz}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: { "xi-api-key": chave, "content-type": "application/json" },
          body: JSON.stringify({
            text: texto,
            model_id: MODELO_ELEVEN,
            voice_settings: { stability: 0.5, similarity_boost: 0.8, speed: 0.9 },
          }),
        },
      );
      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}: ${(await resposta.text()).slice(0, 200)}`);
      }
      await writeFile(`${destino}.mp3`, Buffer.from(await resposta.arrayBuffer()));
    },
  };
}

async function vozesEleven(chave: string) {
  const resposta = await fetch("https://api.elevenlabs.io/v2/voices?page_size=100", {
    headers: { "xi-api-key": chave },
  });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}: ${await resposta.text()}`);
  const dados = (await resposta.json()) as {
    voices: { voice_id: string; name: string; labels?: Record<string, string> }[];
  };
  return dados.voices ?? [];
}

async function primeiraVozEleven(chave: string) {
  const vozes = await vozesEleven(chave);
  if (vozes.length === 0) throw new Error("Nenhuma voz na conta do ElevenLabs.");
  console.log(`Nenhuma voz informada — usando "${vozes[0].name}" (${vozes[0].voice_id}).`);
  return vozes[0].voice_id;
}

async function listarVozes(provedor: string) {
  if (provedor === "elevenlabs") {
    for (const v of await vozesEleven(chaveEleven())) {
      const rotulos = Object.values(v.labels ?? {}).join(", ");
      console.log(`${v.voice_id}  ${v.name.padEnd(22)} ${rotulos}`);
    }
    return;
  }
  const tts = new MsEdgeTTS();
  const vozes = await tts.getVoices();
  for (const v of vozes.filter((x) => x.Locale.startsWith("pt"))) {
    console.log(`${v.ShortName.padEnd(38)} ${v.Gender.padEnd(8)} ${v.Locale}`);
  }
}

// -------------------------------------------------------------------- gerar

async function gerar(nomeProvedor: string) {
  const forcar = temFlag("forcar");
  const so = argumento("so");
  const todos = textosDoApp();
  const textos = so ? todos.filter((t) => t.tipo === so) : todos;
  if (textos.length === 0) {
    console.error(`Nada a gravar para --so=${so} (use "palavras" ou "frases").`);
    process.exitCode = 1;
    return;
  }

  const provedor = nomeProvedor === "elevenlabs" ? await provedorEleven() : await provedorEdge();
  const caracteres = textos.reduce((n, t) => n + t.texto.length, 0);

  await mkdir(PASTA_AUDIO, { recursive: true });
  console.log(`Provedor: ${provedor.nome}`);
  console.log(`Voz: ${provedor.voz}`);
  console.log(
    `Textos: ${textos.length} (${caracteres} caracteres)${forcar ? " — regravando tudo" : ""}`,
  );

  let gravados = 0;
  let pulados = 0;
  let falhas = 0;
  for (const [i, { texto }] of textos.entries()) {
    const slug = slugDeTexto(texto);
    const destino = path.join(PASTA_AUDIO, slug);
    if (!forcar && existsSync(`${destino}.mp3`)) {
      pulados++;
      continue;
    }
    try {
      await provedor.gravar(texto, destino);
      gravados++;
      if (gravados % 25 === 0) console.log(`  ${i + 1}/${textos.length}...`);
    } catch (erro) {
      falhas++;
      console.error(`Falhou "${texto}":`, erro instanceof Error ? erro.message : erro);
      // Chave inválida ou crédito no fim: não adianta insistir mais 400 vezes.
      if (falhas >= 5) {
        console.error("Cinco falhas seguidas — parando. Confira a chave, a voz e os créditos.");
        break;
      }
    }
  }

  await escreverLista();
  console.log(`Pronto: ${gravados} gravados, ${pulados} já existiam, ${falhas} falharam.`);
}

/** Reescreve src/lib/data/audios.ts a partir do que está em public/audio. */
async function escreverLista() {
  const arquivos = existsSync(PASTA_AUDIO) ? await readdir(PASTA_AUDIO) : [];
  const slugs = arquivos
    .filter((f) => f.endsWith(".mp3"))
    .map((f) => f.replace(/\.mp3$/, ""))
    .sort();

  const lista = slugs.length === 0 ? "[]" : `[\n${slugs.map((s) => `  "${s}",`).join("\n")}\n]`;
  await writeFile(
    ARQUIVO_LISTA,
    `// ARQUIVO GERADO — não edite à mão.
// Rode \`bun run audio\` para gravar os áudios em public/audio e atualizar esta lista.
// Cada item é o nome do arquivo (sem extensão) dentro de /audio.
// Com a lista vazia o app usa a voz do próprio navegador.

export const audiosGravados: string[] = ${lista};

export const audiosDisponiveis = new Set(audiosGravados);
`,
  );
  console.log(`Lista atualizada: ${slugs.length} áudios em src/lib/data/audios.ts`);
}

const provedorEscolhido = argumento("provedor") ?? "edge";
try {
  if (temFlag("atualizar-lista")) await escreverLista();
  else if (temFlag("listar-vozes")) await listarVozes(provedorEscolhido);
  else await gerar(provedorEscolhido);
} catch (erro) {
  // Erro esperado (chave faltando, rede fora): mensagem limpa, sem stack.
  console.error(erro instanceof Error ? erro.message : erro);
  process.exitCode = 1;
}
