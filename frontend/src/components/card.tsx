import React from "react";
import Image from "next/image";

interface CardProps {
    src?: string;
    alt?: string;
    children?: React.ReactNode;
    className?: string;
    size?: number;
    inputName?: string;
    placeholder?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    type?: string;
    onClick?: () => void;
}

export function Card({ children, className }: CardProps) {
    return (
        <div className={`border border-1 border-[--border] bg-[--card-bg] rounded-xl p-5 shadow-lg w-fit ${className}`}>
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

    return <h1 className={`mb-2 font-[family-name:var(--tiempos)] ${textSize} ${className}`}>{children}</h1>;
}

export function CardContent({ children, className }: CardProps) {
    return <div className={`${className}`}>{children}</div>;
}

export function CardContainer({ children, className }: CardProps) {
    return (
        <div className={`flex flex-col sm:flex-row justify-center px-5 space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-1/2 ${className}`}>
            {children}
        </div>
    );
}

export function CardRow({ children, className }: CardProps) {
    return (
        <div className={`flex flex-row justify-center space-x-3 w-full ${className}`}>
            {children}
        </div>
    );
}

export function CardInput({ placeholder, value, onChange, className, type }: CardProps) {
    return (
        <div className={`${className}`}>
            <input
                type={type === "" ? "text" : type}
                className="w-full p-3 border border-[--border] rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent]"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
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
        <div className={`${className}`}>
            <button
                className={`w-full font-semibold whitespace-nowrap border border-[--border] shadow-lg bg-none rounded-xl p-3 hover:scale-105 ${className}`}
                onClick={onClick}
            >
                {children}
            </button>
        </div>
    );
}

