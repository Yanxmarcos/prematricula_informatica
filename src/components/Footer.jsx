"use client";
import Image from "next/image";
import Link from "next/link";
import { Mail, Facebook, Phone, Clock, ExternalLink, MapPin } from "lucide-react";

const Footer = () => {
  const externalLinks = [
    { name: "Página Oficial Informática", url: "https://inf.unitru.edu.pe/" },
    { name: "Aula Virtual UNT", url: "https://aulavirtual2.unitru.edu.pe/login/index.php" },
    { name: "Sistema Universitario Virtual", url: "https://suv2.unitru.edu.pe/" },
    { name: "FUT", url: "https://inf.unitru.edu.pe/fut" }
  ];

  return (
    <footer className="relative z-10 bg-[#0a0e1a] pt-16 md:pt-20 lg:pt-24 pb-8 border-t border-primary/20">
      {/* Gradiente superior */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className="-mx-4 flex flex-wrap">
          {/* Columna 1: Logo y descripción */}
          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
            <div className="mb-12 max-w-[360px] lg:mb-16">
              <Link href="/" className="mb-8 inline-block">
                <div className="flex items-center">
                  <img 
                    src="/logo_info.webp" 
                    alt="Logo Informática UNT" 
                    className="w-12 h-12 mr-3"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">Universidad Nacional de Trujillo</h3>
                    <p className="text-sm text-primary font-medium">Escuela Profesional de Informática</p>
                  </div>
                </div>
              </Link>
              <p className="mb-9 text-base leading-relaxed text-muted-foreground">
                Formando profesionales en informática con excelencia académica y compromiso social para el desarrollo de soluciones innovadoras que impacten al mundo.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61569647381199"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground duration-300 hover:text-primary transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://inf.unitru.edu.pe/"
                  aria-label="Página Web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground duration-300 hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Columna 2: Enlaces útiles */}
          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
            <div className="mb-12 lg:mb-16">
              <h2 className="mb-10 text-xl font-bold text-white">
                Enlaces Útiles
              </h2>
              <ul>
                {externalLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-4 inline-block text-base text-muted-foreground duration-300 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Columna 3: Contacto */}
          <div className="w-full px-4 md:w-1/2 lg:w-2/12 xl:w-2/12">
            <div className="mb-12 lg:mb-16">
              <h2 className="mb-10 text-xl font-bold text-white">
                Contacto
              </h2>
              <ul className="space-y-4">
                {/* <li className="flex items-start">
                  <Phone className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">924 079 049</p>
                    <p className="text-muted-foreground text-xs">Secretaría</p>
                  </div>
                </li> */}
                                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Av. Juan Pablo II</p>
                    <p className="text-muted-foreground text-xs">Ciudad Universitaria - Trujillo</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">informatica@unitru.edu.pe</p>
                    <p className="text-muted-foreground text-xs">Correo Institucional</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Lun-Vie: 7:00am a 2:45pm</p>
                    <p className="text-muted-foreground text-xs">Horario de Atención</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
            <div className="mb-12 lg:mb-16">
              <h2 className="mb-10 text-xl font-bold text-white">
                Redes
              </h2>
              <a
                href="https://www.facebook.com/profile.php?id=61569647381199"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center w-full space-x-3 bg-primary/10 border border-primary/30 hover:border-primary px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
              >
                <Facebook className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" />
                <div>
                  <p className="text-white text-sm font-medium">Facebook</p>
                  <p className="text-muted-foreground text-xs">@Ingeniería Informática - UNT</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        {/* Copyright */}
        <div className="py-8">
          <p className="text-center text-base text-muted-foreground">
            © 2026 Universidad Nacional de Trujillo - Escuela Profesional de Informática.
            <br className="sm:hidden" />
          </p>
        </div>
      </div>

      {/* Decoración de fondo */}
      <div className="absolute right-0 top-14 z-[-1]">
        <svg
          width="55"
          height="99"
          viewBox="0 0 55 99"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle opacity="0.8" cx="49.5" cy="49.5" r="49.5" fill="#2563eb" />
          <mask
            id="mask0_94:899"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="99"
            height="99"
          >
            <circle
              opacity="0.8"
              cx="49.5"
              cy="49.5"
              r="49.5"
              fill="#2563eb"
            />
          </mask>
          <g mask="url(#mask0_94:899)">
            <circle
              opacity="0.8"
              cx="49.5"
              cy="49.5"
              r="49.5"
              fill="url(#paint0_radial_94:899)"
            />
            <g opacity="0.8" filter="url(#filter0_f_94:899)">
              <circle cx="53.8676" cy="26.2061" r="20.3824" fill="white" />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_f_94:899"
              x="12.4852"
              y="-15.1763"
              width="82.7646"
              height="82.7646"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="10.5"
                result="effect1_foregroundBlur_94:899"
              />
            </filter>
            <radialGradient
              id="paint0_radial_94:899"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(49.5 49.5) rotate(90) scale(53.1397)"
            >
              <stop stopOpacity="0.47" />
              <stop offset="1" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-24 left-0 z-[-1]">
        <svg
          width="79"
          height="94"
          viewBox="0 0 79 94"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-41"
            y="26.9426"
            width="66.6675"
            height="66.6675"
            transform="rotate(-22.9007 -41 26.9426)"
            fill="url(#paint0_linear_94:889)"
          />
          <rect
            x="-41"
            y="26.9426"
            width="66.6675"
            height="66.6675"
            transform="rotate(-22.9007 -41 26.9426)"
            stroke="url(#paint1_linear_94:889)"
            strokeWidth="0.7"
          />
          <path
            opacity="0.3"
            d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L77.1885 68.2073L50.5215 7.42229Z"
            fill="url(#paint2_linear_94:889)"
          />
          <path
            d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L76.7963 68.2073L50.5215 7.42229Z"
            stroke="url(#paint3_linear_94:889)"
            strokeWidth="0.7"
          />
          <path
            opacity="0.3"
            d="M17.9721 93.3057L-14.9695 88.2076L46.2077 62.325L77.1885 68.2074L17.9721 93.3057Z"
            fill="url(#paint4_linear_94:889)"
          />
          <path
            d="M17.972 93.3057L-14.1852 88.2076L46.2077 62.325L77.1884 68.2074L17.972 93.3057Z"
            stroke="url(#paint5_linear_94:889)"
            strokeWidth="0.7"
          />
          <defs>
            <linearGradient
              id="paint0_linear_94:889"
              x1="-41"
              y1="21.8445"
              x2="36.9671"
              y2="59.8878"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2563eb" stopOpacity="0.62" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_94:889"
              x1="25.6675"
              y1="95.9631"
              x2="-42.9608"
              y2="20.668"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2563eb" stopOpacity="0" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0.51" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_94:889"
              x1="20.325"
              y1="-3.98039"
              x2="90.6248"
              y2="25.1062"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2563eb" stopOpacity="0.62" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_94:889"
              x1="18.3642"
              y1="-1.59742"
              x2="113.9"
              y2="80.6826"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2563eb" stopOpacity="0" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0.51" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_94:889"
              x1="61.1098"
              y1="62.3249"
              x2="-8.82468"
              y2="58.2156"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2563eb" stopOpacity="0.62" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint5_linear_94:889"
              x1="65.4236"
              y1="65.0701"
              x2="24.0178"
              y2="41.6598"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2563eb" stopOpacity="0" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0.51" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;