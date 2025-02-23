import Link from "next/link";

interface StyledLinkProps {
    href?: string;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
    background?: string;
}

export default function StyledLink({ href, className, onClick, children, background }: StyledLinkProps) {
    const commonClasses = background === "dark"
        ? "underline hover:text-stone-500"
        : "underline decoration-[--accent] text-[--light] hover:text-[--link-hover]";

    if (href) {
        return (
            <Link
                href={href}
                className={`${commonClasses} ${className}`}
                onClick={onClick}
            >
                {children}
            </Link>
        );
    } else {
        return (
            <a
                className={`${commonClasses} ${className}`}
                onClick={onClick}
            >
                {children}
            </a>
        );
    }
}