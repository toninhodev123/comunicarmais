import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { TelaEntrar } from "@/components/TelaEntrar";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Comunicar+" },
      { name: "description", content: "Entre na sua conta para continuar o progresso." },
    ],
  }),
  component: PaginaEntrar,
});

function PaginaEntrar() {
  const { session } = useApp();
  const navegar = useNavigate();

  // Quem já entrou (ou acabou de entrar) não fica preso no formulário.
  useEffect(() => {
    if (session) void navegar({ to: "/app" });
  }, [session, navegar]);

  return <TelaEntrar />;
}
