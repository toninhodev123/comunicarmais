import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Rolagem suave (a mesma ideia dos sites de estúdio: o scroll "desliza" em vez
 * de pular). Fica só na landing e sai de cena quando a pessoa pede menos
 * movimento no sistema, caso em que o scroll nativo é o certo.
 */
export function useScrollSuave() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let frame = 0;
    const passo = (tempo: number) => {
      lenis.raf(tempo);
      frame = requestAnimationFrame(passo);
    };
    frame = requestAnimationFrame(passo);

    // A landing cresce depois de montada (fonte carregada, galeria fixa
    // medindo o próprio percurso, uma pergunta do FAQ abrindo). O Lenis guarda
    // o limite da página na primeira medida, e sem remedir ele trava a rolagem
    // na altura antiga — era o que impedia de chegar no fim do site.
    const remedir = () => lenis.resize();
    const observador = new ResizeObserver(remedir);
    observador.observe(document.body);
    window.addEventListener("load", remedir);

    // Links de âncora (#mascotes, #pontos...) deslizam em vez de saltar.
    const aoClicar = (evento: MouseEvent) => {
      const alvo = (evento.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const id = alvo?.getAttribute("href");
      if (!alvo || !id || id === "#") return;
      const destino = document.querySelector(id);
      if (!destino) return;
      evento.preventDefault();
      lenis.scrollTo(destino as HTMLElement, { offset: -80 });
    };
    document.addEventListener("click", aoClicar);

    return () => {
      document.removeEventListener("click", aoClicar);
      window.removeEventListener("load", remedir);
      observador.disconnect();
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}
