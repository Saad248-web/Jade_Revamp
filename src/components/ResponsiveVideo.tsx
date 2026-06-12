import { videoSources, type VideoSlug } from "@/lib/videoSources";

export type { VideoSlug };

interface ResponsiveVideoProps {
  slug: VideoSlug;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
}

export default function ResponsiveVideo({
  slug,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  poster,
}: ResponsiveVideoProps) {
  return (
    <video
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      preload="metadata"
      poster={poster}
    >
      <source
        src={videoSources[slug].mobile}
        media="(max-width: 768px) and (orientation: portrait)"
        type="video/mp4"
      />
      <source src={videoSources[slug].landscape} type="video/mp4" />
      Your browser does not support HTML5 video.
    </video>
  );
}
