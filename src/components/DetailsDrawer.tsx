import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Centering wrapper */}
          <div
            className="fixed inset-0 z-[101] flex flex-col items-center justify-end md:justify-center px-4 md:px-0"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Floating close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onClose}
              className="w-12 h-12 mb-3 rounded-full bg-[#124131] flex items-center justify-center text-white hover:bg-[#1f5c48] transition-colors shadow-2xl flex-shrink-0 z-[102]"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </motion.button>

            {/* Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full md:w-[600px] bg-[#0E3A2F] flex flex-col font-manrope rounded-t-2xl md:rounded-lg shadow-2xl border border-white/10 max-h-[80vh] md:max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center px-6 pt-6 pb-2 border-b border-white/5">
                <h2 className="text-white text-gh-h2 font-philosopher">
                  {title}
                </h2>
              </div>

              {/* CONTENT AREA */}
              <div
                className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8"
                data-lenis-prevent
              >
                <div className="flex flex-col gap-6">
                  {items.map((item, idx) => {
                    const Icon = item.icon ? getIcon(item.icon) : null;
                    const itemTitle =
                      item.label ||
                      (item as any).title ||
                      (item as any).question;
                    const description =
                      item.description || (item as any).answer;

                    return (
                      <div key={idx} className="flex gap-4 items-start group">
                        {Icon && (
                          <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-white/10 rounded-sm bg-white/5 transition-colors group-hover:bg-white/10">
                            <Icon className="w-4 h-4 text-[#EFCD62]" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-white font-manrope font-bold tracking-widest text-[12px] mb-2 uppercase">
                            {itemTitle}
                          </h3>
                          {description && (
                            <p className="text-white/60 text-gh-body leading-relaxed">
                              {description}
                            </p>
                          )}
                          {item.footer && (
                            <p className="text-jade-gold text-gh-label mt-2 font-bold tracking-widest uppercase">
                              {item.footer}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailsDrawer;
