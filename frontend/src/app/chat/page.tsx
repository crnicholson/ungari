"use client";

import { Card, CardInput, CardContainer, CardTitle, CardBlock, CardButton, CardRow } from "../../components/card"
import { Header, HeaderLogo, HeaderNav } from "../../components/header"
import Button from "../../components/button";
import StyledLink from "../../components/styledLink"
import Error from "../../components/error";
import Warning from "../../components/warning";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useUser } from "@auth0/nextjs-auth0/client";
import { socket } from "../socket";

const SERVER = "http://127.0.0.1:38321";
// const SERVER = "https://problem-dating-app.cnicholson.hackclub.app";

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [polled, setPolled] = useState(false);

    const [match_id, setMatchID] = useState("");

    const [matchName, setMatchName] = useState("");
    const [matchImage, setMatchImage] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{
        content: string;
        auth0_id: string;
        timestamp: Date;
    }[]>([]);

    const [chats, setChats] = useState([]);

    const [erorrMessage, setErrorMessage] = useState("");
    const [warningMessage, setWarningMessage] = useState("");

    const { user, isLoading } = useUser();
    const router = useRouter();

    // Basic auth
    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/api/auth/login");
        }
    }, [isLoading, user, router]);

    // Get match _id 
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const message = params.get('match_id');
        if (message) {
            setMatchID(message);
        }
    }, []);

    // Websocket
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

        function onMessage(message: {
            content: string;
            auth0_id: string;
            timestamp: Date;
        }) {
            setMessages(prev => [...prev, {
                content: message.content,
                auth0_id: message.auth0_id,
                timestamp: new Date(message.timestamp),
            }]);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("message", onMessage);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("message", onMessage);
        };
    }, [user]);

    function sendMessage() {
        if (message.trim()) {
            const messageData = {
                content: message,
                auth0_id: user.sub,
                match_id: match_id
            };

            socket.emit("message", messageData);
            setMessages(prev => [...prev, {
                content: message,
                auth0_id: user.sub,
                timestamp: new Date()
            }]);
            setMessage("");
        }
    };

    const getChat = useCallback(async () => {
        try {
            const response = await fetch(SERVER + "/api/get-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ auth0_id: user.sub, match_id: match_id }),
            });
            if (!response.ok) {
                const error = await response.json();
                setErrorMessage("Server-side error: " + error.error);
                setPolled(false);
            } else {
                setErrorMessage("");
                setPolled(true);

                const data = await response.json();

                console.log(data);

                setMessages(data.messages);
                setMatchName(data.matchName);
                setMatchImage(data.matchImage);
            }
        } catch (error) {
            console.error("Error: Failed to fetch settings: ", error);
            setErrorMessage("Client-side error: " + error);
            setPolled(false);
        }
    }, [user, match_id]);

    const getChats = useCallback(async () => {
        try {
            const response = await fetch(SERVER + "/api/get-chats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ auth0_id: user.sub }),
            });
            if (!response.ok) {
                const error = await response.json();
                setErrorMessage("Server-side error: " + error.error);
                setPolled(false);
            } else {
                setErrorMessage("");
                setPolled(true);

                const data = await response.json();

                console.log(data);

                setChats(data.chatList);
            }
        } catch (error) {
            console.error("Error: Failed to fetch settings: ", error);
            setErrorMessage("Client-side error: " + error);
            setPolled(false);
        }
    }, [user]);

    // Get match on page load 
    useEffect(() => {
        if (!isLoading && user) {
            if (match_id) {
                getChat();
            } else {
                getChats();
            }
        }
    }, [isLoading, user, getChat, getChats, match_id]);

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
                    {match_id ? (
                        <div className="flex items-center gap-4 mb-5">
                            {match_id && matchImage && (
                                <div className="h-full w-fit flex items-center">
                                    <Image
                                        src={matchImage}
                                        alt={matchName || "Match profile"}
                                        width={96}
                                        height={96}
                                        className="rounded-full"
                                    />
                                </div>
                            )}
                            <div className="h-fit">
                                <CardTitle className="mb-2" size={2}>
                                    Chat {!polled ? "" : ` with `}
                                    {polled && matchName && (
                                        <StyledLink href={`/user?_id=${match_id}`}>
                                            {matchName}
                                        </StyledLink>
                                    )}
                                </CardTitle>
                                <StyledLink className="italic" href="/chat" onClick={() => setMatchID("")}>
                                    Back to chat page
                                </StyledLink>
                            </div>
                        </div>
                    ) : (
                        <CardTitle className="mb-5" size={2}>
                            Choose your chat
                        </CardTitle>
                    )}

                    <div className="border-b border-[--border] h-fit w-full mb-5" />
                    {(!isConnected || !polled) ? (
                        <p>Loading...</p>
                    ) : (
                        match_id ? (
                            <>
                                <CardBlock className="mb-5">
                                    {messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`mb-2 p-[10px] border-[--border] rounded-xl bg-[--bg] border w-fit max-w-[70%] break-words ${msg.auth0_id === user.sub ? "ml-auto" : "mr-auto"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    ))}
                                </CardBlock>

                                <CardRow>
                                    <CardInput
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                    />
                                    <Button
                                        className="px-4 py-2"
                                        onClick={sendMessage}
                                        type="button"
                                    >
                                        <div className="h-full w-full flex justify-center items-center">
                                            <span className="material-symbols-outlined">
                                                send
                                            </span>
                                        </div>
                                    </Button>
                                </CardRow>
                            </>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {chats.map((chat) => (
                                    <Button
                                        key={chat.match_id}
                                        href={`/chat?match_id=${chat.match_id}`}
                                        className="w-full hover:bg-[--bg-hover] transition-colors duration-200"
                                        onClick={() => setMatchID(chat.match_id)}
                                    >
                                        <div className="flex items-center space-x-4 p-4">
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={chat.matchImage}
                                                    alt={chat.matchName}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-left truncate border-b border-[--border] pb-2">
                                                    {chat.matchName.length > 30 ? `${chat.matchName.slice(0, 30)}...` : chat.matchName}
                                                </p>
                                                <div className="mt-2 font-normal text-base flex items-center gap-2">
                                                    <span className="h-full w-fit material-symbols-outlined">
                                                        mail
                                                    </span>
                                                    <p className="h-fit w-fit">
                                                        {chat.lastMessage.length > 5 ? `${chat.lastMessage.slice(0, 5)}...` : chat.lastMessage}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        )
                    )}
                </Card>
            </CardContainer >
        </>
    );
}