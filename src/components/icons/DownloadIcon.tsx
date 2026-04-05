type Props = { className?: string; size?: 'sm' | 'md' };

const sizes = { sm: 20, md: 24 };

export default function DownloadIcon({ className = '', size = 'md' }: Props) {
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
      <path d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L11 13.59V4a1 1 0 0 1 1-1Z" />
      <path d="M5 20a1 1 0 0 1-1-1v-3a1 1 0 1 1 2 0v2h12v-2a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1H5Z" />
    </svg>
  );
}

