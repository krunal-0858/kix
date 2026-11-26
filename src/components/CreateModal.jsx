import React, { useState } from 'react';
import { useApp, go } from '../store.jsx';
import { img } from '../data.js';
import { Avatar, Img } from '../ui.jsx';
import { IconClose, IconChevronLeft, IconEmoji, IconCamera } from '../icons.jsx';

const GALLERY = Array.from({ length: 12 }, (_, i) => img(`kix-gallery-${i}`, 1080, 1080));

export default function CreateModal({ onClose }) {
  const { me, dispatch } = useApp();
  const [step, setStep] = useState(1);
  const [chosen, setChosen] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [sharing, setSharing] = useState(false);

  const share = () => {
    setSharing(true);
    setTimeout(() => {
      dispatch({ type: 'createPost', image: chosen, caption: caption.trim() || '✨', location: location.trim() || null });
      onClose();
      go(`/profile/${me.username}`);
    }, 800);
  };

  return (
    <div className="modal-overlay create-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="create-modal" role="dialog" aria-modal="true" aria-label="Create new post">
        <header className="create-head">
          {step === 2 ? (
            <button type="button" className="icon-btn" onClick={() => setStep(1)} aria-label="Back"><IconChevronLeft size={22} /></button>
          ) : (
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><IconClose size={22} /></button>
          )}
          <h2>{step === 1 ? 'Create new post' : sharing ? 'Sharing…' : 'Share'}</h2>
          {step === 1 ? (
            <span className="create-head-spacer" />
          ) : (
            <button type="button" className="share-link" onClick={share} disabled={sharing}>Share</button>
          )}
        </header>

        {step === 1 ? (
          <div className="create-body">
            <div className="create-title"><IconCamera size={36} /><h3>Create new post</h3><p>Drag photos and videos here</p></div>
            <div className="create-gallery">
              {GALLERY.map((src) => (
                <button key={src} type="button" className={`gallery-cell ${chosen === src ? 'picked' : ''}`}
                  onClick={() => { setChosen(src); setStep(2); }}>
                  <Img src={src} alt="Gallery item" seed={src} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="create-split">
            <div className="create-preview"><Img src={chosen} alt="Selected" seed={chosen} /></div>
            <div className="create-form">
              <div className="create-user"><Avatar user={me} size={28} /><strong>{me.username}</strong></div>
              <textarea className="create-caption" value={caption} onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption…" rows={7} maxLength={2200} autoFocus />
              <div className="create-caption-foot">
                <button type="button" className="icon-btn" aria-label="Emoji"><IconEmoji size={20} /></button>
                <span>{caption.length}/2,200</span>
              </div>
              <input className="create-location" value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location" />
              <div className="create-access">Audience · Everyone <span>▾</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
