# KIX

**KIX** is an unofficial, educational replica of Instagram — a full social app experience built as a pure client-side React + Vite single-page application. No backend, no real accounts: everything (posts, stories, reels, chats, notifications) is seeded locally and persisted in `localStorage`.

> ⚠️ **Disclaimer:** KIX is an independent educational project. It is **not** affiliated with, endorsed by, or connected to Instagram or Meta Platforms, Inc. All branding here is "KIX"; no Instagram/Meta logos or proprietary assets are used.

---

## How Instagram works (and how KIX mirrors it)

### 1. The Home Feed — gather → score → order
Instagram doesn't show posts chronologically. Its ranking system **narrows ~700 candidate posts to ~500**, scores them with a personalized model, then applies diversity rules. Top signals: **watch time, likes, and sends**, plus how recently you interacted with the author.

**KIX's `rankFeed()`** implements the same pipeline:
- **Relationship boost** — posts from accounts you follow score highest; your own posts are pinned first.
- **Affinity** — authors you've liked before get a bonus (learned preference).
- **Engagement** — `log(1 + likes + 3×comments)` so viral posts rise without dominating.
- **Recency** — exponential decay (`e^(-ageH/48)`) so fresh content gets a window.
- **Jitter** — a small random term keeps the feed from feeling static between refreshes.
- **Diversity pass** — a greedy adjacency rule guarantees **no two consecutive posts by the same author** (Instagram's known 2-in-a-row restriction).

### 2. Explore — interest-based discovery
Explore is mostly **non-followed content**: Instagram gathers ~100 candidates ranked by predicted interest, not by who you follow.

**KIX's `rankExplore()`** flips the relationship signal (followed authors are *penalized*), boosts engagement, and favors posts you've liked from before — then renders a **dense 3-column grid with periodic double-height tiles**, exactly like IG's signature masonry look.

### 3. Reels — chained recommendations
Instagram's *Reels Chaining* system picks ~100 candidate reels and **chains them**: your reaction to one reel (watch, like, skip) reshapes what comes next — e.g., liking a cooking reel pulls more cooking reels forward.

**KIX's `chainReels()`** runs a greedy anchor loop: unseen reels first, and after each pick the next candidate gets a **+30 genre bonus if it matches the watched reel's genre**. The player is a scroll-snap vertical video surface with ken-burns motion, IntersectionObserver-style active-index tracking, double-tap-to-like, and a live progress bar.

### 4. Stories — closeness ordering
Stories aren't chronological either: they're ordered by **closeness** (how often you view/reply to someone) with unseen stories first.

**KIX's `orderStories()`** sorts: followed → unseen → most recent. The viewer auto-advances each item in **5 seconds** with segmented progress bars, hold-to-pause, arrow-key navigation, and marks items seen (persisted per account).

### 5. Notifications, DMs, multi-account
- **Notifications** group by Today / This week / Earlier, with inline thumbs for post likes and inline Follow buttons.
- **Messages** behave like DM threads: send a message and the other account **auto-replies after a short delay**, unread badges drive the sidebar/mobile counters.
- **Account switching** (Profile → Switch account, or the sidebar menu) swaps the entire activity scope — likes, saves, following, and seen stories are stored **per userId** (`activity[userId]`), just like IG's multi-account model.

---

## Features

| Area | Details |
|---|---|
| 🏠 **Feed** | Ranked feed, stories rail, double-tap like + heart burst, load-more → "You're all caught up", suggestions sidebar |
| 🧭 **Explore** | Engagement-ranked dense grid, All / Following / For you filters, hover like/comment counts |
| 🎬 **Reels** | Full-screen snap player, genre chaining, like/comment/share/save rail, mute toggle, next/prev nav |
| 📖 **Stories** | 5s auto-advance, hold-to-pause, reply bar, seen-state ring (grey after seen) |
| 👤 **Profile** | Stats, bio, highlights, Posts / Saved / Liked tabs, grid hover counts, **Edit profile** modal |
| ➕ **Create** | 2-step flow (pick from gallery → caption + location), posts appear at top of profile & feed |
| 💬 **Messages** | Conversation list, thread view, auto-replies, unread dots, new-message modal |
| 🔔 **Notifications** | Grouped timeline, follow buttons, post thumbnails |
| 🔍 **Search** | Slide-out panel: accounts, tags, recent searches, post result grid |
| 🌙 **Theme** | Light default + dark mode toggle (persisted) |
| 📱 **Responsive** | Desktop sidebar → tablet icon rail → mobile bottom nav + full-bleed layouts |

## Tech

- **React 19 + Vite** — pure SPA, zero backend
- **Hash router** (`#/explore`, `#/reels`, `#/messages/:user`, `#/profile/:user`, `#/post/:id`, `#/tag/:tag`)
- **State**: `useReducer` + React Context, persisted to `localStorage` (`kix_state_v1`)
- **Images**: `picsum.photos` seeds + `pravatar.cc` avatars, each with a **gradient fallback** on error
- **Icons**: hand-drawn SVG set in `src/icons.jsx` (no icon library)
- **Lint**: oxlint · **Build**: `vite build`

## Run

```bash
npm install
npm run dev      # http://localhost:5180 (strict; frees stale ports first)
npm run build    # production build → dist/
npm run lint     # oxlint
npm run preview  # serve the build on :5180
```

> Use `npm.cmd` on Windows PowerShell environments where `npm.ps1` is blocked.

## Project structure

```
KIX/
├─ index.html                 # KIX title + SVG camera favicon
├─ vite.config.js             # port 5180 strict
├─ scripts/free-ports.mjs     # IPv6-safe port cleanup (predev/prepreview)
└─ src/
   ├─ main.jsx                # StrictMode + AppProvider
   ├─ App.jsx                 # sidebar / mobile nav / routing / panels
   ├─ store.jsx               # context, hash router, reducer, ranking engines
   ├─ data.js                 # seed users, posts, stories, reels, chats
   ├─ icons.jsx               # SVG icon set
   ├─ ui.jsx                  # Avatar, PostCard, StoryCircle, Modal, Img…
   ├─ index.css               # full IG-style design system (light + dark)
   ├─ views/                  # Feed, Explore, Reels, Profile, Messages
   └─ components/             # StoryViewer, CreateModal, PostModal, SearchPanel, NotificationsPanel
```

## Keyboard shortcuts

| Key | Action |
|---|---|
| `←` / `→` | Previous / next story |
| `Space` | Pause story |
| `Esc` | Close any modal / panel |

---

*Built as a study of how modern social feeds actually work. For education and demo purposes only.*
