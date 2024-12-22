interface HeadingProps {
    className?: string;
    children: React.ReactNode;
    size: number;
}

export default function Heading(HeadingProps) {
    if (HeadingProps.size <= 1) {
        return (
            <header className={`p-3 mt-10 mb-4 text-lg font-semibold ${HeadingProps.className}`}>
                <p>
                    {HeadingProps.children}
                </p>
            </header>
        );
    }
    if (HeadingProps.size > 1 && HeadingProps.size <= 2) {
        return (
            <header className={`p-3 mt-10 mb-4 text-xl font-semibold ${HeadingProps.className}`}>
                <p>
                    {HeadingProps.children}
                </p>
            </header>
        );
    }
    if (HeadingProps.size > 2 && HeadingProps.size <= 3) {
        return (
            <header className={`p-3 mt-10 mb-4 text-2xl font-semibold ${HeadingProps.className}`}>
                <p>
                    {HeadingProps.children}
                </p>
            </header>
        );
    }
    if (HeadingProps.size > 3 && HeadingProps.size <= 4) {
        return (
            <header className={`p-3 mt-10 mb-4 text-3xl font-semibold ${HeadingProps.className}`}>
                <p>
                    {HeadingProps.children}
                </p>
            </header>
        );
    } else {
        return (
            <header className={`p-3 mt-10 mb-4 text-xl font-semibold ${HeadingProps.className}`}>
                <p>
                    {HeadingProps.children}
                </p>
            </header>
        );
    }
}