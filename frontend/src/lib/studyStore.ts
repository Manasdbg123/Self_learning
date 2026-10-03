'use client';
import { useState, useEffect } from 'react';

const COMPLETED_KEY = 'engknowledge_completed_topics';
const BOOKMARKED_KEY = 'engknowledge_bookmarked_topics';
const NOTES_KEY_PREFIX = 'engknowledge_notes_';
const LAST_TOPIC_KEY = 'engknowledge_last_topic';

export function useStudyProgress() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [lastTopic, setLastTopicState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const c = localStorage.getItem(COMPLETED_KEY);
      if (c) setCompleted(JSON.parse(c));

      const b = localStorage.getItem(BOOKMARKED_KEY);
      if (b) setBookmarked(JSON.parse(b));

      const l = localStorage.getItem(LAST_TOPIC_KEY);
      if (l) setLastTopicState(l);
    } catch {
      // Ignore local storage errors in private browsing
    }
    setLoaded(true);
  }, []);

  const toggleCompleted = (topicId: string) => {
    setCompleted((prev) => {
      const updated = prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId];
      try {
        localStorage.setItem(COMPLETED_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleBookmarked = (topicId: string) => {
    setBookmarked((prev) => {
      const updated = prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId];
      try {
        localStorage.setItem(BOOKMARKED_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const recordVisit = (topicId: string) => {
    try {
      localStorage.setItem(LAST_TOPIC_KEY, topicId);
      setLastTopicState(topicId);
    } catch {}
  };

  const getTopicNotes = (topicId: string): string => {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem(NOTES_KEY_PREFIX + topicId) || '';
    } catch {
      return '';
    }
  };

  const saveTopicNotes = (topicId: string, notes: string) => {
    try {
      localStorage.setItem(NOTES_KEY_PREFIX + topicId, notes);
    } catch {}
  };

  return {
    completed,
    bookmarked,
    lastTopic,
    loaded,
    isCompleted: (id: string) => completed.includes(id),
    isBookmarked: (id: string) => bookmarked.includes(id),
    toggleCompleted,
    toggleBookmarked,
    recordVisit,
    getTopicNotes,
    saveTopicNotes,
  };
}
