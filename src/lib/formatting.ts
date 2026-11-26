// Course counts use Western digits and comma grouping in both approved locales.
// Keep this separate from locale-specific currency and date formatting.
const countFormatter = new Intl.NumberFormat('en-US', {
  numberingSystem: 'latn',
  maximumFractionDigits: 0,
  useGrouping: true,
});

export function formatCount(value: number): string {
  return countFormatter.format(value);
}
