export function prepareImages(root?: string): Promise<{
  images: number;
  sourceBytes: number;
  largestVariantBytes: number;
  generatedBytes: number;
}>;
