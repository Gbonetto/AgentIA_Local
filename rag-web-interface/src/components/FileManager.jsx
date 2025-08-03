// src/components/FileManager.jsx
import React, { useRef } from 'react';
import FolderIcon from '../icons/FolderIcon.jsx';
import TrashIcon from '../icons/TrashIcon.jsx';

export default function FileManager({ files, visibleFiles, setVisibleFiles, setFiles }) {
  const inputRef = useRef();
  const handleAdd = () => {
    const selected = Array.from(inputRef.current.files);
    setFiles(prev => [...prev, ...selected.map(f => ({ name: f.name, file: f }))]);
  };
  const toggle = name => {
    setVisibleFiles(v => v.includes(name) ? v.filter(x => x !== name) : [...v, name]);
  };
  const remove = name => {
    setFiles(f => f.filter(x => x.name !== name));
    setVisibleFiles(v => v.filter(x => x !== name));
  };

  return (
    <div>
      <input type="file" multiple ref={inputRef} className="hidden" id="file-input" onChange={handleAdd} />
      <label htmlFor="file-input" className="cursor-pointer text-sm text-gray-700 hover:text-indigo-600 mb-3 inline-block">+ Ajouter fichiers</label>
      {files.map((f, i) => (
        <div key={i} className="flex items-center justify-between mb-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={visibleFiles.includes(f.name)} onChange={() => toggle(f.name)} />
            <FolderIcon className="w-4 h-4 text-gray-700" />
            <span className="truncate text-gray-800">{f.name}</span>
          </label>
          <button onClick={() => remove(f.name)} title="Supprimer">
            <TrashIcon className="w-4 h-4 text-red-600 hover:text-red-800" />
          </button>
        </div>
      ))}
    </div>
  );
}