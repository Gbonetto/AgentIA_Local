// src/components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { queryRAG } from '../api/api.js';
import { motion } from 'framer-motion';

export default function Chat({ conversation, updateMessages, visibleFiles }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => { setInput(''); }, [conversation]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation?.messages]);

  if (!conversation) {
    return <div className="flex-1 flex items-center justify-center text-gray-700">Sélectionne une conversation</div>;
  }

  const send = async () => {
    if (!input.trim()) return;
    const msgs = [...conversation.messages, { role: 'user', content: input }];
    updateMessages(conversation.id, msgs);
    setInput(''); setLoading(true);
    const ans = await queryRAG(input, visibleFiles);
    updateMessages(conversation.id, [...msgs, { role: 'assistant', content: ans }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100">
      <div className="flex-1 overflow-auto p-4 flex flex-col space-y-3">
        {conversation.messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`max-w-xl p-3 rounded-xl break-words text-sm shadow
              ${m.role === 'user' ? 'self-end bg-indigo-600 text-white' : 'self-start bg-white text-gray-900'}`}
          >{m.content}</motion.div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-4 border-t border-gray-300 flex">
        <input
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-900"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Pose ta question…"
        />
        <button
          onClick={send}
          disabled={loading}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-r-lg disabled:opacity-50 transition-colors"
        >{loading ? '⏳' : '▶️'}</button>
      </div>
    </div>
  );
}