export interface ColorRgb {
  r: number;
  g: number;
  b: number;
}

export interface ContrastResult {
  ratio: number;
  aa: boolean;
  aaLarge: boolean;
  aaa: boolean;
  aaaLarge: boolean;
}

const linearizeChannel = (channel: number): number => {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
};

const relativeLuminance = ({ r, g, b }: ColorRgb): number => {
  return (
    0.2126 * linearizeChannel(r) +
    0.7152 * linearizeChannel(g) +
    0.0722 * linearizeChannel(b)
  );
};

export const contrastRatio = (foreground: ColorRgb, background: ColorRgb): number => {
  const lumA = relativeLuminance(foreground);
  const lumB = relativeLuminance(background);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
};

export const calculateContrast = (foreground: ColorRgb, background: ColorRgb): ContrastResult => {
  const ratio = contrastRatio(foreground, background);
  return {
    ratio,
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 4.5
  };
};

export const rgbToHex = ({ r, g, b }: ColorRgb): string => {
  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const clampRgb = (value: number): number => Math.min(255, Math.max(0, Math.round(value)));

export const hexToRgb = (hex: string): ColorRgb | null => {
  const cleanedHex = hex.replace(/^#/, '');
  if (cleanedHex.length !== 6) return null;

  const r = parseInt(cleanedHex.slice(0, 2), 16);
  const g = parseInt(cleanedHex.slice(2, 4), 16);
  const b = parseInt(cleanedHex.slice(4, 6), 16);

  if ([r, g, b].some(isNaN)) return null;

  return { r, g, b };
}

export const adjustLightness = (color: ColorRgb, lightness: number): ColorRgb => {
  const factor = lightness / 100;
  return {
    r: clampRgb(color.r * factor),
    g: clampRgb(color.g * factor),
    b: clampRgb(color.b * factor)
  };
};