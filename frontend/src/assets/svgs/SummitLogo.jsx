import React, { memo } from 'react';

// Summit Scholars Hub logo - inline SVG matching the circular badge design
const SummitLogo = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer circle */}
    <circle cx="100" cy="100" r="98" fill="#1a3a6b" stroke="#c9a227" strokeWidth="3" />
    {/* Inner ring */}
    <circle cx="100" cy="100" r="85" fill="none" stroke="white" strokeWidth="2" />

    {/* Open book base */}
    <ellipse cx="100" cy="135" rx="52" ry="10" fill="white" opacity="0.9" />
    <path d="M48 135 Q100 120 152 135" stroke="white" strokeWidth="3" fill="none" />
    <path d="M48 135 Q48 145 100 148 Q152 145 152 135" fill="white" opacity="0.7" />
    {/* Book spine line */}
    <line x1="100" y1="120" x2="100" y2="148" stroke="#1a3a6b" strokeWidth="2" />

    {/* Mountains */}
    {/* Left mountain */}
    <path d="M60 133 L85 85 L108 115 L75 133Z" fill="#c9a227" />
    <path d="M70 133 L85 85 L95 105 L78 133Z" fill="#e8b830" />

    {/* Right mountain */}
    <path d="M92 133 L115 88 L140 133Z" fill="#c9a227" />
    <path d="M115 88 L125 110 L140 133 L130 133Z" fill="#e8b830" />

    {/* Center/main peak */}
    <path d="M78 133 L100 65 L122 133Z" fill="#d4a820" />
    <path d="M100 65 L108 90 L122 133 L113 133Z" fill="#c9a227" />
    {/* Path going up mountain */}
    <path d="M100 133 Q105 110 100 65" stroke="#1a3a6b" strokeWidth="2.5" fill="none" opacity="0.4" />

    {/* Star at peak */}
    <polygon
      points="100,42 103.5,52 114,52 105.5,58.5 108.5,69 100,62.5 91.5,69 94.5,58.5 86,52 96.5,52"
      fill="#c9a227"
      stroke="#e8b830"
      strokeWidth="1"
    />
  </svg>
);

export default memo(SummitLogo);
