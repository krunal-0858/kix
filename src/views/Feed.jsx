import React, { useMemo, useState } from 'react';
import { useApp, rankFeed, orderStories, go } from '../store.jsx';
import { userById, formatCount } from '../data.js';
import { PostCard, StoryCircle, Avatar, FollowButton, Skeleton } from '../ui.jsx';
import { IconHeart } from '../icons.jsx';

function StoryRail({ onOpenStory }) {
  const { state, activity, me } = useApp();
  const followed = activity.following;
  const ordered = useMemo(
    () => orderStories(state.stories, { ...activity, selfId: me.id }, followed),
    [state.stories, activity, followed, me.id],
  );
  return (
    <div className="story-rail" role="list">
      {ordered.map((story) => {
        const seen = story.items.every((i) => activity.seenStories.includes(i.id));
        return (
          <StoryCircle
            key={story.userId}
            story={story}
            seen={seen && story.userId !== me.id}
            onClick={() => onOpenStory(story.userId)}
          />
        );
      })}
    </div>
  );
}

function Suggestions() {
  const { activity, me, state } = useApp();
  const notFollowed = state.posts
    .map((p) => p.authorId)
    .filter((id, i, arr) => id !== me.id && arr.indexOf(id) === i && !activity.following.includes(id))
    .slice(0, 5);
  return (
    <div className="suggestions">
      <div className="sug-head">
        <span className="sug-me"><Avatar user={me} size={44} /></span>
        <div>
          <button type="button" className="sug-username" onClick={() => go(`/profile/${me.username}`)}>{me.username}</button>
                  <span className="sug-sub">KIX demo account</span>
        </div>
        <button type="button" className="link-btn">Switch</button>
      </div>
      <div className="sug-title">Suggested for you <button type="button" className="link-btn">See all</button></div>
      {notFollowed.map((id) => {
        const u = userById(id);
        if (!u) return null;
        return (
          <div key={id} className="sug-row">
            <Avatar user={u} size={44} onClick={() => go(`/profile/${u.username}`)} className="as-btn" />
            <div className="sug-info">
              <button type="button" className="sug-username" onClick={() => go(`/profile/${u.username}`)}>{u.username}</button>
              <span className="sug-sub">{formatCount(u.followers)} followers</span>
            </div>
            <FollowButton userId={id} small />
          </div>
        );
      })}
    </div>
  );
}

export default function Feed({ onOpenPost, onOpenStory }) {
  const { activity, me, allPosts } = useApp();
  const [loading, setLoading] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);

  const feedPosts = useMemo(() => {
    const candidates = allPosts.filter((p) => p.inFeed);
    return rankFeed(candidates, { ...activity, selfId: me.id }, allPosts);
  }, [allPosts, activity, me.id]);

  const [count, setCount] = useState(6);
  const visible = feedPosts.slice(0, count);

  const loadMore = () => {
    if (loading || loadedAll) return;
    setLoading(true);
    setTimeout(() => {
      const next = count + 4;
      if (next >= feedPosts.length) { setCount(feedPosts.length); setLoadedAll(true); }
      else setCount(next);
      setLoading(false);
    }, 650);
  };

  return (
    <div className="feed-page">
      <div className="feed-main">
        <StoryRail onOpenStory={onOpenStory} />

        {visible.map((post) => (
          <PostCard key={post.id} post={post} onOpen={() => onOpenPost(post.id)} />
        ))}

        {loading && <Skeleton />}

        {loadedAll ? (
          <div className="caught-up">
            <div className="caught-ico"><IconHeart size={28} filled /></div>
            <h3>You're all caught up</h3>
            <p>You've seen all new posts from the past 3 days.</p>
          </div>
        ) : (
          <button type="button" className="load-more" onClick={loadMore} disabled={loading}>
            {loading ? 'Loading…' : 'Load more posts'}
          </button>
        )}

        <footer className="feed-footer">
          <div className="foot-links">
            <a href="#/">About</a><a href="#/">Help</a><a href="#/">Press</a><a href="#/">API</a>
            <a href="#/">Jobs</a><a href="#/">Privacy</a><a href="#/">Terms</a><a href="#/">Locations</a>
          </div>
          <div className="foot-copy">© 2026 KIX from KIX</div>
        </footer>
      </div>

      <aside className="feed-aside">
        <Suggestions />
        <div className="aside-footer">
          <p>About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language</p>
          <p>© 2026 KIX</p>
          <p className="disclaimer">Unofficial educational replica. Not affiliated with Instagram or Meta.</p>
        </div>
      </aside>
    </div>
  );
}
