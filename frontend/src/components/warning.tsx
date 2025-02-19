interface WarningComponentProps {
    children: React.ReactNode;
    className?: string;
}

export default function Warning({ children, className }: WarningComponentProps) {
    return (
        <div className="px-5 w-full h-fit flex justify-center items-center">
            <div className={`flex flex-row justify-center items-center gap-3 p-3 border border-yellow-400 bg-yellow-100 text-yellow-700 rounded-xl ${className}`}>
                <span className="material-symbols-outlined">
                    warning
                </span>
                <p className="font-semibold">{children}</p>
            </div>
       
        </div>
    );
}
