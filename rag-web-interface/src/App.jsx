// src/App.jsx
import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Chat from './components/Chat.jsx';
import './index.css';

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [files, setFiles] = useState([]);
  const [visibleFiles, setVisibleFiles] = useState([]);

  const newConversation = () => {
    const id = conversations.length + 1;
    const conv = { id, title: `Conversation ${id}`, messages: [], archived: false };
    setConversations([conv, ...conversations]);
    setActiveId(id);
  };

  const deleteConversation = (id) => {
    setConversations(conversations.filter(c => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const toggleArchive = (id) => {
    setConversations(conversations.map(c => c.id === id ? { ...c, archived: !c.archived } : c));
    if (activeId === id) setActiveId(null);
  };

  const updateMessages = (id, messages) => {
    setConversations(conversations.map(c => c.id === id ? { ...c, messages } : c));
  };

  const activeConv = conversations.find(c => c.id === activeId);

  return (
    <div className="flex h-screen">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onNew={newConversation}
        onSelect={setActiveId}
        onDelete={deleteConversation}
        onArchive={toggleArchive}
        files={files}
        visibleFiles={visibleFiles}
        setVisibleFiles={setVisibleFiles}
        setFiles={setFiles}
      />
      <Chat
        conversation={activeConv}
        updateMessages={updateMessages}
        visibleFiles={visibleFiles}
      />
    </div>
  );
}