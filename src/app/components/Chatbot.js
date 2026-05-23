"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  X, Send, Bot, User } from 'lucide-react';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// 1. Define your Business Knowledge Base
const BUSINESS_KNOWLEDGE = [
  {
    keywords: ["hi", "hello", "assalam", "salam"],
    answer: "Assalam-o-Alaikum! I'm your Blood Donation Assistant. How can I help you save lives today?"
  },
  {
    keywords: ["donate", "become donor", "register"],
    answer: "To become a donor, click 'Become a Donor' on our homepage. You'll need to provide basic personal and medical details."
  },
  {
    keywords: ["find donor", "need blood", "urgent"],
    answer: "Use the 'Find Donors' page. You can filter by blood type, city, or mark a request as urgent for faster responses."
  },
  {
    keywords: ["eligibility", "who can donate"],
    answer: "Generally, healthy individuals aged 18–65, weighing >50kg, with no recent infections or major illnesses can donate. Check our detailed eligibility page for specifics."
  },
  {
    keywords: ["blood type", "compatibility", "match"],
    answer: "We follow standard transfusion rules: O- is universal donor, AB+ is universal recipient. Use our compatibility chart on the homepage for more details."
  },
  {
    keywords: ["location", "near me", "city"],
    answer: "We connect donors and recipients across multiple cities. Once you're logged in, the system shows matches based on your saved location."
  }
];
const AIChatFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm your Blood Donation Hub assistant. How can I help you today?" }
  ]);
  
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.toLowerCase();
    setInput("");

    // Simulate "Thinking" and then reply
    setTimeout(() => {
      let botResponse = "I'm sorry, I don't have information on that yet. Would you like to speak to our team via WhatsApp?";
      
      // Check knowledge base
      for (const item of BUSINESS_KNOWLEDGE) {
        if (item.keywords.some(key => currentInput.includes(key))) {
          botResponse = item.answer;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-28 right-6 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-red-500 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-full"><Bot size={20} /></div>
                <div>
                  <h3 className="font-bold text-sm">Blood Donation Hub AI Support</h3>
                  <p className="text-[10px] text-emerald-100">Online | Instant Answers</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-700 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="h-80 p-4 overflow-y-auto bg-gray-50 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about delivery, hours..." 
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button 
                onClick={handleSend}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-emerald-700 transition-transform active:scale-90"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center"
      >
        {isOpen ? <X size={28} /> : 
        
         (
          <DotLottieReact
            src="https://lottie.host/9fcdb205-a03d-4722-94aa-f4a370d9f241/s3XcpXXTzd.lottie"
            loop
            autoplay
            style={{ width: "50px", height: "50px" }}
          />
        )}

      </button>
    </div>
  );
};

export default AIChatFloat;