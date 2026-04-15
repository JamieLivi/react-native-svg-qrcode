import { SvgUri, SvgXml } from 'react-native-svg';
import type { LogoSVGProps } from './types';

const isString = (variable: unknown): variable is string => {
  return typeof variable === 'string';
};

const isUrlString = (variable: unknown): boolean => {
  return isString(variable) && variable.startsWith('http');
};

const LogoSVG = ({ svg, logoSize, logoColor }: LogoSVGProps) => {
  if (isString(svg)) {
    if (isUrlString(svg)) {
      return <SvgUri uri={svg} fill={logoColor} width={logoSize} height={logoSize} />;
    }

    return <SvgXml xml={svg} fill={logoColor} width={logoSize} height={logoSize} />;
  }

  // Local assets via require() are not supported on web
  return null;
};

export default LogoSVG;
