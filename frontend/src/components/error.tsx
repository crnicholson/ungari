import { ErrorComponent } from "next/dist/client/components/error-boundary";

interface ErrorComponentProps {
    children: React.ReactNode;
    className?: string;
}

export default function Error({ children, className }: ErrorComponentProps) {
    return (
        <div className={`px-5 w-full h-fit flex justify-center items-center ${className}`}>
            <div className="w-full flex flex-row justify-between gap-3 p-3 border border-red-400 bg-red-100 text-red-700 rounded-xl">
                <div className="flex flex-row gap-3 items-center">
                    <span className="material-symbols-outlined">
                        error
                    </span>
                    <p className="font-semibold">{children}</p>
                </div>
            </div>
        </div>
    );
}