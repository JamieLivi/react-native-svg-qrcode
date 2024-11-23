import React, { useMemo } from 'react';
import Svg, { ClipPath, Defs, G, Image, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import LogoSVG from './LogoSVG';
import { genMatrix } from './genMatrix';
import { transformMatrixIntoPath } from './transformMatrixIntoPath';
import type { QRCodeProps, RenderLogoProps } from './types';

const renderLogo = ({
  size,
  backgroundColor,
  logo,
  logoSVG,
  logoSize,
  logoBackgroundColor,
  logoColor,
  logoMargin,
  logoBorderRadius,
}: RenderLogoProps) => {
  const logoPosition = (size - logoSize - logoMargin * 2) / 2;
  const logoBackgroundSize = logoSize + logoMargin * 2;
  const logoBackgroundBorderRadius = logoBorderRadius + (logoMargin / logoSize) * logoBorderRadius;

  return (
    <G x={logoPosition} y={logoPosition}>
      <Defs>
        <ClipPath id="clip-logo-background">
          <Rect
            width={logoBackgroundSize}
            height={logoBackgroundSize}
            rx={logoBackgroundBorderRadius}
            ry={logoBackgroundBorderRadius}
          />
        </ClipPath>
        <ClipPath id="clip-logo">
          <Rect width={logoSize} height={logoSize} rx={logoBorderRadius} ry={logoBorderRadius} />
        </ClipPath>
      </Defs>
      <G>
        <Rect
          width={logoBackgroundSize}
          height={logoBackgroundSize}
          fill={backgroundColor}
          clipPath="url(#clip-logo-background)"
        />
      </G>
      <G x={logoMargin} y={logoMargin} clipPath="url(#clip-logo)">
        <Rect
          width={logoBackgroundSize - logoMargin}
          height={logoBackgroundSize - logoMargin}
          fill={logoBackgroundColor}
        />
        {logoSVG ? (
          <LogoSVG svg={logoSVG} logoSize={logoSize} logoColor={logoColor} />
        ) : (
          <Image
            width={logoSize}
            height={logoSize}
            preserveAspectRatio="xMidYMid slice"
            href={logo}
            clipPath="url(#clip-logo)"
          />
        )}
      </G>
    </G>
  );
};

const QRCode: React.FC<QRCodeProps> = ({
  value = 'this is a QR code',
  size = 100,
  color = 'black',
  backgroundColor = 'white',
  logo,
  logoSVG,
  logoSize = size * 0.2,
  logoBackgroundColor = 'transparent',
  logoColor,
  logoMargin = 2,
  logoBorderRadius = 0,
  quietZone = 0,
  enableLinearGradient = false,
  gradientDirection = ['0%', '0%', '100%', '100%'],
  linearGradient = ['rgba(0, 73, 255, 1)', 'rgba(255, 255, 255, 1)'],
  ecl = 'M',
  onError,
  testID,
}) => {
  const result = useMemo(() => {
    try {
      return transformMatrixIntoPath(genMatrix(value, ecl), size);
    } catch (error) {
      if (onError && typeof onError === 'function') {
        onError(error as Error);
      }
      return null;
    }
  }, [value, ecl, size, onError]);

  if (!result) {
    return null;
  }

  const { path, cellSize } = result;
  const displayLogo = logo || logoSVG;

  return (
    <Svg
      testID={testID}
      viewBox={[-quietZone, -quietZone, size + quietZone * 2, size + quietZone * 2].join(' ')}
      width={size}
      height={size}
    >
      <Defs>
        <LinearGradient
          id="grad"
          x1={gradientDirection[0]}
          y1={gradientDirection[1]}
          x2={gradientDirection[2]}
          y2={gradientDirection[3]}
        >
          <Stop offset="0" stopColor={linearGradient[0]} stopOpacity="1" />
          <Stop offset="1" stopColor={linearGradient[1]} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <G>
        <Rect
          x={-quietZone}
          y={-quietZone}
          width={size + quietZone * 2}
          height={size + quietZone * 2}
          fill={backgroundColor}
        />
      </G>
      <G>
        <Path
          d={path}
          strokeLinecap="butt"
          stroke={enableLinearGradient ? 'url(#grad)' : color}
          strokeWidth={cellSize}
        />
      </G>
      {displayLogo &&
        renderLogo({
          size,
          backgroundColor,
          logo,
          logoSVG,
          logoSize,
          logoBackgroundColor,
          logoColor,
          logoMargin,
          logoBorderRadius,
        })}
    </Svg>
  );
};

export default QRCode;
