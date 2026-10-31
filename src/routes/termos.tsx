import { createFileRoute } from "@tanstack/react-router";
import { Lista, PaginaLegal, type SecaoLegal } from "@/components/landing/pagina-legal";
import { EMPRESA } from "@/components/landing/rodape";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Comunicar+" },
      {
        name: "description",
        content:
          "As regras de uso do Comunicar+: o que o app é, o que ele não é, o que esperamos de você e os limites de responsabilidade.",
      },
    ],
  }),
  component: Termos,
});

const ATUALIZADO = "30 de outubro de 2026";

const SECOES: SecaoLegal[] = [
  {
    id: "aceite",
    titulo: "Ao usar, você concorda",
    corpo: (
      <p>
        Estes termos são o acordo entre você e a <strong>{EMPRESA.nome}</strong>, CNPJ{" "}
        <strong>{EMPRESA.cnpj}</strong>, sobre o uso do Comunicar+. Usando o app, você concorda com
        eles. Se não concordar com algum ponto, basta não usar. Se a pessoa que vai usar é uma
        criança, quem aceita estes termos é o adulto responsável.
      </p>
    ),
  },
  {
    id: "oque-e",
    titulo: "O que o Comunicar+ é",
    corpo: (
      <>
        <p>
          É uma ferramenta de <strong>apoio e prática</strong> de fala para crianças, com atividades
          de fonemas, vocabulário, memória auditiva, trava-línguas e frases do dia a dia, áudios
          gravados com voz humana e um sistema de estrelinhas para criar rotina.
        </p>
        <p>
          Ele foi pensado para o intervalo entre as sessões de terapia: o lugar onde a criança
          repete, sozinha e sem medo de errar, o que trabalhou com o profissional.
        </p>
      </>
    ),
  },
  {
    id: "oque-nao-e",
    titulo: "O que o Comunicar+ não é",
    corpo: (
      <>
        <p>Este é o ponto mais importante de todo o documento. O Comunicar+:</p>
        <Lista
          itens={[
            <>
              <strong>não faz avaliação nem dá diagnóstico</strong> de qualquer tipo;
            </>,
            <>
              <strong>não substitui</strong> acompanhamento fonoaudiológico, médico, psicológico ou
              pedagógico;
            </>,
            <>
              <strong>não define</strong> qual som deve ser treinado, em que ordem, nem quando
              avançar — isso é decisão de quem acompanha a criança;
            </>,
            <>
              <strong>não garante resultado.</strong> Desenvolvimento de fala depende da criança, do
              caso e do acompanhamento profissional.
            </>,
          ]}
        />
        <p>
          Se você tem qualquer dúvida sobre a fala, a audição ou o desenvolvimento da criança,
          procure uma fonoaudióloga ou um fonoaudiólogo. O app existe para somar ao trabalho dela,
          nunca para ocupar o lugar dele.
        </p>
      </>
    ),
  },
  {
    id: "conta",
    titulo: "Conta e responsabilidade do adulto",
    corpo: (
      <>
        <p>
          Dá para usar o app inteiro sem conta. Criar uma é opcional e serve apenas para continuar o
          progresso em outro aparelho. Ao criar uma conta, você declara ser maior de 18 anos e
          responsável pela criança que vai usar, ou o profissional que a acompanha com autorização
          de quem é responsável.
        </p>
        <Lista
          itens={[
            "Você é responsável por manter a senha em segurança e por tudo que acontecer na conta.",
            "Use um e-mail válido e que seja seu.",
            "Avise a gente se desconfiar de acesso indevido.",
            "Você pode apagar a conta quando quiser, escrevendo para o e-mail de contato.",
          ]}
        />
      </>
    ),
  },
  {
    id: "uso",
    titulo: "Como usar (e como não usar)",
    corpo: (
      <>
        <p>
          Você pode usar o Comunicar+ livremente com a criança, em casa, na escola ou na clínica.
        </p>
        <p>Não é permitido:</p>
        <Lista
          itens={[
            "tentar invadir, sobrecarregar ou quebrar o serviço;",
            "copiar, redistribuir ou revender os áudios, as listas de palavras, os mascotes ou o código;",
            "usar o app para qualquer finalidade ilegal;",
            "apresentar o app como se fosse avaliação ou laudo profissional.",
          ]}
        />
      </>
    ),
  },
  {
    id: "propriedade",
    titulo: "Conteúdo e propriedade",
    corpo: (
      <p>
        O nome Comunicar+, os mascotes Nina, Tito e Léo, os áudios gravados, os textos, o desenho
        das telas e o código são da <strong>{EMPRESA.nome}</strong> e estão protegidos por direito
        autoral. Usar o app não transfere nenhum desses direitos. O progresso da criança é seu, e
        você pode pedir uma cópia ou a exclusão a qualquer momento.
      </p>
    ),
  },
  {
    id: "disponibilidade",
    titulo: "Disponibilidade e mudanças no app",
    corpo: (
      <p>
        O app roda no navegador e depende de internet, do aparelho e do navegador que você usa.
        Fazemos o possível para manter tudo no ar, mas pode haver interrupção para manutenção ou por
        causa de terceiros. Também podemos acrescentar, mudar ou remover funcionalidades ao longo do
        tempo — avisando com antecedência quando a mudança for relevante.
      </p>
    ),
  },
  {
    id: "limites",
    titulo: "Limites de responsabilidade",
    corpo: (
      <p>
        O Comunicar+ é oferecido como está. Dentro do que a lei permite, a {EMPRESA.nome} não se
        responsabiliza por decisões tomadas com base no uso do app, por resultados de treino, por
        indisponibilidade temporária do serviço ou por problemas do aparelho, do navegador ou da
        conexão. Nada aqui afeta os direitos que o Código de Defesa do Consumidor garante a você.
      </p>
    ),
  },
  {
    id: "privacidade",
    titulo: "Privacidade",
    corpo: (
      <p>
        O tratamento de dados está descrito na{" "}
        <a href="/privacidade" className="font-semibold text-primary underline">
          Política de Privacidade
        </a>
        , que faz parte destes termos. O resumo: a voz da criança não é gravada, dá para usar sem
        conta e não há anúncio nem rastreamento de terceiros.
      </p>
    ),
  },
  {
    id: "contato",
    titulo: "Lei aplicável e contato",
    corpo: (
      <>
        <p>
          Estes termos seguem a lei brasileira. Questões não resolvidas de forma amigável serão
          tratadas no foro do domicílio do consumidor.
        </p>
        <p>
          Para qualquer dúvida sobre este documento, escreva para{" "}
          <a href={`mailto:${EMPRESA.email}`} className="font-semibold text-primary underline">
            {EMPRESA.email}
          </a>{" "}
          ou visite{" "}
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
];

function Termos() {
  return (
    <PaginaLegal
      titulo="Termos de Uso"
      resumo="As regras do Comunicar+ em português claro: o que o app é, o que ele deliberadamente não é, o que esperamos de você e até onde vai a nossa responsabilidade."
      atualizadoEm={ATUALIZADO}
      secoes={SECOES}
    />
  );
}
