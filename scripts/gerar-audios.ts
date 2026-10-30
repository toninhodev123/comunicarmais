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
 *     bun run audio -- --voz=pt-BR-AntonioNeural --banco=masculina
 *
 * Outras opções: --forcar regrava o que já existe; --so=frases|palavras limita
 * o lote (útil para gastar crédito só onde a voz importa mais);
 * --atualizar-lista só reescreve src/lib/data/audios.ts a partir das pastas.
 *
 * Cada --banco é uma voz guardada em public/audio/<banco>/; o app mostra todas
 * em Personalizar para a pessoa escolher. Sem --banco, grava em "padrao".
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

import { phonemes, silabasDe } from "../src/lib/data/phonemes";
import { categories } from "../src/lib/data/vocabulary";
import { tongueTwisters } from "../src/lib/data/tongueTwisters";
import { socialPhrases } from "../src/lib/data/socialSkills";
import { memoryWords } from "../src/lib/data/memoryWords";
import { slugDeTexto } from "../src/lib/voz";

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const RAIZ = path.resolve(import.meta.dirname, "..");
const PASTA_AUDIO = path.join(RAIZ, "public", "audio");
const BANCO_PADRAO = "padrao";
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
    add(silabasDe(fonema), "palavras");
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

/** Chave recusada: insistir nos outros 459 textos não adianta. */
class ErroDeChave extends Error {}
/** Voz que o plano não libera por API — idem. */
class ErroDePlano extends Error {}

interface Provedor {
  nome: string;
  voz: string;
  gravar: (texto: string, destinoSemExtensao: string) => Promise<void>;
  /** Fecha conexões abertas, para o processo não ficar pendurado no fim. */
  encerrar?: () => void;
}

/**
 * Conecta ao Edge TTS, repetindo quando o handshake cai (o serviço recusa de
 * vez em quando com "Expected 101 status code" e, no Bun, a biblioteca não
 * consegue fazer sozinha a correção de relógio que trataria isso).
 */
async function conectarEdge(voz: string) {
  let ultimoErro: unknown;
  for (let tentativa = 1; tentativa <= 5; tentativa++) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(voz, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      return tts;
    } catch (erro) {
      ultimoErro = erro;
      if (tentativa < 5) {
        console.log(`  conexão com o Edge falhou (tentativa ${tentativa}), tentando de novo...`);
        await esperar(2000 * tentativa);
      }
    }
  }
  throw new Error(
    `Não consegui conectar ao Edge TTS: ${ultimoErro instanceof Error ? ultimoErro.message : ultimoErro}`,
  );
}

async function provedorEdge(): Promise<Provedor> {
  const voz = argumento("voz") ?? VOZ_EDGE_PADRAO;
  // Um tiquinho mais devagar que o normal: fica mais fácil de acompanhar.
  const ritmo = Number(argumento("ritmo") ?? 0.92);
  if (!Number.isFinite(ritmo) || ritmo <= 0) throw new Error(`Ritmo inválido: ${ritmo}`);
  let tts = await conectarEdge(voz);
  return {
    nome: "Edge (Microsoft)",
    voz,
    gravar: async (texto, destino) => {
      // O texto entra num SSML: escapamos o que quebraria o XML.
      const seguro = texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      // toFile() grava "audio.mp3" dentro de uma pasta; aqui queremos o nome
      // exato do arquivo, então juntamos o stream e escrevemos nós mesmos.
      const sintetizar = async () => {
        const { audioStream } = tts.toStream(seguro, { rate: ritmo });
        const pedacos: Buffer[] = [];
        await new Promise<void>((resolve, reject) => {
          audioStream.on("data", (parte: Buffer) => pedacos.push(Buffer.from(parte)));
          audioStream.on("close", resolve);
          audioStream.on("error", reject);
        });
        if (pedacos.length === 0) throw new Error("o servidor não devolveu áudio");
        return Buffer.concat(pedacos);
      };

      let audio: Buffer;
      try {
        audio = await sintetizar();
      } catch {
        // Conexão caiu no meio de um lote longo: reconecta e tenta de novo.
        tts.close();
        tts = await conectarEdge(voz);
        audio = await sintetizar();
      }
      await writeFile(`${destino}.mp3`, audio);
    },
    encerrar: () => tts.close(),
  };
}

function chaveEleven() {
  // Espaço ou quebra de linha na colagem (acontece muito no secret do GitHub)
  // faz a API recusar com "API key must be exactly 51 characters".
  const chave = process.env.ELEVENLABS_API_KEY?.trim();
  if (!chave) {
    throw new Error(
      "Falta a chave: export ELEVENLABS_API_KEY=sk_... (pegue em elevenlabs.io → perfil → API keys)",
    );
  }
  if (!/^sk_[A-Za-z0-9]+$/.test(chave)) {
    throw new Error(
      `A chave não parece uma chave do ElevenLabs (${chave.length} caracteres, esperado 51 começando com "sk_"). Recadastre o secret colando só a chave, sem espaços.`,
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
        const corpo = (await resposta.text()).slice(0, 300);
        if (resposta.status === 402 || corpo.includes("paid_plan_required")) {
          throw new ErroDePlano(
            `A voz ${voz} não é liberada por API no seu plano do ElevenLabs. ` +
              `Vozes da Voice Library só funcionam por API em plano pago; use uma voz padrão ` +
              `(categoria "premade") — rode com --listar-vozes para ver quais são — ou grave ` +
              `com --provedor=edge, que não tem essa limitação.\n${corpo}`,
          );
        }
        if (corpo.includes("invalid_api_key") || resposta.status === 401) {
          throw new ErroDeChave(
            `Chave recusada pelo ElevenLabs (HTTP ${resposta.status}). A chave guardada tem ` +
              `${chave.length} caracteres. Recadastre o secret ELEVENLABS_API_KEY colando ` +
              `apenas a chave, sem espaços nem caracteres extras.\n${corpo}`,
          );
        }
        throw new Error(`HTTP ${resposta.status}: ${corpo}`);
      }
      await writeFile(`${destino}.mp3`, Buffer.from(await resposta.arrayBuffer()));
    },
  };
}

interface VozEleven {
  voice_id: string;
  name: string;
  /** "premade" (padrão da plataforma), "cloned", "generated", "professional"... */
  category?: string;
  labels?: Record<string, string>;
}

async function vozesEleven(chave: string): Promise<VozEleven[]> {
  const resposta = await fetch("https://api.elevenlabs.io/v2/voices?page_size=100", {
    headers: { "xi-api-key": chave },
  });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}: ${await resposta.text()}`);
  const dados = (await resposta.json()) as { voices: VozEleven[] };
  return dados.voices ?? [];
}

/** Vozes da Voice Library exigem plano pago para uso por API. */
function liberadaPorApi(v: VozEleven) {
  return v.category !== "famous" && v.category !== "high_quality";
}

async function primeiraVozEleven(chave: string) {
  const vozes = await vozesEleven(chave);
  if (vozes.length === 0) throw new Error("Nenhuma voz na conta do ElevenLabs.");
  // Prefere uma voz padrão da plataforma: é a que o plano gratuito usa por API.
  const escolhida = vozes.find((v) => v.category === "premade" && liberadaPorApi(v)) ?? vozes[0];
  console.log(`Nenhuma voz informada — usando "${escolhida.name}" (${escolhida.voice_id}).`);
  return escolhida.voice_id;
}

async function listarVozes(provedor: string) {
  if (provedor === "elevenlabs") {
    for (const v of await vozesEleven(chaveEleven())) {
      const rotulos = Object.values(v.labels ?? {}).join(", ");
      const marca = liberadaPorApi(v) ? "   " : "[$]";
      console.log(
        `${marca} ${v.voice_id}  ${v.name.padEnd(22)} ${(v.category ?? "").padEnd(14)} ${rotulos}`,
      );
    }
    console.log("\n[$] = voz da Voice Library: por API, só em plano pago.");
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
  const banco = (argumento("banco") ?? BANCO_PADRAO).toLowerCase();
  if (!/^[a-z0-9-]+$/.test(banco)) {
    throw new Error(`Nome de banco inválido: "${banco}" (use letras, números e hífen).`);
  }
  const pastaBanco = path.join(PASTA_AUDIO, banco);
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

  await mkdir(pastaBanco, { recursive: true });
  console.log(`Provedor: ${provedor.nome}`);
  console.log(`Voz: ${provedor.voz}`);
  console.log(`Banco: ${banco} (public/audio/${banco})`);
  console.log(
    `Textos: ${textos.length} (${caracteres} caracteres)${forcar ? " — regravando tudo" : ""}`,
  );

  let gravados = 0;
  let pulados = 0;
  let falhas = 0;
  let falhasSeguidas = 0;
  for (const [i, { texto }] of textos.entries()) {
    const slug = slugDeTexto(texto);
    const destino = path.join(pastaBanco, slug);
    if (!forcar && existsSync(`${destino}.mp3`)) {
      pulados++;
      continue;
    }
    try {
      await provedor.gravar(texto, destino);
      gravados++;
      falhasSeguidas = 0;
      if (gravados % 25 === 0) console.log(`  ${i + 1}/${textos.length}...`);
    } catch (erro) {
      falhas++;
      falhasSeguidas++;
      console.error(`Falhou "${texto}":`, erro instanceof Error ? erro.message : erro);
      if (erro instanceof ErroDeChave || erro instanceof ErroDePlano) break;
      // Crédito no fim ou voz inválida: não adianta insistir mais 400 vezes.
      if (falhasSeguidas >= 5) {
        console.error("Cinco falhas seguidas — parando. Confira a voz e os créditos.");
        break;
      }
    }
  }

  provedor.encerrar?.();
  await escreverLista();
  console.log(`Pronto: ${gravados} gravados, ${pulados} já existiam, ${falhas} falharam.`);

  // Sem isso o job termina verde mesmo sem gravar nada — e o erro passa batido.
  if (falhas > 0) {
    console.error(
      gravados === 0
        ? "Nenhum áudio foi gravado. Veja o erro acima — nada foi alterado no repositório."
        : `${falhas} texto(s) não foram gravados. Rode de novo para completar.`,
    );
    process.exitCode = 1;
  }
}

/** Reescreve src/lib/data/audios.ts a partir das pastas em public/audio. */
async function escreverLista() {
  const entradas = existsSync(PASTA_AUDIO)
    ? await readdir(PASTA_AUDIO, { withFileTypes: true })
    : [];
  const bancos: Record<string, string[]> = {};
  for (const entrada of entradas) {
    if (!entrada.isDirectory()) continue;
    const arquivos = await readdir(path.join(PASTA_AUDIO, entrada.name));
    const slugs = arquivos
      .filter((f) => f.endsWith(".mp3"))
      .map((f) => f.replace(/\.mp3$/, ""))
      .sort();
    if (slugs.length > 0) bancos[entrada.name] = slugs;
  }

  const corpo = Object.entries(bancos)
    .map(([nome, slugs]) => {
      // Chave sem aspas quando dá, para o arquivo gerado já sair no formato
      // que o prettier exige (o lint roda em cima dele).
      const chave = /^[a-zA-Z_$][\w$]*$/.test(nome) ? nome : `"${nome}"`;
      return `  ${chave}: [\n${slugs.map((s) => `    "${s}",`).join("\n")}\n  ],`;
    })
    .join("\n");

  await writeFile(
    ARQUIVO_LISTA,
    `// ARQUIVO GERADO — não edite à mão.
// Rode \`bun run audio\` (ou o workflow "Gerar áudios") para gravar os arquivos
// em public/audio/<banco>/ e atualizar esta lista. Cada banco é uma voz; os
// itens são os nomes dos arquivos, sem extensão. Sem bancos aqui, o app fala
// com a voz do próprio navegador.

export const bancosDeAudio: Record<string, string[]> = ${corpo ? `{\n${corpo}\n}` : "{}"};
`,
  );
  const total = Object.values(bancos).reduce((n, s) => n + s.length, 0);
  console.log(
    `Lista atualizada: ${total} áudios em ${Object.keys(bancos).length} banco(s) ` +
      `(${Object.keys(bancos).join(", ") || "nenhum"}).`,
  );
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
