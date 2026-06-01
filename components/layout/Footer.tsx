import Link from 'next/link';
import { Instagram, Facebook, Youtube, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-12 sm:mt-20 border-t border-white/8">
      <div className="glass-dark">
        {/* Newsletter */}
        <div className="border-b border-white/8">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="text-center lg:text-left">
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-1">Fique por dentro</h3>
                <p className="text-white/50 text-xs sm:text-sm">Receba lançamentos exclusivos, dicas de treino e ofertas para membros.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <input
                  type="email"
                  placeholder="Digite seu email"
                  className="flex-1 lg:w-72 bg-white/5 border border-white/10 rounded-full px-5 h-11 sm:h-12 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/60 transition-all"
                />
                <button className="h-11 sm:h-12 px-8 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-full transition-all whitespace-nowrap">
                  Inscrever-se
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4 group">
                <img
                  src="/Logo/Vitally%20-%20Logotipo%20Branca.svg"
                  alt="Vitally"
                  className="h-7 sm:h-8 w-auto"
                />
              </Link>
              <p className="text-white/40 text-xs sm:text-sm leading-relaxed mb-5">
                Equipamentos de academia projetados para força, cardio e performance todos os dias.
              </p>
              <div className="flex gap-3">
                {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-9 h-9 bg-white/5 hover:bg-amber-500/20 border border-white/8 hover:border-amber-500/40 rounded-full flex items-center justify-center text-white/50 hover:text-amber-400 transition-all"
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 sm:mb-4 uppercase tracking-wider">Loja</h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {[
                  { label: 'Máquinas de Força', href: '/shop?category=M%C3%A1quinas%20de%20For%C3%A7a' },
                  { label: 'Cardio', href: '/shop?category=Cardio' },
                  { label: 'Pesos Livres', href: '/shop?category=Pesos%20Livres' },
                  { label: 'Racks e Bancos', href: '/shop?category=Racks%20e%20Bancos' },
                  { label: 'Treino Funcional', href: '/shop?category=Treino%20Funcional' },
                  { label: 'Acessórios', href: '/shop?category=Acess%C3%B3rios' },
                  { label: 'Ofertas', href: '/shop' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-white/45 hover:text-white text-xs sm:text-sm transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 sm:mb-4 uppercase tracking-wider">Empresa</h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {['Sobre nós', 'Carreiras', 'Sustentabilidade', 'Imprensa', 'Afiliados', 'Blog'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/45 hover:text-white text-xs sm:text-sm transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 sm:mb-4 uppercase tracking-wider">Ajuda</h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {['FAQ', 'Envio e devoluções', 'Guia de tamanhos', 'Guia de cuidados', 'Rastrear pedido', 'Fale conosco'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/45 hover:text-white text-xs sm:text-sm transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 sm:mb-4 uppercase tracking-wider">Contato</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-white/45 text-xs sm:text-sm">
                  <Mail size={14} className="text-amber-500 shrink-0" />
                  contato@vitally.com.br
                </li>
                <li className="flex items-center gap-2.5 text-white/45 text-xs sm:text-sm">
                  <Phone size={14} className="text-amber-500 shrink-0" />
                  +55 17 99641-8917
                </li>
                <li className="flex items-start gap-2.5 text-white/45 text-xs sm:text-sm">
                  <MapPin size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  São José do Rio Preto, Brasil
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 sm:py-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-white/30 text-[10px] sm:text-xs">
              &copy; 2026 Vitally. Todos os direitos reservados.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-white/30 text-[10px] sm:text-xs">Aplicação desenvolvida por</span>
              <a
                href="https://www.linkedin.com/in/ryan-tofanini"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center h-7 sm:h-8 px-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:border-white/30 transition-colors text-[10px] sm:text-xs"
              >
                Ryan Tofanini
              </a>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              {['Política de Privacidade', 'Termos de Serviço', 'Política de Cookies'].map((item) => (
                <Link key={item} href="#" className="text-white/30 hover:text-white/60 text-[10px] sm:text-xs transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
