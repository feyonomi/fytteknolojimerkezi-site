export function WhatsappFloat() {
  const link = "https://wa.me/905412991923?text=Merhaba%20Fyt%20Teknoloji%20Merkezi,%20bilgi%20almak%20istiyorum.";

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-[#03231b] shadow-lg transition hover:scale-[1.02]"
      aria-label="WhatsApp ile iletişime geç"
    >
      WhatsApp
    </a>
  );
}
