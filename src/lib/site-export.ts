import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getNicheContent, professionalizeName } from "@/lib/niche-content";
import { getGalleryImages, getNicheColors } from "@/lib/gallery-images";
import { generateReviews } from "@/lib/review-generator";
import { getPublishedBaseUrl } from "@/lib/public-site-url";
import type { SiteContentOverrides } from "@/lib/site-content-types";

/** Convert local/relative asset paths to absolute URLs so exported HTML works standalone */
function toAbsoluteUrl(src: string): string {
  if (!src) return src;
  // Already absolute (http/https or data URI) — keep as-is
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  // Local asset resolved by Vite (e.g. /assets/hero-salon-abc.jpg)
  const base = getPublishedBaseUrl();
  return `${base}${src.startsWith("/") ? "" : "/"}${src}`;
}

interface LeadData {
  company_name: string;
  niche: string;
  city: string;
  phone: string;
  slug: string;
  services_list?: string[] | null;
  site_content?: SiteContentOverrides | null;
  photos?: string[] | null;
  google_maps_url?: string | null;
  instagram?: string | null;
  description?: string | null;
}

function buildSiteHTML(lead: LeadData): string {
  const displayName = professionalizeName(lead.company_name, lead.niche);
  const content = getNicheContent(lead.niche, lead.city, displayName);
  const colors = getNicheColors(lead.niche);
  const sc = lead.site_content;

  const galleryOverrides = sc?.galleryImages && sc.galleryImages.length > 0 ? sc.galleryImages : undefined;
  const gallery = getGalleryImages(lead.niche, galleryOverrides || lead.photos || undefined, lead.slug);
  const reviews = generateReviews(lead.niche, lead.slug);

  const heroImage = sc?.heroImage || content.heroImage;
  const whatsappMsg = sc?.whatsappMessage || content.whatsappMessage;
  const whatsappLink = `https://wa.me/${lead.phone}?text=${encodeURIComponent(whatsappMsg)}`;

  const displayServices = lead.services_list && lead.services_list.length > 0
    ? lead.services_list.map((s: string) => ({ title: s, desc: `Serviço profissional de qualidade em ${lead.city}. Chame no WhatsApp para saber mais.` }))
    : content.services;

  const mapsQuery = encodeURIComponent(`${displayName} ${lead.city}`);
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${mapsQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const mapsLink = lead.google_maps_url || `https://www.google.com/maps/search/${mapsQuery}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mapsLink)}`;

  const benefitsHTML = content.benefits.map((b: string) =>
    `<div style="display:flex;align-items:center;gap:8px;font-size:0.875rem;font-weight:500;color:hsl(${colors.primaryForeground})">
      <span style="color:hsl(${colors.accent})">✓</span>${b}
    </div>`
  ).join("\n");

  const reviewsHTML = reviews.map((r) => {
    const starsHTML = Array.from({ length: r.rating }).map(() =>
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="hsl(${colors.accent})" stroke="hsl(${colors.accent})" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
    ).join("");
    return `<div style="background:hsl(${colors.secondary});border-radius:12px;padding:24px;box-shadow:0 1px 2px rgba(0,0,0,0.05);border:1px solid rgba(0,0,0,0.05)">
      <div style="display:flex;gap:2px;margin-bottom:12px">${starsHTML}</div>
      <p style="font-size:0.875rem;line-height:1.6;margin-bottom:16px;font-style:italic;color:#1a1a2e">"${r.text}"</p>
      <p style="font-size:0.75rem;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280">— ${r.name}</p>
    </div>`;
  }).join("\n");

  const fiveStarsHTML = Array.from({ length: 5 }).map(() =>
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="hsl(${colors.accent})" stroke="hsl(${colors.accent})" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  ).join("");

  const galleryHTML = gallery.slice(0, 10).map((img, i) =>
    `<div style="${i === 0 ? 'grid-column:span 2;grid-row:span 2;' : ''}overflow:hidden;border-radius:6px">
      <img src="${img.src}" alt="${img.alt}" loading="lazy" style="width:100%;height:100%;object-fit:cover;aspect-ratio:1/1;transition:transform 0.5s" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
    </div>`
  ).join("\n");

  const servicesHTML = displayServices.map((s: { title: string; desc: string }) =>
    `<div style="background:#fff;border-radius:8px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
      <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:1.25rem;font-weight:600;margin-bottom:12px;color:#1a1a2e">${s.title}</h3>
      <p style="color:#6b7280;font-size:0.875rem;line-height:1.6">${s.desc}</p>
    </div>`
  ).join("\n");

  const instagramHTML = lead.instagram
    ? `<a href="https://instagram.com/${lead.instagram.replace("@", "")}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:6px;color:hsl(${colors.accent});font-size:0.875rem;text-decoration:none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        <span>${lead.instagram}</span>
      </a>`
    : "";

  const footerInstagramHTML = lead.instagram
    ? `<a href="https://instagram.com/${lead.instagram.replace("@", "")}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;margin-top:16px;font-size:0.875rem;color:hsl(${colors.accent});text-decoration:none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        ${lead.instagram}
      </a>`
    : "";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayName} - ${lead.city}</title>
  <meta name="description" content="${content.heroSubtitle}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',system-ui,sans-serif;color:#1a1a2e;background:#faf9f7;line-height:1.6}
    a{text-decoration:none}
    img{max-width:100%;display:block}

    .header{position:sticky;top:0;z-index:50;background:rgba(250,249,247,.95);backdrop-filter:blur(8px);border-bottom:1px solid #e8e5e0}
    .header-inner{max-width:64rem;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:12px 16px}
    .header h1{font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;letter-spacing:-0.02em;color:#1a1a2e}
    .header-right{display:flex;align-items:center;gap:12px;font-size:0.85rem;color:#6b7280}

    .hero{position:relative;min-height:55vh;display:flex;align-items:flex-end;overflow:hidden}
    .hero img.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
    .hero-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(to top,rgba(0,0,0,.9),rgba(0,0,0,.5) 50%,rgba(0,0,0,.2))}
    .hero-content{position:relative;z-index:2;padding:80px 16px 40px;max-width:64rem;margin:0 auto;width:100%}
    .hero-divider{width:40px;height:2px;margin-bottom:16px}
    .hero h2{font-family:'Playfair Display',Georgia,serif;font-size:2rem;font-weight:600;line-height:1.2;margin-bottom:12px;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.3)}
    .hero p{color:rgba(255,255,255,.8);font-size:0.875rem;max-width:32rem;margin-bottom:12px;line-height:1.6;text-shadow:0 1px 4px rgba(0,0,0,.2)}
    .hero-badge{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:9999px;font-size:0.8rem;font-weight:500;backdrop-filter:blur(4px);background:rgba(255,255,255,.1);color:rgba(255,255,255,.9);margin-bottom:24px;width:fit-content}
    .cta-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;font-size:0.95rem;font-weight:600;border-radius:8px;background:#25D366;color:#fff;box-shadow:0 8px 30px rgba(37,211,102,.3);transition:transform .2s,filter .2s;border:none;cursor:pointer}
    .cta-btn:hover{transform:scale(1.03);filter:brightness(1.1)}

    .benefits-strip{padding:24px 0}
    .benefits-grid{max-width:64rem;margin:0 auto;padding:0 16px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px}

    .section{padding:48px 16px;max-width:64rem;margin:0 auto}
    .section-label{text-transform:uppercase;font-size:0.7rem;letter-spacing:0.2em;font-weight:500;margin-bottom:12px;text-align:center}
    .section-heading{font-family:'Playfair Display',Georgia,serif;font-size:1.5rem;font-weight:600;letter-spacing:-0.02em;margin-bottom:16px;text-align:center;color:#1a1a2e}
    .section-divider{width:64px;height:2px;margin:0 auto 32px}
    .section-text{color:#6b7280;font-size:0.95rem;line-height:1.7;text-align:center;max-width:40rem;margin:0 auto}

    .gallery-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}

    .services-section{padding:48px 16px}
    .services-grid{max-width:64rem;margin:0 auto;display:grid;grid-template-columns:1fr;gap:24px}

    .reviews-grid{display:grid;grid-template-columns:1fr;gap:20px}

    .stars-row{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:12px}

    .map-container{border-radius:8px;overflow:hidden;margin-bottom:32px;box-shadow:0 4px 12px rgba(0,0,0,.08)}
    .map-container iframe{width:100%;height:400px;border:0}

    .qr-section{text-align:center;max-width:28rem;margin:0 auto}
    .qr-box{display:inline-block;background:#fff;padding:20px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.1)}

    .final-cta{padding:56px 16px;text-align:center}
    .final-cta h2{font-family:'Playfair Display',Georgia,serif;font-size:1.5rem;font-weight:600;margin-bottom:16px}
    .final-cta p{font-size:0.95rem;max-width:28rem;margin:0 auto 32px}

    footer{padding:40px 16px}
    .footer-inner{max-width:64rem;margin:0 auto;display:grid;grid-template-columns:1fr;gap:40px}
    .footer-bottom{margin-top:48px;padding-top:32px;text-align:center;font-size:0.75rem}

    .fab{position:fixed;bottom:20px;right:20px;z-index:40;width:56px;height:56px;border-radius:50%;background:#25D366;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,.5);transition:transform .2s;border:none;cursor:pointer}
    .fab:hover{transform:scale(1.1)}
    .fab svg{width:24px;height:24px}

    .contact-form{max-width:28rem;margin:0 auto}
    .contact-form label{display:block;font-size:0.8rem;font-weight:500;margin-bottom:4px;color:#374151}
    .contact-form input,.contact-form textarea,.contact-form select{width:100%;padding:10px 12px;border:1px solid #e5e7eb;border-radius:6px;font-size:0.875rem;font-family:inherit;margin-bottom:16px;background:#fff}
    .contact-form textarea{resize:vertical;min-height:80px}

    @media(min-width:640px){
      .hero{min-height:70vh}
      .hero h2{font-size:2.5rem}
      .hero p{font-size:1rem}
      .hero-content{padding:80px 20px 56px}
      .header-inner{padding:16px 20px}
      .header h1{font-size:1.25rem}
      .section{padding:64px 20px}
      .services-section{padding:64px 20px}
    }
    @media(min-width:768px){
      .hero{min-height:85vh}
      .hero h2{font-size:3rem}
      .benefits-grid{grid-template-columns:repeat(4,1fr)}
      .gallery-grid{grid-template-columns:repeat(3,1fr)}
      .reviews-grid{grid-template-columns:repeat(3,1fr)}
      .services-grid{grid-template-columns:repeat(2,1fr)}
      .footer-inner{grid-template-columns:repeat(3,1fr)}
    }
    @media(min-width:1024px){
      .gallery-grid{grid-template-columns:repeat(4,1fr)}
      .section{padding:80px 64px}
      .services-section{padding:80px 64px}
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header class="header">
    <div class="header-inner">
      <h1>${displayName}</h1>
      <div class="header-right">
        <span style="display:flex;align-items:center;gap:6px">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:hsl(${colors.accent})"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${lead.city}
        </span>
        ${instagramHTML}
      </div>
    </div>
  </header>

  <main>
    <!-- Hero -->
    <section class="hero">
      <img class="hero-bg" src="${heroImage}" alt="${displayName} - ${lead.niche} em ${lead.city}" width="1280" height="832">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-divider" style="background:hsl(${colors.accent})"></div>
        <h2>${content.heroTitle}</h2>
        <p>${content.heroSubtitle}</p>
        <div class="hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:hsl(${colors.accent})"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${lead.city}
        </div>
        <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="cta-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${content.ctaText}
        </a>
      </div>
    </section>

    <!-- Benefits Strip -->
    <section class="benefits-strip" style="background:hsl(${colors.primary})">
      <div class="benefits-grid">
        ${benefitsHTML}
      </div>
    </section>

    <!-- Social Proof / Reviews -->
    <section class="section">
      <p class="section-label" style="color:hsl(${colors.accent})">Avaliações reais</p>
      <h2 class="section-heading">O que nossos clientes dizem</h2>
      <div class="section-divider" style="background:hsl(${colors.accent})"></div>
      <div class="stars-row">${fiveStarsHTML}</div>
      <div style="height:40px"></div>
      <div class="reviews-grid">
        ${reviewsHTML}
      </div>
    </section>

    <!-- About -->
    <section class="section">
      <div style="text-align:center;max-width:40rem;margin:0 auto">
        <p class="section-label" style="color:hsl(${colors.accent})">${content.aboutLabel}</p>
        <h2 class="section-heading" style="white-space:pre-line">${content.aboutHeading}</h2>
        <div class="section-divider" style="background:hsl(${colors.accent})"></div>
        <p class="section-text">${lead.description || content.aboutText}</p>
      </div>
    </section>

    <!-- Gallery -->
    <section class="section">
      <div style="text-align:center;margin-bottom:48px">
        <p class="section-label" style="color:hsl(${colors.accent})">${content.galleryLabel}</p>
        <h2 class="section-heading">${content.galleryHeading}</h2>
        <div class="section-divider" style="background:hsl(${colors.accent})"></div>
      </div>
      <div class="gallery-grid">
        ${galleryHTML}
      </div>
    </section>

    <!-- Services -->
    <section class="services-section" style="background:hsl(${colors.secondary})">
      <div style="max-width:64rem;margin:0 auto">
        <div style="text-align:center;margin-bottom:56px">
          <p class="section-label" style="color:hsl(${colors.accent})">${content.servicesLabel}</p>
          <h2 class="section-heading">${content.servicesHeading}</h2>
          <div class="section-divider" style="background:hsl(${colors.accent})"></div>
        </div>
        <div class="services-grid">
          ${servicesHTML}
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <section class="services-section" style="background:hsl(${colors.secondary})">
      <div style="max-width:64rem;margin:0 auto">
        <div style="text-align:center;margin-bottom:48px">
          <p class="section-label" style="color:hsl(${colors.accent})">Contato</p>
          <h2 class="section-heading">Fale conosco</h2>
          <div class="section-divider" style="background:hsl(${colors.accent})"></div>
          <p style="color:#6b7280;font-size:0.875rem">Preencha seus dados e envie direto pelo WhatsApp.</p>
        </div>
        <div class="contact-form">
          <label>Seu nome *</label>
          <input type="text" id="cf-name" placeholder="Como podemos te chamar?">
          <label>Seu WhatsApp *</label>
          <input type="tel" id="cf-phone" placeholder="(11) 99999-9999">
          ${lead.services_list && lead.services_list.length > 0
            ? `<label>Serviço de interesse</label>
               <select id="cf-service">
                 <option value="">Escolha um serviço</option>
                 ${lead.services_list.map(s => `<option value="${s}">${s}</option>`).join("")}
               </select>`
            : ""}
          <label>Mensagem</label>
          <textarea id="cf-msg" placeholder="Conte um pouco do que precisa..."></textarea>
          <button onclick="sendWhatsApp()" class="cta-btn" style="width:100%;justify-content:center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            ENVIAR PELO WHATSAPP
          </button>
        </div>
      </div>
    </section>

    <!-- Google Maps -->
    <section class="section">
      <div style="text-align:center;margin-bottom:48px">
        <p class="section-label" style="color:hsl(${colors.accent})">Localização</p>
        <h2 class="section-heading">Onde estamos</h2>
        <div class="section-divider" style="background:hsl(${colors.accent})"></div>
      </div>
      <div class="map-container">
        <iframe title="Localização de ${displayName}" src="${mapsEmbedUrl}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <div style="text-align:center">
        <a href="${mapsLink}" target="_blank" rel="noopener noreferrer" class="cta-btn" style="background:hsl(${colors.primary});color:hsl(${colors.primaryForeground})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Ver no Google Maps
        </a>
      </div>
    </section>

    <!-- QR Code -->
    <section class="section">
      <div class="qr-section">
        <p class="section-label" style="color:hsl(${colors.accent})">Avalie-nos</p>
        <h2 class="section-heading">Sua opinião importa</h2>
        <div class="section-divider" style="background:hsl(${colors.accent})"></div>
        <p style="color:#6b7280;font-size:0.875rem;margin-bottom:32px">
          Sua opinião é muito importante para nós.<br>
          Escaneie o QR Code e deixe sua avaliação no Google.
        </p>
        <div class="qr-box">
          <img src="${qrCodeUrl}" alt="QR Code para avaliar no Google" width="200" height="200" loading="lazy">
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta" style="background:hsl(${colors.primary})">
      <h2 style="color:hsl(${colors.primaryForeground})">Entre em contato</h2>
      <p style="color:hsl(${colors.primaryForeground} / 0.7)">Atendimento profissional em ${lead.city} e região. Fale conosco pelo WhatsApp.</p>
      <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="cta-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        ${content.ctaText}
      </a>
    </section>
  </main>

  <!-- Footer -->
  <footer style="background:hsl(${colors.primary})">
    <div class="footer-inner" style="padding:40px 16px">
      <div>
        <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;margin-bottom:16px;color:hsl(${colors.primaryForeground})">${displayName}</h3>
        <p style="font-size:0.875rem;line-height:1.6;color:hsl(${colors.primaryForeground} / 0.7)">${content.footerTagline}</p>
        ${footerInstagramHTML}
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div style="display:flex;align-items:flex-start;gap:12px;font-size:0.875rem;color:hsl(${colors.primaryForeground} / 0.8)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(${colors.accent})" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${lead.city}</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;font-size:0.875rem;color:hsl(${colors.primaryForeground} / 0.8)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(${colors.accent})" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>${lead.phone}</span>
        </div>
      </div>
      <div>
        <div style="display:flex;align-items:flex-start;gap:12px;font-size:0.875rem;color:hsl(${colors.primaryForeground} / 0.8)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(${colors.accent})" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <div>
            <p>Seg a Sex: 9h às 20h</p>
            <p>Sáb: 9h às 18h</p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom" style="border-top:1px solid hsl(${colors.primaryForeground} / 0.1);color:hsl(${colors.primaryForeground} / 0.5)">
      <p>© ${new Date().getFullYear()} ${displayName}. Todos os direitos reservados.</p>
    </div>
  </footer>

  <!-- WhatsApp FAB -->
  <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" aria-label="Chamar no WhatsApp agora" class="fab">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  </a>

  <script>
    function sendWhatsApp(){
      var name=document.getElementById('cf-name').value;
      var phone=document.getElementById('cf-phone').value;
      var svc=document.getElementById('cf-service');
      var msg=document.getElementById('cf-msg').value;
      if(!name||phone.replace(/\\D/g,'').length<10){alert('Preencha nome e WhatsApp');return}
      var text='Olá! Meu nome é '+name+'.';
      if(svc&&svc.value)text+=' Tenho interesse em: '+svc.value+'.';
      if(msg)text+=' '+msg;
      text+=' (Enviado pelo site ${displayName})';
      window.open('https://wa.me/${lead.phone}?text='+encodeURIComponent(text),'_blank');
    }
  </script>
</body>
</html>`;
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
  const html = buildSiteHTML(lead);
  const displayName = professionalizeName(lead.company_name, lead.niche);

  const packageJson = JSON.stringify({
    name: lead.slug,
    version: "1.0.0",
    private: true,
    scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
    dependencies: { react: "^18.3.1", "react-dom": "^18.3.1" },
    devDependencies: { "@vitejs/plugin-react": "^4.3.0", vite: "^5.4.0" },
  }, null, 2);

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()] });
`;

  const indexHtml = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${displayName} - ${lead.city}</title></head>
<body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>`;

  const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div dangerouslySetInnerHTML={{ __html: \`${html.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\` }} />
  </React.StrictMode>
);
`;

  const vercelJson = JSON.stringify({
    framework: "vite",
    buildCommand: "npm run build",
    outputDirectory: "dist",
    rewrites: [{ source: "/(.*)", destination: "/index.html" }],
  }, null, 2);

  const readmeMd = `# ${displayName} - ${lead.city}\n\nSite gerado automaticamente.\n\n## Deploy na Vercel\n1. npm install\n2. npm run build\n3. Deploy a pasta dist/\n`;

  zip.file("package.json", packageJson);
  zip.file("vite.config.js", viteConfig);
  zip.file("index.html", indexHtml);
  zip.file("src/main.jsx", mainJsx);
  zip.file("public/index.html", html);
  zip.file("README.md", readmeMd);
  zip.file("vercel.json", vercelJson);

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${lead.slug}-react.zip`);
}
