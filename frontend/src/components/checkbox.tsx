interface CardProps {
    children?: React.ReactNode;
    className?: string;
    onChange?: () => void;
    checked?: boolean;
}

export default function Checkbox({ onChange, checked, className, children }: CardProps) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative flex items-center justify-center h-[14px] w-[14px]">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="absolute inset-0 h-[14px] w-[14px] cursor-pointer appearance-none rounded border border-[--border] checked:border-[--accent] bg-[--bg] z-10  checked:bg-[--accent] hover:border-[--accent]"
                />
                <svg
                    className={`absolute inset-0 h-[14px] w-[14px] text-[--bg] ${checked ? 'opacity-100' : 'opacity-0'}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                >
                    <path
                        d="M5 10l4 4 6-8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <span>{children}</span>
        </label>
    );
}