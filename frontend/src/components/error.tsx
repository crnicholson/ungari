interface ErrorComponentProps {
    children: React.ReactNode;
    className?: string;
}

export default function Error({ children, className }: ErrorComponentProps) {
    if (children == "") return <div className="p-3"></div>
    return (
        <div className="px-5 w-full h-fit flex justify-center items-center">
            <div className={`p-3 border border-red-400 bg-red-100 text-red-700 rounded-xl ${className}`}>
                <p className="font-semibold">{children}</p>
            </div>
        </div>
    );
}
