import React, { useEffect, useRef, useState } from 'react';
import { useApp, go } from './store.jsx';
import { userById, timeAgo, fullCount } from './data.js';
import {
  IconHeart, IconComment, IconShare, IconBookmark, IconVerified, IconClose,
} from './icons.jsx';

/* ---------- image with gradient fallback ---------- */
const PALETTE = ['#8ec5fc', '#e0c3fc', '#f6d365', '#fda085', '#a1c4fd', '#d4fc79', '#ff9a9e', '#fad0c4'];
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Img({ src, alt = '', seed = '', className = '', style, onClick }) {
  const [failed, setFailed] = useState(false);
  const h = hashStr(seed || src || 'kix');
  const c1 = PALETTE[h % PALETTE.length];
  const c2 = PALETTE[(h >> 3) % PALETTE.length];
  if (failed) {
    return (
      <div
        className={`img-fallback ${className}`}
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, ...style }}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        aria-label={alt}
      />
    );
  }
  return (
    <img
      src={src} alt={alt} loading="lazy" decoding="async"
      className={className} style={style}
      onClick={onClick}
      onError={() => setFailed(true)}
    />
  );
}

/* ---------- avatar ---------- */
export function Avatar({ user, size = 32, ring = false, story = false, onClick, className = '' }) {
  const u = typeof user === 'string' ? userById(user) : user;
  const [failed, setFailed] = useState(false);
  const h = hashStr(u?.username || 'x');
  const c1 = PALETTE[h % PALETTE.length];
  const c2 = PALETTE[(h >> 3) % PALETTE.length];
  const cls = `avatar ${ring ? 'avatar-ring' : ''} ${story ? 'avatar-story' : ''} ${className}`;
  const inner = failed ? (
    <span className="avatar-fallback" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, fontSize: size * 0.42 }}>
      {(u?.name || '?')[0].toUpperCase()}
    </span>
  ) : (
    <img src={u?.avatar} alt={u?.username || ''} width={size} height={size} loading="lazy"
      onError={() => setFailed(true)} />
  );
  const style = { width: size, height: size };
  if (onClick) {
    return <button type="button" className={`${cls} as-btn`} style={style} onClick={onClick} aria-label={u?.username}>{inner}</button>;
  }
  return <span className={cls} style={style}>{inner}</span>;
}

/* ---------- follow button ---------- */
export function FollowButton({ userId, small = false }) {
  const { isFollowing, toggleFollow, me } = useApp();
  if (userId === me.id) return null;
  const following = isFollowing(userId);
  return (
    <button
      type="button"
      className={`btn-follow ${following ? 'following' : ''} ${small ? 'sm' : ''}`}
      onClick={(e) => { e.stopPropagation(); toggleFollow(userId); }}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  );
}

/* ---------- modal shell ---------- */
export function Modal({ children, onClose, className = '', labelledBy }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <button type="button" className="modal-x" onClick={onClose} aria-label="Close"><IconClose size={20} /></button>
        {children}
      </div>
    </div>
  );
}

/* ---------- time ---------- */
export function TimeAgo({ iso }) {
  return <time title={new Date(iso).toLocaleString()}>{timeAgo(iso)}</time>;
}

/* ---------- double-tap heart burst ---------- */
function HeartBurst({ show }) {
  return <span className={`heart-burst ${show ? 'show' : ''}`} aria-hidden>❤️</span>;
}

/* ---------- post actions ---------- */
export function PostActions({ post, onOpen, compact = false }) {
  const { isLiked, isSaved, toggleLike, toggleSave } = useApp();
  const liked = isLiked(post.id);
  const saved = isSaved(post.id);
  return (
    <div className={`post-actions ${compact ? 'compact' : ''}`}>
      <button type="button" className={`act-btn ${liked ? 'liked' : ''}`} aria-label="Like"
        onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}>
        <span className="act-ico"><IconHeart size={24} filled={liked} /></span>
      </button>
      <button type="button" className="act-btn" aria-label="Comment" onClick={(e) => { e.stopPropagation(); onOpen?.(); }}>
        <span className="act-ico"><IconComment size={24} /></span>
      </button>
      <button type="button" className="act-btn" aria-label="Share"
        onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(`${location.origin}${location.pathname}#/post/${post.id}`); }}>
        <span className="act-ico"><IconShare size={24} /></span>
      </button>
      <button type="button" className={`act-btn right ${saved ? 'saved' : ''}`} aria-label="Save"
        onClick={(e) => { e.stopPropagation(); toggleSave(post.id); }}>
        <span className="act-ico"><IconBookmark size={24} filled={saved} /></span>
      </button>
    </div>
  );
}

/* ---------- post card (feed) ---------- */
export function PostCard({ post, onOpen }) {
  const { isLiked, toggleLike, state, formatCount: fc } = useApp();
  const author = userById(post.authorId);
  const [burst, setBurst] = useState(false);
  const lastTap = useRef(0);
  const liked = isLiked(post.id);
  const extra = state.extraComments[post.id] || [];
  const commentCount = post.comments + extra.length;

  const handleDouble = () => {
    if (liked) return;
    toggleLike(post.id);
    setBurst(true);
    setTimeout(() => setBurst(false), 700);
  };
  const onMedia = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) { handleDouble(); lastTap.current = 0; }
    else lastTap.current = now;
  };

  return (
    <article className="post-card">
      <header className="post-head">
        <button type="button" className="post-author" onClick={() => go(`/profile/${author.username}`)}>
          <Avatar user={author} size={32} ring />
          <span className="post-author-name">
            {author.username}
            {author.verified && <IconVerified size={12} />}
          </span>
        </button>
        <span className="post-dot">·</span>
        <TimeAgo iso={post.createdAt} />
        <button type="button" className="act-btn post-more" aria-label="More options"><span className="act-ico">⋯</span></button>
      </header>

      <div className="post-media" onClick={onMedia} style={{ aspectRatio: post.aspect }}>
        <Img src={post.image} alt={post.caption.slice(0, 60)} seed={post.id} />
        <HeartBurst show={burst} />
      </div>

      <PostActions post={post} onOpen={onOpen} />

      <div className="post-body">
        <div className="post-likes"><strong>{fc(post.likes + (liked ? 1 : 0))}</strong> likes</div>
        <div className="post-caption">
          <button type="button" className="post-user" onClick={() => go(`/profile/${author.username}`)}>{author.username}</button>{' '}
          {post.caption.split(/(#\w+)/g).map((part, i) =>
            part.startsWith('#')
              ? <button key={i} type="button" className="post-tag" onClick={() => go(`/tag/${part.slice(1)}`)}>{part}</button>
              : <React.Fragment key={i}>{part}</React.Fragment>,
          )}
        </div>
        {post.location && <div className="post-location">{post.location}</div>}
        {commentCount > 0 && (
          <button type="button" className="post-viewcomments" onClick={onOpen}>
            View all {fullCount(commentCount)} comments
          </button>
        )}
        {extra.slice(-2).map((c) => (
          <div key={c.id} className="post-comment">
            <strong>{userById(c.userId)?.username}</strong> {c.text}
          </div>
        ))}
        <div className="post-time">{timeAgo(post.createdAt).toUpperCase()} AGO</div>
      </div>
    </article>
  );
}

/* ---------- story circle ---------- */
export function StoryCircle({ story, seen, onClick, size = 56 }) {
  const user = userById(story.userId);
  if (!user) return null;
  return (
    <button type="button" className={`story-circle ${seen ? 'seen' : ''}`} onClick={onClick} aria-label={`Story of ${user.username}`}>
      <span className="story-ring" style={{ width: size, height: size }}>
        <Avatar user={user} size={size - 8} />
      </span>
      <span className="story-username">{user.username}</span>
    </button>
  );
}

/* ---------- skeleton loader ---------- */
export function Skeleton() {
  return (
    <div className="post-card skeleton-card" aria-hidden>
      <div className="sk-head"><span className="sk-avatar" /><span className="sk-line w120" /></div>
      <div className="sk-media" />
      <div className="sk-actions"><span className="sk-line w80" /><span className="sk-line w60 right" /></div>
      <div className="sk-line w140" />
      <div className="sk-line w90" />
    </div>
  );
}

/* ---------- empty state ---------- */
export function Empty({ icon, title, sub }) {
  return (
    <div className="empty-state">
      <div className="empty-ico">{icon}</div>
      <h3>{title}</h3>
      {sub && <p>{sub}</p>}
    </div>
  );
}
