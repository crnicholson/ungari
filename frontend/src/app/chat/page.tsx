"use client";

import { Card, CardInput, CardContainer, CardTitle, CardBlock, CardButton, CardRow } from "../../components/card";
import { Header, HeaderLogo, HeaderNav } from "../../components/header";
import Button from "../../components/button";
import StyledLink from "../../components/styledLink";
import Error from "../../components/error";
import Warning from "../../components/warning";

import React, { useRef, useEffect, useState, useCallback } from "react";
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

    const [_id, setID] = useState("");

    const [matchName, setMatchName] = useState("");
    const [matchImage, setMatchImage] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{
        content: string;
        auth0_id: string;
        timestamp: Date;
    }[]>([]);

    const [chats, setChats] = useState([]);

    const [errorMessage, setErrorMessage] = useState("");
    const [warningMessage, setWarningMessage] = useState("");
    const [noUser, setNoUser] = useState(false);
    const [unReadMessages, setUnreadMessages] = useState(0);

    const { user, isLoading } = useUser();
    const router = useRouter();

    const firstUnreadMessageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (unReadMessages > 0 && firstUnreadMessageRef.current) {
            firstUnreadMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [unReadMessages]);

    // Basic auth
    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/api/auth/login");
        }
    }, [isLoading, user, router]);

    // Get match _id 
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const result = params.get('_id');
        if (result) {
            setID(result);
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
                _id: _id
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
                body: JSON.stringify({ auth0_id: user.sub, _id: _id }),
            });
            if (!response.ok) {
                const error = await response.json();
                setErrorMessage(error.error);
                setNoUser(error.noUser);
                setPolled(false);

                if (error.noUser) {
                    setTimeout(() => {
                        router.push("/chat");
                        setID("");
                    }, 2500);
                }
            } else {
                setErrorMessage("");
                setPolled(true);

                const data = await response.json();

                console.log(data);

                setMessages(data.messages);
                setMatchName(data.matchName);
                setMatchImage(data.matchImage);
                setUnreadMessages(data.unreadMessages);

                console.log(data.unreadMessages);
            }
        } catch (error) {
            setErrorMessage("Client-side error: " + error);
            setPolled(false);
        }
    }, [user, _id, router]);

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
                setErrorMessage(error.error);
                setPolled(false);
            } else {
                setErrorMessage("");
                setPolled(true);

                const data = await response.json();

                console.log(data);

                setChats(data.chatList);
            }
        } catch (error) {
            setErrorMessage("Client-side error: " + error);
            setPolled(false);
        }
    }, [user]);

    const setMessagesRead = useCallback(async () => {
        try {
            const response = await fetch(SERVER + "/api/set-messages-read", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ auth0_id: user.sub, _id: _id }),
            });
            if (!response.ok) {
                const error = await response.json();
                setErrorMessage(error.error);
            }
        } catch (error) {
            setErrorMessage("Client-side error: " + error);
        }
    }, [user, _id]);

    // Get match on page load 
    useEffect(() => {
        if (!isLoading && user) {
            if (_id) {
                getChat();
            } else {
                getChats();
            }
        }
    }, [isLoading, user, getChat, getChats, _id]);

    return (
        <>
            <Header>
                <HeaderLogo href="/">
                    <span className="text-[--accent] text-xl font-bold">⁂</span> Ungari
                </HeaderLogo>
                <HeaderNav>
                    <StyledLink href="/match" className="h-full w-fit flex items-center no-underline">
                        <span title="Match" className="material-symbols-outlined">hub</span>
                    </StyledLink>
                    <StyledLink href="/settings" className="h-full w-fit flex items-center no-underline">
                        <span title="Settings" className="material-symbols-outlined">settings</span>
                    </StyledLink>
                    <Button href="/api/auth/logout">Logout</Button>
                </HeaderNav>
            </Header>

            {errorMessage !== "" && (
                <Error className="w-full sm:w-1/2 mt-24">{errorMessage}</Error>
            )}

            {warningMessage !== "" && (
                <Warning onClick={() => setWarningMessage("")} className={`w-full sm:w-1/2 ${errorMessage !== "" ? 'mt-5' : 'mt-24'}`}>{warningMessage}</Warning>
            )}

            <CardContainer className={`sm:w-3/4 lg:w-2/3 xl:w-1/2 w-full ${(errorMessage !== "" || warningMessage !== "") ? 'mt-5' : 'mt-24'}`}>
                <Card className="w-full">
                    {_id ? (
                        <div className="flex items-center gap-4 mb-5">
                            {_id && matchImage && (
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
                                        <StyledLink href={`/user?_id=${_id}`}>
                                            {matchName}
                                        </StyledLink>
                                    )}, {unReadMessages > 0 ? `you have ${unReadMessages} unread messages` : "you are up to date"}
                                </CardTitle>
                                <StyledLink className="italic" href="/chat" onClick={() => setID("")}>
                                    Back to chat page
                                </StyledLink>
                            </div>
                        </div>
                    ) : (
                        <CardTitle className="mb-5" size={2}>
                            Choose your chat
                        </CardTitle>
                    )}

                    {(isLoading && !user && !polled) ? (
                        <p>Loading...</p>
                    ) : errorMessage !== "" ? (
                        noUser ? (
                            <p>User does not exist! The _id field of the URL may be wrong. Redirecting...</p>
                        ) : (
                            <p>Looks like you{"'"}re not getting your chat... our backend seems to be down. Try reloading or coming back later.</p>
                        )
                    ) : (
                        _id ? (
                            <>
                                <CardBlock
                                    className="p-3 mb-5 border border-[--border] rounded-xl overflow-y-auto max-h-[500px]"
                                    onScroll={(e) => {
                                        const element = e.target as HTMLDivElement;
                                        const isBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
                                        if (isBottom) {
                                            console.log('Scrolled to bottom!');
                                            setMessagesRead();
                                            setUnreadMessages(0);
                                        }
                                    }}
                                >
                                    {messages.map((msg, index) => (
                                        <React.Fragment key={index}>
                                            {unReadMessages > 0 && index === messages.length - unReadMessages && (
                                                <>
                                                    <div
                                                        ref={firstUnreadMessageRef}
                                                        className="w-full border-t-2 border-red-300"
                                                    />
                                                    <div>
                                                        <p className="text-sm px-1 pb-1 rounded-b-xl h-fit w-fit text-[--bg] bg-red-300">New messages below</p>
                                                    </div>
                                                </>
                                            )}
                                            <div
                                                className={`mb-2 p-[10px] border-[--border] rounded-xl bg-[--bg] border w-fit max-w-[70%] break-words ${msg.auth0_id === user.sub ? "ml-auto" : "mr-auto"
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </React.Fragment>
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
                            chats.length === 0 ? (
                                <p>No conversations found, please match with someone to start chatting!</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {chats.map((chat) => (
                                        <Button
                                            key={chat._id}
                                            href={`/chat?_id=${chat._id}`}
                                            className="w-full hover:bg-[--bg-hover] transition-colors duration-200"
                                            onClick={() => setID(chat._id)}
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
                        )
                    )}
                </Card>
            </CardContainer>
        </>
    );
}