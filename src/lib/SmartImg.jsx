import { useState } from "react";

/*
  Uses the local /public/images asset first; falls back to the bundled
  remote URL only if the local file is missing. Once the cropped
  reference images are placed in public/images, no code change is needed.
*/
export default function SmartImg({ local, remote, alt, className, eager = false, onError }) {
  const [src, setSrc] = useState(local);
  return (
    <img
      src={src}
      onError={() => {
        if (src !== remote) setSrc(remote);
        if (onError) onError();
      }}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      className={className}
    />
  );
}
