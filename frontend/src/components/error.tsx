interface ErrorComponentProps {
    children: React.ReactNode;
    className?: string;
}

export default function Error({ children, className }: ErrorComponentProps) {
    return (
        <div className="px-5 w-full h-fit flex justify-center items-center">
            <div className={`flex flex-row items-center gap-3 p-3 border border-red-400 bg-red-100 text-red-700 rounded-xl ${className}`}>
                <span className="material-symbols-outlined">
                    error
                </span>
                <p className="font-semibold">{children}</p>
            </div>

        </div>
    );
}
