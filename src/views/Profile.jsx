import React, { useMemo, useState } from 'react';
import { useApp, go } from '../store.jsx';
import { USERS, userByName, formatCount, fullCount, img } from '../data.js';
import { Avatar, Img, FollowButton, Modal, Empty } from '../ui.jsx';
import {
  IconGrid, IconBookmark, IconTagged, IconSettings, IconChevronDown, IconVerified, IconHeart, IconComment, IconPlay, IconPlus,
} from '../icons.jsx';

function EditProfileModal({ onClose }) {
  const { me } = useApp();
  const [name, setName] = useState(me.name);
  const [bio, setBio] = useState(me.bio);
  const [website, setWebsite] = useState(me.website || '');
  const save = () => {
    // demo: local edit only (identity edits are illustrative)
    onClose();
  };
  return (
    <Modal onClose={onClose} className="edit-modal">
      <h2 id="edit-title">Edit profile</h2>
      <div className="edit-row">
        <Avatar user={me} size={56} />
        <div className="edit-name">
          <strong>{me.username}</strong>
          <button type="button" className="link-btn">Change photo</button>
        </div>
      </div>
      <label className="field"><span>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} />
      </label>
      <label className="field"><span>Bio</span>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={150} />
        <em className="field-count">{bio.length}/150</em>
      </label>
      <label className="field"><span>Website</span>
        <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website" />
      </label>
      <div className="edit-actions">
        <button type="button" className="btn-primary" onClick={save}>Submit</button>
        <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function SwitchAccountModal({ onClose }) {
  const { dispatch, me } = useApp();
  const others = USERS.filter((u) => u.id !== me.id).slice(0, 6);
  return (
    <Modal onClose={onClose} className="switch-modal">
      <h2>Switch account</h2>
      <button type="button" className="switch-row current" onClick={onClose}>
        <Avatar user={me} size={44} />
        <div><strong>{me.username}</strong><span>Current account</span></div>
        <span className="check">✓</span>
      </button>
      {others.map((u) => (
        <button key={u.id} type="button" className="switch-row"
          onClick={() => { dispatch({ type: 'switchAccount', userId: u.id }); onClose(); }}>
          <Avatar user={u} size={44} />
          <div><strong>{u.username}</strong><span>{u.name}</span></div>
        </button>
      ))}
      <button type="button" className="link-btn center" onClick={() => go('/create')}>Add account</button>
    </Modal>
  );
}

function PostGridItem({ post, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button" className="profile-tile"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(post.id)}
    >
      <Img src={post.image} alt={post.caption.slice(0, 50)} seed={post.id} />
      {post.aspect === '4 / 5' && <span className="tile-mark portrait-mark" />}
      {reelMark(post) && <span className="tile-mark reel-mark"><IconPlay size={14} /></span>}
      <span className={`tile-stats ${hover ? 'show' : ''}`}>
        <span><IconHeart size={16} filled /> {formatCount(post.likes)}</span>
        <span><IconComment size={16} /> {formatCount(post.comments)}</span>
      </span>
    </button>
  );
}
function reelMark(post) { return post.id.startsWith('r_'); }

export default function Profile({ username, onOpenPost, onMenu }) {
  const { me, activity, allPosts } = useApp();
  const [tab, setTab] = useState('posts');

  const user = username ? userByName(username) || userByName('krunal') : me;
  const isMe = user.id === me.id;

  const posts = useMemo(
    () => allPosts.filter((p) => p.authorId === user.id),
    [allPosts, user.id],
  );
  const savedPosts = allPosts.filter((p) => activity.saves.includes(p.id));
  const likedPosts = allPosts.filter((p) => activity.likes.includes(p.id));

  const followers = user.followers + (isMe ? 0 : 0);
  const following = isMe ? activity.following.length : user.following;

  const [editOpen, setEditOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);

  const gridSource = tab === 'posts' ? posts : tab === 'saved' ? savedPosts : likedPosts;

  return (
    <div className="profile-page">
      <header className="profile-head">
        <div className="profile-avatar">
          <Avatar user={user} size={150} ring />
        </div>
        <div className="profile-info">
          <div className="profile-toprow">
            <h1 className="profile-username">
              {user.username}
              {user.verified && <IconVerified size={16} />}
            </h1>
            {isMe ? (
              <>
                <button type="button" className="btn-secondary" onClick={() => setEditOpen(true)}>Edit profile</button>
                <button type="button" className="btn-secondary" onClick={() => setSwitchOpen(true)}>Switch account</button>
                <button type="button" className="icon-btn" aria-label="Settings" onClick={onMenu}><IconSettings size={22} /></button>
              </>
            ) : (
              <>
                <FollowButton userId={user.id} />
                <button type="button" className="btn-secondary" onClick={() => go('/messages')}>Message</button>
                <button type="button" className="icon-btn" aria-label="More"><IconChevronDown size={20} /></button>
              </>
            )}
          </div>
          <div className="profile-stats">
            <span><strong>{fullCount(posts.length)}</strong> posts</span>
            <span><strong>{fullCount(followers)}</strong> followers</span>
            <span><strong>{fullCount(following)}</strong> following</span>
          </div>
          <div className="profile-bio">
            <strong>{user.name}</strong>
            {(user.bio || '').split('\n').map((line, i) => <div key={i}>{line}</div>)}
            {user.website && <a href="#/" className="profile-web">{user.website}</a>}
          </div>
        </div>
      </header>

      <div className="profile-highlights">
        {['Personal', 'Travel', 'Design', 'Music'].map((h, i) => (
          <div key={h} className="highlight">
            <span className="highlight-ring">
              <Img src={img(`kix-hl-${h}`, 160, 160)} alt={h} seed={`hl${i}`} />
            </span>
            <span>{h}</span>
          </div>
        ))}
        {isMe && (
          <button type="button" className="highlight new" onClick={() => go('/create')}>
            <span className="highlight-ring"><IconPlus size={24} /></span>
            <span>New</span>
          </button>
        )}
      </div>

      <nav className="profile-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'posts'} className={`ptab ${tab === 'posts' ? 'active' : ''}`} onClick={() => setTab('posts')}>
          <IconGrid size={14} /> Posts
        </button>
        {isMe && (
          <button type="button" role="tab" aria-selected={tab === 'saved'} className={`ptab ${tab === 'saved' ? 'active' : ''}`} onClick={() => setTab('saved')}>
            <IconBookmark size={14} /> Saved
          </button>
        )}
        <button type="button" role="tab" aria-selected={tab === 'tagged'} className={`ptab ${tab === 'tagged' ? 'active' : ''}`} onClick={() => setTab('tagged')}>
          <IconTagged size={14} /> {isMe ? 'Liked' : 'Tagged'}
        </button>
      </nav>

      {gridSource.length ? (
        <div className="profile-grid">
          {gridSource.map((p) => <PostGridItem key={p.id} post={p} onOpen={onOpenPost} />)}
        </div>
      ) : (
        <Empty
          icon={<IconGrid size={44} />}
          title={tab === 'posts' ? 'Share Photos' : tab === 'saved' ? 'Nothing saved yet' : 'Nothing liked yet'}
          sub={tab === 'posts' ? 'When you share photos, they will appear on your profile.' : 'Save posts and videos that you want to see again.'}
        />
      )}

      {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} />}
      {switchOpen && <SwitchAccountModal onClose={() => setSwitchOpen(false)} />}
    </div>
  );
}
