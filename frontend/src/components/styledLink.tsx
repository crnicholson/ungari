import Link from "next/link";

interface StyledLinkProps {
    href: string;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
    background: string;
}

export default function StyledLink(StyledLinkProps) {
    if (StyledLinkProps.background == "dark") {
        return (
            <Link
                href={StyledLinkProps.href}
                className={`underline hover:text-stone-500 ${StyledLinkProps.className}`}
                onClick={StyledLinkProps.onClick}
            >
                {StyledLinkProps.children}
            </Link >
        );
    } else {
        return (
            <Link
                href={StyledLinkProps.href}
                className={`underline text-stone-500 hover:text-stone-400 ${StyledLinkProps.className}`}
                onClick={StyledLinkProps.onClick}
            >
                {StyledLinkProps.children}
            </Link >
        );
    }
};