import { cloneElement } from 'react';
import { SvgUri, SvgXml } from 'react-native-svg';
import { LocalSvg } from 'react-native-svg/css';
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

  if (typeof svg === 'number') {
    return <LocalSvg asset={svg} fill={logoColor} width={logoSize} height={logoSize} />;
  }

  return cloneElement(svg, {
    width: logoSize,
    height: logoSize,
    ...(logoColor ? { fill: logoColor } : {}),
  });
};

export default LogoSVG;
