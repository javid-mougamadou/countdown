type CarouselArrowProps = {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
};

export function CarouselArrow({ direction, onClick, disabled }: CarouselArrowProps) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      className="btn btn-circle btn-ghost shrink-0"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? 'Événement précédent' : 'Événement suivant'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
        aria-hidden
      >
        {isPrev ? (
          <path
            fillRule="evenodd"
            d="M7.72 12.53a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 1 1 1.06 1.06L9.31 12l2.97 2.97a.75.75 0 1 1-1.06 1.06l-3.75-3.75Z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M16.28 11.47a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06L14.69 12 11.72 9.03a.75.75 0 0 1 1.06-1.06l3.75 3.75Z"
            clipRule="evenodd"
          />
        )}
      </svg>
    </button>
  );
}
