# Vozes do Comunicar+

O app fala de duas maneiras, nesta ordem:

1. **Áudio gravado** (`public/audio/<banco>/<slug>.mp3`). Voz neural de verdade,
   idêntica em qualquer celular ou computador. Cada **banco** é uma voz (por
   exemplo `feminina` e `masculina`) e aparece em *Personalizar → Voz do
   aplicativo* para a pessoa escolher.
2. **Voz do navegador** (Web Speech API), usada só quando a frase não tem gravação.
   A pessoa escolhe qual em *Personalizar → Voz do aplicativo*.

O app publicado **não** chama nenhuma API de voz: ele só baixa os mp3. Toda a geração
acontece na sua máquina, uma vez, e os arquivos entram no commit.

## Gravando pelo GitHub (sem instalar nada)

Em **Settings → Secrets and variables → Actions → New repository secret**, crie
`ELEVENLABS_API_KEY` com a chave da sua conta. Depois vá em **Actions → Gerar
áudios → Run workflow**, escolha o provedor e (opcional) o id da voz. O robô grava
os mp3 e comita `public/audio/` + `src/lib/data/audios.ts` na branch escolhida.

Com o provedor `edge` não precisa de chave nenhuma.

## Gravando os áudios

São 459 áudios no total (~3.700 caracteres) — todas as palavras dos fonemas, o
vocabulário, os trava-línguas, as frases sociais e as palavras da memória.

### ElevenLabs (voz quase real)

O plano grátis dá 10.000 créditos por mês, então o app inteiro cabe de sobra
(~3.700). A chave sai em elevenlabs.io → foto do perfil → *API keys*.

```bash
export ELEVENLABS_API_KEY=sk_...

bun run audio -- --provedor=elevenlabs --listar-vozes     # ids das suas vozes
bun run audio -- --provedor=elevenlabs --voz=<id> --banco=feminina
```

> **Plano gratuito**: vozes da *Voice Library* (aquelas que você adiciona da
> galeria da comunidade) não funcionam por API em conta grátis — a API responde
> `402 paid_plan_required`. Rode com a opção **Só listar as vozes** no workflow
> (ou `--listar-vozes`): as marcadas com `[$]` exigem plano pago; as demais,
> normalmente as padrão da plataforma ("premade"), funcionam.

Dicas:

- Escolha uma voz treinada em português, ou crie uma no *Voice Design* descrevendo
  uma voz brasileira calma e clara — o modelo `eleven_multilingual_v2` é o que fala
  português bem.
- `--so=frases` grava só trava-línguas e frases sociais; `--so=palavras`, só as
  palavras soltas. Útil para gastar crédito aos poucos.
- O plano grátis do ElevenLabs pede atribuição ("Powered by ElevenLabs") e não
  permite uso comercial. Para uso clínico/comercial, o plano pago mais barato
  resolve, ou use o Edge abaixo.

### Edge / Microsoft (sem chave, sem limite)

Mesmas vozes neurais do "Ler em voz alta" do Edge. Não são tão expressivas quanto as
do ElevenLabs, mas são boas e não têm cota:

```bash
bun run audio -- --listar-vozes                  # vozes pt disponíveis
bun run audio -- --voz=pt-BR-FranciscaNeural --banco=feminina
bun run audio -- --voz=pt-BR-AntonioNeural --banco=masculina
```

### Opções comuns

| Opção | O que faz |
| --- | --- |
| `--forcar` | regrava os arquivos que já existem |
| `--so=palavras` / `--so=frases` | grava só um tipo de conteúdo |
| `--banco=<nome>` | em qual voz gravar (`feminina`, `masculina`, …) |
| `--ritmo=<n>` | velocidade da fala no Edge (padrão `0.92`, um pouco calma) |
| `--atualizar-lista` | só reescreve `src/lib/data/audios.ts` a partir das pastas |

Depois de gravar, confira no navegador e faça commit de `public/audio/` junto com
`src/lib/data/audios.ts` — é esse arquivo que diz ao app quais frases já têm áudio.

## Duas vozes ao mesmo tempo

Rode uma vez por voz, mudando `--banco`:

```bash
bun run audio -- --voz=pt-BR-FranciscaNeural --banco=feminina
bun run audio -- --voz=pt-BR-AntonioNeural  --banco=masculina
```

As duas aparecem em *Personalizar* e a escolha fica salva no navegador. Se a
pessoa escolher uma voz que ainda não tem a frase gravada, o app usa a outra —
e, não havendo nenhuma, a voz do navegador.

## Trocando a voz de um banco

Apague a pasta daquele banco (`public/audio/<banco>/`) e rode de novo com a voz
nova, ou use `--forcar --banco=<banco>`.
