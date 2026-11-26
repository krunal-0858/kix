import React, { useEffect, useRef, useState } from 'react';
import { useApp, go } from '../store.jsx';
import { userById, timeAgo, fullCount } from '../data.js';
import { Avatar, Img, Modal, PostActions, TimeAgo } from '../ui.jsx';
import { IconChevronLeft, IconChevronRight, IconClose, IconHeart, IconEmoji, IconVerified } from '../icons.jsx';

function Comments({ post, inputRef }) {
  const { state, dispatch, isLiked } = useApp();
  const seed = state.comments[post.id] || [];
  const extra = state.extraComments[post.id] || [];
  const list = [...seed, ...extra];
  const author = userById(post.authorId);
  const [text, setText] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    dispatch({ type: 'addComment', postId: post.id, text: t });
    setText('');
  };

  return (
    <>
      <div className="pm-comments">
        <div className="pm-comment head-comment">
          <Avatar user={author} size={32} />
          <div className="pm-comment-body">
            <div>
              <strong className="pm-cuser" onClick={() => { go(`/profile/${author.username}`); }}>{author.username}</strong>
              {author.verified && <IconVerified size={11} />}
            </div>
            <p>{post.caption}</p>
            <span className="pm-ctime">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        {list.map((c) => {
          const cu = userById(c.userId);
          return (
            <div key={c.id || `${c.userId}-${c.at}`} className="pm-comment">
              <Avatar user={cu} size={32} />
              <div className="pm-comment-body">
                <div>
                  <strong className="pm-cuser" onClick={() => { go(`/profile/${cu.username}`); }}>{cu?.username}</strong>
                  {cu?.verified && <IconVerified size={11} />}
                </div>
                <p>{c.text}</p>
                <span className="pm-ctime">{timeAgo(c.at)} · {c.likes ? `${c.likes} likes` : 'Reply'}</span>
              </div>
              <button type="button" className="pm-comment-like" aria-label="Like comment"><IconHeart size={13} /></button>
            </div>
          );
        })}
        {!list.length && <p className="pm-nocomments">No comments yet.</p>}
      </div>

      <div className="pm-foot">
        <PostActions post={post} />
        <div className="pm-likes"><strong>{fullCount(post.likes + (isLiked(post.id) ? 1 : 0))}</strong> likes</div>
        <div className="pm-time">{timeAgo(post.createdAt).toUpperCase()} AGO</div>
        <form className="pm-input" onSubmit={submit}>
          <button type="button" className="icon-btn" aria-label="Emoji"><IconEmoji size={22} /></button>
          <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment…" aria-label="Add a comment" />
          {text.trim() && <button type="submit" className="link-btn">Post</button>}
        </form>
      </div>
    </>
  );
}

export default function PostModal({ postId, onClose, onNav }) {
  const { allPosts } = useApp();
  const inputRef = useRef(null);
  const index = allPosts.findIndex((p) => p.id === postId);
  const post = allPosts[index];
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(false); const t = setTimeout(() => setLoaded(true), 250); return () => clearTimeout(t); }, [postId]);

  useEffect(() => { if (!post) onClose(); }, [post, onClose]);

  if (!post) return null;
  const author = userById(post.authorId);

  return (
    <Modal onClose={onClose} className="post-modal">
      <button type="button" className="pm-nav prev" disabled={index <= 0} onClick={() => onNav(allPosts[index - 1].id)} aria-label="Previous post">
        <IconChevronLeft size={18} />
      </button>
      <div className="pm-media"><Img src={post.image} alt={post.caption} seed={post.id} /></div>
      <div className="pm-side">
        <header className="pm-head">
          <Avatar user={author} size={32} ring onClick={() => { onClose(); go(`/profile/${author.username}`); }} className="as-btn" />
          <button type="button" className="pm-user" onClick={() => { onClose(); go(`/profile/${author.username}`); }}>
            {author.username}{author.verified && <IconVerified size={12} />}
          </button>
          <span className="post-dot">·</span>
          <button type="button" className="link-btn" onClick={() => {}}>Follow</button>
          <span className="post-dot">·</span>
          <TimeAgo iso={post.createdAt} />
        </header>
        {!loaded ? <div className="pm-loading">Loading…</div> : <Comments post={post} inputRef={inputRef} />}
      </div>
      <button type="button" className="pm-close" onClick={onClose} aria-label="Close"><IconClose size={20} /></button>
      <button type="button" className="pm-nav next" disabled={index >= allPosts.length - 1} onClick={() => onNav(allPosts[index + 1].id)} aria-label="Next post">
        <IconChevronRight size={18} />
      </button>
    </Modal>
  );
}
