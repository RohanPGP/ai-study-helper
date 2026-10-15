export default function PulserIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pulserGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <line x1="24" y1="4" x2="24" y2="10" stroke="url(#pulserGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="4" r="2.5" fill="url(#pulserGrad)" className="pulser-antenna-dot" />
      <circle cx="7" cy="26" r="4" fill="url(#pulserGrad)" opacity="0.85" />
      <circle cx="41" cy="26" r="4" fill="url(#pulserGrad)" opacity="0.85" />
      <rect x="10" y="12" width="28" height="26" rx="12" fill="url(#pulserGrad)" />
      <circle cx="19" cy="25" r="3.2" fill="#fff" className="pulser-eye" />
      <circle cx="29" cy="25" r="3.2" fill="#fff" className="pulser-eye" />
    </svg>
  );
}
