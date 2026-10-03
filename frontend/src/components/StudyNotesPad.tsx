'use client';
import React, { useState, useEffect } from 'react';
import { useStudyProgress } from '@/lib/studyStore';

export default function StudyNotesPad({ topicId }: { topicId: string }) {
  const { getTopicNotes, saveTopicNotes } = useStudyProgress();
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setNotes(getTopicNotes(topicId)); }, [topicId]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    saveTopicNotes(topicId, val);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid rgba(245,158,11,0.2)',
      borderRadius: 14, padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>📝</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Personal Study Notes</span>
        </div>
        <span style={{ fontSize: 11, color: saved ? '#34d399' : 'var(--text-muted)', fontWeight: saved ? 600 : 400, transition: 'color 0.3s' }}>
          {saved ? '✓ Auto-saved' : 'Saved in browser'}
        </span>
      </div>
      <textarea
        value={notes}
        onChange={onChange}
        className="notes-area"
        rows={4}
        placeholder="Write your personal notes, key takeaways, edge cases, or anything you want to remember about this topic..."
      />
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
        📌 Notes are saved in your browser — they persist across visits
      </div>
    </div>
  );
}
