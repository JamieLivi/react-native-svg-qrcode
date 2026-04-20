import type { ReactElement } from 'react';

export interface LogoSVGProps {
  svg: string | number | ReactElement;
  logoSize: number;
  logoColor?: string;
}
