export function styles(primaryColor: string, position: "bottom-right" | "bottom-left") {
  const side = position === "bottom-left" ? "left" : "right";
  return `
    :host { all: initial; }
    .root { position: fixed; ${side}: 22px; bottom: 22px; z-index: 2147483000; font-family: Arial, sans-serif; }
    .bubble { display: grid; place-items: center; width: 58px; height: 58px; border: 0; border-radius: 999px; color: #fff; cursor: pointer; background: linear-gradient(135deg, ${primaryColor}, #0b72f0); box-shadow: 0 14px 36px rgba(0, 140, 255, .42); }
    .bubble:hover { transform: translateY(-1px); }
    .modal { position: fixed; right: 22px; bottom: 94px; width: min(400px, calc(100vw - 32px)); height: min(640px, calc(100vh - 120px)); overflow: hidden; border: 1px solid #2b3b4e; border-radius: 16px; background: #071624; box-shadow: 0 22px 60px rgba(0,0,0,.4); }
    iframe { width: 100%; height: 100%; border: 0; background: #071624; }
    @media (max-width: 520px) { .modal { inset: 0; width: auto; height: auto; border-radius: 0; } .root { ${side}: 18px; bottom: 18px; } }
  `;
}
