import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Trash2, 
  Settings2, 
  Volume2, 
  Copy, 
  Check, 
  Zap, 
  BrainCircuit, 
  MessageSquare, 
  ShieldAlert, 
  BookOpen, 
  HeartHandshake,
  RotateCcw
} from 'lucide-react';
import { UserRole } from '../../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  isError?: boolean;
}

interface ChatRole {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  systemInstruction: string;
  badge: string;
}

const PRESET_ROLES: ChatRole[] = [
  {
    id: 'healthcare_assistant',
    name: 'Healthcare Sign Assistant',
    icon: HeartHandshake,
    description: 'Specialized in medical sign glosses, doctor-patient communication, and plain medical translation.',
    systemInstruction: 'You are BeyondSilence Healthcare Assistant, an empathetic AI specializing in medical sign language glosses, plain-language patient translation, and Deaf healthcare communication support. Always convert complex medical terms into clear 5th-grade language, provide ASL/BSL keyword glosses when relevant (e.g. [DOCTOR, TAKE, MEDICINE]), and maintain a supportive, polite tone.',
    badge: 'Medical',
  },
  {
    id: 'sign_tutor',
    name: 'ISL & ASL Sign Tutor',
    icon: BookOpen,
    description: 'Teaches Indian Sign Language (ISL) & American Sign Language (ASL) vocabulary and grammar.',
    systemInstruction: 'You are an expert Sign Language Tutor proficient in ISL (Indian Sign Language) and ASL (American Sign Language). Teach vocabulary, facial expressions, spatial grammar, and finger-spelling step-by-step with clear examples.',
    badge: 'Education',
  },
  {
    id: 'emergency_advisor',
    name: 'Emergency Triage Advisor',
    icon: ShieldAlert,
    description: 'Rapid, direct, high-priority emergency advice and visual signaling instructions.',
    systemInstruction: 'You are an Emergency Triage Assistant. Provide concise, bold, bulleted advice for urgent medical situations. Prioritize calling emergency services (911/112) immediately and using visual alert signals.',
    badge: 'Emergency',
  },
  {
    id: 'custom',
    name: 'Custom Persona',
    icon: Settings2,
    description: 'Define your own system instruction and chatbot behavior.',
    systemInstruction: 'You are a versatile AI communication assistant.',
    badge: 'Custom',
  }
];

const MODEL_OPTIONS = [
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    description: 'Recommended for general tasks & balanced multi-turn chat',
    icon: Sparkles,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    type: 'General',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    description: 'Deep reasoning for complex medical & linguistic analysis',
    icon: BrainCircuit,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    type: 'Complex Reasoning',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    description: 'Ultra-fast responses for quick questions and lookups',
    icon: Zap,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    type: 'Fast Speed',
  },
];

const SUGGESTED_PROMPTS = [
  "How do I sign 'Doctor' and 'Prescription' in ASL?",
  "Translate this doctor note into plain English: 'Patient exhibits acute hypertension'",
  "What are the top 5 essential emergency signs every nurse should know?",
  "How does spatial grammar work in Indian Sign Language (ISL)?",
];

interface ChatbotPageProps {
  userRole?: UserRole;
}

export const ChatbotPage: React.FC<ChatbotPageProps> = () => {
  const [selectedRole, setSelectedRole] = useState<ChatRole>(PRESET_ROLES[0]);
  const [customInstruction, setCustomInstruction] = useState<string>(PRESET_ROLES[0].systemInstruction);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      role: 'model',
      text: `Hello! I am your BeyondSilence Gemini AI Assistant configured as **${PRESET_ROLES[0].name}**.\n\nHow can I help you with sign language translation, doctor-patient communication, or accessible medical guidance today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleRoleSelect = (role: ChatRole) => {
    setSelectedRole(role);
    setCustomInstruction(role.systemInstruction);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Send message array to server
      const apiMessages = newHistory.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const activeInstruction = selectedRole.id === 'custom' ? customInstruction : selectedRole.systemInstruction;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          systemInstruction: activeInstruction,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to receive response from Gemini AI');
      }

      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        role: 'model',
        text: data.reply || 'No response received from AI.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chatbot error:', err);
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        role: 'model',
        text: `Sorry, I encountered an issue: ${err.message || 'Unable to connect to AI server.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear conversation history?')) {
      setMessages([
        {
          id: `welcome_${Date.now()}`,
          role: 'model',
          text: `Conversation history reset. Active persona: **${selectedRole.name}**. How can I assist you?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
        }
      ]);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#]/g, ''));
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Bot className="w-3.5 h-3.5" />
              Multi-Turn AI Studio
            </span>
            <span className="text-xs font-mono text-slate-400 font-bold">
              {selectedModel}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 tracking-tight">
            Gemini Conversational Chatbot
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Multi-turn conversation thread with specialized role system instructions & Gemini model selection.
          </p>
        </div>

        <button
          onClick={handleClearHistory}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-center border border-slate-200/80"
          title="Clear Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Thread</span>
        </button>
      </div>

      {/* Main Grid: Persona & Model Settings (Left 4 cols) + Chat Thread (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Persona & Model Selection */}
        <div className="lg:col-span-4 space-y-5">
          {/* Persona / Role Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold font-heading text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-blue-600" />
                Chatbot Role Persona
              </h3>
            </div>

            <div className="space-y-2.5">
              {PRESET_ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole.id === role.id;

                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50/80 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold font-heading truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                          {role.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
                          {role.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Instruction Box if Custom selected or preview */}
            {selectedRole.id === 'custom' && (
              <div className="space-y-1.5 pt-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  System Instruction Prompt:
                </label>
                <textarea
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none font-sans"
                  placeholder="Type custom instructions for the chatbot..."
                />
              </div>
            )}
          </div>

          {/* Model Selection */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold font-heading text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Gemini Model Engine
              </h3>
            </div>

            <div className="space-y-2.5">
              {MODEL_OPTIONS.map((m) => {
                const Icon = m.icon;
                const isSelected = selectedModel === m.id;

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-slate-900/20'
                        : 'bg-white border-slate-200/80 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold font-heading ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {m.name}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isSelected ? 'bg-slate-800 text-blue-300' : 'bg-slate-100 text-slate-600'}`}>
                          {m.type}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-snug ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {m.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Chat Thread Window */}
        <div className="lg:col-span-8 flex flex-col h-[650px] bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Thread Bar Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  {selectedRole.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Ready • Multi-turn History Saved</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600">
                {selectedModel}
              </span>
            </div>
          </div>

          {/* Scrollable Message Thread List */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                      isUser
                        ? 'bg-blue-600 text-white'
                        : msg.isError
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-900 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble Card */}
                  <div
                    className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 shadow-xs ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : msg.isError
                        ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-xs'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-3 text-[10px] font-semibold opacity-80 border-b border-black/5 pb-1">
                      <span>{isUser ? 'You' : selectedRole.name}</span>
                      <span className="font-mono">{msg.timestamp}</span>
                    </div>

                    {/* Body Text */}
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    {/* Action Bar for AI Responses */}
                    {!isUser && !msg.isError && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                        <span className="font-mono text-slate-400">
                          {msg.modelUsed || selectedModel}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSpeakText(msg.text)}
                            className="p-1 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded transition-colors cursor-pointer"
                            title="Read response aloud"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="p-1 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded transition-colors cursor-pointer flex items-center gap-1"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-xs shadow-xs text-xs font-medium text-slate-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span>Generating response with {selectedModel}...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompts Chips */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0">
              Quick Prompts:
            </span>
            {SUGGESTED_PROMPTS.map((promptText, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(promptText)}
                disabled={isLoading}
                className="text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 border border-slate-200/60"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Input Box Footer */}
          <div className="p-3 bg-white border-t border-slate-200/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask ${selectedRole.name}...`}
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-sans"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
