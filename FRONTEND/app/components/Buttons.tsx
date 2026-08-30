import type { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
    onClick?: () => void;
    disabled?: boolean;
}

const Buttons = ({
    children,
    variant = 'primary',
    onClick,
    disabled = false,
}: ButtonProps) => {
    const baseStyles =
        'px-4 py-2 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[#003DA5] text-white hover:bg-[#002966]',
        secondary: 'bg-[#FFD700] text-[#003DA5] hover:bg-[#FFC700]',
        error: 'bg-[#D32F2F] text-white hover:bg-[#B71C1C]',
        success: 'bg-[#388E3C] text-white hover:bg-[#2E7D32]',
        warning: 'bg-[#F57C00] text-white hover:bg-[#E65100]',
    };

    return (
        <button
            type="button"
            className={`${baseStyles} ${variants[variant]}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Buttons;