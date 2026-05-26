import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/923426353166"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        {/* Button */}
        <div className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] group-hover:scale-110 group-hover:shadow-[0_6px_30px_rgba(37,211,102,0.5)] transition-all duration-300">
          <MessageCircle className="w-7 h-7 text-white fill-white" />
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
