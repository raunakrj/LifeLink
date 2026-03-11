import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { 
    Send, User, Search, MoreVertical, 
    ArrowLeft, Loader2, Image, Paperclip, 
    Smile, MapPin, Clock 
} from 'lucide-react';
import { cn } from '../lib/utils';

const Messages = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const socketRef = useRef();
    const messagesEndRef = useRef();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Initialize Socket
        socketRef.current = io(SOCKET_URL);
        
        socketRef.current.on('receive-message', (message) => {
            if (activeChat && (message.chatId === activeChat._id)) {
                setMessages(prev => [...prev, message]);
            }
            // Update chat list preview
            fetchChats();
        });

        socketRef.current.on('user-typing', ({ userName }) => {
            if (activeChat) {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 3000);
            }
        });

        return () => socketRef.current.disconnect();
    }, [user, activeChat]);

    useEffect(() => {
        if (user) {
            fetchChats();
        }
    }, [user]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const chatId = queryParams.get('chatId');
        if (chatId && chats.length > 0) {
            const chat = chats.find(c => c._id === chatId);
            if (chat) selectChat(chat);
        }
    }, [location.search, chats]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChats = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
            const { data } = await axios.get(`${API_URL}/chats`, config);
            setChats(data);
            setLoading(false);
        } catch (error) {
            console.error('Fetch chats failed', error);
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
            const { data } = await axios.get(`${API_URL}/messages/${chatId}`, config);
            setMessages(data);
        } catch (error) {
            console.error('Fetch messages failed', error);
        }
    };

    const selectChat = (chat) => {
        setActiveChat(chat);
        setMessages([]);
        fetchMessages(chat._id);
        socketRef.current.emit('join-chat', chat._id);
        // Clear unread logic would go here
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const receiver = activeChat.participants.find(p => p._id !== user._id);
        
        try {
            const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
            const { data } = await axios.post(`${API_URL}/messages`, {
                chatId: activeChat._id,
                receiverId: receiver._id,
                content: newMessage
            }, config);

            // Emit via socket
            socketRef.current.emit('send-message', {
                chatId: activeChat._id,
                message: {
                    ...data,
                    senderName: user.name
                }
            });

            setMessages(prev => [...prev, data]);
            setNewMessage('');
            fetchChats(); // Refresh preview
        } catch (error) {
            console.error('Send message failed', error);
        }
    };

    const handleTyping = () => {
        if (activeChat) {
            socketRef.current.emit('typing', {
                chatId: activeChat._id,
                userName: user.name
            });
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
        </div>
    );

    return (
        <div className="h-screen pt-20 pb-0 bg-white flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar - Chat List */}
            <div className={cn(
                "w-full md:w-96 border-r border-gray-100 flex flex-col bg-gray-50/30",
                activeChat ? "hidden md:flex" : "flex"
            )}>
                <div className="p-6 border-b border-gray-100 bg-white">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/20"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.length > 0 ? chats.map(chat => {
                        const otherUser = chat.participants.find(p => p._id !== user._id);
                        const isOnline = true; // Placeholder for online status
                        return (
                            <button 
                                key={chat._id}
                                onClick={() => selectChat(chat)}
                                className={cn(
                                    "w-full p-4 flex items-center gap-4 transition-all hover:bg-white border-b border-gray-50/50",
                                    activeChat?._id === chat._id ? "bg-white border-l-4 border-l-red-600 shadow-sm" : ""
                                )}
                            >
                                <div className="relative flex-shrink-0">
                                    <img 
                                        src={otherUser?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.email}`} 
                                        alt={otherUser?.name}
                                        className="w-12 h-12 rounded-2xl object-cover bg-white shadow-sm"
                                    />
                                    {isOnline && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className="font-bold text-gray-900 truncate text-sm">{otherUser?.name}</h4>
                                        <span className="text-[10px] text-gray-400">
                                            {chat.updatedAt && new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate leading-relaxed">
                                        {chat.lastMessage?.content || "Start a conversation"}
                                    </p>
                                </div>
                            </button>
                        );
                    }) : (
                        <div className="p-10 text-center">
                            <p className="text-sm text-gray-500">No conversations yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-white transition-all h-full",
                !activeChat ? "hidden md:flex bg-gray-50/50 items-center justify-center" : "flex"
            )}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setActiveChat(null)}
                                    className="md:hidden p-2 hover:bg-gray-100 rounded-full text-gray-500"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={activeChat.participants.find(p => p._id !== user._id)?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.participants.find(p => p._id !== user._id)?.email}`} 
                                        className="w-10 h-10 rounded-xl object-cover"
                                        alt="Profile"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {activeChat.participants.find(p => p._id !== user._id)?.name}
                                        </h3>
                                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">
                                            {isTyping ? "Typing..." : "Online"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Thread */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/30">
                            {messages.map((msg, idx) => {
                                const isMe = msg.sender === user._id;
                                return (
                                    <div 
                                        key={msg._id || idx} 
                                        className={cn(
                                            "flex w-full mb-2",
                                            isMe ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm text-sm break-words relative group",
                                            isMe 
                                                ? "bg-gray-900 text-white rounded-br-none" 
                                                : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                                        )}>
                                            {msg.content}
                                            <div className={cn(
                                                "text-[9px] mt-1.5 flex items-center gap-1",
                                                isMe ? "text-gray-400 justify-end" : "text-gray-400"
                                            )}>
                                                {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                {isMe && <Clock className="w-2.5 h-2.5" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 md:p-6 bg-white border-t border-gray-100">
                            <form 
                                onSubmit={handleSendMessage}
                                className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-red-500/20 transition-all"
                            >
                                <div className="flex items-center px-2 border-r border-gray-200">
                                    <button type="button" className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Type your message..."
                                    className="flex-1 py-2 bg-transparent outline-none text-sm placeholder:text-gray-400"
                                    value={newMessage}
                                    onChange={(e) => {
                                        setNewMessage(e.target.value);
                                        handleTyping();
                                    }}
                                />
                                <div className="flex items-center gap-1 pr-1">
                                    <button type="button" className="p-2 text-gray-400 hover:text-yellow-500 hidden sm:block">
                                        <Smile className="w-5 h-5" />
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-red-600 text-white p-2.5 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:shadow-none"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                            <p className="text-[10px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                                <MapPin className="w-2.5 h-2.5" /> End-to-end encrypted messaging
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-12">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-large shadow-red-100">
                            <Send className="w-10 h-10 text-red-600 -rotate-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Conversations</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            Connect with donors or receivers directly via our secure real-time messaging system.
                        </p>
                        <button 
                            onClick={() => navigate('/donors')}
                            className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg"
                        >
                            Find Someone to Chat
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
