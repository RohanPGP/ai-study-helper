import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useChatContext } from '../contexts/ChatContext';
import { api } from '../utils/api';
import PulserIcon from './PulserIcon';

export default function ChatWidget() {
  const { user } = useAuth();
  const { studyPackContext } = useChatContext();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, loading]);

  if (!user) return null;

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const data = await api.chat(text, newMessages.slice(0, -1), studyPackContext);
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      const limited = err?.status === 429 || /too quickly/i.test(err?.message || '');
      setMessages([...newMessages, { role: 'assistant', content: limited ? "You're sending messages too quickly — give it a few minutes!" : "Sorry, I couldn't respond right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-label="Open Pulser chat">
        <span className="chat-fab-ring" />
        {open ? '✕' : <PulserIcon size={26} />}
      </button>
      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <strong style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PulserIcon size={22} /> Pulser
            </strong>
            {studyPackContext && <span className="chat-context-badge">Viewing: {studyPackContext.title}</span>}
          </div>
          <div className="chat-panel-messages">
            {messages.length === 0 && (
              <div className="chat-empty-hint">Hi, I'm Pulser! Ask me anything about your homework, or how to use TutorPulseAI.</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble chat-bubble-${m.role}`}>{m.content}</div>
            ))}
            {loading && (
              <div className="chat-bubble chat-bubble-assistant chat-bubble-loading">
                <span className="typing-dots"><span /><span /><span /></span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="chat-panel-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Pulser…"
              rows={1}
            />
            <button onClick={send} disabled={loading || !input.trim()}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
