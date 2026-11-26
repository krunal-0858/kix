import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp, chainReels, go } from '../store.jsx';
import { userById, formatCount, fullCount, timeAgo } from '../data.js';
import { Avatar, Img, FollowButton } from '../ui.jsx';
import {
  IconHeart, IconComment, IconShare, IconBookmark, IconMore, IconMusic,
  IconPlay, IconMute, IconUnmute, IconChevronLeft, IconChevronRight,
} from '../icons.jsx';

function ReelCard({ reel, active, onOpenComments }) {
  const { isLiked, toggleLikeReel, isSaved, toggleSave, state, dispatch } = useApp();
  const author = userById(reel.authorId);
  const liked = isLiked(reel.id);
  const saved = isSaved(reel.id);
  const extraLikes = state.reelLikes[reel.id] || 0;
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [burst, setBurst] = useState(false);
  const ref = useRef(null);

  // mark seen when it becomes the active reel (drives chaining order)
  useEffect(() => {
    if (active) dispatch({ type: 'seenReel', reelId: reel.id });
  }, [active, reel.id, dispatch]);

  const dbl = () => {
    if (!liked) toggleLikeReel(reel.id);
    setBurst(true);
    setTimeout(() => setBurst(false), 700);
  };

  const likeCount = reel.likes + extraLikes;

  return (
    <div className={`reel-card ${active ? 'active' : ''}`} ref={ref} onDoubleClick={dbl}>
      <div className="reel-media" onClick={() => setPaused((p) => !p)}>
        <Img src={reel.video} alt={reel.caption} seed={reel.id} className={`reel-img ${paused ? 'paused' : ''} ${active && !paused ? 'ken' : ''}`} />
        <span className={`reel-burst ${burst ? 'show' : ''}`}>❤️</span>
        {paused && (
          <span className="reel-playbig"><IconPlay size={64} /></span>
        )}
        <div className="reel-progress"><span className={active && !paused ? 'run' : ''} /></div>
      </div>

      <div className="reel-rail">
        <button type="button" className={`reel-act ${liked ? 'liked' : ''}`} onClick={() => toggleLikeReel(reel.id)} aria-label="Like">
          <IconHeart size={26} filled={liked} />
          <span>{formatCount(likeCount)}</span>
        </button>
        <button type="button" className="reel-act" onClick={onOpenComments} aria-label="Comments">
          <IconComment size={26} />
          <span>{formatCount(reel.comments)}</span>
        </button>
        <button type="button" className="reel-act" onClick={() => navigator.clipboard?.writeText(`${location.origin}${location.pathname}#/reels/${reel.id}`)} aria-label="Share">
          <IconShare size={26} />
          <span>{formatCount(reel.shares)}</span>
        </button>
        <button type="button" className={`reel-act ${saved ? 'saved' : ''}`} onClick={() => toggleSave(reel.id)} aria-label="Save">
          <IconBookmark size={26} filled={saved} />
          <span>Save</span>
        </button>
        <button type="button" className="reel-act" aria-label="More"><IconMore size={24} /></button>
        <button type="button" className="reel-mute" onClick={() => setMuted((m) => !m)} aria-label="Toggle sound">
          {muted ? <IconMute size={20} /> : <IconUnmute size={20} />}
        </button>
      </div>

      <div className="reel-meta">
        <div className="reel-author">
          <Avatar user={author} size={32} ring onClick={() => go(`/profile/${author.username}`)} className="as-btn" />
          <button type="button" className="reel-username" onClick={() => go(`/profile/${author.username}`)}>
            {author.username}{author.verified ? ' ✓' : ''}
          </button>
          <FollowButton userId={author.id} small />
        </div>
        <div className="reel-caption">{reel.caption}</div>
        <div className="reel-audio"><IconMusic size={14} /> {reel.audio}</div>
        <div className="reel-views">{fullCount(reel.views)} views · {timeAgo(reel.at)}</div>
      </div>
    </div>
  );
}

export default function Reels({ onOpenComments, focusId }) {
  const { state, activity, me } = useApp();
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef(null);

  const ordered = useMemo(
    () => chainReels(state.reels, { ...activity, selfId: me.id }, activity.likes),
    [state.reels, activity, me.id],
  );

  // scroll to focused reel if navigated from a link
  useEffect(() => {
    if (!focusId) return;
    const i = ordered.findIndex((r) => r.id === focusId);
    if (i >= 0) {
      requestAnimationFrame(() => {
        scrollerRef.current?.children[i]?.scrollIntoView({ block: 'start' });
      });
    }
  }, [focusId, ordered]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const i = Math.round(el.scrollTop / el.clientHeight);
    if (i !== index) setIndex(i);
  };

  const nudge = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: Math.max(0, Math.min(ordered.length - 1, index + dir)) * el.clientHeight, behavior: 'smooth' });
  };

  if (!ordered.length) return <div className="reels-page"><p className="grid-empty">No reels yet.</p></div>;

  return (
    <div className="reels-page">
      <div className="reels-scroller" ref={scrollerRef} onScroll={onScroll}>
        {ordered.map((reel, i) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            active={i === index}
            onOpenComments={() => onOpenComments(reel.id)}
          />
        ))}
      </div>
      <button type="button" className="reel-nav up" onClick={() => nudge(-1)} disabled={index === 0} aria-label="Previous reel">
        <IconChevronLeft size={18} />
      </button>
      <button type="button" className="reel-nav down" onClick={() => nudge(1)} disabled={index === ordered.length - 1} aria-label="Next reel">
        <IconChevronRight size={18} />
      </button>
      <div className="reels-hint">Scroll · double-tap to like</div>
    </div>
  );
}
