import React, { useEffect, useState } from 'react';
import { useApp, go } from './store.jsx';
import { userById, fullCount } from './data.js';
import { Avatar } from './ui.jsx';
import {
  IconHome, IconSearch, IconExplore, IconReels, IconMessage, IconCreate, IconHeart,
  IconThreads, IconMenu, IconLogo, IconMoon, IconSun,
} from './icons.jsx';
import Feed from './views/Feed.jsx';
import Explore from './views/Explore.jsx';
import Reels from './views/Reels.jsx';
import Profile from './views/Profile.jsx';
import Messages from './views/Messages.jsx';
import StoryViewer from './components/StoryViewer.jsx';
import CreateModal from './components/CreateModal.jsx';
import PostModal from './components/PostModal.jsx';
import SearchPanel from './components/SearchPanel.jsx';
import NotificationsPanel from './components/NotificationsPanel.jsx';

function AccountMenu({ onClose }) {
  const { me, state, dispatch, theme } = useApp();
  const others = [
    userById('u_me'),
    ...['u_1', 'u_3', 'u_7'].map(userById),
  ].filter(Boolean).filter((u, i, arr) => arr.findIndex((x) => x.id === u.id) === i);

  return (
    <div className="menu-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="account-menu" role="menu">
        {others.map((u) => (
          <button key={u.id} type="button" className="menu-row" role="menuitem"
            onClick={() => { dispatch({ type: 'switchAccount', userId: u.id }); onClose(); }}>
            <Avatar user={u} size={44} />
            <div className="menu-row-info">
              <strong>{u.username}</strong>
              <span>{u.name}</span>
            </div>
            {state.currentUserId === u.id && <span className="menu-check">✓</span>}
          </button>
        ))}
        <div className="menu-sep" />
        <button type="button" className="menu-row text" role="menuitem" onClick={() => go('/create')}>
          <span className="menu-ico">＋</span> Add account
        </button>
        <button type="button" className="menu-row text" role="menuitem" onClick={() => { go(`/profile/${me.username}`); onClose(); }}>
          <span className="menu-ico">👤</span> Profile
        </button>
        <button type="button" className="menu-row text" role="menuitem" onClick={() => { dispatch({ type: 'theme' }); }}>
          <span className="menu-ico">{theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}</span>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <button type="button" className="menu-row text" role="menuitem" onClick={onClose}>
          <span className="menu-ico">⚙︎</span> Settings
        </button>
        <div className="menu-sep" />
        <button type="button" className="menu-row text danger" role="menuitem" onClick={onClose}>Log out</button>
      </div>
    </div>
  );
}

function Sidebar({ onSearch, onNotifs, onMenu }) {
  const { route, state, me } = useApp();
  const unread = state.chats.reduce((n, c) => n + c.unread, 0);
  const notifDot = !state.notifSeen;

  const items = [
    { key: 'feed', label: 'Home', icon: <IconHome filled={route.name === 'feed'} />, action: () => go('/') },
    { key: 'search', label: 'Search', icon: <IconSearch />, action: onSearch },
    { key: 'explore', label: 'Explore', icon: <IconExplore filled={route.name === 'explore'} />, action: () => go('/explore') },
    { key: 'reels', label: 'Reels', icon: <IconReels filled={route.name === 'reels'} />, action: () => go('/reels') },
    { key: 'messages', label: 'Messages', icon: <IconMessage filled={route.name === 'messages'} />, action: () => go('/messages'), badge: unread },
    { key: 'create', label: 'Create', icon: <IconCreate />, action: () => go('/create') },
    { key: 'notifications', label: 'Notifications', icon: <IconHeart filled={route.name === 'notifications'} />, action: onNotifs, dot: notifDot },
    { key: 'profile', label: 'Profile', icon: null, action: () => go(`/profile/${me.username}`) },
  ];

  return (
    <nav className="sidebar" aria-label="Primary">
      <button type="button" className="sidebar-logo" onClick={() => go('/')} aria-label="KIX home">
        <IconLogo size={30} />
        <span className="logo-word">KIX</span>
      </button>
      <div className="sidebar-items">
        {items.map((it) => (
          <button key={it.key} type="button"
            className={`side-item ${route.name === it.key ? 'active' : ''}`}
            onClick={it.action}>
            <span className="side-ico">
              {it.key === 'profile' ? <Avatar user={me} size={24} ring={route.name === 'profile'} /> : it.icon}
              {it.badge > 0 && <span className="side-badge">{it.badge}</span>}
              {it.dot && <span className="side-dot" />}
            </span>
            <span className="side-label">{it.label}</span>
          </button>
        ))}
        <button type="button" className="side-item" onClick={() => go('/explore')}>
          <span className="side-ico"><IconThreads /></span>
          <span className="side-label">Threads</span>
        </button>
        <button type="button" className="side-item" onClick={onMenu}>
          <span className="side-ico"><IconMenu /></span>
          <span className="side-label">More</span>
        </button>
      </div>
      <div className="sidebar-account">
        <button type="button" className="side-item" onClick={onMenu}>
          <span className="side-ico"><Avatar user={me} size={24} /></span>
          <span className="side-label">{me.username}</span>
        </button>
      </div>
    </nav>
  );
}

function MobileNav({ onSearch, onNotifs }) {
  const { route, state, me } = useApp();
  const unread = state.chats.reduce((n, c) => n + c.unread, 0);
  return (
    <nav className="mobile-nav" aria-label="Primary">
      <button type="button" className={`mob-item ${route.name === 'feed' ? 'active' : ''}`} onClick={() => go('/')} aria-label="Home">
        <IconHome filled={route.name === 'feed'} size={24} />
      </button>
      <button type="button" className="mob-item" onClick={onSearch} aria-label="Search"><IconSearch size={24} /></button>
      <button type="button" className={`mob-item ${route.name === 'explore' ? 'active' : ''}`} onClick={() => go('/explore')} aria-label="Explore">
        <IconExplore filled={route.name === 'explore'} size={24} />
      </button>
      <button type="button" className="mob-item" onClick={() => go('/create')} aria-label="Create">
        <IconCreate size={24} />
      </button>
      <button type="button" className={`mob-item ${route.name === 'reels' ? 'active' : ''}`} onClick={() => go('/reels')} aria-label="Reels">
        <IconReels filled={route.name === 'reels'} size={24} />
      </button>
      <button type="button" className={`mob-item ${route.name === 'messages' ? 'active' : ''}`} onClick={() => go('/messages')} aria-label="Messages">
        <span className="mob-ico"><IconMessage filled={route.name === 'messages'} size={24} />{unread > 0 && <span className="side-badge">{unread}</span>}</span>
      </button>
      <button type="button" className={`mob-item profile-item ${route.name === 'profile' ? 'active' : ''}`} onClick={() => go(`/profile/${me.username}`)} aria-label="Profile">
        <Avatar user={me} size={24} ring={route.name === 'profile'} />
      </button>
      <button type="button" className="mob-item mob-more" onClick={onNotifs} aria-label="Notifications">
        <IconHeart size={22} filled={false} />
        {!state.notifSeen && <span className="side-dot" />}
      </button>
    </nav>
  );
}

export default function App() {
  const { route, state } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [storyUser, setStoryUser] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [postId, setPostId] = useState(null);

  // global route-driven modal states
  useEffect(() => {
    if (route.name === 'create') { setCreateOpen(true); go('/'); }
    if (route.name === 'post') setPostId(route.id);
    else setPostId((p) => (route.name !== 'post' ? null : p));
    if (route.name === 'notifications') { setNotifOpen(true); go('/'); }
    setSearchOpen((s) => (route.name === 'search' ? true : s));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.name, route.id]);

  // close panels on desktop when resizing into mobile, etc. — handled by CSS
  const openPost = (id) => setPostId(id);

  const nav = (id) => setPostId(id);

  return (
    <div className={`app theme-${state.theme}`}>
      <Sidebar
        onSearch={() => setSearchOpen(true)}
        onNotifs={() => setNotifOpen(true)}
        onMenu={() => setMenuOpen(true)}
      />

      <main className="main" id="main">
        {route.name === 'feed' && <Feed onOpenPost={openPost} onOpenStory={setStoryUser} />}
        {route.name === 'explore' && <Explore onOpenPost={openPost} />}
        {route.name === 'reels' && <Reels onOpenComments={openPost} focusId={route.id} />}
        {route.name === 'profile' && <Profile username={route.username} onOpenPost={openPost} onMenu={() => setMenuOpen(true)} />}
        {route.name === 'messages' && <Messages activeId={route.id} />}
        {route.name === 'tag' && <TagView tag={route.tag} onOpenPost={openPost} />}
        {route.name === 'post' && <PostStandalone id={route.id} onOpenPost={openPost} />}
        {!['feed', 'explore', 'reels', 'profile', 'messages', 'tag', 'post'].includes(route.name) && <Feed onOpenPost={openPost} onOpenStory={setStoryUser} />}
      </main>

      <MobileNav onSearch={() => setSearchOpen(true)} onNotifs={() => setNotifOpen(true)} />

      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
      {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
      {menuOpen && <AccountMenu onClose={() => setMenuOpen(false)} />}
      {createOpen && <CreateModal onClose={() => setCreateOpen(false)} />}
      {postId && <PostModal postId={postId} onClose={() => { setPostId(null); if (route.name === 'post') go('/'); }} onNav={nav} />}
      {storyUser && <StoryViewer startUserId={storyUser} onClose={() => setStoryUser(null)} />}
    </div>
  );
}

function TagView({ tag, onOpenPost }) {
  const { allPosts } = useApp();
  const posts = allPosts.filter((p) => p.tags.includes(tag));
  return (
    <div className="tag-page">
      <header className="tag-head">
        <div className="tag-hash-big">#</div>
        <div><h1>{tag}</h1><p>{fullCount(posts.length)} posts</p></div>
      </header>
      <div className="explore-grid">
        {posts.map((p) => (
          <button key={p.id} type="button" className="explore-tile" onClick={() => onOpenPost(p.id)}>
            <img src={p.image} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      {!posts.length && <p className="grid-empty">No posts with #{tag}.</p>}
    </div>
  );
}

function PostStandalone({ id, onOpenPost }) {
  const { allPosts } = useApp();
  const post = allPosts.find((p) => p.id === id);
  useEffect(() => { if (!post) go('/'); }, [post]);
  if (!post) return <div className="post-page"><p className="grid-empty">Post not found.</p></div>;
  return (
    <div className="post-page">
      <button type="button" className="link-btn" onClick={() => go('/')}>← Back to feed</button>
      <div className="post-page-card">
        <img className="post-page-img" src={post.image} alt={post.caption} />
        <div className="post-page-meta">
          <strong>{userById(post.authorId)?.username}</strong>
          <p>{post.caption}</p>
          <span>{fullCount(post.likes)} likes · {fullCount(post.comments)} comments</span>
          <button type="button" className="btn-primary" onClick={() => onOpenPost(post.id)}>Open comments</button>
        </div>
      </div>
    </div>
  );
}
