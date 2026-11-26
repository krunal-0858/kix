import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp, go } from '../store.jsx';
import { userById, timeAgo } from '../data.js';
import { Avatar, Modal, Empty } from '../ui.jsx';
import {
  IconChevronLeft, IconMessage, IconPhoto, IconEmoji, IconHeart, IconSend, IconPlus, IconVerified,
} from '../icons.jsx';

function NewChatModal({ onClose, onPick }) {
  const { activity } = useApp();
  const [q, setQ] = useState('');
  const people = (activity.following.length ? activity.following : ['u_1', 'u_2', 'u_3'])
    .map(userById).filter(Boolean)
    .filter((u) => u.username.includes(q.toLowerCase()));
  return (
    <Modal onClose={onClose} className="newchat-modal">
      <h2>New message</h2>
      <div className="newchat-to">
        <span>To:</span>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
      </div>
      <div className="newchat-list">
        <div className="newchat-sug">Suggested</div>
        {people.map((u) => (
          <button key={u.id} type="button" className="newchat-row" onClick={() => { onPick(u.id); onClose(); }}>
            <Avatar user={u} size={44} />
            <div><strong>{u.username}</strong><span>{u.name}</span></div>
          </button>
        ))}
        {!people.length && <p className="grid-empty">No users found.</p>}
      </div>
    </Modal>
  );
}

function ChatThread({ chat, onBack, isMobile }) {
  const { dispatch, sendChatMessage, me } = useApp();
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const user = userById(chat.userId);

  useEffect(() => {
    dispatch({ type: 'markChatRead', chatId: chat.id });
  }, [chat.id, dispatch, chat.messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [chat.messages.length]);

  const submit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    sendChatMessage(chat.id, t);
    setText('');
  };

  return (
    <div className="chat-thread">
      <header className="chat-head">
        {isMobile && (
          <button type="button" className="icon-btn" onClick={onBack} aria-label="Back"><IconChevronLeft size={22} /></button>
        )}
        <Avatar user={user} size={40} onClick={() => go(`/profile/${user.username}`)} className="as-btn" />
        <div className="chat-head-info">
          <button type="button" className="chat-head-name" onClick={() => go(`/profile/${user.username}`)}>
            {user.username}{user.verified && <IconVerified size={12} />}
          </button>
          <span className="chat-head-sub">Active {timeAgo(chat.at)} ago</span>
        </div>
        <button type="button" className="icon-btn" aria-label="Call"><IconMessage size={20} /></button>
      </header>

      <div className="chat-scroll">
        <div className="chat-day">{new Date(chat.messages[0]?.at).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</div>
        {chat.messages.map((m, i) => {
          const mine = m.from === me.id;
          const prev = chat.messages[i - 1];
          const showAvatar = !mine && (!prev || prev.from !== m.from);
          return (
            <div key={m.id} className={`bubble-row ${mine ? 'mine' : ''}`}>
              {!mine && (
                <span className="bubble-avatar" style={{ visibility: showAvatar ? 'visible' : 'hidden' }}>
                  <Avatar user={user} size={28} />
                </span>
              )}
              <div className={`bubble ${mine ? 'mine' : ''}`}>{m.text}</div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form className="chat-input" onSubmit={submit}>
        <button type="button" className="icon-btn" aria-label="Emoji"><IconEmoji size={22} /></button>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message…" aria-label="Message" />
        {text.trim() ? (
          <button type="submit" className="send-btn" aria-label="Send"><IconSend size={18} /></button>
        ) : (
          <>
            <button type="button" className="icon-btn" aria-label="Photo"><IconPhoto size={22} /></button>
            <button type="button" className="icon-btn" aria-label="Like"><IconHeart size={22} /></button>
          </>
        )}
      </form>
    </div>
  );
}

export default function Messages({ activeId }) {
  const { state, me } = useApp();
  const [newOpen, setNewOpen] = useState(false);
  const [mobileThread, setMobileThread] = useState(!!activeId);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const chats = useMemo(
    () => [...state.chats].sort((a, b) => new Date(b.at) - new Date(a.at)),
    [state.chats],
  );
  const active = activeId ? chats.find((c) => c.userId === activeId || c.id === activeId) : chats[0];

  // route param picks the conversation
  useEffect(() => {
    if (activeId) setMobileThread(true);
  }, [activeId]);

  if (!chats.length) {
    return <div className="messages-page"><Empty icon={<IconMessage size={44} />} title="Your messages" sub="Send a message to start a chat." /></div>;
  }

  return (
    <div className="messages-page">
      <div className={`msg-list ${mobileThread && isMobile ? 'hidden' : ''}`}>
        <header className="msg-list-head">
          <h1>{me.username}</h1>
          <button type="button" className="icon-btn" onClick={() => setNewOpen(true)} aria-label="New message"><IconPlus size={22} /></button>
        </header>
        <div className="msg-tabs">
          <button type="button" className="msg-tab active">Messages</button>
          <button type="button" className="msg-tab">Requests</button>
        </div>
        <div className="msg-rows">
          {chats.map((c) => {
            const u = userById(c.userId);
            const last = c.messages[c.messages.length - 1];
            return (
              <button
                key={c.id} type="button"
                className={`msg-row ${active?.id === c.id ? 'active' : ''} ${c.unread ? 'unread' : ''}`}
                onClick={() => { go(`/messages/${c.userId}`); setMobileThread(true); }}
              >
                <Avatar user={u} size={56} />
                <div className="msg-row-info">
                  <span className="msg-row-name">{u.username}</span>
                  <span className="msg-row-last">
                    {last?.from === me.id ? 'You: ' : ''}{last?.text}
                    <span className="msg-row-time"> · {timeAgo(c.at)}</span>
                  </span>
                </div>
                {c.unread > 0 && <span className="unread-dot" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`msg-thread ${!mobileThread && isMobile ? 'hidden' : ''}`}>
        {active ? (
          <ChatThread key={active.id} chat={active} isMobile={isMobile} onBack={() => { go('/messages'); setMobileThread(false); }} />
        ) : (
          <div className="chat-empty">
            <span className="chat-empty-ico"><IconMessage size={40} /></span>
            <h2>Your messages</h2>
            <p>Send a message to start a chat.</p>
            <button type="button" className="btn-primary" onClick={() => setNewOpen(true)}>Send message</button>
          </div>
        )}
      </div>

      {newOpen && (
        <NewChatModal
          onClose={() => setNewOpen(false)}
          onPick={(uid) => { go(`/messages/${uid}`); setMobileThread(true); }}
        />
      )}
    </div>
  );
}
