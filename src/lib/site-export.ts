import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getNicheContent, professionalizeName } from "@/lib/niche-content";
import { getNicheColors } from "@/lib/gallery-images";
import type { SiteContentOverrides } from "@/lib/site-content-types";

interface LeadData {
  company_name: string;
  niche: string;
  city: string;
  phone: string;
  slug: string;
  services_list?: string[] | null;
  site_content?: SiteContentOverrides | null;
}

function buildSiteHTML(lead: LeadData): string {
  const displayName = professionalizeName(lead.company_name, lead.niche);
  const content = getNicheContent(lead.niche, lead.city, displayName);
  const colors = getNicheColors(lead.niche);
  const sc = lead.site_content;

  const heroTitle = sc?.heroTitle || displayName;
  const heroSubtitle = sc?.heroSubtitle || content.heroSubtitle;
  const urgencyBadge = (sc?.urgencyBadge || content.urgencyBadge).replace("⚡ ", "");
  const ctaText = sc?.ctaText || content.ctaText;
  const whatsappMsg = sc?.whatsappMessage || content.whatsappMessage;
  const servicesTitle = sc?.servicesTitle || "O que oferecemos";
  const servicesSubtitle = sc?.servicesSubtitle || "Toque no botão e pergunte sobre qualquer serviço";
  const reviewsTitle = sc?.reviewsTitle || "O que dizem nossos clientes";
  const contactTitle = sc?.contactTitle || `Fale diretamente com ${displayName}`;
  const contactSubtitle = sc?.contactSubtitle || "Sem formulário, sem espera. Atendimento direto e pessoal.";
  const finalCtaTitle = sc?.finalCtaTitle || "Não perca tempo!";
  const finalCtaSubtitle = sc?.finalCtaSubtitle || `Clique no botão abaixo e fale agora com ${displayName} em ${lead.city}. Atendimento imediato via WhatsApp.`;
  const workingHours = sc?.workingHours || "Seg a Sex: 9h às 20h · Sáb: 9h às 18h";
  const whatsappLink = `https://wa.me/${lead.phone}?text=${encodeURIComponent(whatsappMsg)}`;

  const displayServices = sc?.services && sc.services.length > 0
    ? sc.services
    : lead.services_list && lead.services_list.length > 0
      ? lead.services_list
      : content.services.map((s: { title: string }) => s.title);

  const displayReviews = sc?.reviews && sc.reviews.length > 0 ? sc.reviews : content.reviews;

  const benefits = sc?.benefits && sc.benefits.length > 0
    ? sc.benefits
    : [
        { title: "Atendimento Imediato", desc: "Resposta na hora pelo WhatsApp" },
        { title: "Equipe Preparada", desc: `Profissionais de confiança em ${lead.city}` },
        { title: "Não Espere Piorar", desc: "Resolva hoje, não amanhã" },
        { title: "Serviço com Garantia", desc: "Trabalho profissional e seguro" },
      ];

  const servicesHTML = displayServices.slice(0, 8).map((s: string | { title: string }) => {
    const name = typeof s === "string" ? s : s.title;
    return `<div class="service-item"><span class="check">✓</span><span>${name}</span></div>`;
  }).join("\n");

  const reviewsHTML = displayReviews.map((r: { name: string; text: string; rating: number }) => {
    const stars = "★".repeat(r.rating);
    return `<div class="review"><div class="review-header"><div class="avatar">${r.name.charAt(0)}</div><div><strong>${r.name}</strong><span class="stars">${stars}</span></div></div><p>"${r.text}"</p></div>`;
  }).join("\n");

  const benefitsHTML = benefits.map((b) =>
    `<div class="benefit"><h3>${b.title}</h3><p>${b.desc}</p></div>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayName} - ${lead.city}</title>
  <meta name="description" content="${heroSubtitle}">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a2e;background:#fff;line-height:1.6}
    a{text-decoration:none}
    .header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.95);backdrop-filter:blur(8px);border-bottom:1px solid #e5e7eb;padding:12px 20px}
    .header-inner{max-width:1024px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
    .header h1{font-size:1.1rem;font-weight:700}
    .header .location{font-size:.85rem;color:#6b7280;display:flex;align-items:center;gap:6px}
    .hero{position:relative;min-height:70vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,hsl(${colors.primary}),hsl(${colors.accent}));color:#fff;text-align:center;padding:60px 20px}
    .hero-overlay{position:absolute;inset:0;background:rgba(0,0,0,.5)}
    .hero-content{position:relative;z-index:2;max-width:600px}
    .badge{display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;padding:8px 16px;border-radius:100px;font-size:.85rem;font-weight:700;margin-bottom:20px;animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}
    .hero h2{font-size:2rem;font-weight:800;margin-bottom:12px;line-height:1.2}
    .hero p{font-size:1rem;opacity:.85;margin-bottom:24px}
    .cta{display:inline-flex;align-items:center;gap:10px;background:#25D366;color:#fff;padding:16px 32px;border-radius:12px;font-size:1.1rem;font-weight:700;box-shadow:0 8px 30px rgba(37,211,102,.4);transition:transform .2s}
    .cta:hover{transform:scale(1.05)}
    .benefits{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;padding:48px 20px;max-width:900px;margin:0 auto;background:hsl(${colors.primary});border-radius:0}
    .benefit{text-align:center;padding:20px;color:hsl(${colors.primaryForeground})}
    .benefit h3{font-weight:700;margin-bottom:4px}
    .benefit p{font-size:.85rem;opacity:.7}
    .section{padding:48px 20px;max-width:700px;margin:0 auto;text-align:center}
    .section h2{font-size:1.5rem;font-weight:800;margin-bottom:8px}
    .section .sub{color:#6b7280;font-size:.9rem;margin-bottom:32px}
    .services-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;text-align:left;margin-bottom:32px}
    .service-item{display:flex;align-items:center;gap:12px;padding:16px;border:1px solid #e5e7eb;border-radius:10px;font-weight:500}
    .service-item .check{color:#25D366;font-size:1.2rem}
    .reviews-section{padding:48px 20px;background:hsl(${colors.secondary})}
    .reviews-section h2{text-align:center;font-size:1.5rem;font-weight:800;margin-bottom:24px}
    .reviews{max-width:700px;margin:0 auto;display:flex;flex-direction:column;gap:16px}
    .review{background:#fff;padding:20px;border-radius:12px;display:flex;flex-direction:column;gap:8px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
    .review-header{display:flex;align-items:center;gap:12px}
    .avatar{width:40px;height:40px;border-radius:50%;background:hsl(${colors.primary});color:hsl(${colors.primaryForeground});display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.9rem}
    .stars{color:#facc15;margin-left:8px}
    .review p{color:#6b7280;font-size:.9rem}
    .contact{padding:48px 20px;max-width:500px;margin:0 auto;text-align:center}
    .contact h2{font-size:1.5rem;font-weight:800;margin-bottom:8px}
    .contact .sub{color:#6b7280;font-size:.9rem;margin-bottom:24px}
    .info-row{display:flex;align-items:center;gap:12px;padding:14px;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:12px;text-align:left;font-size:.9rem}
    .final-cta{background:#25D366;padding:48px 20px;text-align:center;color:#fff}
    .final-cta h2{font-size:1.8rem;font-weight:800;margin-bottom:12px}
    .final-cta p{opacity:.8;font-size:1.05rem;margin-bottom:24px}
    .final-cta .cta{background:#fff;color:#25D366}
    footer{padding:32px 20px;text-align:center;background:hsl(${colors.primary});color:hsl(${colors.primaryForeground} / .5);font-size:.75rem}
    .fab{position:fixed;bottom:20px;right:20px;z-index:40;background:#25D366;color:#fff;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;box-shadow:0 4px 20px rgba(37,211,102,.5);transition:transform .2s}
    .fab:hover{transform:scale(1.1)}
    @media(max-width:640px){.hero h2{font-size:1.4rem}.cta{padding:14px 24px;font-size:1rem}.benefits{grid-template-columns:1fr 1fr}}
  </style>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <h1>${displayName}</h1>
      <span class="location">📍 ${lead.city}</span>
    </div>
  </header>

  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="badge">⚡ ${urgencyBadge}</div>
      <h2>${heroTitle}</h2>
      <p>${heroSubtitle}</p>
      <a href="${whatsappLink}" target="_blank" class="cta">💬 ${ctaText.toUpperCase()}</a>
      <p style="opacity:.5;font-size:.75rem;margin-top:16px">⚡ Resposta em menos de 2 minutos</p>
    </div>
  </section>

  <section class="benefits">
    ${benefitsHTML}
  </section>

  <section class="section">
    <h2>${servicesTitle}</h2>
    <p class="sub">${servicesSubtitle}</p>
    <div class="services-grid">
      ${servicesHTML}
    </div>
    <a href="${whatsappLink}" target="_blank" class="cta">💬 Quero saber mais – WhatsApp</a>
  </section>

  ${displayReviews.length > 0 ? `
  <section class="reviews-section">
    <h2>${reviewsTitle}</h2>
    <div class="reviews">
      ${reviewsHTML}
    </div>
  </section>
  ` : ""}

  <section class="contact">
    <h2>${contactTitle}</h2>
    <p class="sub">${contactSubtitle}</p>
    <div class="info-row">📍 ${lead.city}</div>
    <div class="info-row">📞 ${lead.phone}</div>
    <div class="info-row">🕐 ${workingHours}</div>
    <br>
    <a href="${whatsappLink}" target="_blank" class="cta" style="width:100%;justify-content:center">💬 CHAMAR NO WHATSAPP AGORA</a>
    <p style="color:#6b7280;font-size:.75rem;margin-top:12px">Atendimento rápido e sem compromisso</p>
  </section>

  <section class="final-cta">
    <h2>${finalCtaTitle}</h2>
    <p>${finalCtaSubtitle}</p>
    <a href="${whatsappLink}" target="_blank" class="cta">💬 FALAR AGORA</a>
  </section>

  <footer>© ${new Date().getFullYear()} ${displayName} · ${lead.city}</footer>

  <a href="${whatsappLink}" target="_blank" class="fab" aria-label="WhatsApp">💬</a>
</body>
</html>`;
}

function buildReactProject(lead: LeadData): Record<string, string> {
  const displayName = professionalizeName(lead.company_name, lead.niche);
  const html = buildSiteHTML(lead);

  const packageJson = JSON.stringify({
    name: lead.slug,
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies: {
      react: "^18.3.1",
      "react-dom": "^18.3.1",
    },
    devDependencies: {
      "@vitejs/plugin-react": "^4.3.0",
      vite: "^5.4.0",
    },
  }, null, 2);

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;

  const indexHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${displayName} - ${lead.city}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`;

  const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div dangerouslySetInnerHTML={{ __html: document.getElementById('site-html').innerHTML }} />
  </React.StrictMode>
);
`;

  // For simplicity, the React project uses a static HTML approach embedded in public/
  const readmeMd = `# ${displayName} - ${lead.city}

Site gerado automaticamente pelo CRM.

## Como usar

### Opção 1: Abrir diretamente
Abra o arquivo \`public/index.html\` no navegador.

### Opção 2: Deploy na Vercel
1. Instale as dependências: \`npm install\`
2. Build: \`npm run build\`
3. O resultado estará na pasta \`dist/\`

### Deploy na Vercel (recomendado)
1. Faça push para o GitHub
2. Conecte o repositório na Vercel
3. Framework Preset: \`Vite\`
4. Build Command: \`npm run build\`
5. Output Directory: \`dist\`
`;

  const vercelJson = JSON.stringify({
    framework: "vite",
    buildCommand: "npm run build",
    outputDirectory: "dist",
    rewrites: [{ source: "/(.*)", destination: "/index.html" }],
  }, null, 2);

  return {
    "package.json": packageJson,
    "vite.config.js": viteConfig,
    "index.html": indexHtml,
    "src/main.jsx": mainJsx,
    "public/index.html": html,
    "README.md": readmeMd,
    "vercel.json": vercelJson,
  };
}

export async function downloadStaticHTML(lead: LeadData) {
  const zip = new JSZip();
  const html = buildSiteHTML(lead);
  zip.file("index.html", html);
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${lead.slug}-site.zip`);
}

export async function downloadReactProject(lead: LeadData) {
  const zip = new JSZip();
  const files = buildReactProject(lead);
  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${lead.slug}-react.zip`);
}
