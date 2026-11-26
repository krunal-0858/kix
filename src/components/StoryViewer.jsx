import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp, go } from '../store.jsx';
import { userById, timeAgo } from '../data.js';
import { Avatar, Img } from '../ui.jsx';
import { IconClose, IconHeart, IconSend, IconChevronLeft, IconChevronRight, IconMute, IconUnmute } from '../icons.jsx';

const DURATION = 5000;

function Bars({ count, current, paused }) {
  return (
    <div className="sv-bars" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`sv-bar ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}>
          <span className={`sv-bar-fill ${i < current ? 'done' : ''} ${i === current && !paused ? 'run' : ''}`}
            style={{ animationDuration: `${DURATION}ms`, transform: i < current ? 'scaleX(1)' : undefined }} />
        </span>
      ))}
    </div>
  );
}

export default function StoryViewer({ startUserId, onClose }) {
  const { state, dispatch, activity, me } = useApp();
  const ordered = useMemo(() => {
    const followed = activity.following;
    const seen = (s) => s.items.every((i) => activity.seenStories.includes(i.id));
    return [...state.stories].sort((a, b) => {
      const af = followed.includes(a.userId) || a.userId === me.id;
      const bf = followed.includes(b.userId) || b.userId === me.id;
      if (af !== bf) return af ? -1 : 1;
      const as = seen(a), bs = seen(b);
      if (as !== bs) return as ? 1 : -1;
      return 0;
    });
  }, [state.stories, activity, me.id]);

  const startIndex = Math.max(0, ordered.findIndex((s) => s.userId === startUserId));
  const [sIdx, setSIdx] = useState(startIndex);   // story index
  const [iIdx, setIIdx] = useState(0);            // item index
  const [paused, setPaused] = useState(false);
  const [reply, setReply] = useState('');
  const [muted, setMuted] = useState(true);
  const startRef = useRef(Date.now());
  const [progress, setProgress] = useState(0);

  const story = ordered[sIdx];
  const items = story?.items || [];
  const item = items[iIdx];
  const user = story ? userById(story.userId) : null;

  // mark item seen
  useEffect(() => {
    if (item) dispatch({ type: 'seenStory', storyId: item.id });
  }, [item, dispatch]);

  // auto-advance with pause-aware progress
  useEffect(() => {
    setProgress(0);
    startRef.current = Date.now();
  }, [sIdx, iIdx]);

  useEffect(() => {
    if (paused || !item) return;
    let raf;
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(1, elapsed / DURATION);
      setProgress(p);
      if (p >= 1) { advance(1); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, item, sIdx, iIdx]);

  const advance = (dir) => {
    if (dir > 0) {
      if (iIdx < items.length - 1) { setIIdx((i) => i + 1); return; }
      if (sIdx < ordered.length - 1) { setSIdx((s) => s + 1); setIIdx(0); return; }
      onClose(); return;
    }
    if (iIdx > 0) { setIIdx((i) => i - 1); return; }
    if (sIdx > 0) { setSIdx((s) => s - 1); setIIdx(0); }
  };

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') advance(1);
      if (e.key === 'ArrowLeft') advance(-1);
      if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p); }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sIdx, iIdx, ordered.length]);

  // close gracefully if the story disappears (e.g. account switch)
  useEffect(() => {
    if (!story || !item) onClose();
  }, [story, item, onClose]);

  if (!story || !item) return null;

  const prevStory = ordered[sIdx - 1];
  const nextStory = ordered[sIdx + 1];

  return (
    <div className="story-viewer">
      <button type="button" className="sv-close" onClick={onClose} aria-label="Close stories"><IconClose size={24} /></button>
      <button type="button" className="sv-nav prev" aria-label="Previous story"
        onClick={() => { if (sIdx > 0) { setSIdx(sIdx - 1); setIIdx(0); } }}>
        <IconChevronLeft size={20} />
      </button>

      <div className="sv-card" onContextMenu={(e) => e.preventDefault()}>
        <div className="sv-media" onClick={() => advance(1)}
          onPointerDown={() => setPaused(true)} onPointerUp={() => setPaused(false)}>
          <Img src={item.image} alt={item.caption || ''} seed={item.id} />
          {item.caption && <div className="sv-caption">{item.caption}</div>}
          <div className="sv-progress" style={{ width: `${progress * 100}%` }} />
        </div>

        <header className="sv-head">
          <Bars count={items.length} current={iIdx} paused={paused} />
          <div className="sv-user">
            <Avatar user={user} size={32} onClick={() => { onClose(); go(`/profile/${user.username}`); }} className="as-btn" />
            <button type="button" className="sv-username" onClick={() => { onClose(); go(`/profile/${user.username}`); }}>
              {user.username}
            </button>
            <span className="sv-time">{timeAgo(item.at)}</span>
            <button type="button" className="sv-mute" onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }} aria-label="Mute">
              {muted ? <IconMute size={18} /> : <IconUnmute size={18} />}
            </button>
            <button type="button" className="sv-pause" onPointerDown={(e) => { e.stopPropagation(); setPaused(true); }}
              onPointerUp={(e) => { e.stopPropagation(); setPaused(false); }} aria-label="Hold to pause">⋯</button>
          </div>
        </header>

        <footer className="sv-foot" onClick={(e) => e.stopPropagation()}>
          <input value={reply} onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && reply.trim()) setReply(''); }}
            placeholder={`Reply to ${user.username}…`} aria-label="Reply" />
          <button type="button" className="sv-like" aria-label="Like story"><IconHeart size={22} /></button>
          <button type="button" className="sv-send" aria-label="Send"><IconSend size={22} /></button>
        </footer>
      </div>

      <button type="button" className="sv-nav next" aria-label="Next story" onClick={() => advance(1)}>
        <IconChevronRight size={20} />
      </button>
      {prevStory && (
        <div className="sv-side prev-side"><Avatar user={userById(prevStory.userId)} size={44} /></div>
      )}
      {nextStory && (
        <div className="sv-side next-side"><Avatar user={userById(nextStory.userId)} size={44} /></div>
      )}
    </div>
  );
}
