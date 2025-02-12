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
                className={`underline decoration-[--accent] text-[--light] hover:text-[--lighter] ${StyledLinkProps.className}`}
                onClick={StyledLinkProps.onClick}
            >
                {StyledLinkProps.children}
            </Link >
        );
    }
};