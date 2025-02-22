import { ErrorComponent } from "next/dist/client/components/error-boundary";

interface ErrorComponentProps {
    children: React.ReactNode;
    className?: string;
    onClick: () => void;
}

export default function Error({ children, className, onClick }: ErrorComponentProps) {
    return (
        <div className={`px-5 w-full h-fit flex justify-center items-center ${className}`}>
            <div className="w-full flex flex-row justify-between gap-3 p-3 border border-red-400 bg-red-100 text-red-700 rounded-xl">
                <div className="flex flex-row gap-3 items-center">
                    <span className="material-symbols-outlined">
                        error
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