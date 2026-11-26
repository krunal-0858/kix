import React, { useMemo, useRef, useState } from 'react';
import { useApp, go } from '../store.jsx';
import { USERS, userById, formatCount } from '../data.js';
import { Avatar, Img } from '../ui.jsx';
import { IconSearch, IconClose, IconVerified } from '../icons.jsx';

export default function SearchPanel({ onClose }) {
  const { allPosts } = useApp();
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return null;
    return {
      users: USERS.filter((u) => u.username.includes(query) || u.name.toLowerCase().includes(query)).slice(0, 6),
      tags: [...new Set(allPosts.flatMap((p) => p.tags))]
        .filter((t) => t.includes(query)).slice(0, 6),
      posts: allPosts.filter((p) =>
        p.caption.toLowerCase().includes(query) ||
        p.tags.some((t) => t.includes(query)) ||
        userById(p.authorId)?.username.includes(query),
      ).slice(0, 9),
    };
  }, [q, allPosts]);

  const recent = ['mia.chen', 'streetphotography', 'nova.sounds', 'recipe'];

  return (
    <div className="search-panel" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="search-card" role="dialog" aria-label="Search">
        <header className="search-head">
          <h2>Search</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search"><IconClose size={20} /></button>
        </header>
        <div className="search-box">
          <IconSearch size={16} />
          <input ref={inputRef} autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search" aria-label="Search" />
          {q && <button type="button" className="search-clear" onClick={() => setQ('')} aria-label="Clear"><IconClose size={14} /></button>}
        </div>

        <div className="search-scroll">
          {!results && (
            <>
              <div className="search-row-title">Recent<button type="button" className="link-btn">Clear all</button></div>
              {recent.map((r) => (
                <button key={r} type="button" className="search-recent" onClick={() => setQ(r)}>
                  <span className="recent-ico"><IconSearch size={16} /></span>
                  <span>{r}</span>
                  <span className="recent-x" onClick={(e) => { e.stopPropagation(); }}><IconClose size={14} /></span>
                </button>
              ))}
            </>
          )}

          {results && !results.users.length && !results.tags.length && !results.posts.length && (
            <p className="grid-empty">No results found for “{q}”.</p>
          )}

          {results?.users.length > 0 && (
            <>
              <div className="search-row-title">Accounts</div>
              {results.users.map((u) => (
                <button key={u.id} type="button" className="search-user" onClick={() => { onClose(); go(`/profile/${u.username}`); }}>
                  <Avatar user={u} size={44} />
                  <div>
                    <strong>{u.username} {u.verified && <IconVerified size={12} />}</strong>
                    <span>{u.name} · {formatCount(u.followers)} followers</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {results?.tags.length > 0 && (
            <>
              <div className="search-row-title">Tags</div>
              {results.tags.map((t) => (
                <button key={t} type="button" className="search-tag" onClick={() => { onClose(); go(`/tag/${t}`); }}>
                  <span className="tag-hash">#</span>
                  <div><strong>{t}</strong><span>{allPosts.filter((p) => p.tags.includes(t)).length} posts</span></div>
                </button>
              ))}
            </>
          )}

          {results?.posts.length > 0 && (
            <>
              <div className="search-row-title">Posts</div>
              <div className="search-grid">
                {results.posts.map((p) => (
                  <button key={p.id} type="button" className="search-tile" onClick={() => { onClose(); go(`/post/${p.id}`); }}>
                    <Img src={p.image} alt="" seed={p.id} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
