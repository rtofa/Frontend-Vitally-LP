export default function VideoSection() {
  return (
    <section className="relative z-10 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Conheça Nossa <span className="text-gradient">História</span>
          </h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 glass-card">
            <iframe
              src="https://www.youtube.com/embed/vEQ9tojPTTA"
              title="Conheça Nossa História"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
