'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Sparkles, X, Send, Bot, User, CornerDownLeft, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAIUsage } from '@/lib/ai/usage-tracker';
import { useFeatureFlags } from '@/lib/hooks/use-feature-flags';
import { AIUsageIndicator, AIGeminiAttribution } from '@/components/ai/ai-usage-indicator';

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

const WELCOME_MESSAGE = "Hi! I'm your AI property assistant powered by Gemini. How can I help you today? You can ask me about properties, prices, localities, or market trends! 🏠";

export default function AiChatWidget() {
  const { isFeatureEnabled, aiFeatures } = useFeatureFlags();
  const chatUsage = useAIUsage('chatMessages');

  const isAllowed = aiFeatures && isFeatureEnabled('ai-chat-assistant');

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
    if (!queryText || isStreaming || !isAllowed || !chatUsage.canUse) return;

    chatUsage.increment();

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
                  'AI temporarily unavailable. Please try again.',
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  if (!isAllowed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Floating Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[360px] max-w-[calc(100vw-2rem)] sm:w-[380px] h-[540px] bg-card border border-border/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary p-4 text-primary-foreground flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center">
                  <Sparkles className="h-4.5 w-4.5 text-white" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-extrabold tracking-tight leading-none">EstateX AI Assistant</span>
                  <span className="text-[10px] text-primary-foreground/80 font-medium mt-0.5">Real Estate Advisor • Gemini AI</span>
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
            
            {/* Header Usage Indicator */}
            <div className="pt-1 border-t border-white/20">
              <AIUsageIndicator featureKey="chatMessages" className="max-w-full text-white" />
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {/* Welcome Message */}
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3 rounded-2xl bg-muted/60 text-foreground leading-relaxed text-left font-medium max-w-[85%] border border-border/40">
                {WELCOME_MESSAGE}
              </div>
            </div>

            {/* Message Thread */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`p-1.5 rounded-full shrink-0 mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    <Bot className="h-3.5 w-3.5" />
                  )}
                </div>

                <div
                  className={`p-3 rounded-2xl leading-relaxed text-left max-w-[85%] font-medium ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground font-semibold rounded-br-none'
                      : 'bg-muted/60 text-foreground border border-border/40 rounded-bl-none'
                  }`}
                >
                  {msg.content ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>AI is thinking...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="px-3 py-1.5 border-t border-border/30 bg-muted/20 flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_REPLIES.map((reply, i) => (
              <button
                key={i}
                disabled={isStreaming || !chatUsage.canUse}
                onClick={() => handleSendMessage(reply)}
                className="whitespace-nowrap text-[10px] font-bold px-2.5 py-1 rounded-full bg-background border border-border/70 text-foreground hover:border-primary hover:text-primary transition-colors shrink-0 cursor-pointer disabled:opacity-50"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Footer Input Area */}
          <div className="p-3 border-t border-border/40 bg-card flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Input
                placeholder={chatUsage.canUse ? "Ask anything about properties..." : "Daily limit reached. Resets at midnight."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isStreaming || !chatUsage.canUse}
                className="h-10 text-xs font-semibold rounded-xl bg-background border-border/80 focus-visible:ring-primary/45"
              />
              <Button
                size="icon"
                disabled={isStreaming || !input.trim() || !chatUsage.canUse}
                onClick={() => handleSendMessage()}
                className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 cursor-pointer border-none shadow-xs"
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1 pt-0.5">
              <span>Press Enter ↵ to send</span>
              <AIGeminiAttribution />
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        data-ai-chat-button="true"
        onClick={toggleOpen}
        className="relative p-3.5 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center border-none"
        title="Open AI Property Assistant"
      >
        <Sparkles className="h-6 w-6 text-primary-foreground" />
        
        {/* Unread notification dot */}
        {hasUnreadDot && !isOpen && (
          <span className="absolute top-0 right-0 h-3.5 w-3.5 bg-rose-500 rounded-full border-2 border-background animate-pulse" />
        )}
      </button>
    </div>
  );
}
