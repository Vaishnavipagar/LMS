import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStickyNote, FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaSearch } from "react-icons/fa";

const DEFAULT_NOTES = [
  {
    id: 1,
    title: "Linux Commands Cheatsheet",
    content: "ls - list directory contents\ncd - change directory\npwd - print working directory\ncat - display file contents\ngrep - search text patterns",
    color: "#FEF3C7",
    createdAt: "2024-01-10",
    course: "Linux Fundamentals",
  },
  {
    id: 2,
    title: "Shell Scripting Notes",
    content: "Variables: name=value\nConditionals: if [ condition ]; then\nLoops: for i in list; do\nFunctions: function_name() { }",
    color: "#DBEAFE",
    createdAt: "2024-01-15",
    course: "Shell Scripting",
  },
  {
    id: 3,
    title: "Important Reminders",
    content: "- Complete assignment by Friday\n- Review chapter 5\n- Practice vim commands\n- Setup virtual machine",
    color: "#FCE7F3",
    createdAt: "2024-01-20",
    course: "General",
  },
];

const COLORS = ["#FEF3C7", "#DBEAFE", "#FCE7F3", "#D1FAE5", "#E9D5FF", "#FED7AA"];

export default function NotesApp() {
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState({ title: "", content: "" });

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "New Note",
      content: "",
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      createdAt: new Date().toISOString().split("T")[0],
      course: "General",
    };
    setNotes([newNote, ...notes]);
    setEditingId(newNote.id);
    setEditContent({ title: newNote.title, content: newNote.content });
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditContent({ title: note.title, content: note.content });
  };

  const saveEdit = (id) => {
    setNotes(notes.map(n =>
      n.id === id ? { ...n, title: editContent.title, content: editContent.content } : n
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent({ title: "", content: "" });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <FaStickyNote className="text-pink-500" />
          <span className="hidden sm:inline">Course</span> Notes
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addNote}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-pink-500 text-white text-xs sm:text-sm rounded-lg hover:bg-pink-600 transition-colors"
        >
          <FaPlus size={10} />
          <span className="hidden sm:inline">New Note</span>
          <span className="sm:hidden">Add</span>
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-3 sm:mb-4">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-auto -mx-1 px-1 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100"
              style={{ backgroundColor: note.color }}
            >
              {editingId === note.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editContent.title}
                    onChange={(e) => setEditContent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-2 py-1 bg-white/50 rounded text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
                    autoFocus
                  />
                  <textarea
                    value={editContent.content}
                    onChange={(e) => setEditContent(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-2 py-1 bg-white/50 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(note.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-green-500 text-white text-[10px] sm:text-xs rounded hover:bg-green-600"
                    >
                      <FaSave size={10} /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-slate-500 text-white text-[10px] sm:text-xs rounded hover:bg-slate-600"
                    >
                      <FaTimes size={10} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-xs sm:text-sm truncate flex-1">{note.title}</h3>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => startEdit(note)}
                        className="p-1 hover:bg-white/50 rounded transition-colors"
                      >
                        <FaEdit size={12} className="text-slate-600" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 hover:bg-white/50 rounded transition-colors"
                      >
                        <FaTrash size={12} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-600 whitespace-pre-wrap mb-2 line-clamp-4">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
                    <span className="truncate">{note.course}</span>
                    <span className="flex-shrink-0 ml-2">{note.createdAt}</span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
