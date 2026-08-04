import { useState, type FormEvent } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function TelaEntrar() {
  const { entrar, cadastrar } = useApp();
  const [modo, setModo] = useState<"entrar" | "cadastrar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [cadastroFeito, setCadastroFeito] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    const mensagem = modo === "entrar" ? await entrar(email, senha) : await cadastrar(email, senha);
    setEnviando(false);
    if (mensagem) {
      setErro(mensagem);
    } else if (modo === "cadastrar") {
      setCadastroFeito(true);
    }
  };

  const trocarModo = () => {
    setModo((m) => (m === "entrar" ? "cadastrar" : "entrar"));
    setErro(null);
    setCadastroFeito(false);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-center font-display text-2xl font-bold">
          Comunicar<span className="ml-1">+</span>
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {modo === "entrar"
            ? "Entre para continuar seu progresso."
            : "Crie uma conta para salvar seu progresso."}
        </p>

        {cadastroFeito ? (
          <p className="mt-6 rounded-2xl bg-success/15 p-4 text-center text-sm text-success">
            Conta criada! Confira seu e-mail para confirmar antes de entrar.
          </p>
        ) : (
          <form onSubmit={enviar} className="mt-6 space-y-3">
            <Input
              type="email"
              required
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-2xl"
            />
            <Input
              type="password"
              required
              minLength={6}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="h-12 rounded-2xl"
            />
            {erro && <p className="text-sm text-destructive">{erro}</p>}
            <Button type="submit" disabled={enviando} className="h-12 w-full rounded-2xl text-base">
              {enviando ? "Enviando..." : modo === "entrar" ? "Entrar" : "Criar conta"}
            </Button>
          </form>
        )}

        <button
          onClick={trocarModo}
          className="mt-4 w-full text-center text-sm text-muted-foreground underline"
        >
          {modo === "entrar" ? "Ainda não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </Card>
    </div>
  );
}
