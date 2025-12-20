import { useState } from 'react';
import { FaCommentMedical, FaUserMd, FaBook, FaPhoneAlt, FaBrain, FaHeart, FaHandsHelping } from 'react-icons/fa';
import { GiMeditation } from 'react-icons/gi';

const MentalHealthPage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [mood, setMood] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    // Add user message
    const newMessage = { text: chatMessage, sender: 'user' as const };
    setMessages([...messages, newMessage]);
    setChatMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I hear you. Would you like to talk more about how you're feeling?",
        "That sounds difficult. You're not alone in this.",
        "Thank you for sharing. How can I support you right now?",
        "I understand this is hard. Let's work through it together."
      ];
      const botResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  const breathingExercise = () => {
    // This would be a more interactive component in a real app
    alert("Let's do a quick breathing exercise. Breathe in for 4 seconds, hold for 4, exhale for 6. Repeat 5 times.");
  };

  const emergencyContact = () => {
    if (window.confirm("Would you like to be connected to emergency services?")) {
      window.open('tel:112');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">Mental Health & Well-being</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Your emotional well-being matters. We're here to support you.</p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { 
              title: 'Chat with a Counselor', 
              icon: <FaCommentMedical className="text-3xl mb-3 text-indigo-600" />,
              onClick: () => setActiveTab('chat')
            },
            { 
              title: 'Book Psychiatrist', 
              icon: <FaUserMd className="text-3xl mb-3 text-green-600" />,
              onClick: () => setActiveTab('psychiatrist')
            },
            { 
              title: 'Self-Help Resources', 
              icon: <FaBook className="text-3xl mb-3 text-purple-600" />,
              onClick: () => setActiveTab('resources')
            },
            { 
              title: 'Emergency Help', 
              icon: <FaPhoneAlt className="text-3xl mb-3 text-red-600" />,
              onClick: emergencyContact
            },
          ].map((item, index) => (
            <div 
              key={index}
              onClick={item.onClick}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer text-center"
            >
              {item.icon}
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'chat', label: 'Chat Support', icon: <FaCommentMedical className="mr-2" /> },
                { id: 'psychiatrist', label: 'Professional Help', icon: <FaUserMd className="mr-2" /> },
                { id: 'resources', label: 'Self-Help Resources', icon: <FaBook className="mr-2" /> },
                { id: 'wellness', label: 'Wellness Tools', icon: <GiMeditation className="mr-2" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-6 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Chat Support */}
            {activeTab === 'chat' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg h-96 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 h-full flex items-center justify-center">
                      <div>
                        <p className="text-lg mb-2">Welcome to our support chat</p>
                        <p className="text-sm">How are you feeling today?</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === 'user' 
                              ? 'bg-indigo-600 text-white rounded-br-none' 
                              : 'bg-gray-200 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Send
                  </button>
                </form>
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Quick mood check:</h3>
                  <div className="flex flex-wrap gap-2">
                    {['😊 Good', '😐 Okay', '😕 Stressed', '😔 Sad', '😖 Anxious'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={`px-3 py-1 rounded-full text-sm ${mood === m ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Psychiatrist Support */}
            {activeTab === 'psychiatrist' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Professional Mental Health Support</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <FaUserMd className="mr-2 text-indigo-600" />
                      Book a Session
                    </h3>
                    <p className="text-gray-600 mb-4">Schedule a consultation with a licensed mental health professional.</p>
                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                      Find a Psychiatrist
                    </button>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <FaHandsHelping className="mr-2 text-green-600" />
                      Emergency Support
                    </h3>
                    <p className="text-gray-600 mb-4">Immediate help is available 24/7.</p>
                    <button 
                      onClick={emergencyContact}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <FaPhoneAlt className="mr-2" /> Emergency Helpline
                    </button>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Our Network of Professionals</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl mr-4">
                            Dr. {String.fromCharCode(64 + item)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">Dr. {String.fromCharCode(64 + item)}. Smith</h4>
                            <p className="text-sm text-gray-500">Clinical Psychologist • 10+ years experience</p>
                          </div>
                          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                            Book Session
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Self-Help Resources */}
            {activeTab === 'resources' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Self-Help Resources</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <FaBrain className="text-indigo-600 text-xl" />
                        </div>
                        <h3 className="text-lg font-semibold">Understanding Anxiety</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Learn about anxiety disorders, symptoms, and coping strategies.</p>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Read Article →
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <FaHeart className="text-green-600 text-xl" />
                        </div>
                        <h3 className="text-lg font-semibold">Healing from Trauma</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Resources for survivors of trauma and abuse.</p>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Explore Resources →
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Daily Mental Health Tips</h3>
                  <div className="space-y-3">
                    {[
                      "Practice deep breathing for 5 minutes when feeling overwhelmed.",
                      "Write down three things you're grateful for each day.",
                      "Take short breaks every hour if you're working for long periods.",
                      "Reach out to a friend or family member for support.",
                      "Remember that it's okay to ask for professional help when needed."
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start">
                        <div className="bg-indigo-100 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Wellness Tools */}
            {activeTab === 'wellness' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Wellness Tools</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div 
                    onClick={breathingExercise}
                    className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl cursor-pointer hover:shadow-md transition-shadow border border-indigo-100"
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <GiMeditation className="text-indigo-600 text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold">Guided Breathing</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Follow along with our guided breathing exercise to reduce stress and anxiety.</p>
                    <div className="text-indigo-600 text-sm font-medium">
                      Start Exercise →
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                    <div className="flex items-center mb-3">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <FaHeart className="text-green-600 text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold">Mood Tracker</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Track your mood over time to identify patterns and triggers.</p>
                    <div className="flex gap-2">
                      {['😊', '😐', '😕', '😔', '😖'].map((emoji) => (
                        <button 
                          key={emoji}
                          onClick={() => alert(`Thanks for sharing! Your mood (${emoji}) has been recorded.`)}
                          className="text-2xl hover:scale-110 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Relaxation Techniques</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "5-4-3-2-1 Grounding",
                        desc: "Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste."
                      },
                      {
                        title: "Progressive Muscle Relaxation",
                        desc: "Tense each muscle group for 5 seconds, then release. Start from your toes and work up to your head."
                      },
                      {
                        title: "Guided Imagery",
                        desc: "Close your eyes and imagine a peaceful place. Engage all your senses to make it feel real."
                      }
                    ].map((item, i) => (
                      <div key={i} className="border-l-4 border-indigo-200 pl-4 py-1">
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Emergency Banner - Sticky at bottom */}
        <div className="fixed bottom-4 right-4">
          <button 
            onClick={emergencyContact}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center font-medium animate-pulse"
          >
            <FaPhoneAlt className="mr-2" /> Emergency SOS
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthPage;
