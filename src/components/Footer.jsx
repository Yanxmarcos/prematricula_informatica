import { ContactRound, Mail, Facebook, Phone, Clock, HelpCircle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export default function Footer() {
  const [showDevelopers, setShowDevelopers] = useState(false);
  const handleHelpClick = () => {
    // Modal de ayuda, implementación pendiente ... fe
    // Modal de ayuda, implementación pendiente ... fe
    // Modal de ayuda, implementación pendiente ... fe
    console.log("Abrir modal de ayuda");
  };

  const externalLinks = [
    { name: "Página Oficial Informática", url: "https://inf.unitru.edu.pe/" },
    { name: "Aula Virtual UNT", url: "https://aulavirtual2.unitru.edu.pe/login/index.php" },
    { name: "Sistema Universitario Virtual", url: "https://suv2.unitru.edu.pe/" },
    { name: "FUT", url: "https://inf.unitru.edu.pe/fut" }
  ];

  return (
    <footer className="relative mt-16 bg-gradient-to-br from-[#1E232E] via-[#1B264F] to-[#1E232E] border-t border-[#4A6CF7]/20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4A6CF7] to-transparent"></div>
      
      <div className="container mx-auto px-6 py-12">
        {/* Botón de Ayuda */}
        <div className="flex justify-center mb-12 animate-pulse">
          <button 
            onClick={handleHelpClick}
            className="group bg-gradient-to-r from-[#4A6CF7] to-blue-500 hover:from-blue-500 hover:to-[#4A6CF7] text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-3 text-lg font-semibold"
          >
            <HelpCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span>¿Necesitas Ayuda?</span>
            <div className="w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
          </button>
        </div>

        {/* Footer Principal */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-8">
          {/* UNT Info */}
          <div className="animate-fade-up [animation-delay:100ms]">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#4A6CF7]/20 to-blue-500/20 rounded-2xl flex items-center justify-center mr-3 border border-[#4A6CF7]/30">
                <img src="/logo_info.webp" alt="Logo" className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Universidad Nacional de Trujillo</h3>
                <p className="text-sm text-[#4A6CF7]">Escuela Profesional de Informática</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Formando profesionales en informática con excelencia académica y compromiso social para el
              desarrollo de soluciones innovadoras que impacten al mundo.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className="animate-fade-up [animation-delay:200ms]">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <ExternalLink className="w-4 h-4 mr-2 text-[#4A6CF7]" />
              Enlaces Externos
            </h4>
            <ul className="space-y-3">
              {externalLinks.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#4A6CF7] transition-all duration-300 text-sm flex items-center group hover:translate-x-1"
                  >
                    <div className="w-2 h-2 bg-[#4A6CF7]/50 rounded-full mr-3 group-hover:bg-[#4A6CF7] transition-colors"></div>
                    {item.name}
                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="animate-fade-up [animation-delay:300ms]">
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <div className="space-y-4">
              <ContactoItem
                icon={<Phone className="w-4 h-4" />}
                bg="bg-green-500/20"
                iconColor="text-green-400"
                text="924 079 049"
                sub="Secretaría Académica"
                borderColor="border-green-500/30"
              />
              <ContactoItem
                icon={<Mail className="w-4 h-4" />}
                bg="bg-[#4A6CF7]/20"
                iconColor="text-[#4A6CF7]"
                text="informatica@unitru.edu.pe"
                sub="Información General"
                borderColor="border-[#4A6CF7]/30"
              />
              <ContactoItem
                icon={<Clock className="w-4 h-4" />}
                bg="bg-purple-500/20"
                iconColor="text-purple-400"
                text="Lun-Vie: 7:00am a 2:45pm"
                sub="Horario de Atención"
                borderColor="border-purple-500/30"
              />
            </div>
          </div>

          {/* Red Social: solo Facebook */}
          <div className="animate-fade-up [animation-delay:400ms]">
            <h4 className="text-white font-semibold mb-4">Síguenos</h4>
            <a
              href="https://www.facebook.com/profile.php?id=61569647381199"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 hover:border-blue-400 px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group"
            >
              <Facebook className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <div>
                <p className="text-white text-sm font-medium">Facebook</p>
                <p className="text-gray-400 text-xs">@Ingeniería Informática - UNT</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-300 transition-colors" />
            </a>
            
            <div className="mt-4 p-3 bg-[#1B264F]/50 rounded-lg border border-[#4A6CF7]/20">
              <p className="text-xs text-gray-400 mb-1">Síguenos para:</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Noticias y eventos</li>
                <li>• Logros estudiantiles</li>
                <li>• Convocatorias importantes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-6 pb-6 border-t border-[#4A6CF7]/20">
          <p className="text-gray-400 text-sm">
            © 2026 Universidad Nacional de Trujillo - Escuela Profesional de Informática. Todos los derechos reservados.
          </p>
        </div>

        <div className="relative mb-8">
          <div className="border-t border-[#4A6CF7]/20"></div>
          <div className="absolute inset-0 flex justify-center">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#4A6CF7] to-transparent"></div>
          </div>
        </div>

        
        {/* Créditos del Equipo de Desarrollo */}
        <div className="text-center animate-fade-up [animation-delay:500ms]">
          <button 
            onClick={() => setShowDevelopers(!showDevelopers)}
            className="text-gray-400 hover:text-gray-300 text-xs flex items-center justify-center mx-auto transition-colors duration-300 group"
          >
            <div className="w-4 h-4 bg-gray-600/50 rounded mr-2 flex items-center justify-center group-hover:bg-gray-500/50 transition-colors">
              <svg className="w-2 h-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Equipo de Desarrollo</span>
            {showDevelopers ? (
              <ChevronUp className="w-3 h-3 ml-1 transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-1 transition-transform duration-300" />
            )}
          </button>
          
          {/* Contenido expandible */}
          <div className={`overflow-hidden transition-all duration-500 ${showDevelopers ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="grid md:grid-cols-4 gap-5 max-w-4xl mx-auto">

              <div className="group bg-gradient-to-br from-[#4A6CF7]/5 to-blue-500/5 border border-[#4A6CF7]/10 rounded-xl p-4 hover:border-[#4A6CF7]/30 transition-all duration-300 hover:shadow-sm hover:shadow-[#4A6CF7]/10">
                <div className="w-8 h-8 bg-gradient-to-br from-[#4A6CF7] to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xs">YC</span>
                </div>
                <h5 className="text-white font-medium text-sm mb-1">Yanxmarcos Chan Vásquez</h5>
                <p className="text-[#4A6CF7] text-xs mb-2">yanxmarcoschan@outlook.com</p>
                {/* <button className="text-gray-400 hover:text-[#4A6CF7] text-xs transition-colors duration-300 flex items-center justify-center mx-auto space-x-1">
                  <ContactRound className="w-3 h-3" />
                  <span>Contactar</span>
                </button> */}
              </div>

              <div className="group bg-gradient-to-br from-[#4A6CF7]/5 to-blue-500/5 border border-[#4A6CF7]/10 rounded-xl p-4 hover:border-[#4A6CF7]/30 transition-all duration-300 hover:shadow-sm hover:shadow-[#4A6CF7]/10">
                <div className="w-8 h-8 bg-gradient-to-br from-[#4A6CF7] to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xs">EI</span>
                </div>
                <h5 className="text-white font-medium text-sm mb-1">Eliaser Isai Avila Zamudio</h5>
                <p className="text-[#4A6CF7] text-xs mb-2">eliaseravilazamudio@gmail.com</p>
              </div>

              <div className="group bg-gradient-to-br from-[#4A6CF7]/5 to-blue-500/5 border border-[#4A6CF7]/10 rounded-xl p-4 hover:border-[#4A6CF7]/30 transition-all duration-300 hover:shadow-sm hover:shadow-[#4A6CF7]/10">
                <div className="w-8 h-8 bg-gradient-to-br from-[#4A6CF7] to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xs">JB</span>
                </div>
                <h5 className="text-white font-medium text-sm mb-1">Jim Becerra Gutierrez</h5>
                <p className="text-[#4A6CF7] text-xs mb-2">jbecerrag@unitru.edu.pe</p>
              </div>
              
              <div className="group bg-gradient-to-br from-[#4A6CF7]/5 to-blue-500/5 border border-[#4A6CF7]/10 rounded-xl p-4 hover:border-[#4A6CF7]/30 transition-all duration-300 hover:shadow-sm hover:shadow-[#4A6CF7]/10">
                <div className="w-8 h-8 bg-gradient-to-br from-[#4A6CF7] to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xs">JB</span>
                </div>
                <h5 className="text-white font-medium text-sm mb-1">Farid Cayetano Morillas</h5>
                <p className="text-[#4A6CF7] text-xs mb-2">fcayetanomorillas@gmail.com</p>
              </div>

            </div>
          </div>
        </div>

        
      </div>
    </footer>
  )
}

function ContactoItem({ icon, bg, iconColor, text, sub, borderColor }) {
  return (
    <div className="flex items-center text-gray-300 text-sm group hover:text-white transition-colors duration-300">
      <div className={`w-10 h-10 ${bg} ${borderColor} border rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
        <div className={`${iconColor} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="font-medium group-hover:text-[#4A6CF7] transition-colors duration-300">{text}</p>
        <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{sub}</p>
      </div>
    </div>
  )
}