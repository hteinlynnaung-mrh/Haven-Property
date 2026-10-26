import { useEffect, useState } from 'react';

export function SafeImage({ src, alt = '', fallback, onUnavailable, ...props }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) return fallback || null;

  return <img {...props} src={src} alt={alt} onError={() => { setFailed(true); onUnavailable?.(); }} />;
}
