import React from 'react';

/* KIX icon set — hand-drawn SVGs in the style of a modern social app.
   All icons accept size + filled (boolean) + className. */

const base = (size, extra = {}) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
  ...extra,
});

export const IconHome = ({ size = 24, filled = false }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M3 10.5 12 3l9 7.5" fill={filled ? 'currentColor' : 'none'} />
    <path d="M5 9.5V21h5v-6h4v6h5V9.5" fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'} />
  </svg>
);

export const IconSearch = ({ size = 24, filled = false }) => (
  <svg {...base(size)} aria-hidden>
    <circle cx="11" cy="11" r="7" fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'currentColor' : 'currentColor'} />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconExplore = ({ size = 24, filled = false }) => (
  <svg {...base(size)} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" fill={filled ? 'currentColor' : 'none'} />
    <path d="m8.5 15.5 2.6-6.4L17.5 11l-2.6 6.4z" fill={filled ? '#fff' : 'none'} stroke={filled ? '#fff' : 'currentColor'} />
  </svg>
);

export const IconReels = ({ size = 24, filled = false }) => (
  <svg {...base(size)} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" fill={filled ? 'currentColor' : 'none'} />
    <path d="M3 8.5h18M9.5 3 13 8.5M15 3l3.5 5.5" stroke={filled ? '#fff' : 'currentColor'} />
    <path d="m10.5 12.5 5 3-5 3z" fill={filled ? '#fff' : 'currentColor'} stroke="none" />
  </svg>
);

export const IconMessage = ({ size = 24, filled = false }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M12 21c4.97 0 9-3.8 9-8.5S16.97 4 12 4 3 7.8 3 12.5c0 2.3 1 4.4 2.6 5.9L4.5 21l3.4-1.2c1.2.5 2.6.7 4.1.7z"
      fill={filled ? 'currentColor' : 'none'} />
  </svg>
);

export const IconHeart = ({ size = 24, filled = false }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M12 20.3 4.7 13a4.6 4.6 0 0 1 0-6.5 4.6 4.6 0 0 1 6.5 0l.8.8.8-.8a4.6 4.6 0 0 1 6.5 6.5z"
      fill={filled ? '#ff3040' : 'none'} stroke={filled ? '#ff3040' : 'currentColor'} />
  </svg>
);

export const IconComment = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z" />
  </svg>
);

export const IconShare = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M21.5 3 10.5 14M21.5 3l-7 18-4-7-7-4z" />
  </svg>
);

export const IconBookmark = ({ size = 24, filled = false }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M5.5 3.5h13v18L12 16.6 5.5 21.5z" fill={filled ? 'currentColor' : 'none'} />
  </svg>
);

export const IconCreate = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

export const IconMenu = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M4 6.5h16M4 12h16M4 17.5h16" />
  </svg>
);

export const IconThreads = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M12 21c-4.5 0-7.5-3-7.5-9S7.5 3 12 3c3.8 0 6.4 2 7.2 5.2M9 10.5c.6-1.3 1.7-2 3.2-2 2 0 3.3 1.3 3.3 3.5S14.3 15.5 12.2 15.5c-1.4 0-2.4-.6-3-1.7" />
  </svg>
);

export const IconMore = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

export const IconClose = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
);

export const IconChevronLeft = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden><path d="m14.5 5-7 7 7 7" /></svg>
);

export const IconChevronRight = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden><path d="m9.5 5 7 7-7 7" /></svg>
);

export const IconChevronDown = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden><path d="m5 9 7 7 7-7" /></svg>
);

export const IconVerified = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Verified" role="img">
    <path fill="#0095f6" d="m12 1.7 2.4 1.8 3-.2 1.2 2.7 2.7 1.2-.2 3 1.8 2.4-1.8 2.4.2 3-2.7 1.2-1.2 2.7-3-.2L12 22.3l-2.4-1.8-3 .2-1.2-2.7-2.7-1.2.2-3L1.1 12l1.8-2.4-.2-3 2.7-1.2 1.2-2.7 3 .2z" />
    <path fill="#fff" d="m10.6 15.4-3-3 1.3-1.3 1.7 1.7 4.5-4.5 1.3 1.3z" />
  </svg>
);

export const IconGrid = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconTagged = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M7.5 3.5h9A4 4 0 0 1 20.5 7.5v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4z" />
    <circle cx="12" cy="10" r="2.5" />
    <path d="M7.5 18c.8-2 2.4-3 4.5-3s3.7 1 4.5 3" />
  </svg>
);

export const IconSettings = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.26.62.88 1.02 1.55 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);

export const IconMoon = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />
  </svg>
);

export const IconSun = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
  </svg>
);

export const IconCamera = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M4 7.5h3.2l1.6-2.4h6.4l1.6 2.4H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </svg>
);

export const IconPhoto = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="8.5" cy="9.5" r="1.8" />
    <path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" />
  </svg>
);

export const IconEmoji = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 14.5c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8" />
    <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPlay = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path d="M6.5 4.8v14.4c0 .9 1 1.4 1.7.9l10.8-7.2a1.1 1.1 0 0 0 0-1.8L8.2 3.9c-.7-.5-1.7 0-1.7.9z" fill="currentColor" />
  </svg>
);

export const IconPause = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <rect x="5.5" y="4" width="4.4" height="16" rx="1.2" fill="currentColor" />
    <rect x="14.1" y="4" width="4.4" height="16" rx="1.2" fill="currentColor" />
  </svg>
);

export const IconMute = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z" />
    <path d="m16 9.5 5 5M21 9.5l-5 5" />
  </svg>
);

export const IconUnmute = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z" />
    <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
  </svg>
);

export const IconMusic = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M9 18.5a3 3 0 1 1-2-2.83V6.2l10-2.2v9.8a3 3 0 1 1-2-2.83V7.4L9 8.9z" />
  </svg>
);

export const IconSend = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M21.5 3 10.5 14M21.5 3l-7 18-4-7-7-4z" />
  </svg>
);

export const IconPlus = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden><path d="M12 5v14M5 12h14" /></svg>
);

export const IconChevron = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden><path d="m9 5 7 7-7 7" /></svg>
);

export const IconAudio = ({ size = 24 }) => (
  <svg {...base(size)} aria-hidden>
    <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />
  </svg>
);

export const IconLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-label="KIX" role="img">
    <rect x="6" y="6" width="88" height="88" rx="24" fill="none" stroke="currentColor" strokeWidth="8" />
    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="8" />
    <circle cx="74" cy="26" r="6" fill="currentColor" />
  </svg>
);
