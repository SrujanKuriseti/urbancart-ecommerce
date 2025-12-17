import React, { useState, useRef, useEffect } from "react";

const faqData = [
  {
    question: "How do I track my order?",
    keywords: ["track", "tracking", "where is my order"],
    answer:
      "You can track your order from the 'Orders' page after logging in. Go to Orders to see status and details.",
  },
  {
    question: "What is your return policy?",
    keywords: ["return", "refund", "exchange"],
    answer:
      "You can return most items within 30 days of delivery as long as they are in original condition. Contact support for a return label.",
  },
  {
    question: "How long does shipping take?",
    keywords: ["shipping", "delivery", "ship", "arrive"],
    answer:
      "Standard shipping usually takes 3–7 business days depending on your location. Express options may be available at checkout.",
  },
  {
    question: "Do I need an account to order?",
    keywords: ["account", "guest", "login", "register"],
    answer:
      "You can browse products without an account, but you need to register or log in to place orders and track them.",
  },
  {
    question: "What payment methods do you accept?",
    keywords: ["payment", "pay", "card", "credit", "debit"],
    answer:
      "We accept major credit and debit cards. Your payment is processed securely and we do not store full card details.",
  },
  {
    question: "How do I contact support?",
    keywords: ["support", "help", "contact", "issue", "problem"],
    answer:
      "You can use this chatbot for quick answers, or email our support team using the contact form in the footer.",
  },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! 👋 I’m your UrbanCart assistant. Ask me about orders, returns, shipping, or payments.",
    },
  ]);

  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const findAnswer = (text) => {
    const lower = text.toLowerCase();
    for (const faq of faqData) {
      if (faq.keywords.some((k) => lower.includes(k))) {
        return faq.answer;
      }
    }
    return "Sorry, I’m not sure about that yet. Try asking about orders, returns, shipping, or payments.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { from: "user", text: trimmed };
    const botReply = { from: "bot", text: findAnswer(trimmed) };

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          cursor: "pointer",
          zIndex: 9999,
          fontSize: "1.5rem",
        }}
        aria-label="Open help chat"
      >
        {isOpen ? "×" : "?"}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            right: "24px",
            bottom: "96px",
            width: "320px",
            maxHeight: "420px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9998,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
            }}
          >
            <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>
              Need help?
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                opacity: 0.9,
                marginTop: 2,
              }}
            >
              Ask a quick question about your shopping
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px 12px",
              overflowY: "auto",
              background: "#f9fafb",
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "8px 10px",
                    borderRadius: 12,
                    fontSize: "0.85rem",
                    lineHeight: 1.35,
                    background: m.from === "user" ? "#3498db" : "#e5e7eb",
                    color: m.from === "user" ? "#fff" : "#111827",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            style={{
              display: "flex",
              padding: "8px",
              borderTop: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              style={{
                flex: 1,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                padding: "6px 10px",
                fontSize: "0.85rem",
                outline: "none",
                marginRight: 6,
              }}
            />
            <button
              type="submit"
              style={{
                background: "#3498db",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "6px 12px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
