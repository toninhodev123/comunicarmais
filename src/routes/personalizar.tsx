import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/personalizar")({
  head: () => ({
    meta: [
      { title: "Personalizar — Comunicar+" },
      { name: "description", content: "Página de teste de personalização." },
    ],
  }),
  component: CustomizePage,
});

function CustomizePage() {
  const [clicado, setClicado] = useState(false);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Personalizar</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Modo de visualização simplificado.
        </p>
      </header>

      <div className="flex flex-col items-start gap-4">
        <Button
          onClick={() => setClicado(!clicado)}
          className="h-12 rounded-2xl px-6 text-base"
          variant={clicado ? "secondary" : "default"}
        >
          {clicado ? "Ação Ativada! ✨" : "Clique aqui para Personalizar"}
        </Button>

        {clicado && (
          <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            O botão foi clicado com sucesso.
          </p>
        )}
      </div>
    </div>
  );
}