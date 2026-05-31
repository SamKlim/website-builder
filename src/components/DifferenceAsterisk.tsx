const SIZE = 20;
const COLOR = "#F0744A";

export function DifferenceAsterisk() {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <g stroke={COLOR} strokeWidth="1.25" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
      </g>
    </svg>
  );
}
