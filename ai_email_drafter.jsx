import { useState, useRef, useEffect } from "react";

const CHIPS = [
  { icon: "📋", label: "Follow-up email" },
  { icon: "🤝", label: "Job application" },
  { icon: "😔", label: "Apology email" },
  { icon: "🎉", label: "Thank you note" },
  { icon: "❌", label: "Decline invitation" },
  { icon: "💼", label: "Meeting request" },
];

const SYSTEM_PROMPT = `You are an expert email drafting assistant. When a user describes an email they need, draft it professionally.

Always respond with a JSON object ONLY (no markdown, no extra text) in this exact format:
{
  "reply": "A brief friendly message acknowledging the request and mentioning the tone/style chosen",
  "to": "Suggested recipient description (e.g. 'Hiring Manager' or 'Client Name') or empty string",
  "subject": "Email subject line",
  "body": "Full email body with proper greeting, paragraphs, and sign-off. Use \\n for line breaks."
}

Make the email natural, well-structured, and appropriate for the described context.`;

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I'm your AI email drafting assistant. Just describe the email you need — who it's for, what it's about, and the tone you want — and I'll draft it instantly.\n\nTry: \"Write a follow-up email to a client who hasn't responded in a week\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: msg }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      let parsed;
      try {
        parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      } catch {
        parsed = { reply: raw, subject: "Draft Email", body: raw, to: "" };
      }
      setMessages((prev) => [...prev, { role: "ai", text: parsed.reply || "Here is your drafted email!" }]);
      setEmail(parsed);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyEmail = () => {
    if (!email) return;
    const text = `To: ${email.to || "[Recipient]"}\nSubject: ${email.subject}\n\n${email.body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: "#f5f0e8", color: "#1a1a2e", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#1a1a2e", color: "#f5f0e8", padding: "14px 24px", display: "flex", alignItems: "center", gap: 12, borderBottom: "3px solid #c4492a", flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, background: "#c4492a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✉</div>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, letterSpacing: "0.02em" }}>AI Email Drafter</span>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#8a8070", marginLeft: "auto", opacity: 0.7 }}>made by han han</span>
      </div>

      {/* Main */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Chat Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid #d4cec0", background: "#f9f5ee", minWidth: 0 }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: m.role === "ai" ? "#1a1a2e" : "#c4492a", color: m.role === "ai" ? "#f5f0e8" : "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginTop: 2 }}>
                  {m.role === "ai" ? "✦" : "U"}
                </div>
                <div style={{
                  maxWidth: "78%", padding: "10px 14px", fontSize: 13.5, lineHeight: 1.6,
                  background: m.role === "ai" ? "#fdfaf5" : "#1a1a2e",
                  color: m.role === "ai" ? "#1a1a2e" : "#f5f0e8",
                  border: m.role === "ai" ? "1px solid #d4cec0" : "none",
                  borderLeft: m.role === "ai" ? "3px solid #2a6b8a" : "none",
                  borderRadius: m.role === "ai" ? "0 8px 8px 8px" : "8px 0 8px 8px",
                  fontFamily: m.role === "user" ? "monospace" : "inherit",
                  whiteSpace: "pre-wrap",
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1a1a2e", color: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>✦</div>
                <div style={{ padding: "14px", background: "#fdfaf5", border: "1px solid #d4cec0", borderLeft: "3px solid #2a6b8a", borderRadius: "0 8px 8px 8px", display: "flex", gap: 4 }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{ width: 6, height: 6, background: "#8a8070", borderRadius: "50%", animation: `bounce 1.2s ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, padding: "10px 16px", borderTop: "1px solid #d4cec0", background: "#ede8dc" }}>
            {CHIPS.map((c, i) => (
              <button key={i} onClick={() => sendMessage(`Write a ${c.label.toLowerCase()} for me`)}
                style={{ background: "#fdfaf5", border: "1px solid #d4cec0", borderRadius: 20, padding: "5px 12px", fontSize: 11.5, fontFamily: "monospace", color: "#8a8070", cursor: "pointer", whiteSpace: "nowrap" }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "14px 16px", borderTop: "1px solid #d4cec0", background: "#fdfaf5", display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Describe the email you need…" rows={2}
              style={{ flex: 1, border: "1px solid #d4cec0", background: "#f5f0e8", padding: "10px 12px", fontFamily: "inherit", fontSize: 13.5, color: "#1a1a2e", resize: "none", borderRadius: 4, outline: "none", maxHeight: 100, lineHeight: 1.5 }} />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              style={{ background: loading || !input.trim() ? "#8a8070" : "#c4492a", color: "white", border: "none", borderRadius: 4, padding: "10px 18px", fontFamily: "monospace", fontSize: 12, fontWeight: 500, cursor: loading || !input.trim() ? "not-allowed" : "pointer", letterSpacing: "0.05em", flexShrink: 0 }}>
              SEND →
            </button>
          </div>
        </div>

        {/* Email Preview Panel */}
        <div style={{ width: 400, display: "flex", flexDirection: "column", background: "#fdfaf5", flexShrink: 0 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #d4cec0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ede8dc" }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a8070" }}>✉ Draft Preview</span>
            <button onClick={copyEmail} disabled={!email}
              style={{ background: "none", border: "1px solid #d4cec0", borderRadius: 3, padding: "4px 10px", fontFamily: "monospace", fontSize: 10, color: copied ? "#2a6b8a" : "#8a8070", cursor: email ? "pointer" : "not-allowed", letterSpacing: "0.05em" }}>
              {copied ? "✓ COPIED" : "COPY ALL"}
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
            {!email ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: "#8a8070", textAlign: "center" }}>
                <div style={{ fontSize: 40, opacity: 0.4 }}>📝</div>
                <p style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.7, maxWidth: 240 }}>Your drafted email will appear here once you describe what you need in the chat.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {email.to && (
                  <div style={{ padding: "10px 0", borderBottom: "1px solid #d4cec0", display: "flex", gap: 10, fontSize: 13 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 500, color: "#8a8070", width: 55, flexShrink: 0, paddingTop: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>To</span>
                    <span style={{ color: "#1a1a2e", lineHeight: 1.5, fontSize: 13, fontWeight: 500 }}>{email.to}</span>
                  </div>
                )}
                <div style={{ padding: "10px 0", borderBottom: "1px solid #d4cec0", display: "flex", gap: 10 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 500, color: "#8a8070", width: 55, flexShrink: 0, paddingTop: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject</span>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{email.subject}</span>
                </div>
                <div style={{ padding: "18px 0", whiteSpace: "pre-wrap", lineHeight: 1.75, fontSize: 13.5, color: "#1a1a2e" }}>{email.body}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
