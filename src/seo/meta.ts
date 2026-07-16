/**
 * SEO Optimization & Metadata Schemas (JSON-LD)
 * Solusi Mr Bi
 */

import { BRAND_NAME, BRAND_TAGLINE } from "../constants";

export const getSiteMetadata = () => {
  return {
    title: `${BRAND_NAME} - Bimbingan & Konseling Pernikahan Profesional`,
    description: BRAND_TAGLINE,
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: "https://solusimrbi.id",
      siteName: BRAND_NAME,
      title: `${BRAND_NAME} | Konseling & Terapi Pasangan`,
      description: "Layanan konseling pranikah, pernikahan, dan dinamika cinta berlandaskan sains psikologi modern.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2",
          width: 1200,
          height: 630,
          alt: "Solusi Mr Bi - Konseling Pasangan",
        },
      ],
    },
    robots: "index, follow",
  };
};

/**
 * Returns JSON-LD structured script tag for business rich snippet
 */
export const getJsonLdSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": BRAND_NAME,
    "image": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2",
    "@id": "https://solusimrbi.id/#organization",
    "url": "https://solusimrbi.id",
    "telephone": "+62-812-3456-7890",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Kencana Damai No. 88, Menteng",
      "addressLocality": "Jakarta Pusat",
      "postalCode": "10310",
      "addressCountry": "ID"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    },
    "sameAs": [
      "https://www.instagram.com/solusi.mr.bi",
      "https://www.tiktok.com/@solusi.mr.bi"
    ]
  };
};
