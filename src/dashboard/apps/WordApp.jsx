import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaFileAlt, FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, 
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaSave, FaFolderOpen,
  FaPlus, FaDownload
} from "react-icons/fa";

const SAMPLE_DOCUMENTS = [
  { id: 1, title: "Linux Notes", content: "My notes on Linux fundamentals...", lastModified: "2024-01-20" },
  { id: 2, title: "Assignment 1", content: "Shell scripting assignment...", lastModified: "2024-01-18" },
];

export default function WordApp() {
  const [documents, setDocuments] = useState(SAMPLE_DOCUMENTS);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const createNewDoc = () => {
    const newDoc = {
      id: Date.now(),
      title: "Untitled Document",
      content: "",
      lastModified: new Date().toISOString().split("T")[0],
    };
    setDocuments([newDoc, ...documents]);
    setCurrentDoc(newDoc);
    setTitle(newDoc.title);
    setContent(newDoc.content);
  };

  const openDoc = (doc) => {
    setCurrentDoc(doc);
    setTitle(doc.title);
    setContent(doc.content);
  };

  const saveDoc = () => {
    if (!currentDoc) return;
    setDocuments(documents.map(d =>
      d.id === currentDoc.id
        ? { ...d, title, content, lastModified: new Date().toISOString().split("T")[0] }
        : d
    ));
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-slate-50 border-b border-slate-200 rounded-t-lg overflow-x-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={createNewDoc}
          className="p-1.5 sm:p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
          title="New Document"
        >
          <FaPlus size={12} className="text-slate-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-1.5 sm:p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
          title="Open Document"
        >
          <FaFolderOpen size={12} className="text-slate-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveDoc}
          className="p-1.5 sm:p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
          title="Save"
        >
          <FaSave size={12} className="text-slate-600" />
        </motion.button>
        
        <div className="w-px h-5 bg-slate-300 mx-0.5 flex-shrink-0" />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => formatText('bold')}
          className="p-1.5 sm:p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
          title="Bold"
        >
          <FaBold size={12} className="text-slate-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => formatText('italic')}
          className="p-1.5 sm:p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
          title="Italic"
        >
          <FaItalic size={12} className="text-slate-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => formatText('underline')}
          className="p-1.5 sm:p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
          title="Underline"
        >
          <FaUnderline size={12} className="text-slate-600" />
        </motion.button>

        {/* Hide some buttons on mobile for cleaner toolbar */}
        <div className="hidden sm:block w-px h-5 bg-slate-300 mx-0.5 flex-shrink-0" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => formatText('insertUnorderedList')}
          className="hidden sm:block p-1.5 sm:p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
          title="Bullet List"
        >
          <FaListUl size={12} className="text-slate-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => formatText('insertOrderedList')}
          className="hidden sm:block p-1.5 sm:p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
          title="Numbered List"
        >
          <FaListOl size={12} className="text-slate-600" />
        </motion.button>

        <div className="hidden sm:block w-px h-5 bg-slate-300 mx-0.5 flex-shrink-0" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => formatText('justifyLeft')}
          className="hidden sm:block p-1.5 sm:p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
          title="Align Left"
        >
          <FaAlignLeft size={12} className="text-slate-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => formatText('justifyCenter')}
          className="hidden sm:block p-1.5 sm:p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
          title="Align Center"
        >
          <FaAlignCenter size={12} className="text-slate-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => formatText('justifyRight')}
          className="hidden sm:block p-1.5 sm:p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
          title="Align Right"
        >
          <FaAlignRight size={12} className="text-slate-600" />
        </motion.button>

        <div className="flex-1" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 sm:p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
          title="Export"
        >
          <FaDownload size={12} className="text-slate-600" />
        </motion.button>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - hidden by default on mobile */}
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isMobile ? 160 : 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-slate-200 bg-slate-50 overflow-auto flex-shrink-0"
          >
            <div className="p-1.5 sm:p-2">
              <div className="text-[10px] sm:text-xs font-semibold text-slate-500 mb-2 px-2">DOCUMENTS</div>
              {documents.map(doc => (
                <motion.button
                  key={doc.id}
                  onClick={() => openDoc(doc)}
                  whileHover={{ x: 2 }}
                  className={`w-full text-left p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm transition-colors ${
                    currentDoc?.id === doc.id
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FaFileAlt size={10} />
                    <span className="truncate">{doc.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 ml-4">{doc.lastModified}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Editor */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {currentDoc ? (
            <>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-lg font-semibold border-b border-slate-100 focus:outline-none"
                placeholder="Document Title"
              />
              <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: content }}
                className="flex-1 p-3 sm:p-4 text-sm focus:outline-none overflow-auto"
                style={{ minHeight: 150 }}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 p-4">
              <div className="text-center">
                <FaFileAlt size={36} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select or create a document</p>
                <button
                  onClick={createNewDoc}
                  className="mt-3 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  New Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
