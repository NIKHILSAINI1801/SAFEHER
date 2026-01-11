import React, { useState, useRef, useEffect } from 'react';
import { Send, Shield, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToAI } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";

export const SafetyAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello. I'm SafeHer AI. I can provide safety tips, travel advice, or guidance on how to handle uncomfortable situations. How can I help you stay safe today?",
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const streamResponse = await sendMessageToAI(userMsg.text);
      
      const botMsgId = (Date.now() + 1).toString();
      // Add placeholder for streaming
      setMessages(prev => [...prev, {
          id: botMsgId,
          role: 'model',
          text: '',
          timestamp: Date.now()
      }]);

      let fullText = '';
      
      for await (const chunk of streamResponse) {
          const c = chunk as GenerateContentResponse;
          if (c.text) {
              fullText += c.text;
              setMessages(prev => prev.map(msg => 
                  msg.id === botMsgId ? { ...msg, text: fullText } : msg
              ));
          }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting right now. Please check your internet connection or try again later.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-900">
      <div className="p-4 bg-slate-800 border-b border-slate-700 shadow-md flex items-center gap-3">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
             <Shield className="text-indigo-400" size={24} />
        </div>
        <div>
          <h2 className="font-bold text-white">Safety Assistant</h2>
          <p className="text-xs text-slate-400">AI-Powered Safety Advice</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-50 text-xs uppercase tracking-wider">
                 {msg.role === 'user' ? <User size={12}/> : <Bot size={12}/>}
                 {msg.role === 'user' ? 'You' : 'SafeHer AI'}
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
             <div className="flex justify-start">
                 <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-700 flex gap-2">
                     <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                     <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for safety advice..."
            className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-3 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};