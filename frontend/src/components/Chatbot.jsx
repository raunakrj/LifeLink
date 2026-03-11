import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { MessageSquare, Send, X, Bot, User, Loader2, Minus, Maximize2 } from 'lucide-react';
import { cn } from '../lib/utils';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am LifeLink AI, your medical and donation assistant. How can I help you save a life today?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const socketRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Use environment variable for API URL or fallback to localhost
        const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
        console.log(`[DEBUG] Connecting to socket.io at ${apiUrl}`);
        socketRef.current = io(apiUrl);

        socketRef.current.on('connect', () => {
            console.log('[DEBUG] Socket connected:', socketRef.current.id);
        });

        socketRef.current.on('chat-delta', (delta) => {
            setIsTyping(false);
            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.role === 'assistant') {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { 
                        ...lastMsg, 
                        content: (lastMsg.content === '...' ? '' : lastMsg.content) + delta 
                    };
                    return newMessages;
                } else {
                    return [...prev, { role: 'assistant', content: delta }];
                }
            });
        });

        socketRef.current.on('chat-error', (err) => {
            console.error('[ERROR] Socket chat-error:', err);
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "I'm sorry, I'm having trouble retrieving that information right now. Please try again or check our help section." 
            }]);
        });

        socketRef.current.on('disconnect', (reason) => {
            console.warn('[WARN] Socket disconnected:', reason);
        });

        return () => socketRef.current.disconnect();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim() || isTyping) return;

        const userMsg = { role: 'user', content: message };
        const history = messages
            .filter(m => m.role === 'user' || m.role === 'assistant')
            .map(m => ({ role: m.role, content: m.content }));

        console.log('[DEBUG] Sending message with history length:', history.length);
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);
        
        socketRef.current.emit('chat-message', { 
            message: message.trim(), 
            history
        });
        
        setMessage('');
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-red-600 text-white p-4 rounded-full shadow-2xl shadow-red-300 hover:bg-red-700 hover:scale-110 transition-all active:scale-95 flex items-center gap-2 group"
            >
                <div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold px-0 group-hover:px-2">
                    Chat with Medical AI
                </div>
                <MessageSquare className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className={cn(
            "fixed bottom-6 right-6 z-50 bg-white shadow-2xl rounded-3xl border border-gray-100 flex flex-col transition-all duration-300 overflow-hidden",
            isMinimized ? "h-16 w-64" : "h-[600px] w-[400px] max-w-[90vw]"
        )}>
            {/* Header */}
            <div className="bg-red-600 p-4 text-white flex items-center justify-between shrink-0 cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">LifeLink AI</h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-red-100">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            Online Helper
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map((m, idx) => (
                            <div key={idx} className={cn(
                                "flex gap-3 max-w-[85%]",
                                m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}>
                                <div className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                                    m.role === 'user' ? "bg-red-100 text-red-600" : "bg-white border border-gray-100 text-gray-400 shadow-sm"
                                )}>
                                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm leading-relaxed",
                                    m.role === 'user' 
                                        ? "bg-red-600 text-white rounded-tr-none shadow-md shadow-red-100" 
                                        : "bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-sm"
                                )}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center shadow-sm">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1 items-center shadow-sm">
                                    <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce"></span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-3 shrink-0">
                        <input
                            type="text"
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
                            placeholder="Ask medical assistant..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button 
                            type="submit"
                            className="bg-red-600 text-white p-3 rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Chatbot;
