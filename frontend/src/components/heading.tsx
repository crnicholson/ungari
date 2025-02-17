interface HeadingProps {
    className?: string;
    children: React.ReactNode;
    size: number;
}

export default function Heading(HeadingProps) {
    if (HeadingProps.size == 1) {
        return (
            <header className={`mb-4 text-lg font-semibold font-[family-name:var(--tiempos)] ${HeadingProps.className}`}>
                <p>
                    {HeadingProps.children}
                </p>
            </header>
        );
    }
    if (HeadingProps.size == 2) {
        return (
            <header className={`mb-4 text-xl font-semibold font-[family-name:var(--tiempos)] ${HeadingProps.className}`}>
                <p>
                    {HeadingProps.children}
                </p>
            </header>
        );
    }
    if (HeadingProps.size == 3) {
        return (
            <header className={`mb-4 text-2xl font-semibold font-[family-name:var(--tiempos)] ${HeadingProps.className}`}>
                <p>
                    {HeadingProps.children}
                </p>
            </header>
        );
    }
    if (HeadingProps.size == 4) {
        return (
            <header className={`mb-4 text-3xl font-semibold font-[family-name:var(--tiempos)] ${HeadingProps.className}`}>
                <p>
                    {HeadingProps.children}
                </p>
            </header>
        );
    } else {
        return (
            <header className={`mb-4 text-lg font-semibold font-[family-name:var(--tiempos)] ${HeadingProps.className}`}>
                <p>
                    {HeadingProps.children}
                </p>
            </header>
        );
    }
}