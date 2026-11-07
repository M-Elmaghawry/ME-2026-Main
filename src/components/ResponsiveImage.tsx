import { forwardRef, type ImgHTMLAttributes } from 'react';
import imageManifest from '@/data/imageManifest.json';
import { assetUrl } from '@/lib/utils';

interface ImageInfo {
  width: number;
  height: number;
  variants: { width: number; src: string }[];
}
const images: Record<string, ImageInfo> = imageManifest;
interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
  src: string;
  alt: string;
  priority?: boolean;
}

const ResponsiveImage = forwardRef<HTMLImageElement, Props>(({ src, alt, sizes = '100vw', priority = false, loading, decoding = 'async', ...props }, ref) => {
  let key = src;
  try { key = decodeURI(src); } catch { /* A literal percent sign may be part of a filename. */ }
  const image = images[key];
  // React 18 forwards lowercase attributes without its unsupported-prop warning.
  const priorityAttribute = priority ? { fetchpriority: 'high' } : {};
  return <picture className="contents">
    {image && <source type="image/webp" sizes={sizes} srcSet={image.variants.map((variant) => `${assetUrl(variant.src)} ${variant.width}w`).join(', ')} />}
    <img ref={ref} src={assetUrl(src)} alt={alt} width={image?.width} height={image?.height}
      loading={loading ?? (priority ? 'eager' : 'lazy')} decoding={decoding}
      {...priorityAttribute} {...props} />
  </picture>;
});
ResponsiveImage.displayName = 'ResponsiveImage';
export default ResponsiveImage;
