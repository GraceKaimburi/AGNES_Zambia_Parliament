import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, ArrowLeft, Send, Clock, MessageSquarePlus } from 'lucide-react';

const AGNESChatbot = () => {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'recent'
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([{
    type: 'bot',
    text: "Hi! My Name is AGNES. I am an AI chatbot here to help with any questions you may have about Climate Change. Please note that I am still under training and may not have all the answers now, but definitely with time, I will be more optimized",
    timestamp: new Date(),
    id: 'welcome'
  }, {
    type: 'bot',
    text: "What can I help you with?",
    timestamp: new Date(),
    id: 'prompt'
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
      id: Date.now().toString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate typing delay
    setTimeout(async () => {
      try {
        let response;
        // Handle gibberish or random input
        if (inputValue.match(/^[a-zA-Z0-9]+$/)) {
          response = "It seems like there might have been a typo or an error in your message. Could you please clarify or let me know how I can assist you? 😊";
        } else {
          response = await generateResponse(inputValue);
        }

        setMessages(prev => [...prev, {
          type: 'bot',
          text: response,
          timestamp: new Date(),
          id: Date.now().toString()
        }]);
      } catch (error) {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: "I apologize, but I encountered an error. Please try asking your question again.",
          timestamp: new Date(),
          id: Date.now().toString()
        }]);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const generateResponse = async (input) => {
    // Add your response generation logic here
    return "This is a placeholder response. Implement your actual response generation logic here.";
  };

  const handleMessageAction = (messageId, action) => {
    switch(action) {
      case 'like':
        // Handle like
        break;
      case 'dislike':
        // Handle dislike
        break;
      case 'copy':
        // Handle copy
        const message = messages.find(m => m.id === messageId);
        if (message) {
          navigator.clipboard.writeText(message.text);
        }
        break;
      case 'retry':
        // Handle retry
        break;
      default:
        break;
    }
  };

  const MenuDropdown = () => (
    <div className="absolute right-2 top-12 bg-white rounded-lg shadow-lg z-50 w-48">
      <button onClick={() => setMessages([])} className="w-full text-left px-4 py-2 hover:bg-gray-100">
        <MessageSquarePlus className="inline mr-2" size={16} />
        Start a new chat
      </button>
      <button onClick={() => setCurrentView('recent')} className="w-full text-left px-4 py-2 hover:bg-gray-100">
        <Clock className="inline mr-2" size={16} />
        View recent chats
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
        {currentView === 'recent' ? (
          <>
            <button onClick={() => setCurrentView('chat')} className="p-1">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-lg font-semibold">Recent chats</h1>
            <MessageSquarePlus size={24} />
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold">AGNES CLIMATE CHATBOT</h1>
            <MoreVertical size={24} className="cursor-pointer" />
          </>
        )}
      </div>

      {currentView === 'chat' ? (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="relative group">
                  <div className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    msg.type === 'user' 
                      ? 'bg-green-600 text-white ml-12' 
                      : 'bg-gray-200 text-gray-800 mr-12'
                  }`}>
                    {msg.text}
                  </div>
                  <div className="hidden group-hover:flex space-x-2 absolute bottom-0 left-0 bg-white shadow rounded-lg p-1">
                    <button onClick={() => handleMessageAction(msg.id, 'like')}>👍</button>
                    <button onClick={() => handleMessageAction(msg.id, 'dislike')}>👎</button>
                    <button onClick={() => handleMessageAction(msg.id, 'copy')}>📋</button>
                    <button onClick={() => handleMessageAction(msg.id, 'retry')}>🔄</button>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex space-x-2 p-4">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </>
      ) : (
        // Recent Chats View
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {recentChats.map((chat, idx) => (
            <div 
              key={idx}
              className="flex items-center p-4 border-b hover:bg-gray-100 cursor-pointer"
              onClick={() => setCurrentView('chat')}
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                AC
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{chat.title}</h3>
                <p className="text-sm text-gray-500">{chat.preview}</p>
              </div>
              <span className="text-green-600">Open</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AGNESChatbot;