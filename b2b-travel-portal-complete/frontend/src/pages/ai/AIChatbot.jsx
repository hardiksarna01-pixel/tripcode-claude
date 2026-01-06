import React, { useState, useRef, useEffect } from 'react';
import {
    ChatBubbleLeftRightIcon,
    PaperAirplaneIcon,
    SparklesIcon,
    XMarkIcon,
    ArrowPathIcon,
    HandThumbUpIcon,
    HandThumbDownIcon,
    ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AIChatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: "Hello! I'm your AI travel assistant. I can help you with:\n\n• Finding the best travel deals\n• Planning your itinerary\n• Answering travel questions\n• Booking assistance\n• Visa & documentation info\n\nHow can I help you today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [suggestions] = useState([
        'Best time to visit Bali?',
        'Suggest a 5-day Thailand itinerary',
        'What documents do I need for Dubai?',
        'Find cheap flights to Singapore',
        'Best honeymoon destinations'
    ]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (messageText = input) => {
        if (!messageText.trim()) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: messageText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await api.post('/ai/chat', {
                messages: [...messages, userMessage].map(m => ({
                    role: m.role,
                    content: m.content
                })),
                context: 'travel'
            });

            const assistantMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: response.data.message || generateMockResponse(messageText),
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const assistantMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: generateMockResponse(messageText),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const generateMockResponse = (query) => {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('bali')) {
            return `**Best Time to Visit Bali** 🌴

The ideal time to visit Bali is during the **dry season (April to October)**:

🌞 **April-June**: Pleasant weather, fewer crowds
🎉 **July-August**: Peak tourist season, great for festivals
🌅 **September-October**: Best deals with good weather

**Weather Details:**
• Dry Season: 27-30°C, low humidity
• Wet Season (Nov-Mar): Heavy afternoon showers

**Pro Tips:**
1. Book 2-3 months in advance for peak season
2. Nyepi (Day of Silence) in March - unique experience!
3. Consider shoulder months for best value

Would you like me to help you plan a Bali itinerary?`;
        }

        if (lowerQuery.includes('thailand') && lowerQuery.includes('itinerary')) {
            return `**5-Day Thailand Itinerary** 🇹🇭

Here's a perfect 5-day plan:

**Day 1-2: Bangkok**
• Grand Palace & Wat Phra Kaew
• Chatuchak Weekend Market
• Khao San Road nightlife
• Chao Phraya River cruise

**Day 3-4: Phuket/Krabi**
• Phi Phi Islands day trip
• Beach relaxation
• Thai cooking class
• Floating market

**Day 5: Departure**
• Morning temple visit
• Last-minute shopping
• Airport transfer

**Estimated Budget:** ₹35,000-50,000 per person
**Best For:** First-timers, beach lovers

Want me to customize this further or help with bookings?`;
        }

        if (lowerQuery.includes('dubai') && (lowerQuery.includes('document') || lowerQuery.includes('visa'))) {
            return `**Dubai Visa & Documentation Guide** 🇦🇪

**Visa Requirements for Indian Citizens:**

📋 **Documents Needed:**
• Valid passport (6 months validity)
• Passport-size photographs
• Confirmed return tickets
• Hotel booking confirmation
• Proof of sufficient funds

**Visa Types:**
| Type | Duration | Price | Processing |
|------|----------|-------|------------|
| 14-Day | 14 days | ₹2,999 | 3-5 days |
| 30-Day | 30 days | ₹4,999 | 3-5 days |
| 90-Day | 90 days | ₹9,999 | 3-5 days |

**Pro Tips:**
✅ Apply at least 7 days before travel
✅ Keep bank statement (3 months) ready
✅ Travel insurance recommended

Would you like me to help you apply for a Dubai visa?`;
        }

        if (lowerQuery.includes('flight') || lowerQuery.includes('cheap')) {
            return `**Finding Cheap Flights** ✈️

Here are my top tips for scoring the best deals:

**🎯 Best Booking Time:**
• Domestic: 3-6 weeks before travel
• International: 6-12 weeks before travel
• Tuesdays & Wednesdays usually cheapest

**💡 Pro Tips:**
1. Use incognito mode while searching
2. Be flexible with dates (±3 days)
3. Consider nearby airports
4. Book connecting flights for savings
5. Set price alerts

**Current Deals I Found:**
• Delhi → Singapore: ₹12,500 (IndiGo)
• Mumbai → Dubai: ₹8,999 (Air India Express)
• Bangalore → Bangkok: ₹9,800 (Thai AirAsia)

Want me to search for specific routes for you?`;
        }

        if (lowerQuery.includes('honeymoon')) {
            return `**Best Honeymoon Destinations** 💑

Here are my top recommendations:

**🏝️ Beach Paradises:**
1. **Maldives** - Ultimate luxury, overwater villas
   Budget: ₹1,50,000-3,00,000 (5N/6D)

2. **Bali** - Romance + adventure
   Budget: ₹70,000-1,20,000 (6N/7D)

**🏔️ Mountain Romance:**
3. **Switzerland** - Scenic Alps
   Budget: ₹2,00,000-3,50,000 (7N/8D)

4. **Shimla-Manali** - Budget-friendly
   Budget: ₹25,000-40,000 (5N/6D)

**🌆 City + Beach:**
5. **Thailand** - Perfect mix
   Budget: ₹50,000-80,000 (6N/7D)

**What to Consider:**
• Travel time from India
• Your budget
• Adventure vs relaxation preference
• Visa requirements

Which destination interests you most?`;
        }

        return `Thanks for your question! Let me help you with that.

Based on your query, here are some suggestions:

1. **For specific destinations:** I can provide detailed itineraries, best times to visit, and local tips.

2. **For bookings:** I can help you find the best deals on flights, hotels, and packages.

3. **For visa/documentation:** I can guide you through the requirements for any country.

4. **For travel planning:** I can create personalized itineraries based on your preferences.

Could you please provide more details so I can give you a more specific answer? For example:
• Destination you're interested in
• Travel dates
• Budget range
• Type of experience (adventure, relaxation, cultural)`;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const copyMessage = (content) => {
        navigator.clipboard.writeText(content);
    };

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                role: 'assistant',
                content: "Hello! I'm your AI travel assistant. How can I help you today?",
                timestamp: new Date()
            }
        ]);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-6">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">AI Travel Assistant</h1>
                                <p className="text-blue-100 text-sm">Powered by Claude AI</p>
                            </div>
                        </div>
                        <button
                            onClick={clearChat}
                            className="p-2 hover:bg-white/20 rounded-lg transition"
                            title="Clear chat"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Chat Container */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                        message.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                                            <SparklesIcon className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs text-gray-500">AI Assistant</span>
                                        </div>
                                    )}
                                    <div className="prose prose-sm max-w-none">
                                        {message.content.split('\n').map((line, i) => (
                                            <p key={i} className={`${line.startsWith('**') ? 'font-semibold' : ''} mb-1`}>
                                                {line.replace(/\*\*/g, '')}
                                            </p>
                                        ))}
                                    </div>
                                    {message.role === 'assistant' && (
                                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200">
                                            <button
                                                onClick={() => copyMessage(message.content)}
                                                className="p-1 hover:bg-gray-200 rounded transition"
                                                title="Copy"
                                            >
                                                <ClipboardDocumentIcon className="w-4 h-4 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-200 rounded transition" title="Helpful">
                                                <HandThumbUpIcon className="w-4 h-4 text-gray-500" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-200 rounded transition" title="Not helpful">
                                                <HandThumbDownIcon className="w-4 h-4 text-gray-500" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <SparklesIcon className="w-4 h-4 text-blue-600 animate-pulse" />
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions */}
                    {messages.length === 1 && (
                        <div className="px-4 pb-4">
                            <p className="text-sm text-gray-500 mb-2">Try asking:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => sendMessage(suggestion)}
                                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="border-t p-4">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about travel..."
                                className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isTyping}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || isTyping}
                                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            AI-powered assistant. Responses may not always be accurate.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;
