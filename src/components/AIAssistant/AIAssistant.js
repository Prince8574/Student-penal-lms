import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const CatScene = () => (
  <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">

    {/* ── Laptop screen (open, side view) ── */}
    <rect x="55" y="30" width="70" height="48" rx="4" fill="#1a1a3a" stroke="#6c63ff" strokeWidth="1.5" strokeOpacity="0.8"/>
    <rect x="59" y="34" width="62" height="38" rx="2" fill="#0d0d2a"/>
    {/* screen glow */}
    <rect x="59" y="34" width="62" height="38" rx="2" fill="#6c63ff" fillOpacity="0.12"/>
    {/* typing lines */}
    <rect x="63" y="39" width="32" height="2" rx="1" fill="#a78bfa" fillOpacity="0.8">
      <animate attributeName="width" values="32;46;22;38;32" dur="1.8s" repeatCount="indefinite"/>
    </rect>
    <rect x="63" y="44" width="44" height="2" rx="1" fill="#48cfad" fillOpacity="0.6">
      <animate attributeName="width" values="44;28;50;36;44" dur="2.2s" repeatCount="indefinite"/>
    </rect>
    <rect x="63" y="49" width="26" height="2" rx="1" fill="#a78bfa" fillOpacity="0.5">
      <animate attributeName="width" values="26;40;18;32;26" dur="1.6s" repeatCount="indefinite"/>
    </rect>
    <rect x="63" y="54" width="38" height="2" rx="1" fill="#48cfad" fillOpacity="0.4">
      <animate attributeName="width" values="38;22;44;30;38" dur="2s" repeatCount="indefinite"/>
    </rect>
    {/* cursor */}
    <rect x="63" y="59" width="2" height="8" rx="1" fill="#a78bfa">
      <animate attributeName="opacity" values="1;0;1" dur="0.9s" repeatCount="indefinite"/>
    </rect>
    {/* laptop hinge + base */}
    <rect x="50" y="76" width="80" height="6" rx="3" fill="#2a2a4a" stroke="#6c63ff" strokeWidth="1" strokeOpacity="0.5"/>

    {/* ── Cat sitting (side view) ── */}
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="2.8s" repeatCount="indefinite"/>

      {/* Body */}
      <ellipse cx="30" cy="62" rx="18" ry="22" fill="#c084fc"/>

      {/* Head */}
      <circle cx="30" cy="32" r="16" fill="#c084fc"/>

      {/* Ears */}
      <polygon points="18,20 14,6 26,18" fill="#c084fc"/>
      <polygon points="42,20 46,6 34,18" fill="#c084fc"/>
      {/* inner ears */}
      <polygon points="19,19 16,9 25,18" fill="#f9a8d4" fillOpacity="0.8"/>
      <polygon points="41,19 44,9 35,18" fill="#f9a8d4" fillOpacity="0.8"/>

      {/* Face */}
      {/* left eye */}
      <ellipse cx="24" cy="29" rx="4" ry="4.5" fill="white"/>
      <circle cx="24" cy="29" r="2.5" fill="#1e1b4b"/>
      <circle cx="25" cy="28" r="1" fill="white"/>
      {/* blink */}
      <ellipse cx="24" cy="29" rx="4" ry="4.5" fill="#c084fc" fillOpacity="0">
        <animate attributeName="ry" values="4.5;0.3;4.5" dur="4s" repeatCount="indefinite" begin="1.5s"/>
        <animate attributeName="fillOpacity" values="0;1;0" dur="4s" repeatCount="indefinite" begin="1.5s"/>
      </ellipse>

      {/* right eye */}
      <ellipse cx="36" cy="29" rx="4" ry="4.5" fill="white"/>
      <circle cx="36" cy="29" r="2.5" fill="#1e1b4b"/>
      <circle cx="37" cy="28" r="1" fill="white"/>
      {/* blink */}
      <ellipse cx="36" cy="29" rx="4" ry="4.5" fill="#c084fc" fillOpacity="0">
        <animate attributeName="ry" values="4.5;0.3;4.5" dur="4s" repeatCount="indefinite" begin="1.5s"/>
        <animate attributeName="fillOpacity" values="0;1;0" dur="4s" repeatCount="indefinite" begin="1.5s"/>
      </ellipse>

      {/* nose */}
      <polygon points="30,34 28,36 32,36" fill="#f9a8d4"/>
      {/* mouth */}
      <path d="M28 36 Q30 39 32 36" stroke="#f9a8d4" strokeWidth="1.2" fill="none" strokeLinecap="round"/>

      {/* cheeks */}
      <ellipse cx="19" cy="34" rx="4" ry="2.5" fill="#f9a8d4" fillOpacity="0.35"/>
      <ellipse cx="41" cy="34" rx="4" ry="2.5" fill="#f9a8d4" fillOpacity="0.35"/>

      {/* whiskers left */}
      <line x1="6" y1="32" x2="22" y2="34" stroke="white" strokeWidth="0.8" strokeOpacity="0.7"/>
      <line x1="6" y1="36" x2="22" y2="36" stroke="white" strokeWidth="0.8" strokeOpacity="0.7"/>
      {/* whiskers right */}
      <line x1="54" y1="32" x2="38" y2="34" stroke="white" strokeWidth="0.8" strokeOpacity="0.7"/>
      <line x1="54" y1="36" x2="38" y2="36" stroke="white" strokeWidth="0.8" strokeOpacity="0.7"/>

      {/* neck */}
      <rect x="24" y="46" width="12" height="8" rx="4" fill="#c084fc"/>

      {/* front paws */}
      <ellipse cx="20" cy="84" rx="8" ry="5" fill="#d8b4fe"/>
      <ellipse cx="40" cy="84" rx="8" ry="5" fill="#d8b4fe"/>
      {/* paw toes */}
      <circle cx="17" cy="83" r="2" fill="#c084fc"/>
      <circle cx="20" cy="82" r="2" fill="#c084fc"/>
      <circle cx="23" cy="83" r="2" fill="#c084fc"/>
      <circle cx="37" cy="83" r="2" fill="#c084fc"/>
      <circle cx="40" cy="82" r="2" fill="#c084fc"/>
      <circle cx="43" cy="83" r="2" fill="#c084fc"/>

      {/* tail — wagging */}
      <path d="M46 72 Q62 68 72 58 Q80 50 76 42" stroke="#c084fc" strokeWidth="7" strokeLinecap="round" fill="none">
        <animate attributeName="d"
          values="M46 72 Q62 68 72 58 Q80 50 76 42;M46 72 Q64 72 76 64 Q86 56 82 46;M46 72 Q60 64 68 52 Q74 44 70 36;M46 72 Q62 68 72 58 Q80 50 76 42"
          dur="1.2s" repeatCount="indefinite"/>
      </path>
      {/* tail tip */}
      <circle cx="76" cy="42" r="6" fill="#e9d5ff">
        <animate attributeName="cx" values="76;82;70;76" dur="1.2s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="42;46;36;42" dur="1.2s" repeatCount="indefinite"/>
      </circle>
    </g>
  </svg>
);

const SmallCatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="55" rx="28" ry="24" fill="#a78bfa"/>
    <polygon points="30,36 24,18 42,32" fill="#a78bfa"/>
    <polygon points="70,36 76,18 58,32" fill="#a78bfa"/>
    <polygon points="31,35 26,22 40,32" fill="#ff9eb5" fillOpacity="0.8"/>
    <polygon points="69,35 74,22 60,32" fill="#ff9eb5" fillOpacity="0.8"/>
    <circle cx="42" cy="50" r="5" fill="white"/>
    <circle cx="42" cy="50" r="3" fill="#2a1a6e"/>
    <circle cx="58" cy="50" r="5" fill="white"/>
    <circle cx="58" cy="50" r="3" fill="#2a1a6e"/>
    <polygon points="50,58 47,61 53,61" fill="#ff9eb5"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your LearnVerse AI assistant. Ask me anything about your courses, assignments, or any topic you're studying." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Please login first to use AI assistant.' }]);
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: updatedMessages.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.success ? data.reply : `Sorry, something went wrong: ${data.message}`
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please check your connection.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat cleared. How can I help you?' }]);
  };

  return (
    <>
      {open && (
        <div className="ai-container">
          <div className="ai-cat-outside">
            <CatScene />
          </div>
          <div className="ai-window">
            <div className="ai-header">
              <div className="ai-header-left">
                <div className="ai-avatar">
                  <SmallCatIcon />
                  <span className="ai-status-dot" />
                </div>
                <div>
                  <div className="ai-title">AI Assistant</div>
                  <div className="ai-subtitle">Powered by Groq</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className="ai-clear-btn" onClick={clearChat}>Clear</button>
                <button className="ai-close-btn" onClick={() => setOpen(false)}><CloseIcon /></button>
              </div>
            </div>

            <div className="ai-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`ai-msg ${msg.role}`}>{msg.content}</div>
              ))}
              {loading && <div className="ai-msg assistant typing">Thinking...</div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="ai-input-row">
              <textarea
                ref={inputRef}
                className="ai-input"
                placeholder="Ask anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button className="ai-send-btn" onClick={sendMessage} disabled={!input.trim() || loading}>
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="ai-fab" onClick={() => setOpen(o => !o)} title="AI Assistant">
        <CatScene />
      </button>
    </>
  );
}
