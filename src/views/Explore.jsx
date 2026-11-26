import React, { useMemo, useState } from 'react';
import { useApp, rankExplore } from '../store.jsx';
import { formatCount } from '../data.js';
import { Img } from '../ui.jsx';
import { IconHeart, IconComment } from '../icons.jsx';

function ExploreTile({ post, tall, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      className={`explore-tile ${tall ? 'tall' : ''} ${post.aspect === '4 / 5' ? 'portrait' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(post.id)}
      aria-label={`Post by ${post.authorId}`}
    >
      <Img src={post.image} alt={post.caption.slice(0, 50)} seed={post.id} />
      <span className={`tile-stats ${hover ? 'show' : ''}`}>
        <span><IconHeart size={18} filled /> {formatCount(post.likes)}</span>
        <span><IconComment size={18} /> {formatCount(post.comments)}</span>
      </span>
    </button>
  );
}

export default function Explore({ onOpenPost }) {
  const { allPosts, activity, me } = useApp();
  const [filter, setFilter] = useState('all');

  const ranked = useMemo(
    () => rankExplore(allPosts.filter((p) => p.explore), { ...activity, selfId: me.id }, activity.following),
    [allPosts, activity, me.id],
  );

  const filtered = filter === 'all' ? ranked
    : filter === 'following' ? ranked.filter((p) => activity.following.includes(p.authorId))
    : ranked.filter((p) => !activity.following.includes(p.authorId));

  // IG explore: 3-col grid with periodic double-height (tall) tiles
  const tiles = [];
  filtered.forEach((post, i) => {
    tiles.push(<ExploreTile key={post.id} post={post} tall={i % 12 === 2 || i % 12 === 7} onOpen={onOpenPost} />);
  });

  return (
    <div className="explore-page">
      <div className="explore-filters">
        {['all', 'following', 'for you'].map((f) => (
          <button key={f} type="button" className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'for you' ? 'For you' : f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="explore-grid">
        {tiles.length ? tiles : <p className="grid-empty">Nothing here yet.</p>}
      </div>
    </div>
  );
}
