type Props = { className?: string; size?: 'sm' | 'md' };

const sizes = { sm: 20, md: 24 };

export default function MoonIcon({ className = '', size = 'md' }: Props) {
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
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
    </svg>
  );
}
