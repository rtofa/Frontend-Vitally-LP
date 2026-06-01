'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Image as ImageIcon, Users, LogOut, Tags, Menu, X } from 'lucide-react';
import { clearAuthToken, getAuthToken } from '@/lib/auth';

const NAV_ITEMS = [
  { label: 'Painel', href: '/admin', icon: LayoutDashboard },
  { label: 'Categorias', href: '/admin/categories', icon: Tags },
  { label: 'Produtos', href: '/admin/products', icon: Package },
  { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { label: 'Leads', href: '/admin/leads', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isLogin) return;
    const token = getAuthToken();
    if (!token) {
      router.replace('/admin/login');
    }
  }, [isLogin, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    clearAuthToken();
    router.replace('/admin/login');
  };

  const handleMobileLogout = () => {
    handleLogout();
    setMobileOpen(false);
  };

  const currentSection =
    NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ??
    'Admin';

  if (isLogin) {
    return <div className="min-h-screen bg-black text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-white/10 bg-black/80 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="p-6 border-b border-white/10">
            <div className="text-[#39FF14] text-xs font-bold uppercase tracking-[0.35em]">Vitally</div>
            <div className="text-white text-xl font-black mt-2">Painel Admin</div>
            <p className="text-white/40 text-xs mt-1">Operações high-ticket</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/40'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-white/15 text-white/70 hover:text-white hover:border-[#39FF14]/40 transition-colors"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="lg:hidden border-b border-white/10 bg-black/80 backdrop-blur-xl px-4 py-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-[#39FF14]/40 transition-colors"
              aria-label="Abrir navegação"
            >
              <Menu size={18} />
            </button>
            <div className="text-center">
              <div className="text-[#39FF14] text-[10px] font-bold uppercase tracking-[0.35em]">Vitally</div>
              <div className="text-white text-sm font-semibold">{currentSection}</div>
            </div>
            <div className="h-10 w-10" aria-hidden="true" />
          </header>

          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">
            {children}
          </main>
        </div>
      </div>

      <div className={`lg:hidden fixed inset-0 z-50 ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-72 max-w-[85%] border-r border-white/10 bg-black/90 backdrop-blur-xl flex flex-col transform transition-transform ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[#39FF14] text-xs font-bold uppercase tracking-[0.35em]">Vitally</div>
              <div className="text-white text-lg font-black mt-1">Painel Admin</div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-[#39FF14]/40 transition-colors"
              aria-label="Fechar navegação"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/40'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleMobileLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-white/15 text-white/70 hover:text-white hover:border-[#39FF14]/40 transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
