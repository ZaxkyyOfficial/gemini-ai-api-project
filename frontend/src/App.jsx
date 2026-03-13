import { useState, useRef, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo Sobat Bumi! 🌍✨ Aku EcoSphere AI, asisten pribadimu buat dukung gaya hidup hijau. Ada yang bisa aku bantu seputar hemat energi, kurangi jejak karbon, atau pilih barang ramah lingkungan hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Use a pseudo-random session ID for this user session
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error fetching chat:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Waduh, koneksiku lagi gangguan nih, Sobat Bumi. 😟 Coba lagi nanti ya!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-eco-dark/40 backdrop-blur-sm"></div>
      
      <div className="relative w-full max-w-4xl glass-panel h-[85vh] flex flex-col overflow-hidden animate-fade-in">
        
        {/* Header */}
        <header className="px-6 py-4 border-b border-eco-green/20 bg-white/40 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-eco-green to-eco-accent flex items-center justify-center shadow-lg text-white text-2xl">
            🌱
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">EcoSphere AI</h1>
            <p className="text-sm text-gray-600 font-medium tracking-wide">Asisten Produktivitas Hijau Kamu</p>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] md:max-w-[70%] text-sm md:text-base leading-relaxed ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="chat-bubble-ai flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-eco-green animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-eco-green animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-eco-green animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white/50 border-t border-eco-green/20">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya soal tips hemat energi atau barang eco-friendly..."
              className="input-field pr-12 text-gray-800 placeholder-gray-500 bg-white/70"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-eco-green hover:bg-eco-accent text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-2">
            EcoSphere AI selalu berusaha memberikan solusi hijau terbaik. Mari jaga bumi bersama! 🌍
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
