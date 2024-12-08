import { KeyboardShortcut } from "@/constants/DefaultKeyboardShortCut";
import { Helper } from "@/utils/Helper";
import { LocalStorage } from "@/utils/LocalStorage";
import { useEffect, useState } from "react";

interface StyledButtonProps {
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
  bind?: keyof typeof KeyboardShortcut;
  onClick: () => void;
}

export const StyledButton: React.FC<StyledButtonProps> = ({ 
  size = 'sm',
  children,
  disabled = false, 
  bind,
  onClick, 
}) => {

  const [isModeOn, setIsModeOn] = useState<boolean>(LocalStorage.get('km').value ? true : false);

  // Add useEffect for key handler
  useEffect(() => {
    if (!bind) return;
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!LocalStorage.get('km').value) {
        setIsModeOn(false);
        return;
      } else {
        setIsModeOn(true);
      }
      if (event.key.toLowerCase() === Helper.getKeyboardShortcut(bind)?.toLowerCase()) {
        onClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [bind, onClick, disabled]);

  return (
    <div className="w-full relative">
      { (bind && isModeOn) && 
        <div className="absolute -top-[30%] left-1/2 transform -translate-x-1/2
          bg-gray-800 text-white px-2 py-0.5 text-sm rounded-md
          border border-gray-600 min-w-[24px] text-center z-20">
          {Helper.getKeyboardShortcut(bind)}
        </div> 
      }
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-full font-bold
          text-${size}
          py-3
          sh:text-xs
          md:text-base
          md:py-3
          sh:py-2
          rounded-md
          transition-colors duration-300 ease-in-out
          border border-gray-600
          relative
          overflow-hidden
          ${disabled
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-black text-white hover:text-black'
          }
          ${!disabled && `
            focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-0
            before:content-[''] before:absolute before:inset-0 before:bg-white 
            before:transform before:scale-x-0 before:origin-left before:rounded-md
            before:transition-transform before:duration-300 before:ease-in-out
            hover:before:scale-x-100
          `}
        `}
        data-bind={bind ? Helper.getKeyboardShortcut(bind) : undefined}
      >
        <span className={`relative z-10 text-${size}`}>{children}</span>
      </button>
    </div>
  );
};