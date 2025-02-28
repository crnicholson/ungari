"use client";

import { Card, CardInput, CardContainer, CardTitle, CardBlock, CardButton, CardRow } from "../../components/card"
import { Header, HeaderLogo, HeaderNav } from "../../components/header"
import Button from "../../components/button";
import StyledLink from "../../components/styledLink"
import Error from "../../components/error";
import Warning from "../../components/warning";

import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ text: string; fromSelf: boolean }[]>([]);

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        function onChatMessage(message: string) {
            setMessages(prev => [...prev, { text: message, fromSelf: false }]);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("chat_message", onChatMessage);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("chat_message", onChatMessage);
        };
    }, []);

    function sendMessage () {
        if (message.trim()) {
            socket.emit("chat_message", message);
            setMessages(prev => [...prev, { text: message, fromSelf: true }]);
            setMessage("");
        }
    };

    return (
        <>
            <Header>
                <HeaderLogo href="/">
                    <span className="text-[--accent] text-xl font-bold">⁂</span> Ungari
                </HeaderLogo>
                <HeaderNav>
                    <Button href="/api/auth/logout">Logout</Button>
                </HeaderNav>
            </Header>

            {/* <Card className="mt-24 mb-5">
                <p>Status: {isConnected ? "connected" : "disconnected"}</p>
                <p>Transport: {transport}</p>
            </Card> */}

            <CardContainer className="w-2/3 mt-24">
                <Card className="w-full">
                    <CardTitle className={`${isConnected ? "mb-5" : ""}`} size={2}>Chat</CardTitle>
                    {!isConnected ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <CardBlock className="mb-5">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`mb-2 p-[10px] border-[--border] rounded-xl bg-[--bg] border w-fit min-w-[10%] max-w-[70%] ${msg.fromSelf
                                            ? "ml-auto"
                                            : "mr-auto"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
                            </CardBlock>

                            <CardRow>
                                <CardInput
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full"
                                />
                                <Button
                                    className="px-4 py-2"
                                    onClick={sendMessage}
                                    type="button"
                                >
                                    Send
                                </Button>
                            </CardRow>
                        </>
                    )}
                </Card>
            </CardContainer>
        </>
    );
}