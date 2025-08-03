// src/components/FileDrawer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import FileManager from './FileManager.jsx';

export default function FileDrawer({ open, onClose, files, visibleFiles, setVisibleFiles, setFiles }) {
  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: open ? '0%' : '-100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">File Manager</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700" title="Fermer">✕</button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <FileManager
          files={files}
          visibleFiles={visibleFiles}
          setVisibleFiles={setVisibleFiles}
          setFiles={setFiles}
        />
      </div>
      <div className="p-4 border-t border-gray-200 flex space-x-2">
        <button
          onClick={() => setVisibleFiles(files.map(f => f.name))}
          className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
        >Tout cocher</button>
        <button
          onClick={() => setVisibleFiles([])}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >Tout décocher</button>
      </div>
    </motion.div>
  );
}