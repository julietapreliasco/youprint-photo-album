interface ButtonProps {
  message: string;
  onClick?: () => void;
  variant?: 'PRIMARY' | 'SECONDARY' | 'DISABLED' | 'GALLERY';
  type?: 'submit' | 'reset' | 'button' | undefined;
  disabled?: boolean;
}

export const Button = ({
  message,
  onClick,
  variant,
  type,
  disabled,
}: ButtonProps) => {
  let color;

  switch (variant) {
    case 'PRIMARY':
      color = 'bg-yp-blue hover:bg-yp-secondary-blue';
      break;
    case 'SECONDARY':
      color = 'bg-yp-orange hover:bg-yp-secondary-orange';
      break;
    case 'DISABLED':
      color = 'bg-disabled-grey';
      break;
    case 'GALLERY':
      color = 'bg-whatsapp-green hover:bg-whatsapp-secondary-green';
      break;
    default:
      color = 'bg-yp-orange hover:bg-yp-secondary-orange';
  }

  const className = `${color} text-white font-bold py-1 px-4 rounded text-[15px] lg:py-2`;

  return (
    <>
      <button
        type={type}
        className={className}
        onClick={onClick}
        disabled={disabled}
      >
        {message}
      </button>
    </>
  );
};
