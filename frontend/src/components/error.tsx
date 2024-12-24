import React from 'react';
import { useEffect, useState } from 'react';
import { useUser } from "@auth0/nextjs-auth0/client";

interface ErrorProps {
    children: React.ReactNode;
    className?: string;
}

export default function Error(ErrorProps) {
    const { isLoading } = useUser();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        while (isLoading) {
            return;
        }
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [isLoading]);

    if (!visible || ErrorProps.children == "") return null;

    return (
        <div className={`mt-5 p-3 border border-red-400 bg-red-100 text-red-700 rounded-xl w-fit ${ErrorProps.className}`}>
            <p className="font-semibold">{ErrorProps.children}</p>
        </div>
    );
}
