import React, { useEffect, useState } from "react";
import {
  X,
  Wifi,
  Car,
  Wind,
  Waves,
  Dribbble,
  Presentation,
  Trees,
  Mountain,
  PartyPopper,
  Bath,
  Home,
  Sun,
  ChefHat,
  SprayCan,
  User,
  Phone,
  Check,
  Zap,
  Info,
  Projector,
  Diamond,
} from "lucide-react";

interface DetailItem {
  label: string;
  icon: string;
  description?: string;
  footer?: string; // For services
}

interface DetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: DetailItem[];
}

const getIcon = (iconName: string) => {
  const icons: any = {
    Wifi,
    Car,
    Wind,
    Waves,
    Dribbble,
    Presentation,
    Trees,
    Mountain,
    PartyPopper,
    Bath,
    Home,
    Sun,
    ChefHat,
    SprayCan,
    User,
    Phone,
    Check,
    Zap,
    Projector,
    Diamond,
  };
  return icons[iconName] || Info;
};

const DetailsDrawer: React.FC<DetailsDrawerProps> = ({
  isOpen,
  onClose,
  title,
  items,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Wait for animation
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg md:max-w-2xl max-h-[85vh] bg-[#0D4032] text-white shadow-2xl transform transition-all duration-300 ease-out flex flex-col ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } rounded-[32px] overflow-hidden border border-white/10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/10">
          <h2 className="text-3xl font-philosopher">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white/80" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex flex-col gap-8">
            {items.map((item, idx) => {
              const Icon = item.icon ? getIcon(item.icon) : null;
              const title =
                item.label || (item as any).title || (item as any).question;
              const description = item.description || (item as any).answer;

              return (
                <div key={idx} className="flex gap-5 group">
                  {/* Icon Box - Only render if icon exists */}
                  {Icon && (
                    <div className="shrink-0 w-12 h-12 flex items-center justify-center border border-[#EFCD62]/30 rounded-sm bg-[#EFCD62]/5">
                      <Icon className="w-5 h-5 text-[#EFCD62]" />
                    </div>
                  )}

                  {/* Content Container - Adjust padding if no icon */}
                  <div className={!Icon ? "pl-2" : ""}>
                    <h3 className="text-lg font-bold font-manrope mb-2 text-white">
                      {title}
                    </h3>
                    {description && (
                      <p className="text-white/70 text-sm leading-relaxed font-manrope text-justify">
                        {description}
                      </p>
                    )}
                    {item.footer && (
                      <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider font-manrope">
                        {item.footer}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsDrawer;
