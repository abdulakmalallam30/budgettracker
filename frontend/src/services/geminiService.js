// Gemini AI Integration Service for Finance Bot
// This service handles communication with Google's Gemini 1.5 Flash API

class GeminiService {
  constructor() {
    this.apiKey = null;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    this.conversationHistory = [];
  }

  // Test API key validity
  async testApiKey(apiKey) {
    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    try {
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { 
                  text: "Hello! This is a test message." 
                }
              ]
            }
          ]
        })
      });

      return response.ok;
    } catch (error) {
      console.error('API key test failed:', error);
      return false;
    }
  }

  // Set the API key (call this when user provides the key)
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // Check if API key is configured
  isConfigured() {
    return !!this.apiKey;
  }

  // Build the system prompt for finance-focused responses
  getSystemPrompt() {
    return `You are FinBot, a helpful and friendly AI finance assistant. Your expertise includes:

CORE RESPONSIBILITIES:
- Personal budgeting and expense tracking
- Investment advice for beginners to intermediate investors
- Savings strategies and financial planning
- Debt management and credit improvement
- Financial education and literacy
- Currency and market insights
- Tax planning basics (US-focused but mention international considerations)

PERSONALITY:
- Friendly, encouraging, and supportive
- Use simple language and avoid jargon
- Provide actionable, practical advice
- Always emphasize the importance of personal research
- Be optimistic but realistic about financial goals

RESPONSE GUIDELINES:
- Keep responses concise (under 200 words when possible)
- Use bullet points for multiple tips
- Include relevant emojis sparingly (💰 💡 📊 📈 ✅)
- Always add a disclaimer for investment advice
- Ask follow-up questions to provide better personalized advice
- Reference the user's expense tracking app when relevant

IMPORTANT DISCLAIMERS:
- Always mention that advice is for educational purposes
- Recommend consulting financial advisors for complex situations
- Emphasize personal research before making investment decisions

Remember: You're helping users improve their financial health through their expense tracking journey.`;
  }

  // Build the request payload for Gemini API
  buildRequestPayload(userMessage) {
    // Simple request without conversation history to start
    return {
      contents: [
        {
          parts: [
            { 
              text: `${this.getSystemPrompt()}\n\nUser Question: ${userMessage}\n\nPlease provide a helpful finance response:` 
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };
  }

  // Send message to Gemini API
  async sendMessage(userMessage) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key not configured. Please set your API key first.');
    }

    console.log('Sending message to Gemini API:', userMessage);
    console.log('API Key configured:', this.apiKey ? 'Yes' : 'No');

    try {
      const payload = this.buildRequestPayload(userMessage);
      console.log('Request payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        let errorMessage = 'Unknown error';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error?.message || errorText;
        } catch (e) {
          errorMessage = errorText;
        }
        
        throw new Error(`Gemini API Error (${response.status}): ${errorMessage}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.candidates || data.candidates.length === 0) {
        console.error('No candidates in response:', data);
        throw new Error('No response generated from Gemini API');
      }

      if (!data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        console.error('Invalid response structure:', data.candidates[0]);
        throw new Error('Invalid response structure from Gemini API');
      }

      const botResponse = data.candidates[0].content.parts[0].text;
      console.log('Bot response:', botResponse);

      // Add to conversation history (keep last 10 exchanges)
      this.conversationHistory.push(
        {
          role: 'user',
          parts: [{ text: userMessage }]
        },
        {
          role: 'model',
          parts: [{ text: botResponse }]
        }
      );

      // Keep only last 20 messages (10 exchanges)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return botResponse;

    } catch (error) {
      console.error('Gemini API Error Details:', error);
      throw error;
    }
  }

  // Get fallback responses when API is not available
  getFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
      budget: "💰 Creating a budget is essential! Start with the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Track your income and expenses for a month to see where your money goes. Our expense tracker can help you categorize spending! What's your biggest spending category?",
      
      investment: "📊 Great question! For beginners, consider starting with:\n• Index funds or ETFs (diversified, lower risk)\n• Dollar-cost averaging strategy\n• Emergency fund first (3-6 months expenses)\n• Only invest money you won't need for 5+ years\n\n⚠️ Always do your research and consider consulting a financial advisor. What's your investment timeline?",
      
      expense: "📈 Smart expense tracking tips:\n• Categorize everything (housing, food, transport, entertainment)\n• Review spending weekly\n• Use our built-in tracker for insights\n• Look for patterns and surprises\n• Set spending limits per category\n\nSmall daily expenses often add up more than you think! What category surprises you most?",
      
      saving: "✅ Proven saving strategies:\n• Pay yourself first - save before spending\n• Automate transfers to savings\n• Use the envelope method for discretionary spending\n• Find cheaper alternatives for recurring expenses\n• Set specific, measurable goals\n\n💡 Even $5/day = $1,825/year! What's your savings goal?",
      
      debt: "🎯 Debt management strategies:\n• List all debts (amount, interest rate, minimum payment)\n• Consider debt avalanche (highest interest first) or snowball (smallest first)\n• Negotiate with creditors if struggling\n• Avoid taking on new debt\n• Build emergency fund while paying debt\n\nEvery extra payment helps! What type of debt are you tackling?",
      
      credit: "📊 Credit improvement tips:\n• Pay all bills on time (35% of score)\n• Keep credit utilization below 30% (ideally under 10%)\n• Don't close old credit cards\n• Monitor your credit report regularly\n• Be patient - improvements take time\n\nGood credit opens many financial doors! What's your current credit goal?"
    };

    if (lowerMessage.includes('budget')) return responses.budget;
    if (lowerMessage.includes('invest')) return responses.investment;
    if (lowerMessage.includes('expense') || lowerMessage.includes('track')) return responses.expense;
    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) return responses.saving;
    if (lowerMessage.includes('debt') || lowerMessage.includes('loan')) return responses.debt;
    if (lowerMessage.includes('credit')) return responses.credit;
    
    return "💡 I'm here to help with all your finance questions! I can assist with:\n• Budgeting and expense tracking\n• Investment basics\n• Saving strategies\n• Debt management\n• Credit improvement\n• Financial planning\n\nWhat specific area would you like to explore? Feel free to ask me anything about your financial journey!";
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }

  // Get conversation history
  getHistory() {
    return this.conversationHistory;
  }
}

// Create singleton instance
const geminiService = new GeminiService();

export default geminiService;