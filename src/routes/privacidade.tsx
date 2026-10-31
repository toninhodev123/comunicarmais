import { createFileRoute } from "@tanstack/react-router";
import { Lista, PaginaLegal, type SecaoLegal } from "@/components/landing/pagina-legal";
import { EMPRESA } from "@/components/landing/rodape";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Comunicar+" },
      {
        name: "description",
        content:
          "Como o Comunicar+ trata dados: nenhuma gravação de voz é guardada, o progresso fica no aparelho e a conta é opcional.",
      },
    ],
  }),
  component: Privacidade,
});

const ATUALIZADO = "30 de outubro de 2026";

const SECOES: SecaoLegal[] = [
  {
    id: "resumo",
    titulo: "Em poucas palavras",
    corpo: (
      <>
        <p>
          Esta página explica, sem rodeio, o que o Comunicar+ faz com informação. Se você só tem um
          minuto, é isto:
        </p>
        <Lista
          itens={[
            <>
              <strong>A voz da criança não é gravada nem guardada.</strong> O navegador transforma a
              fala em texto, o app compara esse texto com a palavra do exercício e descarta tudo em
              seguida. Nenhum áudio sai do aparelho.
            </>,
            <>
              <strong>Dá para usar sem conta.</strong> Sem cadastro, o progresso fica salvo só no
              próprio aparelho e nós não recebemos nada.
            </>,
            <>
              <strong>Não há anúncio nem rastreamento de terceiros.</strong> O app não vende, não
              aluga e não troca dados com anunciantes.
            </>,
            <>
              <strong>A conta é opcional e serve para uma coisa só:</strong> continuar o progresso
              em outro aparelho.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "quem",
    titulo: "Quem é o responsável",
    corpo: (
      <>
        <p>
          O Comunicar+ é desenvolvido e operado pela <strong>{EMPRESA.nome}</strong>, inscrita no
          CNPJ sob o nº <strong>{EMPRESA.cnpj}</strong>, controladora e responsável pelo tratamento
          dos dados descritos aqui.
        </p>
        <p>
          Para qualquer assunto desta política — pedidos, dúvidas, correções ou exclusão —, fale com
          a gente em{" "}
          <a href={`mailto:${EMPRESA.email}`} className="font-semibold text-primary underline">
            {EMPRESA.email}
          </a>{" "}
          ou por{" "}
          <a
            href={EMPRESA.site}
            target="_blank"
            rel="noreferrer noopener"
            className="font-semibold text-primary underline"
          >
            {EMPRESA.siteRotulo}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "voz",
    titulo: "O microfone e a voz da criança",
    corpo: (
      <>
        <p>
          Esta é a parte mais sensível do app, então ela vem primeiro e por extenso. As atividades
          de fala usam o reconhecimento de voz do <strong>próprio navegador</strong> (a Web Speech
          API, do Chrome, Edge, Safari e afins).
        </p>
        <Lista
          itens={[
            <>
              O microfone só liga quando a pessoa toca em “Falar” e desliga sozinho assim que a
              palavra é reconhecida ou o tempo acaba.
            </>,
            <>
              O app recebe do navegador <strong>apenas o texto</strong> do que foi dito. Ele compara
              esse texto com a palavra do exercício, decide se acertou e descarta o texto na hora.
            </>,
            <>
              <strong>Nenhum arquivo de áudio é criado, enviado ou armazenado</strong> pelo
              Comunicar+, nem no aparelho nem em servidor nosso.
            </>,
            <>
              Dependendo do navegador, o processamento do som pode acontecer nos servidores de quem
              fabrica esse navegador (é como o ditado do teclado funciona). Esse tratamento é do
              fabricante, segue a política dele, e acontece mesmo quando o app não existe. Se isso
              preocupa você, o app continua funcionando sem o microfone: a criança ouve o áudio
              gravado e repete, e quem acompanha confere.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "coletamos",
    titulo: "Que informação o app usa",
    corpo: (
      <>
        <p>
          <strong>Sem conta (uso anônimo).</strong> Tudo fica no armazenamento local do navegador,
          no próprio aparelho: o mascote escolhido, as estrelinhas, a sequência de dias, as
          preferências de voz e quais palavras já foram treinadas. Essas informações não são
          enviadas para nós e somem se a pessoa limpar os dados do navegador.
        </p>
        <p>
          <strong>Com conta (opcional).</strong> Se a pessoa criar uma conta para continuar em outro
          aparelho, passamos a guardar, no nosso provedor de banco de dados:
        </p>
        <Lista
          itens={[
            <>
              <strong>E-mail e senha</strong> (a senha fica guardada de forma cifrada; nós não
              conseguimos lê-la).
            </>,
            <>
              <strong>Progresso do treino:</strong> estrelinhas, sequência de dias, mascote
              escolhido e palavras concluídas.
            </>,
            <>
              <strong>Preferências:</strong> voz escolhida e ajustes de acessibilidade.
            </>,
          ]}
        />
        <p>
          Não pedimos nome completo, endereço, telefone, documento, foto, localização nem qualquer
          informação de saúde ou diagnóstico da criança. Pedimos que você também não escreva esse
          tipo de informação em campos livres.
        </p>
      </>
    ),
  },
  {
    id: "porque",
    titulo: "Por que usamos cada informação",
    corpo: (
      <Lista
        itens={[
          <>
            <strong>Fazer o app funcionar:</strong> mostrar o progresso, manter o mascote escolhido
            e tocar a voz preferida.
          </>,
          <>
            <strong>Sincronizar entre aparelhos:</strong> única função do e-mail e da senha.
          </>,
          <>
            <strong>Segurança:</strong> impedir acesso indevido à conta e registrar tentativas de
            login com falha.
          </>,
          <>
            <strong>Falar com você:</strong> responder quando você escreve para a gente.
          </>,
        ]}
      />
    ),
  },
  {
    id: "criancas",
    titulo: "Crianças e consentimento",
    corpo: (
      <>
        <p>
          O Comunicar+ foi feito para crianças usarem, mas a conta é de responsabilidade de um
          adulto. O cadastro deve ser feito e autorizado por pai, mãe, responsável legal ou pelo
          profissional que acompanha a criança.
        </p>
        <p>
          Seguimos o princípio do melhor interesse da criança previsto no art. 14 da Lei Geral de
          Proteção de Dados (Lei nº 13.709/2018). Na prática, isso significa que coletamos o mínimo
          possível, não usamos dado de criança para publicidade e não condicionamos o uso do app à
          entrega de informação que não seja necessária.
        </p>
        <p>
          Se você é responsável e quer ver, corrigir ou apagar o que está guardado de uma criança, é
          só escrever para{" "}
          <a href={`mailto:${EMPRESA.email}`} className="font-semibold text-primary underline">
            {EMPRESA.email}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "terceiros",
    titulo: "Quem mais tem acesso",
    corpo: (
      <>
        <p>
          Não vendemos, não alugamos e não trocamos dados com ninguém para fins de marketing. Há
          apenas os fornecedores que fazem o app existir:
        </p>
        <Lista
          itens={[
            <>
              <strong>Supabase</strong> — banco de dados e autenticação, usado só se a pessoa criar
              conta.
            </>,
            <>
              <strong>Vercel</strong> — hospedagem do site, que registra dados técnicos de acesso
              (endereço IP, tipo de navegador) pelo tempo necessário à operação e à segurança.
            </>,
            <>
              <strong>Navegador do aparelho</strong> — responsável pelo reconhecimento de fala, como
              explicado acima.
            </>,
          ]}
        />
        <p>
          Também podemos divulgar informação se formos obrigados por lei ou por ordem judicial. Se
          isso acontecer, avisaremos você sempre que for permitido.
        </p>
      </>
    ),
  },
  {
    id: "audios",
    titulo: "Os áudios do app",
    corpo: (
      <p>
        As 920 vozes que a criança ouve são <strong>arquivos gravados antes</strong> e entregues
        junto com o site. O app não chama nenhuma inteligência artificial de voz durante o uso: ele
        apenas toca um arquivo que já está lá. Por isso a voz é idêntica em qualquer aparelho e nada
        precisa ser enviado para fora quando o app fala.
      </p>
    ),
  },
  {
    id: "quanto-tempo",
    titulo: "Por quanto tempo guardamos",
    corpo: (
      <Lista
        itens={[
          <>
            <strong>Sem conta:</strong> enquanto o navegador mantiver os dados locais. Limpar o
            histórico do navegador apaga tudo.
          </>,
          <>
            <strong>Com conta:</strong> enquanto a conta existir. Ao pedir exclusão, apagamos os
            dados da conta em até 30 dias, salvo registros que a lei mande guardar.
          </>,
          <>
            <strong>Voz:</strong> não se aplica — nada é guardado.
          </>,
        ]}
      />
    ),
  },
  {
    id: "direitos",
    titulo: "Seus direitos",
    corpo: (
      <>
        <p>
          A LGPD garante a você, a qualquer momento e sem custo, o direito de pedir: confirmação de
          que tratamos dados seus, acesso a esses dados, correção do que estiver errado,
          anonimização ou exclusão, portabilidade, informação sobre com quem compartilhamos, e
          revogação do consentimento.
        </p>
        <p>
          Para exercer qualquer um deles, escreva para{" "}
          <a href={`mailto:${EMPRESA.email}`} className="font-semibold text-primary underline">
            {EMPRESA.email}
          </a>
          . Respondemos em até 15 dias. Pode ser que a gente peça uma confirmação de identidade —
          justamente para não entregar dados de uma criança a quem não é responsável por ela.
        </p>
      </>
    ),
  },
  {
    id: "seguranca",
    titulo: "Segurança",
    corpo: (
      <p>
        Todo o tráfego do site é cifrado (HTTPS), as senhas são guardadas com hash e o acesso ao
        banco é restrito. Nenhum sistema é perfeito: se acontecer um incidente que possa trazer
        risco a você, avisaremos você e a Autoridade Nacional de Proteção de Dados, como manda a
        lei.
      </p>
    ),
  },
  {
    id: "mudancas",
    titulo: "Mudanças nesta política",
    corpo: (
      <p>
        Se mudarmos algo relevante, atualizamos a data no topo desta página e, havendo conta,
        avisamos por e-mail antes da mudança valer. Continuar usando o app depois disso significa
        concordar com o texto novo.
      </p>
    ),
  },
];

function Privacidade() {
  return (
    <PaginaLegal
      titulo="Política de Privacidade"
      resumo="O Comunicar+ é usado por crianças, então esta política foi escrita para ser lida de verdade: sem jargão, dizendo exatamente o que acontece com a voz, com o progresso e com a conta."
      atualizadoEm={ATUALIZADO}
      secoes={SECOES}
    />
  );
}
