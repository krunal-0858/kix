import React, { useEffect, useMemo } from 'react';
import { useApp, go } from '../store.jsx';
import { userById, timeAgo } from '../data.js';
import { Avatar, Img } from '../ui.jsx';
import { IconClose, IconHeart, IconComment } from '../icons.jsx';

function groupLabel(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 86_400_000) return 'Today';
  if (diff < 7 * 86_400_000) return 'This week';
  return 'Earlier';
}

export default function NotificationsPanel({ onClose }) {
  const { state, dispatch, activity, allPosts } = useApp();

  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: 'markNotifSeen' }), 600);
    return () => clearTimeout(t);
  }, [dispatch]);

  const sorted = useMemo(
    () => [...state.notifications].sort((a, b) => new Date(b.at) - new Date(a.at)),
    [state.notifications],
  );

  let lastGroup = null;

  return (
    <div className="notif-panel" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="notif-card" role="dialog" aria-label="Notifications">
        <header className="notif-head">
          <h2>Notifications</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close notifications"><IconClose size={20} /></button>
        </header>
        <div className="notif-scroll">
          {sorted.map((n) => {
            const u = userById(n.userId);
            const group = groupLabel(n.at);
            const showGroup = group !== lastGroup;
            lastGroup = group;
            const post = n.postId ? allPosts.find((p) => p.id === n.postId) : null;
            const isFollow = n.type === 'follow';
            const following = isFollow && activity.following.includes(n.userId);
            return (
              <React.Fragment key={n.id}>
                {showGroup && <div className="notif-group">{group}</div>}
                <div className={`notif-row ${isFollow ? 'follow' : ''}`} role="button" tabIndex={0}
                  onClick={() => { onClose(); if (post) go(`/post/${post.id}`); else go(`/profile/${u.username}`); }}>
                  <span className="notif-avatar">
                    <Avatar user={u} size={44} />
                    {n.type === 'like' && <span className="notif-badge heart"><IconHeart size={12} filled /></span>}
                    {n.type === 'comment' && <span className="notif-badge comment"><IconComment size={11} /></span>}
                  </span>
                  <span className="notif-text">
                    <strong>{u.username}</strong> {n.text} <span className="notif-time">{timeAgo(n.at)}</span>
                  </span>
                  {isFollow ? (
                    <button type="button" className={`notif-follow-btn ${following ? 'following' : ''}`}
                      onClick={(e) => { e.stopPropagation(); dispatch({ type: 'follow', userId: n.userId }); }}>
                      {following ? 'Following' : 'Follow'}
                    </button>
                  ) : post ? (
                    <span className="notif-thumb"><Img src={post.image} alt="" seed={post.id} /></span>
                  ) : null}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
