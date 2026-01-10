import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm the TradeEthiopia assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const tradeEthiopiaInfo = {
    about: "TradeEthiopia is a B2B marketplace connecting Ethiopian businesses with global markets. We facilitate real trade connections between real people for real impact, bridging Africa to the world with trusted B2B services.",
    mission: "Our mission is to bridge African businesses, particularly Ethiopian exporters, with international buyers through our trusted B2B marketplace platform.",
    services: "We offer Business Directory, E-Shop, Training & Consultancy, TradeXTV, Expo, Shipping & Logistics, Verified Brokers, Banks & Financial Institutions, Insurance, and Ports & Customs Directory.",
    contact: "For support, you can reach us at International Call Center: +251 929 243 243 or +251 904 944 444. Visit our website at www.tradeethiopia.com",
    features: "Our platform provides verified suppliers, import-export opportunities, shipping & logistics agents, local and international B2B marketplace, and access to banks & financial institutions."
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');

    // Process bot response based on keywords
    setTimeout(() => {
      let botResponse = "I'm here to help you learn about TradeEthiopia. You can ask me about our services, mission, features, or contact information.";

      const lowerInput = inputValue.toLowerCase();
      
      if (lowerInput.includes('about') || lowerInput.includes('what is') || lowerInput.includes('describe')) {
        botResponse = tradeEthiopiaInfo.about;
      } else if (lowerInput.includes('mission') || lowerInput.includes('purpose') || lowerInput.includes('goal')) {
        botResponse = tradeEthiopiaInfo.mission;
      } else if (lowerInput.includes('service') || lowerInput.includes('offer') || lowerInput.includes('provide')) {
        botResponse = tradeEthiopiaInfo.services;
      } else if (lowerInput.includes('contact') || lowerInput.includes('phone') || lowerInput.includes('reach') || lowerInput.includes('email')) {
        botResponse = tradeEthiopiaInfo.contact;
      } else if (lowerInput.includes('feature') || lowerInput.includes('platform') || lowerInput.includes('function')) {
        botResponse = tradeEthiopiaInfo.features;
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        botResponse = "Hello! Welcome to TradeEthiopia. How can I assist you today?";
      } else if (lowerInput.includes('thank')) {
        botResponse = "You're welcome! Is there anything else I can help you with?";
      }

      const botMessage = {
        id: updatedMessages.length + 1,
        text: botResponse,
        sender: 'bot'
      };

      setMessages([...updatedMessages, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#0f3d2e] to-[#134a36] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">TradeEthiopia Assistant</h3>
                <p className="text-xs opacity-80">Online now</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    message.sender === 'user'
                      ? 'bg-[#0f3d2e] text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about TradeEthiopia..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3d2e] focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#0f3d2e] text-white rounded-full p-2 hover:bg-[#134a36] transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-b from-[#0f3d2e] to-[#134a36] text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-shadow flex items-center gap-2"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="hidden sm:inline text-sm font-medium">Ask Us</span>
        </button>
      )}
    </div>
  );
};

export default ChatBot;