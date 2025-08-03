// src/components/Sidebar.jsx
import React, { useState } from 'react';
import ChatIcon from '../icons/ChatIcon.jsx';
import ArchiveIcon from '../icons/ArchiveIcon.jsx';
import TrashIcon from '../icons/TrashIcon.jsx';
import FileIcon from '../icons/FileIcon.jsx';
import FileDrawer from './FileDrawer.jsx';

export default function Sidebar({
  conversations, activeId, onNew, onSelect, onDelete, onArchive,
  files, visibleFiles, setVisibleFiles, setFiles
}) {
  const [viewArchived, setViewArchived] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const list = conversations.filter(c => c.archived === viewArchived);

  return (
    <>
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Conversations</h2>
          <button onClick={onNew} className="text-indigo-600 hover:text-indigo-800" title="Nouvelle conversation">+</button>
        </div>
        <div className="px-4 mb-2 text-sm">
          <button
            onClick={() => setViewArchived(false)}
            className={`${!viewArchived ? 'text-indigo-600 font-bold' : 'text-gray-700'} mr-3`}
          >Actives</button>
          <button
            onClick={() => setViewArchived(true)}
            className={`${viewArchived ? 'text-indigo-600 font-bold' : 'text-gray-700'}`}
          >Archives</button>
        </div>
        <div className="flex-1 overflow-auto">
          {list.map(c => (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-indigo-50 transition-shadow ${c.id === activeId ? 'bg-indigo-100 shadow' : ''}`}
            >
              <span className="truncate text-gray-800">{c.title}</span>
              <div className="flex space-x-2">
                <button
                  onClick={e => { e.stopPropagation(); onArchive(c.id); }}
                  title="Archiver"
                >
                  <ArchiveIcon className="w-5 h-5 text-gray-600 hover:text-indigo-600" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(c.id); }}
                  title="Supprimer"
                >
                  <TrashIcon className="w-5 h-5 text-red-600 hover:text-red-800" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setDrawerOpen(o => !o)}
            className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
            title="Gérer les fichiers"
          >
            <FileIcon className="w-5 h-5 mr-2 text-gray-700" />
            <span className="text-gray-800">Fichiers</span>
          </button>
        </div>
      </div>
      <FileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        files={files}
        visibleFiles={visibleFiles}
        setVisibleFiles={setVisibleFiles}
        setFiles={setFiles}
      />
    </>
  );
}