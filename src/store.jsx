import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  ME, SEED_POSTS, SEED_COMMENTS, SEED_STORIES, SEED_REELS,
  SEED_NOTIFICATIONS, SEED_CHATS, AUTO_REPLIES, userById, timeAgo, formatCount,
} from './data.js';

const KEY = 'kix_state_v1';

// ---------- hash router ----------
export function parseHash() {
  const raw = (window.location.hash || '#/').replace(/^#/, '');
  const parts = raw.split('/').filter(Boolean);
  if (!parts.length) return { name: 'feed' };
  const [head, tail] = parts;
  switch (head) {
    case 'explore': return { name: 'explore' };
    case 'reels': return { name: 'reels', id: tail || null };
    case 'messages': return { name: 'messages', id: tail || null };
    case 'notifications': return { name: 'notifications' };
    case 'create': return { name: 'create' };
    case 'profile': return { name: 'profile', username: tail || null };
    case 'post': return { name: 'post', id: tail || null };
    case 'tag': return { name: 'tag', tag: tail || null };
    default: return { name: 'feed' };
  }
}

export function go(path) {
  const next = `#${path.startsWith('/') ? path : `/${path}`}`;
  if (window.location.hash !== next) window.location.hash = next;
}

// ---------- initial state ----------
function initialState() {
  return {
    theme: 'light',
    currentUserId: ME,
    switchedAt: {},          // userId -> ISO (for per-account activity timestamps)
    activity: {},            // userId -> { likes:Set, saves:Set, following:Set, seenStories:Set, seenReels:Set }
    posts: SEED_POSTS.map((p) => ({ ...p })),
    comments: JSON.parse(JSON.stringify(SEED_COMMENTS)),
    extraComments: {},       // postId -> [comment]
    stories: SEED_STORIES.map((s) => ({ userId: s.userId, items: [...s.items] })),
    reels: SEED_REELS.map((r) => ({ ...r })),
    reelLikes: {},           // reelId -> extra likes count
    notifications: SEED_NOTIFICATIONS.map((n) => ({ ...n })),
    notifSeen: false,
    chats: JSON.parse(JSON.stringify(SEED_CHATS)),
    follows: {},             // userId -> [otherUserId] (seeded defaults merged at read)
    customPosts: [],         // posts created by user (prepended)
    draftCaption: '',
    storyDrafts: [],
    lastFeedRefresh: Date.now(),
  };
}

// default following: everyone the current user follows
const DEFAULT_FOLLOWING = ['u_1', 'u_2', 'u_3', 'u_4', 'u_5', 'u_6', 'u_7', 'u_9', 'u_10'];

function ensureActivity(state, userId) {
  if (state.activity[userId]) return state;
  return {
    ...state,
    activity: {
      ...state.activity,
      [userId]: {
        likes: [], saves: [],
        following: userId === ME ? [...DEFAULT_FOLLOWING] : ['u_1'],
        seenStories: [], seenReels: [],
      },
    },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    // merge onto a fresh seed so new seed content shows up
    const base = initialState();
    const merged = { ...base, ...saved };
    merged.activity = saved.activity || {};
    return merged;
  } catch {
    return null;
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch { /* quota — ignore */ }
}

// ---------- reducer ----------
function reducer(state, action) {
  let s = state;
  switch (action.type) {
    case 'theme':
      s = { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
      break;
    case 'switchAccount': {
      s = { ...state, currentUserId: action.userId };
      s = ensureActivity(s, action.userId);
      s = { ...s, switchedAt: { ...s.switchedAt, [action.userId]: new Date().toISOString() } };
      break;
    }
    case 'like': {
      s = ensureActivity(state, state.currentUserId);
      const uid = s.currentUserId;
      const a = s.activity[uid];
      const has = a.likes.includes(action.postId);
      s = {
        ...s,
        activity: { ...s.activity, [uid]: { ...a, likes: has ? a.likes.filter((x) => x !== action.postId) : [...a.likes, action.postId] } },
      };
      break;
    }
    case 'save': {
      s = ensureActivity(state, state.currentUserId);
      const uid = s.currentUserId;
      const a = s.activity[uid];
      const has = a.saves.includes(action.postId);
      s = {
        ...s,
        activity: { ...s.activity, [uid]: { ...a, saves: has ? a.saves.filter((x) => x !== action.postId) : [...a.saves, action.postId] } },
      };
      break;
    }
    case 'likeReel': {
      s = ensureActivity(state, state.currentUserId);
      const uid = s.currentUserId;
      const a = s.activity[uid];
      const has = a.likes.includes(action.reelId);
      s = {
        ...s,
        reelLikes: { ...s.reelLikes, [action.reelId]: (s.reelLikes[action.reelId] || 0) + (has ? -1 : 1) },
        activity: { ...s.activity, [uid]: { ...a, likes: has ? a.likes.filter((x) => x !== action.reelId) : [...a.likes, action.reelId] } },
      };
      break;
    }
    case 'follow': {
      s = ensureActivity(state, state.currentUserId);
      const uid = s.currentUserId;
      const a = s.activity[uid];
      const has = a.following.includes(action.userId);
      const following = has ? a.following.filter((x) => x !== action.userId) : [...a.following, action.userId];
      s = { ...s, activity: { ...s.activity, [uid]: { ...a, following } } };
      break;
    }
    case 'seenStory': {
      s = ensureActivity(state, state.currentUserId);
      const uid = s.currentUserId;
      const a = s.activity[uid];
      if (a.seenStories.includes(action.storyId)) break;
      s = { ...s, activity: { ...s.activity, [uid]: { ...a, seenStories: [...a.seenStories, action.storyId] } } };
      break;
    }
    case 'seenReel': {
      s = ensureActivity(state, state.currentUserId);
      const uid = s.currentUserId;
      const a = s.activity[uid];
      if (a.seenReels.includes(action.reelId)) break;
      s = { ...s, activity: { ...s.activity, [uid]: { ...a, seenReels: [...a.seenReels, action.reelId] } } };
      break;
    }
    case 'addComment': {
      const list = s.extraComments[action.postId] || [];
      s = {
        ...s,
        extraComments: {
          ...s.extraComments,
          [action.postId]: [...list, { id: `c_${Date.now()}`, userId: s.currentUserId, text: action.text, likes: 0, at: new Date().toISOString() }],
        },
      };
      break;
    }
    case 'createPost': {
      const post = {
        id: `custom_${Date.now()}`,
        authorId: s.currentUserId,
        image: action.image,
        caption: action.caption,
        tags: (action.caption.match(/#\w+/g) || []).map((t) => t.slice(1)),
        likes: 0,
        comments: 0,
        location: action.location || null,
        inFeed: true,
        explore: true,
        hot: true,
        createdAt: new Date().toISOString(),
        aspect: '1 / 1',
      };
      s = { ...s, customPosts: [post, ...s.customPosts] };
      break;
    }
    case 'deletePost':
      s = { ...s, customPosts: s.customPosts.filter((p) => p.id !== action.postId) };
      break;
    case 'markNotifSeen':
      s = { ...s, notifSeen: true };
      break;
    case 'sendMessage': {
      const msg = { id: `m_${Date.now()}`, from: s.currentUserId, text: action.text, at: new Date().toISOString() };
      s = {
        ...s,
        chats: s.chats.map((c) => (c.id === action.chatId ? { ...c, messages: [...c.messages, msg], at: msg.at } : c)),
      };
      break;
    }
    case 'receiveMessage': {
      const msg = { id: `m_${Date.now()}_r`, from: action.from, text: action.text, at: new Date().toISOString() };
      s = {
        ...s,
        chats: s.chats.map((c) =>
          c.id === action.chatId ? { ...c, messages: [...c.messages, msg], at: msg.at, unread: action.unread ? c.unread + 1 : c.unread } : c,
        ),
      };
      break;
    }
    case 'markChatRead':
      s = { ...s, chats: s.chats.map((c) => (c.id === action.chatId ? { ...c, unread: 0 } : c)) };
      break;
    case 'addStory':
      s = {
        ...s,
        stories: s.stories.map((st) =>
          st.userId === s.currentUserId
            ? { ...st, items: [...st.items, { id: `s_${Date.now()}`, image: action.image, at: new Date().toISOString(), caption: action.caption }] }
            : st,
        ),
      };
      break;
    case 'refreshFeed':
      s = { ...s, lastFeedRefresh: Date.now() };
      break;
    case 'reset':
      s = initialState();
      break;
    default:
      return state;
  }
  save(s);
  return s;
}

// ---------- context ----------
const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => load() || initialState());
  const [route, setRoute] = useState(parseHash);

  // ensure activity exists for current user (first load / migrated state)
  const ensured = useMemo(() => ensureActivity(state, state.currentUserId), [state]);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = ensured.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', ensured.theme === 'dark' ? '#000000' : '#ffffff');
  }, [ensured.theme]);

  // delayed auto-reply after sending a message
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const activity = ensured.activity[ensured.currentUserId];

  const api = useMemo(() => {
    const me = userById(ensured.currentUserId) || userById(ME);
    const allPosts = [...ensured.customPosts, ...ensured.posts];

    const isLiked = (id) => activity.likes.includes(id);
    const isSaved = (id) => activity.saves.includes(id);
    const isFollowing = (uid) => activity.following.includes(uid);

    const toggleLike = (postId) => dispatch({ type: 'like', postId });
    const toggleSave = (postId) => dispatch({ type: 'save', postId });
    const toggleLikeReel = (reelId) => dispatch({ type: 'likeReel', reelId });
    const toggleFollow = (userId) => dispatch({ type: 'follow', userId });

    const likeCount = (post) => post.likes + (isLiked(post.id) && !seedLiked(post.id, activity) ? 1 : 0) + (seedLiked(post.id, activity) && isLiked(post.id) ? 0 : 0);

    const sendChatMessage = (chatId, text) => {
      dispatch({ type: 'sendMessage', chatId, text });
      const chat = ensured.chats.find((c) => c.id === chatId);
      if (!chat) return;
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const t = setTimeout(() => {
        dispatch({ type: 'receiveMessage', chatId, from: chat.userId, text: reply, unread: true });
      }, 900 + Math.random() * 1400);
      timers.current.push(t);
    };

    return {
      me,
      route,
      go,
      state: ensured,
      activity,
      allPosts,
      isLiked,
      isSaved,
      isFollowing,
      toggleLike,
      toggleSave,
      toggleLikeReel,
      toggleFollow,
      likeCount,
      dispatch,
      sendChatMessage,
      timeAgo,
      formatCount,
    };
  }, [ensured, activity, route]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

// seed posts were "pre-liked" historically? no — helper kept for clarity
function seedLiked() { return false; }

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp outside AppProvider');
  return v;
}

// ---------- feed ranking (mirrors IG's gather → score → order) ----------
/**
 * Signals (in spirit of Meta's published ranking):
 *  - relationship: followed authors (big boost), own posts pinned first
 *  - affinity: authors you liked/commented before
 *  - engagement: like+comment volume (log-scaled)
 *  - recency: exponential decay over ~3 days
 *  - diversity: never two consecutive posts by the same author
 */
export function rankFeed(posts, activity, allPosts) {
  const likedAuthors = new Set(
    allPosts.filter((p) => activity.likes.includes(p.id)).map((p) => p.authorId),
  );
  const now = Date.now();

  const scored = posts.map((p) => {
    const ageH = (now - new Date(p.createdAt).getTime()) / 3_600_000;
    let score = 0;
    if (p.authorId === ME || p.authorId === activity.selfId) score += 1000; // own/custom pinned
    if (activity.following.includes(p.authorId)) score += 40;               // relationship
    if (likedAuthors.has(p.authorId)) score += 18;                          // affinity
    score += Math.log10(1 + p.likes + p.comments * 3) * 6;                  // engagement
    score += Math.exp(-ageH / 48) * 30;                                     // recency
    score += Math.random() * 4;                                             // jitter (freshness variety)
    return { p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // diversity pass: no 2-in-a-row same author (IG's adjacency rule)
  const out = [];
  const pool = scored.map((x) => x.p);
  let lastAuthor = null;
  while (pool.length) {
    let idx = pool.findIndex((p) => p.authorId !== lastAuthor);
    if (idx === -1) idx = 0;
    const [next] = pool.splice(idx, 1);
    out.push(next);
    lastAuthor = next.authorId;
  }
  return out;
}

// ---------- explore ranking (interest, mostly non-followed) ----------
export function rankExplore(posts, activity, followed) {
  const likedAuthors = new Set(posts.filter((p) => activity.likes.includes(p.id)).map((p) => p.authorId));
  const now = Date.now();
  return posts
    .map((p) => {
      const ageH = (now - new Date(p.createdAt).getTime()) / 3_600_000;
      let score = Math.log10(1 + p.likes + p.comments * 3) * 10;
      if (followed.includes(p.authorId)) score -= 12; // explore prefers discovery
      if (likedAuthors.has(p.authorId)) score += 14;
      if (p.hot) score += 20;
      score += Math.exp(-ageH / 72) * 15;
      score += Math.random() * 6;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

// ---------- Reels chaining (IG: ~100 candidates, interest-chained) ----------
/**
 * Builds the reel watch order: starts from unseen reels, and after each
 * watched/liked reel, boosts same-genre candidates to the front (chaining).
 */
export function chainReels(reels, activity, likedReelIds) {
  const unseen = reels.filter((r) => !activity.seenReels.includes(r.id));
  const rest = reels.filter((r) => activity.seenReels.includes(r.id));
  const pool = [...unseen, ...rest];
  const out = [];
  const used = new Set();
  let anchorGenre = null;

  while (out.length < pool.length) {
    let best = null;
    let bestScore = -Infinity;
    for (const r of pool) {
      if (used.has(r.id)) continue;
      let score = Math.log10(1 + r.views) * 5 + Math.random() * 8;
      if (!activity.seenReels.includes(r.id)) score += 25;        // unseen first
      if (anchorGenre && r.genre === anchorGenre) score += 30;    // chaining boost
      if (likedReelIds.includes(r.id)) score += 10;
      if (score > bestScore) { bestScore = score; best = r; }
    }
    if (!best) break;
    used.add(best.id);
    out.push(best);
    anchorGenre = best.genre; // chain: next pick leans toward this genre
  }
  return out;
}

// ---------- stories ordering (closeness: unseen first, then recency) ----------
export function orderStories(stories, activity, followed) {
  const seen = (s) => s.items.every((i) => activity.seenStories.includes(i.id));
  return [...stories].sort((a, b) => {
    const aFollowed = followed.includes(a.userId) || a.userId === activity.selfId;
    const bFollowed = followed.includes(b.userId) || b.userId === activity.selfId;
    if (aFollowed !== bFollowed) return aFollowed ? -1 : 1;
    const aSeen = seen(a), bSeen = seen(b);
    if (aSeen !== bSeen) return aSeen ? 1 : -1;
    const aLast = Math.max(...a.items.map((i) => new Date(i.at).getTime()));
    const bLast = Math.max(...b.items.map((i) => new Date(i.at).getTime()));
    return bLast - aLast;
  });
}
