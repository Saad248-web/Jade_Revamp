import JadeImage from "@/components/ui/JadeImage";

type VillaRetreatHeroLogoProps = {
  src: string;
  alt: string;
};

export default function VillaRetreatHeroLogo({ src, alt }: VillaRetreatHeroLogoProps) {
  return (
    <div className="relative w-full max-w-[min(100%,20rem)] h-[clamp(2.5rem,8vw,4.5rem)] mx-auto px-1">
      <JadeImage
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 768px) 70vw, 320px"
        className="object-contain object-center drop-shadow-lg"
      />
    </div>
  );
}
