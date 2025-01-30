import React from "react";
import Image from "next/image";

interface CardProps {
    src?: string;
    alt?: string;
    children?: React.ReactNode;
    className?: string;
    size?: number;
    inputName?: string;
    inputPlaceholder?: string;
    inputOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    inputValue?: string;
    inputType?: string;
    onClick?: () => void;
}

export function Card({ children, className }: CardProps) {
    return (
        <div className={`border border-1 border-stone-200 bg-slate-100 rounded-xl p-5 shadow-lg w-fit ${className}`}>
            {children}
        </div>
    );
}

export function CardImage({ src = "", alt = "", className }: CardProps) {
    return (
        <div className={`w-full flex justify-center mb-5 ${className}`}>
            <Image
                src={src}
                alt={alt}
                width={500}
                height={500}
                className="object-cover rounded-xl"
            />
        </div>
    );
}

export function CardTitle({ size = 1, children, className }: CardProps) {
    const sizeClasses = {
        1: "text-lg",
        2: "text-xl",
        3: "text-2xl",
        4: "text-3xl",
    };
    const textSize = sizeClasses[size] || "text-lg";

    return <h1 className={`font-semibold mb-2 ${textSize} ${className}`}>{children}</h1>;
}

export function CardContent({ children, className }: CardProps) {
    return <div className={`${className}`}>{children}</div>;
}

export function CardContainer({ children, className }: CardProps) {
    return (
        <div className={`flex flex-row justify-center space-x-3 w-1/2 ${className}`}>
            {children}
        </div>
    );
}

export function CardInput({ inputPlaceholder, inputValue, inputOnChange, className, inputType }: CardProps) {
    return (
        <div className={`${className}`}>
            <input
                type={inputType === "" ? "text" : inputType}
                className="w-full p-3 border border-stone-200 rounded-xl"
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={inputOnChange}
            />
        </div>
    );
}

export function CardBlock({ children, className }: CardProps) {
    return (
        <div className={`mb-3 ${className}`}>
            {children}
        </div>
    );
}

export function CardSubtitle({ children, className }: CardProps) {
    return <p className={`font-semibold ${className}`}>{children}</p>;
}

export function CardButton({ children, onClick, className }: CardProps) {
    return (
        <button
            className={`font-semibold w-full border border-stone-200 shadow-lg bg-slate-100 rounded-xl p-3 hover:scale-105 ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
