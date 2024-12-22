import React from "react";
import Image from "next/image";

interface CardProps {
    src: string;
    alt: string;
    children: React.ReactNode;
    className?: string;
}

export function Card(CardProps) {
    return (
        <div className={`border border-1 border-stone-200 bg-slate-100 rounded-xl p-4 shadow-lg w-fit ${CardProps.className}`}>
            {CardProps.children}
        </div>
    );
};

export function CardImage(CardProps) {
    return (
        <div className={`w-full flex justify-center mb-5 ${CardProps.className}`}>
            <Image
                src={CardProps.src}
                alt={CardProps.alt}
                width={500}
                height={500}
                className="object-cover rounded-xl"
            />
        </div>
    );
};

export function CardTitle(CardProps) {
    return <h1 className={`font-semibold mb-2 ${CardProps.className}`}>{CardProps.children}</h1>;
};

export function CardContent(CardProps) {
    return <div className={`${CardProps.className}`}>{CardProps.children}</div>;
};

export function CardContainer(CardProps) {
    return (
        <div className={`flex flex-row justify-center space-x-3 w-1/2 ${CardProps.className}`}>
            {CardProps.children}
        </div>
    );
};
