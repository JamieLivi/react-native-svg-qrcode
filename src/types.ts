export interface QRCodeProps {
  value?: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  logo?: string;
  logoSVG?: string | object;
  logoSize?: number;
  logoBackgroundColor?: string;
  logoColor?: string;
  logoMargin?: number;
  logoBorderRadius?: number;
  quietZone?: number;
  enableLinearGradient?: boolean;
  gradientDirection?: string[];
  linearGradient?: string[];
  ecl?: 'L' | 'M' | 'Q' | 'H';
  onError?: (error: Error) => void;
  testID?: string;
}

export interface RenderLogoProps {
  size: number;
  backgroundColor: string;
  logo?: string;
  logoSVG?: string | object;
  logoSize: number;
  logoBackgroundColor: string;
  logoColor?: string;
  logoMargin: number;
  logoBorderRadius: number;
}
