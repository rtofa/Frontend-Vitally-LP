import { Truck, RotateCcw, Shield, Headphones } from 'lucide-react';

const perks = [
  { icon: Truck, title: 'Fabricação Própria', desc: 'Direto de nossa indústria' },
  { icon: RotateCcw, title: '45 Dias de Fabricação', desc: 'Equipamentos sob medida' },
  { icon: Shield, title: 'Há mais de 45 anos no mercado', desc: 'Tradição e confiança' },
  { icon: Headphones, title: 'Suporte Especializado', desc: 'Conte com nossa equipe' },
];

export default function PerksStrip() {
  return (
    <section className="relative z-10 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Mobile: horizontal scroll */}
        <div className="sm:hidden snap-x-container gap-3 -mx-4 px-4 pb-2">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="snap-x-item glass-dark rounded-xl px-4 py-3 flex items-center gap-3 min-w-[220px]">
              <div className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Icon size={16} className="text-amber-400" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold leading-tight">{title}</p>
                <p className="text-white/40 text-[10px] mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Tablet/Desktop: grid */}
        <div className="hidden sm:grid glass-dark rounded-2xl px-6 py-5 grid-cols-2 lg:grid-cols-4 gap-4 divide-x-0 lg:divide-x divide-white/5">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">{title}</p>
                <p className="text-white/40 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
