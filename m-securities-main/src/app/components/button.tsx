// app/components/Button.tsx
interface ButtonProps {
    label: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
  }
  
  const Button: React.FC<ButtonProps> = ({ label, onClick, type = 'button' }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className="w-full sm:w-auto bg-teal-500 text-white py-2 px-4 sm:px-6 rounded-lg shadow-md hover:bg-teal-600 text-sm sm:text-base"
      >
        {label}
      </button>
    );
  };
  
  export default Button;
  