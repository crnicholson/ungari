import Link from "next/link";

interface ButtonProps {
    href?: string;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

export default function Button({ href, className, onClick, children }: ButtonProps) {
    return (
        <Link
            href={href}
            className={`relative p-3 bg-opacity-100 border-1 border text-md font-semibold rounded-xl shadow-lg m-3 hover:scale-105 ${className}`}
            onClick={onClick}
        >
            {children}
        </Link >
    );
};