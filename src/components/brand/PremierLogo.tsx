import React from 'react';

interface PremierLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const PremierLogo: React.FC<PremierLogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  // Variant colors:
  // 'light' is for dark backgrounds (e.g. Header #0F2433, Footer #0B1B27): text is white/cream
  // 'dark' is for light backgrounds (e.g. #F8F6F1): text is deep navy #0F2433
  const isLight = variant === 'light';
  const textColor = isLight ? '#FFFFFF' : '#0F2433';
  const roofColor = isLight ? '#FFFFFF' : '#0F2433';
  const goldColor = '#C8A46B';
  const buildingNavy = isLight ? '#94A3B8' : '#0F2433';

  const sizeDimensions = {
    sm: { height: 32, textScale: 'text-lg', subScale: 'text-[9px]' },
    md: { height: 42, textScale: 'text-2xl', subScale: 'text-[10px]' },
    lg: { height: 56, textScale: 'text-3xl', subScale: 'text-xs' },
    xl: { height: 72, textScale: 'text-4xl', subScale: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Vector Emblem matching PREMIER.png */}
      <svg
        height={sizeDimensions.height}
        viewBox="0 0 120 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        {/* High-Rise Towers (behind and above roof) */}
        {/* Tower 1 (Navy/Slate) */}
        <polygon points="56,42 56,8 65,3 65,42" fill={buildingNavy} />
        {/* Tower 2 (Gold/Sand) */}
        <polygon points="68,42 68,13 77,17 77,42" fill={goldColor} />
        {/* Tower 3 (Navy/Slate) */}
        <polygon points="80,42 80,24 88,27 88,42" fill={buildingNavy} />
        {/* Tower 4 (Gold/Sand) */}
        <polygon points="91,42 91,33 97,36 97,42" fill={goldColor} />

        {/* Slanted Gable Roof */}
        <polygon
          points="62,28 85,46 79,48 62,35 24,53 18,48"
          fill={roofColor}
        />
        {/* Inner shadow line under roof */}
        <polygon
          points="62,35 83,49 80,51 62,38 27,53 25,51"
          fill={roofColor}
          opacity="0.8"
        />

        {/* 4-Pane Window in Gable */}
        <rect x="49" y="38" width="4.5" height="4.5" fill={goldColor} rx="0.5" />
        <rect x="55" y="38" width="4.5" height="4.5" fill={goldColor} rx="0.5" />
        <rect x="49" y="44" width="4.5" height="4.5" fill={goldColor} rx="0.5" />
        <rect x="55" y="44" width="4.5" height="4.5" fill={goldColor} rx="0.5" />

        {/* Curved Golden Baseline Swoosh */}
        <path
          d="M16 54 C35 50, 50 48, 68 53 C85 57, 100 58, 114 55 C100 62, 75 62, 50 56 C34 52, 22 55, 16 54 Z"
          fill={goldColor}
        />
      </svg>

      {/* Typography Lockup */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-brand-mark font-bold tracking-[0.24em] ${sizeDimensions.textScale} uppercase transition-colors`}
          style={{ color: textColor }}
        >
          PREMIER
        </span>
        {showSubtitle && (
          <span
            className={`font-sans tracking-[0.38em] uppercase ${sizeDimensions.subScale} font-medium mt-1`}
            style={{ color: goldColor }}
          >
            REAL ESTATE · CMS
          </span>
        )}
      </div>
    </div>
  );
};
