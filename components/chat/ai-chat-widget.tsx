'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Sparkles, X, Send, Bot, User, CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_REPLIES = [
  'Find 2BHK in Mumbai',
  'Calculate EMI',
  'Best localities in Bangalore',
];

const WELCOME_MESSAGE = "Hi! I'm your AI property assistant. How can I help you today? You can ask me about properties, prices, localities, or anything real estate related! 🏠";

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadDot, setHasUnreadDot] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 30-second unread nudge timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasUnreadDot(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isStreaming]);

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setHasUnreadDot(false);
      }
      return next;
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText,
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    };

    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, initialAssistantMessage]);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          context: {
            currentPage: typeof window !== 'undefined' ? window.location.pathname : '/',
          },
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to start AI chat stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedText }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error streaming chat:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  'I am sorry, but I ran into a connection issue. Please try asking again!',
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end pointer-events-auto">
      {/* Floating Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[360px] max-w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] bg-card border border-border/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-tight leading-none">EstateHub AI Assistant</span>
                <span className="text-[10px] text-primary-foreground/80 font-medium mt-0.5">Real Estate Advisor • Always Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-primary-foreground transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-muted/20">
            {/* Welcome Message */}
            <div className="flex items-start gap-2 max-w-[85%] animate-in fade-in duration-300">
              <div className="p-1.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-1">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border/60 text-xs font-semibold text-foreground leading-relaxed shadow-xs">
                {WELCOME_MESSAGE}
              </div>
            </div>

            {/* Quick Reply Chips (Only show before first user query) */}
            {messages.length === 0 && (
              <div className="flex flex-col gap-1.5 ml-7 mt-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Suggested Questions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_REPLIES.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleSendMessage(chip)}
                      className="px-3 py-1.5 rounded-xl bg-background border border-primary/30 text-primary hover:bg-primary/10 text-xs font-bold text-left cursor-pointer transition-all shadow-2xs"
                    >
                      ✨ {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Conversation Messages */}
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 max-w-[85%] ${
                    isUser ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-xl shrink-0 mt-1 ${
                      isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-card border border-border/60 text-foreground rounded-tl-none'
                    }`}
                  >
                    {msg.content ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      /* Typing Indicator when streaming initial response */
                      <div className="flex items-center gap-1.5 py-1 px-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-card border-t border-border/60 flex items-center gap-2"
          >
            <Input
              type="text"
              placeholder="Ask AI about properties..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
              className="h-10 text-xs font-semibold rounded-xl bg-muted/40 border-border/80 focus-visible:ring-primary/40"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming}
              className="h-10 w-10 shrink-0 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground cursor-pointer shadow-xs"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <div className="relative group">
        <button
          onClick={toggleOpen}
          className="relative h-14 w-14 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          aria-label="Chat with AI Assistant"
        >
          <MessageCircle className="h-6 w-6" />
          <Sparkles className="h-3.5 w-3.5 absolute top-3 right-3 text-amber-300 animate-pulse" />

          {/* Unread Nudge Dot */}
          {hasUnreadDot && !isOpen && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 border-2 border-background animate-ping" />
          )}
          {hasUnreadDot && !isOpen && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 border-2 border-background" />
          )}
        </button>

        {/* Hover Tooltip */}
        {!isOpen && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            Chat with AI ✨
          </div>
        )}
      </div>
    </div>
  );
}
