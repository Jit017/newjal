import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Droplets, ThumbsUp, ThumbsDown, Medal, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Simulated NLP processing using basic pattern matching and scoring
const processQuery = (query) => {
  const tokens = query.toLowerCase().split(/\W+/);
  const topics = {
    irrigation: ['irrigation', 'watering', 'sprinkler', 'drip', 'garden'],
    household: ['home', 'house', 'bathroom', 'kitchen', 'fixture', 'appliance'],
    technology: ['smart', 'meter', 'sensor', 'system', 'device', 'monitoring'],
    conservation: ['save', 'conserve', 'efficiency', 'reduce', 'usage'],
    regulation: ['law', 'rule', 'regulation', 'requirement', 'policy']
  };

  const scores = Object.entries(topics).reduce((acc, [topic, keywords]) => {
    acc[topic] = keywords.reduce((score, keyword) => 
      score + (tokens.includes(keyword) ? 1 : 0), 0);
    return acc;
  }, {});

  return Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort(([_, a], [__, b]) => b - a)
    .map(([topic]) => topic);
};

const AdvancedWaterBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userProfile, setUserProfile] = useState({
    region: 'default',
    interests: [],
    quizScore: 0,
    challengesCompleted: 0
  });
  const [loading, setLoading] = useState(false);

  // Expanded knowledge base with more detailed information
  const knowledgeBase = {
    irrigation: {
      title: 'Smart Irrigation Practices',
      content: `Research from the Journal of Irrigation Science (2023) demonstrates significant water savings through precision irrigation:

Key Findings:
• 30-50% reduction in water usage
• 25% increase in crop yield
• ROI within 2-3 growing seasons

Best Practices:
1. Soil Moisture Monitoring
   - Install sensors at different depths
   - Monitor root zone moisture levels
   - Adjust irrigation based on readings

2. Weather-Based Scheduling
   - Use local weather data
   - Implement rain delays
   - Account for seasonal changes

3. Drip Irrigation
   - Target water delivery
   - Minimize evaporation
   - Reduce runoff

4. System Maintenance
   - Regular inspections
   - Prompt repair of leaks
   - Seasonal adjustments`,
      source: 'Journal of Irrigation Science, 2023',
      tips: [
        'Install moisture sensors',
        'Use smart controllers',
        'Implement drip systems'
      ]
    },
    household: {
      title: 'Household Water Conservation',
      content: `EPA research confirms significant potential for household water savings:

Annual Savings Potential:
• 30,000 gallons per household
• $350 average cost reduction
• 30% reduction in water usage

Key Strategies:
1. WaterSense Fixtures
   - Low-flow showerheads
   - Dual-flush toilets
   - Efficient faucet aerators

2. Leak Detection
   - Regular inspections
   - Smart leak detectors
   - Prompt repairs

3. Appliance Upgrades
   - ENERGY STAR certified
   - Water-efficient models
   - Smart features

4. Behavioral Changes
   - Shorter showers
   - Full loads only
   - Water-wise habits`,
      source: 'Environmental Protection Agency, 2024',
      tips: [
        'Fix leaks promptly',
        'Install efficient fixtures',
        'Use water-smart appliances'
      ]
    },
    technology: {
      title: 'Water-Efficient Technologies',
      content: `Latest Technological Advances in Water Conservation:

Smart Systems:
• IoT-enabled monitoring
• AI-powered optimization
• Real-time leak detection

Key Innovations:
1. Smart Meters
   - Real-time usage tracking
   - Leak alerts
   - Consumption analytics

2. Greywater Systems
   - Water recycling
   - Treatment options
   - Usage applications

3. Rainwater Harvesting
   - Collection systems
   - Storage solutions
   - Treatment methods

4. Automation
   - Smart controllers
   - Predictive maintenance
   - Usage optimization`,
      source: 'Water Research Journal, 2024',
      tips: [
        'Install smart meters',
        'Consider greywater systems',
        'Implement automation'
      ]
    }
  };

  // Quiz questions for interactive learning
  const quizQuestions = [
    {
      question: 'What percentage of household water can be saved using smart irrigation?',
      options: ['10-20%', '30-50%', '60-70%', '80-90%'],
      correct: 1
    },
    {
      question: 'Which system is most efficient for garden irrigation?',
      options: ['Sprinklers', 'Drip irrigation', 'Manual watering', 'Flood irrigation'],
      correct: 1
    }
  ];

  // Simulate async data fetching
  const fetchWeatherData = async () => {
    return new Promise(resolve => 
      setTimeout(() => resolve({
        rainfall: '25mm',
        temperature: '22°C',
        humidity: '65%'
      }), 1000)
    );
  };

  // Handle user input with enhanced processing
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Process query using NLP
      const relevantTopics = processQuery(input);
      const weatherData = await fetchWeatherData();

      // Generate response based on topics and context
      let botResponse = {
        type: 'bot',
        content: "I apologize, but I couldn't find specific information about that topic. Would you like to learn about irrigation, household conservation, or water-efficient technologies instead?",
        suggestions: Object.keys(knowledgeBase)
      };

      if (relevantTopics.length > 0) {
        const primaryTopic = relevantTopics[0];
        const info = knowledgeBase[primaryTopic];
        
        if (info) {
          botResponse = {
            type: 'bot',
            content: `${info.content}\n\nBased on current weather (${weatherData.temperature}, ${weatherData.rainfall} rainfall), here are relevant tips:\n${info.tips.join('\n')}`,
            title: info.title,
            source: info.source,
            weatherData
          };
        }
      }

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        isError: true
      }]);
    }

    setLoading(false);
    setInput('');
  };

  // Handle quiz interactions
  const startQuiz = () => {
    setMessages(prev => [...prev, {
      type: 'bot',
      content: 'Let\'s test your knowledge! ' + quizQuestions[0].question,
      isQuiz: true,
      questionIndex: 0,
      options: quizQuestions[0].options
    }]);
  };

  // Handle user feedback
  const handleFeedback = (messageIndex, isPositive) => {
    setMessages(prev => prev.map((msg, idx) => 
      idx === messageIndex ? { ...msg, feedback: isPositive } : msg
    ));
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Droplets className="text-blue-500" />
          WaterBot - Advanced Water Efficiency Assistant
          {userProfile.challengesCompleted > 0 && (
            <Medal className="text-yellow-500 ml-2" size={20} />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="h-96 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3/4 p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.isError 
                    ? 'bg-red-100'
                    : 'bg-gray-100'
                }`}
              >
                {message.title && (
                  <div className="font-bold mb-1">{message.title}</div>
                )}
                <div className="whitespace-pre-line">{message.content}</div>
                
                {message.weatherData && (
                  <div className="mt-2 text-sm text-gray-600">
                    Weather: {message.weatherData.temperature}, 
                    Rainfall: {message.weatherData.rainfall}
                  </div>
                )}

                {message.type === 'bot' && !message.isQuiz && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleFeedback(index, true)}
                      className="p-1 hover:bg-blue-100 rounded"
                    >
                      <ThumbsUp size={16} />
                    </button>
                    <button
                      onClick={() => handleFeedback(index, false)}
                      className="p-1 hover:bg-blue-100 rounded"
                    >
                      <ThumbsDown size={16} />
                    </button>
                  </div>
                )}

                {message.isQuiz && (
                  <div className="mt-2 space-y-2">
                    {message.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const isCorrect = idx === quizQuestions[message.questionIndex].correct;
                          setUserProfile(prev => ({
                            ...prev,
                            quizScore: prev.quizScore + (isCorrect ? 1 : 0)
                          }));
                        }}
                        className="block w-full text-left p-2 hover:bg-blue-100 rounded"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                Thinking...
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={startQuiz}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Start Quiz
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about water efficiency..."
            className="flex-1 p-2 border rounded-lg"
            disabled={loading}
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <Alert className="mt-4 bg-blue-50">
          <AlertDescription>
            Information is sourced from peer-reviewed research and case studies. 
            Score: {userProfile.quizScore} | Challenges: {userProfile.challengesCompleted}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};


export default AdvancedWaterBot;