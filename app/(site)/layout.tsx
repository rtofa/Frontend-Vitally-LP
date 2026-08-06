import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import LeadModal from '@/components/cart/LeadModal';
import WhatsAppWidget from '@/components/whatsapp/WhatsAppWidget';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-[104px] lg:pt-[160px]">{children}</main>
        <Footer />
      </div>
      <CartDrawer />
      <LeadModal />
      <WhatsAppWidget />
    </CartProvider>
  );
}
