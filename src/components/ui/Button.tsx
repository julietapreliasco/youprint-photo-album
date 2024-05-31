interface ButtonProps {
  message: string;
  onClick?: () => void;
  variant?: 'PRIMARY' | 'SECONDARY';
  type?: 'submit' | 'reset' | 'button' | undefined;
}

export const Button = ({ message, onClick, variant, type }: ButtonProps) => {
  const color =
    variant === 'PRIMARY'
      ? 'bg-yp-blue hover:bg-yp-secondary-blue'
      : 'bg-yp-orange hover:bg-yp-secondary-orange';

  const className = `${color} text-white font-bold py-1 px-4 rounded text-[10px] sm:text-sm lg:py-2`;

  return (
    <>
      <button type={type} className={className} onClick={onClick}>
        {message}
      </button>
    </>
  );
};
