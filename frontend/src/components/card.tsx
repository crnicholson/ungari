import React from "react";
import Image from "next/image";

interface CardProps {
    src: string;
    alt: string;
    children: React.ReactNode;
    className?: string;
    size: number;
    inputName: string;
    inputPlaceholder: string;
    inputOnChange: () => void;
    inputValue: string;
    onClick: () => void;

}

export function Card(CardProps) {
    return (
        <div className={`border border-1 border-stone-200 bg-slate-100 rounded-xl p-5 shadow-lg w-fit ${CardProps.className}`}>
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
    if (CardProps.size == 1) {
        return <h1 className={`font-semibold mb-2 text-lg ${CardProps.className}`}>{CardProps.children}</h1>;
    }
    if (CardProps.size == 2) {
        return <h1 className={`font-semibold mb-2 text-xl ${CardProps.className}`}>{CardProps.children}</h1>;
    }
    if (CardProps.size == 3) {
        return <h1 className={`font-semibold mb-2 text-2xl ${CardProps.className}`}>{CardProps.children}</h1>;
    }
    if (CardProps.size == 4) {
        return <h1 className={`font-semibold mb-2 text-3xl ${CardProps.className}`}>{CardProps.children}</h1>;
    }
    else {
        return <h1 className={`font-semibold mb-2 text-lg ${CardProps.className}`}>{CardProps.children}</h1>;
    }
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

export function CardInput(CardProps) {
    return (
        <div className={`${CardProps.className}`}>
            <input
                type="text"
                className={`w-full p-3 border border-stone-200 rounded-xl `}
                placeholder={CardProps.inputPlaceholder}
                value={CardProps.inputValue}
                onChange={CardProps.inputOnChange}
            />
        </div>
    );
}

export function CardBlock(CardProps) {
    return (
        <div className={`mb-3 ${CardProps.className}`}>
            {CardProps.children}
        </div>
    );
}

export function CardSubtitle(CardProps) {
    return <p className={`font-semibold ${CardProps.className}`}>{CardProps.children}</p>;
}

export function CardButton(CardProps) {
    return (
        <button
            className="font-semibold w-full border border-stone-200 shadow-lg bg-slate-100 rounded-xl p-3 hover:scale-105"
            onClick={CardProps.onClick}
        >
            {CardProps.children}
        </button>
    );
}