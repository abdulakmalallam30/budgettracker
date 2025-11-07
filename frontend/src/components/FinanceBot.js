import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, TrendingUp, PieChart, DollarSign, MessageCircle, Lightbulb, Trash2 } from 'lucide-react';

function FinanceBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm FinBot, your personal finance assistant! 🤖💰\n\nI'm powered by Gemini AI and can help you with:\n• Budgeting and expense tracking\n• Investment advice for beginners\n• Savings strategies\n• Debt management\n• Financial planning tips\n\nWhat would you like to know about managing your finances?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    {
      icon: PieChart,
      text: "How can I create a budget?",
      category: "Budgeting"
    },
    {
      icon: TrendingUp,
      text: "What are good investment options?",
      category: "Investing"
    },
    {
      icon: DollarSign,
      text: "How to track my expenses better?",
      category: "Tracking"
    },
    {
      icon: Lightbulb,
      text: "Tips for saving money?",
      category: "Savings"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      console.log('Sending message to chat API:', messageToSend);
      
      // Call backend API for chat response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      const botResponse = {
        id: Date.now() + 1,
        text: data.response || data.message || 'Sorry, I received an empty response.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      
      // Provide intelligent fallback responses based on the message content
      const messageText = messageToSend.toLowerCase();
      let fallbackResponse = "I'm having trouble connecting to the server right now. Let me give you some general finance advice: ";
      
      if (messageText.includes('budget')) {
        fallbackResponse += "Creating a budget is the foundation of good financial health! Start by tracking your income and expenses for a month to see where your money goes. Use the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.";
      } else if (messageText.includes('invest')) {
        fallbackResponse += "For beginners, consider starting with low-cost index funds or ETFs. They provide diversification and are less risky than individual stocks. Always have an emergency fund before investing!";
      } else if (messageText.includes('save')) {
        fallbackResponse += "Start small and be consistent! Even saving $5 a day adds up to over $1,800 in a year. Automate your savings and pay yourself first.";
      } else if (messageText.includes('debt')) {
        fallbackResponse += "Focus on paying off high-interest debt first (like credit cards). Consider the debt avalanche method: pay minimums on all debts, then put extra money toward the highest interest rate debt.";
      } else {
        fallbackResponse += "Personal finance is all about making informed decisions. Track your expenses, create a budget, build an emergency fund, and invest for the long term. What specific area would you like help with?";
      }
      
      const errorResponse = {
        id: Date.now() + 1,
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hi! I'm FinBot, your personal finance assistant! 🤖💰\n\nI'm powered by Gemini AI and can help you with:\n• Budgeting and expense tracking\n• Investment advice for beginners\n• Savings strategies\n• Debt management\n• Financial planning tips\n\nWhat would you like to know about managing your finances?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold font-heading text-gray-800">FinBot</h2>
            <p className="text-sm text-gray-600">Powered by Gemini AI • Online</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Clear chat history"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="p-4 bg-white border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Quick Questions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question.text)}
              className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-2 mb-1">
                <question.icon className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                <span className="text-xs font-medium text-blue-600">{question.category}</span>
              </div>
              <p className="text-sm text-gray-700 group-hover:text-gray-800 line-clamp-2">{question.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {message.sender === 'bot' && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className={`rounded-2xl px-4 py-3 ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</div>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-sm">You</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about finance..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          FinBot is powered by Gemini AI. Responses are for educational purposes only.
        </p>
      </div>
    </div>
  );
}

export default FinanceBot;