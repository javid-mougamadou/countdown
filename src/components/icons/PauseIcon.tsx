type Props = { className?: string; size?: 'sm' | 'md' };

const sizes = { sm: 20, md: 24 };

export default function PauseIcon({ className = '', size = 'md' }: Props) {
  const d = sizes[size];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={d}
      height={d}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
