interface WarningComponentProps {
    children: React.ReactNode;
    className?: string;
    onClick: () => void;
}

export default function Warning({ children, className, onClick }: WarningComponentProps) {
    return (
        <div className={`px-5 w-full h-fit flex justify-center items-center ${className}`}>
            <div className="w-full flex flex-row justify-between gap-3 p-3 border border-yellow-400 bg-yellow-100 text-yellow-700 rounded-xl">
                <div className="flex flex-row gap-3 items-center">
                    <span className="material-symbols-outlined">
                        warning
                    </span>
                    <p className="font-semibold">{children}</p>
                </div>
                <button className="h-max w-fit flex justify-center items-center" onClick={() => onClick()}>
                    <span className="material-symbols-outlined">
                        close
                    </span>
                </button>
            </div>
        </div>
    );
}