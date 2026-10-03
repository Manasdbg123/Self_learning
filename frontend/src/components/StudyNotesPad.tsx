'use client';
import React, { useState, useEffect } from 'react';
import { useStudyProgress } from '@/lib/studyStore';

interface StudyNotesPadProps {
  topicId: string;
}

export default function StudyNotesPad({ topicId }: StudyNotesPadProps) {
  const { getTopicNotes, saveTopicNotes } = useStudyProgress();
  const [notes, setNotes] = useState('');
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    setNotes(getTopicNotes(topicId));
  }, [topicId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    saveTopicNotes(topicId, val);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 1500);
  };

  return (
    <div className="card p-5 border-amber-500/20 bg-gradient-to-b from-amber-950/10 to-zinc-950 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">📝</span>
          <h4 className="font-bold text-zinc-200 text-sm">Personal Study Notes</h4>
        </div>
        <div className="text-[11px] text-zinc-500">
          {savedStatus ? (
            <span className="text-emerald-400 font-medium">Auto-saved ✓</span>
          ) : (
            <span>Saved in browser</span>
          )}
        </div>
      </div>

      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Write personal takeaways, edge cases, formulas, or reminders for this topic..."
        rows={4}
        className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-xs md:text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition resize-y"
      />
    </div>
  );
}
