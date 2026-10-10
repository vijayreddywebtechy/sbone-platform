import type { ReactNode } from 'react';

function Icon({ children, size = 24 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const DigitalHubIcon = () => (
  <Icon>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Icon>
);

export const RolesIcon = () => (
  <Icon>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .6 3 2.4 3 5" />
  </Icon>
);

export const ProfileIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="10" r="3" />
    <path d="M6.5 18.5c1.2-2 3.2-3 5.5-3s4.3 1 5.5 3" />
  </Icon>
);

export const DocumentsIcon = () => (
  <Icon>
    <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </Icon>
);

export const QueryIcon = () => (
  <Icon>
    <path d="M4 12a8 6 0 1 1 3.5 5L4 19l1-3.5A6 6 0 0 1 4 12Z" />
    <path d="M9 12h.01M12 12h.01M15 12h.01" />
  </Icon>
);

export const AppearanceIcon = () => (
  <Icon>
    <path d="M5 4h12v5H5zM17 6.5h2v5h-8v3" />
    <path d="M10 14.5h2v6h-2z" />
  </Icon>
);

export const SignInIcon = () => (
  <Icon size={28}>
    <rect x="6" y="3" width="12" height="18" rx="2" />
    <path d="M10 17h4M10 8l2 2 3-3" />
  </Icon>
);

export const ApprovalIcon = () => (
  <Icon size={28}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="m8 12 3 3 5-6" />
  </Icon>
);

export const PersonaliseIcon = () => (
  <Icon size={28}>
    <path d="m4 20 9-9M14 4l1.5 3L19 8.5 15.5 10 14 13l-1.5-3L9 8.5 12.5 7Z" />
  </Icon>
);

export const PlayIcon = () => (
  <Icon size={20}>
    <circle cx="12" cy="12" r="9" />
    <path d="m10 9 5 3-5 3Z" fill="currentColor" />
  </Icon>
);

export const ArticleIcon = () => (
  <Icon size={20}>
    <path d="M9 15 15 9M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1" />
  </Icon>
);

export const ArrowIcon = () => (
  <Icon size={16}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);
