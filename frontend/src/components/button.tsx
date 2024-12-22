import Link from "next/link";

interface ButtonProps {
    href: string;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

export default function Button(ButtonProps) {
    return (
        <Link
            href={ButtonProps.href}
            className={`relative inline-block p-3 bg-opacity-100 border-1 border text-sm font-semibold rounded-xl shadow-lg m-3 hover:scale-105 ${ButtonProps.className}`}
            onClick={ButtonProps.onClick}
        >
            {ButtonProps.children}
        </Link >
    );
};