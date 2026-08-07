import React, { useState } from 'react';
import { TranslationNote } from '../types';
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Maximize2 
} from 'lucide-react';

interface TranslationNotesSummarizerProps {
  notes: TranslationNote[];
  onOpenQuickModal: (title: string, text: string) => void;
}

export const MedicalNotesSummarizer: React.FC<TranslationNotesSummarizerProps> = ({
  notes,
  onOpenQuickModal,
}) => {
  const [selectedNote, setSelectedNote] = useState<TranslationNote>(notes[0]);
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimplifyPasted = async () => {
    if (!pastedText.trim()) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/gemini/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: pastedText, userRole: 'signer' }),
      });
      const data = await res.json();
      if (data && data.simplifiedText) {
        const newNote: TranslationNote = {
          id: `tn-${Date.now()}`,
          date: 'Just now',
          speaker: 'Custom Speaker',
          topic: 'Meeting / Conversation Note',
          originalTranscript: pastedText,
          simplifiedText: data.simplifiedText,
          signGlosses: data.signGlosses || ['IMPORTANT', 'NOTE', 'REVIEW'],
          actionItems: data.keyActionItems || [data.simplifiedText],
          keyTerms: data.keyTerms || [],
          urgency: data.urgencyLevel || 'low',
        };
        setSelectedNote(newNote);
        setPastedText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Translation Notes & Transcripts
              </h3>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200/80">
                AI Summarizer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Summarizes spoken transcripts and conversation notes into plain text and sign gloss sequences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): History List + Paste Box */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
            Select Saved Transcript
          </span>

          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedNote.id === note.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 font-heading">
                    {note.topic}
                  </span>
                  <span className="text-[10px] font-medium opacity-75">{note.date}</span>
                </div>
                <p className="text-xs line-clamp-2 mt-1 opacity-90 font-medium">
                  {note.simplifiedText}
                </p>
              </div>
            ))}
          </div>

          {/* Paste Transcript Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
              Paste Text / Transcript
            </span>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste conversation transcript or meeting notes here..."
              rows={3}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSimplifyPasted}
              disabled={isProcessing || !pastedText.trim()}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Translating...' : 'Summarize & Generate Glosses'}</span>
            </button>
          </div>
        </div>

        {/* Right Column (2 cols): Selected Note Visual Breakdown */}
        <div className="lg:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h4 className="text-lg font-bold text-slate-900 font-heading">
                {selectedNote.topic}
              </h4>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedNote.date} • Speaker: {selectedNote.speaker}</span>
              </p>
            </div>

            <button
              onClick={() =>
                onOpenQuickModal(
                  `TRANSCRIPT: ${selectedNote.topic.toUpperCase()}`,
                  selectedNote.simplifiedText
                )
              }
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Fullscreen</span>
            </button>
          </div>

          {/* 1. Plain Text Summary */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-xs">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Plain Language Translation
            </span>
            <p className="text-base font-bold text-slate-900 leading-relaxed">
              {selectedNote.simplifiedText}
            </p>
          </div>

          {/* 2. Sign Glosses */}
          <div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-2">
              Sign Language Concept Sequence:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedNote.signGlosses.map((gloss, idx) => (
                <span
                  key={idx}
                  className="bg-slate-900 text-teal-300 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border border-slate-800 shadow-xs"
                >
                  [{gloss}]
                </span>
              ))}
            </div>
          </div>

          {/* 3. Action Checklist */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Action Items
            </span>
            <div className="space-y-2">
              {selectedNote.actionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-xs font-bold text-slate-800 flex items-center gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Original Transcript */}
          <details className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
            <summary className="font-bold cursor-pointer hover:text-slate-800">
              Show Full Original Transcript
            </summary>
            <p className="mt-2 text-slate-700 leading-relaxed font-normal">
              "{selectedNote.originalTranscript}"
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};
