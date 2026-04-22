type IconButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
};

export function IconButton({ onClick, children, ariaLabel }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="text-brand-navy text-sm hover:bg-brand-mist-lightest rounded px-1 transition cursor-pointer"
    >
      {children}
    </button>
  );
}
