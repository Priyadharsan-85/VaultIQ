import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const { token } = useContext(AuthContext);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { role: "user", parts: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ai/chat`,
        { message, chatHistory },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChatHistory(prev => [...prev, { role: "model", parts: res.data.text }]);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "I'm having trouble connecting. Please check your API key and connection.";
      setChatHistory(prev => [...prev, { role: "model", parts: `Error: ${errorMsg}` }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass w-[350px] md:w-[400px] h-[500px] mb-6 flex flex-col overflow-hidden shadow-2xl border-white/10"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-gold/20 to-transparent border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gold/20 rounded-xl">
                  <Bot size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tighter">Omni-Vault AI</h3>
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                    <span className="text-[10px] text-textSecondary font-bold">Neural Link Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-textSecondary hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {chatHistory.length === 0 && (
                <div className="text-center py-10">
                  <Sparkles size={40} className="text-gold/20 mx-auto mb-4" />
                  <p className="text-sm text-textSecondary italic">"Analyze my spending this month..."</p>
                </div>
              )}
              {chatHistory.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: item.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    item.role === 'user' 
                      ? 'bg-gold/20 text-white rounded-br-none border border-gold/20' 
                      : 'bg-white/5 text-textPrimary rounded-bl-none border border-white/5 shadow-inner'
                  }`}>
                    {item.parts}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-bl-none border border-white/5">
                    <Loader2 size={18} className="text-gold animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 bg-white/5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask Omni-Vault..."
                  className="w-full bg-darkBg/50 border border-white/10 rounded-xl py-4 pl-5 pr-12 text-sm text-white focus:border-gold/50 outline-none transition-all"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-darkBg transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Orb Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full glass border-gold/30 flex items-center justify-center relative group"
      >
        <div className="absolute inset-0 bg-gold/10 rounded-full blur-xl group-hover:bg-gold/20 animate-pulse transition-all" />
        <Bot size={28} className={`text-gold transition-all duration-500 ${isOpen ? 'rotate-[360deg] scale-0' : 'scale-100'}`} />
        <X size={28} className={`text-gold absolute transition-all duration-500 ${isOpen ? 'scale-100 rotate-0' : 'scale-0 rotate-[-180deg]'}`} />
      </motion.button>
    </div>
  );
};

export default ChatAssistant;
