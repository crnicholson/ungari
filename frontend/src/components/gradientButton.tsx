import Link from "next/link";

interface GradientButtonProps {
    href: string;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

export default function GradientButton(GradientButtonProps) {
    return (
        <Link
            href={GradientButtonProps.href}
            className={`relative inline-block p-3 bg-opacity-100 border-1 border text-sm font-semibold rounded-xl shadow-lg m-3 bg-gradient-to-r from-indigo-50 via-slate-50 to-cyan-50 animate-gradient-x hover:scale-105 ${GradientButtonProps.className}`}
            onClick={GradientButtonProps.onClick}
        >
            {GradientButtonProps.children}
        </Link>
    );
};

