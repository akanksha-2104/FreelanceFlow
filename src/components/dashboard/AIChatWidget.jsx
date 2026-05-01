import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../services/aiService';

export default function AIChatWidget() {

    const [isOpen,   setIsOpen]   = useState(false);
    const [messages, setMessages] = useState([
        {
            role:    'assistant',
            content: 'Hi! I am your FreelanceFlow AI assistant. ' +
                     'Ask me anything about your projects, ' +
                     'invoices, or revenue.',
        },
    ]);
    const [input,    setInput]    = useState('');
    const [loading,  setLoading]  = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef       = useRef(null);

    // auto-scroll to latest message
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }, [messages, isOpen]);

    // focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        // add user message immediately
        const userMsg = { role: 'user', content: trimmed };
        const updated = [...messages, userMsg];
        setMessages(updated);
        setInput('');
        setLoading(true);

        try {
            // send to backend — exclude the first greeting
            // from history (it is not a real conversation turn)
            const history = updated
                .slice(1)                          // skip greeting
                .slice(-6)                         // last 6 messages
                .map(m => ({
                    role:    m.role,
                    content: m.content,
                }));

            const response = await sendChatMessage(trimmed, history);

            setMessages(prev => [
                ...prev,
                {
                    role:    'assistant',
                    content: response.reply,
                },
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    role:    'assistant',
                    content: 'Something went wrong. Please try again.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClear = () => {
        setMessages([
            {
                role:    'assistant',
                content: 'Chat cleared. How can I help you?',
            },
        ]);
    };

    // ── Suggested questions ──────────────────────────────────
    const suggestions = [
        'Which client owes me money?',
        'What is my revenue this month?',
        'Which project has the most hours?',
        'Do I have overdue invoices?',
    ];

    const handleSuggestion = (text) => {
        setInput(text);
        inputRef.current?.focus();
    };

    return (
        <>
            {/* ── Chat toggle button ── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position:     'fixed',
                    bottom:       '24px',
                    left:        '30px',
                    width:        '60px',
                    height:       '60px',
                    borderRadius: '50%',
                    background:   '#BDDDFC',
                    border:       'none',
                    color:        'black',
                    fontSize:     '24px',
                    cursor:       'pointer',
                    boxShadow:    '0 4px 12px rgba(0,0,0,0.25)',
                    zIndex:       1000,
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    transition:   'transform 0.2s',
                }}
                title="AI Assistant"
            >
                {isOpen ? '×' : '🤖'}
            </button>

            {/* ── Chat window ── */}
            {isOpen && (
                <div
                    style={{
                        position:     'fixed',
                        bottom:       '90px',
                        left:        '24px',
                        width:        '360px',
                        height:       '500px',
                        background:   'white',
                        borderRadius: '16px',
                        boxShadow:    '0 8px 32px rgba(0,0,0,0.18)',
                        display:      'flex',
                        flexDirection: 'column',
                        zIndex:       999,
                        overflow:     'hidden',
                        border:       '1px solid #e0e0e0',
                    }}
                >
                    {/* ── Header ── */}
                    <div
                        style={{
                            background:  '#1A56DB',
                            padding:     '14px 16px',
                            display:     'flex',
                            alignItems:  'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div style={{
                            display:    'flex',
                            alignItems: 'center',
                            gap:        '8px',
                        }}>
                            <span style={{ fontSize: '20px' }}>🤖</span>
                            <div>
                                <div style={{
                                    color:      'white',
                                    fontWeight: '600',
                                    fontSize:   '14px',
                                }}>
                                    FreelanceFlow AI
                                </div>
                                <div style={{
                                    color:    'rgba(255,255,255,0.75)',
                                    fontSize: '11px',
                                }}>
                                    Your business assistant
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleClear}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border:     'none',
                                color:      'white',
                                fontSize:   '11px',
                                padding:    '4px 8px',
                                borderRadius: '6px',
                                cursor:     'pointer',
                            }}
                            title="Clear chat"
                        >
                            Clear
                        </button>
                    </div>

                    {/* ── Messages area ── */}
                    <div
                        style={{
                            flex:       1,
                            overflowY:  'auto',
                            padding:    '12px',
                            display:    'flex',
                            flexDirection: 'column',
                            gap:        '10px',
                            background: '#f8f9fa',
                        }}
                    >
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display:       'flex',
                                    justifyContent: msg.role === 'user'
                                        ? 'flex-end'
                                        : 'flex-start',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth:     '80%',
                                        padding:      '10px 14px',
                                        borderRadius: msg.role === 'user'
                                            ? '18px 18px 4px 18px'
                                            : '18px 18px 18px 4px',
                                        background:  msg.role === 'user'
                                            ? '#1A56DB'
                                            : 'white',
                                        color:       msg.role === 'user'
                                            ? 'white'
                                            : '#1a1a1a',
                                        fontSize:    '13px',
                                        lineHeight:  '1.5',
                                        boxShadow:   '0 1px 3px rgba(0,0,0,0.08)',
                                        whiteSpace:  'pre-wrap',
                                        wordBreak:   'break-word',
                                    }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Loading dots */}
                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div
                                    style={{
                                        background:   'white',
                                        borderRadius: '18px 18px 18px 4px',
                                        padding:      '12px 16px',
                                        boxShadow:    '0 1px 3px rgba(0,0,0,0.08)',
                                        display:      'flex',
                                        gap:          '4px',
                                        alignItems:   'center',
                                    }}
                                >
                                    {[0, 1, 2].map(i => (
                                        <div
                                            key={i}
                                            style={{
                                                width:       '7px',
                                                height:      '7px',
                                                borderRadius: '50%',
                                                background:  '#1A56DB',
                                                animation:   `bounce 1s infinite`,
                                                animationDelay: `${i * 0.15}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* ── Suggestions (show when only greeting) ── */}
                    {messages.length === 1 && (
                        <div style={{
                            padding:    '8px 12px',
                            background: 'white',
                            borderTop:  '1px solid #f0f0f0',
                            display:    'flex',
                            flexWrap:   'wrap',
                            gap:        '6px',
                        }}>
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestion(s)}
                                    style={{
                                        background:   '#EFF6FF',
                                        border:       '1px solid #BFDBFE',
                                        borderRadius: '12px',
                                        padding:      '4px 10px',
                                        fontSize:     '11px',
                                        color:        '#1D4ED8',
                                        cursor:       'pointer',
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* ── Input area ── */}
                    <div
                        style={{
                            padding:    '12px',
                            background: 'white',
                            borderTop:  '1px solid #f0f0f0',
                            display:    'flex',
                            gap:        '8px',
                            alignItems: 'flex-end',
                        }}
                    >
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about your projects, revenue..."
                            rows={1}
                            style={{
                                flex:        1,
                                border:      '1.5px solid #e0e0e0',
                                borderRadius: '10px',
                                padding:     '8px 12px',
                                fontSize:    '13px',
                                resize:      'none',
                                outline:     'none',
                                fontFamily:  'inherit',
                                lineHeight:  '1.4',
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = '#1A56DB';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = '#e0e0e0';
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            style={{
                                background:   loading || !input.trim()
                                    ? '#94a3b8'
                                    : '#1A56DB',
                                border:       'none',
                                borderRadius: '10px',
                                color:        'white',
                                padding:      '8px 14px',
                                cursor:       loading || !input.trim()
                                    ? 'not-allowed'
                                    : 'pointer',
                                fontSize:     '14px',
                                transition:   'background 0.2s',
                                whiteSpace:   'nowrap',
                            }}
                        >
                            {loading ? '...' : 'Send'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Bounce animation ── */}
            <style>{`
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30%           { transform: translateY(-5px); }
                }
            `}</style>
        </>
    );
}