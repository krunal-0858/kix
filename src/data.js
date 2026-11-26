/**
 * KIX seed data — users, posts, stories, reels, notifications, chats.
 * Images: picsum.photos (posts) + i.pravatar.cc (avatars), with gradient
 * fallback handled in <Img/>.
 */

// ---------- helpers ----------
export function timeAgo(iso) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo`;
  return `${Math.floor(d / 365)}y`;
}

export function formatCount(n) {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const v = n / 1000;
    return `${v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, '')}K`;
  }
  const v = n / 1_000_000;
  return `${v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, '')}M`;
}

export function fullCount(n) {
  return n.toLocaleString('en-US');
}

export function shortTimeAgo(iso) {
  return timeAgo(iso);
}

const hoursAgo = (h) => new Date(Date.now() - h * 3600_000).toISOString();
const daysAgo = (d) => new Date(Date.now() - d * 86_400_000).toISOString();

export const img = (seed, w = 1080, h = 1080) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
export const avatar = (n) => `https://i.pravatar.cc/150?img=${n}`;

// ---------- users ----------
export const ME = 'u_me';

export const USERS = [
  {
    id: 'u_me', username: 'krunal', name: 'Krunal', avatar: avatar(12),
    bio: 'Building things & taking photos 📷\nKIX demo account', website: 'krunal.dev',
    verified: false, followers: 842, following: 531, category: 'Personal',
  },
  { id: 'u_1', username: 'mia.chen', name: 'Mia Chen', avatar: avatar(5), verified: true,
    bio: 'Product designer ✨\nCity light chaser', followers: 128400, following: 892, category: 'Design' },
  { id: 'u_2', username: 'leo.travels', name: 'Leo Marchetti', avatar: avatar(33), verified: false,
    bio: '🌍 41 countries and counting\nNew post every Tuesday', followers: 45210, following: 1104, category: 'Travel' },
  { id: 'u_3', username: 'nova.sounds', name: 'Nova', avatar: avatar(45), verified: true,
    bio: 'producer / dj 🎧\nEP “Nightline” out now', followers: 302800, following: 213, category: 'Music' },
  { id: 'u_4', username: 'bytechef', name: 'Arjun Rao', avatar: avatar(60), verified: false,
    bio: 'Cooking with code 🍳\nRecipes in 60 seconds', followers: 22150, following: 640, category: 'Food' },
  { id: 'u_5', username: 'aria.fitness', name: 'Aria Kowalski', avatar: avatar(31), verified: true,
    bio: 'Trainer 💪\nMove well, live long', followers: 89400, following: 301, category: 'Fitness' },
  { id: 'u_6', username: 'pixelwander', name: 'Sam Okafor', avatar: avatar(14), verified: false,
    bio: 'Street photographer 📸\nShadows & neon', followers: 15980, following: 788, category: 'Photography' },
  { id: 'u_7', username: 'luna.codes', name: 'Luna Petrova', avatar: avatar(47), verified: false,
    bio: 'Frontend engineer ⚡\nReact + CSS nerd', followers: 9840, following: 412, category: 'Tech' },
  { id: 'u_8', username: 'theo.paints', name: 'Theo Laurent', avatar: avatar(52), verified: false,
    bio: 'Painter 🎨\nCommissions open', followers: 33120, following: 519, category: 'Art' },
  { id: 'u_9', username: 'vera.reads', name: 'Vera Kim', avatar: avatar(26), verified: true,
    bio: 'Bookworm 📚\nOne book a week', followers: 67300, following: 344, category: 'Books' },
  { id: 'u_10', username: 'dusk.gaming', name: 'Dusk', avatar: avatar(68), verified: false,
    bio: 'Streamer 🎮\nMon–Fri 8pm', followers: 154600, following: 98, category: 'Gaming' },
  { id: 'u_11', username: 'sana.bakes', name: 'Sana Iqbal', avatar: avatar(24), verified: false,
    bio: 'Cakes & croissants 🥐', followers: 27450, following: 604, category: 'Food' },
];

export const userById = (id) => USERS.find((u) => u.id === id);
export const userByName = (username) => USERS.find((u) => u.username === username);

// ---------- posts ----------
// inFeed: shown in home feed. explore posts are mostly non-followed content.
let pid = 0;
const P = (authorId, caption, tags, likes, comments, seed, opts = {}) => ({
  id: `p_${++pid}`,
  authorId,
  image: img(seed, 1080, opts.portrait ? 1350 : 1080),
  caption,
  tags,
  likes,
  comments,
  location: opts.location || null,
  inFeed: opts.inFeed !== false,
  explore: opts.explore !== false,
  hot: !!opts.hot,
  createdAt: opts.at || hoursAgo(pid + 2),
  aspect: opts.portrait ? '4 / 5' : '1 / 1',
});

export const SEED_POSTS = [
  // --- following feed (mix of followed accounts) ---
  P('u_1', 'New case study is live — redesigning checkout flow for a fintech app. Swipe through the before/after 🔄', ['#design', '#ux'], 4821, 132, 'kix-design-1', { location: 'San Francisco, CA', at: hoursAgo(1) }),
  P('u_3', 'Nightline EP — track 03 “Afterglow” just dropped. Headphones recommended 🎧', ['#music', '#newmusic'], 18402, 641, 'kix-music-1', { location: 'Berlin, Germany', at: hoursAgo(2) }),
  P('u_2', 'Sunrise over the Dolomites. Woke up at 4:30 for this one and it was worth every minute 🏔️', ['#travel', '#italy'], 9210, 287, 'kix-travel-1', { location: 'Dolomites, Italy', at: hoursAgo(4), portrait: true }),
  P('u_5', 'Monday mobility routine — 15 minutes, no equipment. Save this one for later 💪', ['#fitness', '#mobility'], 6754, 198, 'kix-fitness-1', { at: hoursAgo(5) }),
  P('u_6', 'Neon & rain. Shot on 35mm, pushed two stops 📸', ['#streetphotography', '#night'], 3902, 96, 'kix-photo-1', { location: 'Tokyo, Japan', at: hoursAgo(7), portrait: true }),
  P('u_4', '60-second garlic chili noodles that taste like a 20-minute recipe 🍜 Full recipe in bio', ['#food', '#recipe'], 11230, 415, 'kix-food-1', { at: hoursAgo(9) }),
  P('u_7', 'CSS trick of the day: container queries make card layouts trivially responsive. No more media query soup 🍜', ['#css', '#webdev'], 2140, 87, 'kix-tech-1', { at: hoursAgo(11) }),
  P('u_9', 'Finished “The Secret History” in two days. Unreliable narrators forever 📚', ['#bookstagram', '#reading'], 5410, 231, 'kix-books-1', { at: hoursAgo(13), portrait: true }),
  P('u_8', 'Studio afternoon 🎨 New piece drying on the easel — title suggestions welcome', ['#art', '#painting'], 4109, 174, 'kix-art-1', { at: hoursAgo(16) }),
  P('u_10', 'Road to 150k! Thanks for the insane support this month 💜 VOD from last night in bio', ['#gaming', '#stream'], 12750, 522, 'kix-game-1', { at: hoursAgo(18) }),
  P('u_11', 'Strawberry cream cake for a 6th birthday 🍓 Every layer from scratch', ['#baking', '#cake'], 7603, 302, 'kix-bake-1', { at: hoursAgo(20), portrait: true }),
  P('u_1', 'Color palette study from yesterday’s walk. Nature really said “here’s a free design system” 🌿', ['#color', '#design'], 5211, 143, 'kix-design-2', { at: hoursAgo(22) }),
  P('u_3', 'Studio session at 2am hits different. What should I sample next? 🎛️', ['#music', '#producer'], 15980, 508, 'kix-music-2', { at: daysAgo(1.1) }),
  P('u_2', 'Street food crawl through Bangkok — 9 dishes, 4 hours, zero regrets 🇹🇭', ['#travel', '#food'], 10420, 356, 'kix-travel-2', { location: 'Bangkok, Thailand', at: daysAgo(1.3) }),
  P('u_5', 'Rest day = sauna + long walk. Recovery is part of the program 🧎', ['#fitness', '#recovery'], 4388, 102, 'kix-fitness-2', { at: daysAgo(1.5) }),
  P('u_6', 'Golden hour does half the work for you ☀️', ['#photography', '#goldenhour'], 6821, 189, 'kix-photo-2', { at: daysAgo(1.7), portrait: true }),
  P('u_me', 'First post on KIX! Setting up this demo account — say hi 👋', ['#intro'], 128, 24, 'kix-me-1', { at: daysAgo(2) }),
  P('u_4', 'Butter croissants: 3 days of laminating, 12 minutes of eating 🥐', ['#baking', '#food'], 9845, 367, 'kix-food-2', { at: daysAgo(2.2) }),
  P('u_7', 'Shipped a tiny open-source animation lib this weekend. 2kb, zero deps ⚡', ['#opensource', '#js'], 3120, 145, 'kix-tech-2', { at: daysAgo(2.5) }),
  P('u_9', 'Currently reading three books at once and pretending that’s normal 📖', ['#reading', '#books'], 4760, 198, 'kix-books-2', { at: daysAgo(2.8) }),
  P('u_10', 'Clutch of the year candidate. Still shaking 🎮', ['#gaming', '#clutch'], 20140, 811, 'kix-game-2', { at: daysAgo(3) }),
  P('u_8', 'Blue period. Everything I painted this week ended up blue and I’m not fighting it 🫐', ['#art', '#painting'], 3677, 121, 'kix-art-2', { at: daysAgo(3.3), portrait: true }),
  P('u_11', 'Focaccia dimples = tiny happiness reservoirs 🫒', ['#baking', '#bread'], 8122, 274, 'kix-bake-2', { at: daysAgo(3.6) }),
  P('u_1', 'Design system audit checklist (free PDF) — link in stories 🧾', ['#designsystem', '#resources'], 7430, 259, 'kix-design-3', { at: daysAgo(4) }),
  P('u_3', 'Mixing down the album tonight. Send energy ⚡', ['#music', '#studio'], 13200, 398, 'kix-music-3', { at: daysAgo(4.4) }),
  P('u_2', 'Train window views > everything else 🚆', ['#travel', '#slowtravel'], 5609, 167, 'kix-travel-3', { at: daysAgo(4.8), portrait: true }),
  // --- explore-heavy (mostly non-followed) ---
  P('u_5', 'Deadlift form check — 5 cues that fixed my back 🏋️', ['#gym', '#formcheck'], 14320, 486, 'kix-exp-1', { inFeed: false, at: daysAgo(0.6), portrait: true }),
  P('u_10', 'Ranked grind update: hit Diamond 💎 VOD below', ['#esports', '#ranked'], 16780, 604, 'kix-exp-2', { inFeed: false, at: daysAgo(0.8) }),
  P('u_4', 'One-pan lemon herb chicken 🍋 30 minutes, one pan, zero stress', ['#recipe', '#dinner'], 12890, 441, 'kix-exp-3', { inFeed: false, at: daysAgo(1) }),
  P('u_6', 'Rainy alley, one umbrella, one moment 🌧️', ['#street', '#moody'], 7450, 210, 'kix-exp-4', { inFeed: false, at: daysAgo(1.2), portrait: true }),
  P('u_8', 'Impressionist study — after Monet 🪷', ['#art', '#study'], 5980, 176, 'kix-exp-5', { inFeed: false, at: daysAgo(1.6) }),
  P('u_9', 'My March reading stack 📚 Which one first?', ['#tbr', '#books'], 6240, 344, 'kix-exp-6', { inFeed: false, at: daysAgo(1.9), portrait: true }),
  P('u_7', 'Anatomy of a perfect React re-render 🧠', ['#react', '#frontend'], 4410, 158, 'kix-exp-7', { inFeed: false, at: daysAgo(2.1) }),
  P('u_11', 'Matcha swiss roll 🍵 Soft, jiggly, gone in minutes', ['#baking', '#matcha'], 9670, 302, 'kix-exp-8', { inFeed: false, at: daysAgo(2.4), portrait: true }),
  P('u_2', 'Northern lights from a frozen lake. No filter needed 🌌', ['#iceland', '#aurora'], 21340, 722, 'kix-exp-9', { inFeed: false, at: daysAgo(2.7) }),
  P('u_3', 'Beat breakdown: how the drop in “Afterglow” was made 🎛️', ['#production', '#tutorial'], 11980, 389, 'kix-exp-10', { inFeed: false, at: daysAgo(3.1) }),
  P('u_5', 'Morning run club — 6am crew always shows up 🏃‍♀️', ['#running', '#community'], 8320, 245, 'kix-exp-11', { inFeed: false, at: daysAgo(3.4) }),
  P('u_1', 'Typography pairing that never fails: grotesque + serif 🅰️', ['#typography', '#design'], 6890, 198, 'kix-exp-12', { inFeed: false, at: daysAgo(3.8) }),
  P('u_10', 'Setup tour 2026 — everything on my desk 🖥️', ['#setup', '#desk'], 18920, 651, 'kix-exp-13', { inFeed: false, at: daysAgo(4.2), portrait: true }),
  P('u_6', 'Black & white series, frame 12 🖤', ['#bw', '#film'], 5230, 132, 'kix-exp-14', { inFeed: false, at: daysAgo(4.6) }),
  P('u_4', 'Street ramen rating: 9.2/10 🍥', ['#ramen', '#foodreview'], 10450, 388, 'kix-exp-15', { inFeed: false, at: daysAgo(5) }),
  P('u_8', 'Palette knife texture close-up 🧈', ['#texture', '#oilpaint'], 4120, 119, 'kix-exp-16', { inFeed: false, at: daysAgo(5.4), portrait: true }),
  P('u_9', 'Quiet library morning 🤫☕', ['#study', '#aesthetic'], 7110, 205, 'kix-exp-17', { inFeed: false, at: daysAgo(5.8) }),
  P('u_7', 'VS Code settings I can’t live without ⚙️', ['#vscode', '#devtools'], 5640, 267, 'kix-exp-18', { inFeed: false, at: daysAgo(6.2) }),
  P('u_11', 'Chocolate lava cakes for date night 🍫', ['#dessert', '#chocolate'], 13210, 452, 'kix-exp-19', { inFeed: false, at: daysAgo(6.6), portrait: true }),
  P('u_2', 'Desert road, no one for miles 🛣️', ['#roadtrip', '#desert'], 8940, 233, 'kix-exp-20', { inFeed: false, at: daysAgo(7) }),
];

// ---------- comments ----------
export const SEED_COMMENTS = {
  p_1: [
    { userId: 'u_7', text: 'The before/after is brutal in the best way 😄', likes: 42, at: hoursAgo(0.8) },
    { userId: 'u_8', text: 'That spacing rhythm though 🔥', likes: 18, at: hoursAgo(0.5) },
  ],
  p_2: [
    { userId: 'u_me', text: 'Afterglow is on repeat 🎧', likes: 7, at: hoursAgo(1.5) },
    { userId: 'u_10', text: 'This goes hard on stream', likes: 23, at: hoursAgo(1.2) },
  ],
  p_3: [
    { userId: 'u_6', text: 'The light here is unreal 😍', likes: 31, at: hoursAgo(3) },
    { userId: 'u_2', text: '4:30am crew represent ☀️', likes: 12, at: hoursAgo(2.5) },
  ],
};

// ---------- stories ----------
export const SEED_STORIES = [
  { userId: 'u_me', items: [{ id: 's_me_1', image: img('kix-story-me-1', 1080, 1920), at: hoursAgo(3), caption: 'Working on something new 👀' }] },
  { userId: 'u_1', items: [
    { id: 's_1_1', image: img('kix-story-1a', 1080, 1920), at: hoursAgo(1), caption: 'Desk setup refresh' },
    { id: 's_1_2', image: img('kix-story-1b', 1080, 1920), at: hoursAgo(0.6), caption: 'Palette of the day 🎨' },
  ] },
  { userId: 'u_3', items: [
    { id: 's_3_1', image: img('kix-story-3a', 1080, 1920), at: hoursAgo(2), caption: 'Studio night 🎛️' },
    { id: 's_3_2', image: img('kix-story-3b', 1080, 1920), at: hoursAgo(1.8), caption: 'Track 03 snippet' },
  ] },
  { userId: 'u_2', items: [{ id: 's_2_1', image: img('kix-story-2a', 1080, 1920), at: hoursAgo(5), caption: 'Next stop: ? 🚆' }] },
  { userId: 'u_5', items: [
    { id: 's_5_1', image: img('kix-story-5a', 1080, 1920), at: hoursAgo(7), caption: 'Warmup done ✅' },
    { id: 's_5_2', image: img('kix-story-5b', 1080, 1920), at: hoursAgo(6.5), caption: 'PR attempt incoming 💪' },
  ] },
  { userId: 'u_6', items: [{ id: 's_6_1', image: img('kix-story-6a', 1080, 1920), at: hoursAgo(9), caption: 'Test roll 📸' }] },
  { userId: 'u_9', items: [{ id: 's_9_1', image: img('kix-story-9a', 1080, 1920), at: hoursAgo(12), caption: 'Current chapter 📖' }] },
  { userId: 'u_10', items: [
    { id: 's_10_1', image: img('kix-story-10a', 1080, 1920), at: hoursAgo(4), caption: 'Going live in 1h 🎮' },
    { id: 's_10_2', image: img('kix-story-10b', 1080, 1920), at: hoursAgo(3.5), caption: 'Snack break' },
  ] },
];

// ---------- reels ----------
export const SEED_REELS = [
  { id: 'r_1', authorId: 'u_3', video: img('kix-reel-1', 1080, 1920), genre: 'music', caption: 'When the bass finally hits 🎧 #music #producer', audio: 'Nova — Afterglow (Original)', likes: 84200, comments: 1840, shares: 5620, views: 1240000, at: hoursAgo(2) },
  { id: 'r_2', authorId: 'u_5', video: img('kix-reel-2', 1080, 1920), genre: 'fitness', caption: '3 moves that fixed my posture 🧎 #fitness #mobility', audio: 'Original audio — aria.fitness', likes: 41300, comments: 982, shares: 3110, views: 682000, at: hoursAgo(4) },
  { id: 'r_3', authorId: 'u_4', video: img('kix-reel-3', 1080, 1920), genre: 'food', caption: '30-second chili oil noodles 🍜 #food #recipe', audio: 'Original audio — bytechef', likes: 67800, comments: 2410, shares: 8940, views: 990000, at: hoursAgo(6) },
  { id: 'r_4', authorId: 'u_2', video: img('kix-reel-4', 1080, 1920), genre: 'travel', caption: 'POV: you found the empty street 🚆 #travel', audio: 'Leo Marchetti — field recording', likes: 52100, comments: 1120, shares: 4480, views: 815000, at: hoursAgo(8) },
  { id: 'r_5', authorId: 'u_10', video: img('kix-reel-5', 1080, 1920), genre: 'gaming', caption: '1v4 clutch to win the round 🎮 #gaming', audio: 'Original audio — dusk.gaming', likes: 96400, comments: 3210, shares: 7230, views: 1890000, at: hoursAgo(10) },
  { id: 'r_6', authorId: 'u_1', video: img('kix-reel-6', 1080, 1920), genre: 'design', caption: 'UI detail that makes everything feel premium ✨ #design', audio: 'Original audio — mia.chen', likes: 38700, comments: 845, shares: 2960, views: 540000, at: hoursAgo(12) },
  { id: 'r_7', authorId: 'u_6', video: img('kix-reel-7', 1080, 1920), genre: 'photography', caption: 'One lens, one street, one hour 📸 #photography', audio: 'Original audio — pixelwander', likes: 29400, comments: 612, shares: 1870, views: 412000, at: hoursAgo(15) },
  { id: 'r_8', authorId: 'u_11', video: img('kix-reel-8', 1080, 1920), genre: 'food', caption: 'The fluffiest pancakes you’ll ever make 🥞 #baking', audio: 'Original audio — sana.bakes', likes: 72600, comments: 2840, shares: 9610, views: 1120000, at: hoursAgo(18) },
  { id: 'r_9', authorId: 'u_9', video: img('kix-reel-9', 1080, 1920), genre: 'books', caption: 'Books that feel like a warm hug 📚 #booktok', audio: 'Original audio — vera.reads', likes: 44100, comments: 1670, shares: 5320, views: 726000, at: hoursAgo(21) },
  { id: 'r_10', authorId: 'u_8', video: img('kix-reel-10', 1080, 1920), genre: 'art', caption: 'Watch this painting come alive in 20s 🎨 #art', audio: 'Original audio — theo.paints', likes: 35900, comments: 723, shares: 2440, views: 498000, at: daysAgo(1.1) },
  { id: 'r_11', authorId: 'u_3', video: img('kix-reel-11', 1080, 1920), genre: 'music', caption: 'Building a beat from a coffee shop recording ☕🎧 #music', audio: 'Nova — Nightline (Snippet)', likes: 61200, comments: 1490, shares: 4170, views: 894000, at: daysAgo(1.4) },
  { id: 'r_12', authorId: 'u_5', video: img('kix-reel-12', 1080, 1920), genre: 'fitness', caption: 'Day 30 of the challenge — look at the difference 💪 #fitness', audio: 'Original audio — aria.fitness', likes: 58300, comments: 1920, shares: 6040, views: 1030000, at: daysAgo(1.7) },
  { id: 'r_13', authorId: 'u_7', video: img('kix-reel-13', 1080, 1920), genre: 'tech', caption: 'CSS animation in 15 seconds ⚡ #coding #css', audio: 'Original audio — luna.codes', likes: 26800, comments: 544, shares: 1620, views: 356000, at: daysAgo(2) },
  { id: 'r_14', authorId: 'u_2', video: img('kix-reel-14', 1080, 1920), genre: 'travel', caption: 'Things you must eat in Bangkok 🇹🇭 #streetfood', audio: 'Original audio — leo.travels', likes: 47900, comments: 1340, shares: 5810, views: 771000, at: daysAgo(2.3) },
  { id: 'r_15', authorId: 'u_10', video: img('kix-reel-15', 1080, 1920), genre: 'gaming', caption: 'This shortcut breaks the map 💀 #gaming', audio: 'Original audio — dusk.gaming', likes: 88700, comments: 2960, shares: 6890, views: 1670000, at: daysAgo(2.6) },
  { id: 'r_16', authorId: 'u_1', video: img('kix-reel-16', 1080, 1920), genre: 'design', caption: 'Redesigning a famous app logo (for practice) ✍️ #design', audio: 'Original audio — mia.chen', likes: 42600, comments: 1180, shares: 3740, views: 615000, at: daysAgo(3) },
];

// ---------- notifications ----------
export const SEED_NOTIFICATIONS = [
  { id: 'n_1', type: 'like', userId: 'u_1', postId: 'p_17', text: 'liked your post.', at: hoursAgo(0.5) },
  { id: 'n_2', type: 'follow', userId: 'u_7', text: 'started following you.', at: hoursAgo(2) },
  { id: 'n_3', type: 'comment', userId: 'u_3', postId: 'p_17', text: 'commented: “Welcome to KIX! 🎉”', at: hoursAgo(5) },
  { id: 'n_4', type: 'like', userId: 'u_10', postId: 'p_17', text: 'liked your post.', at: hoursAgo(8) },
  { id: 'n_5', type: 'follow', userId: 'u_11', text: 'started following you.', at: hoursAgo(20) },
  { id: 'n_6', type: 'mention', userId: 'u_6', postId: 'p_2', text: 'mentioned you in a comment.', at: daysAgo(1) },
  { id: 'n_7', type: 'like', userId: 'u_9', postId: 'p_17', text: 'and 12 others liked your post.', at: daysAgo(1.5) },
  { id: 'n_8', type: 'follow', userId: 'u_4', text: 'started following you.', at: daysAgo(2) },
];

// ---------- chats ----------
export const SEED_CHATS = [
  {
    id: 'c_1', userId: 'u_1', unread: 2, at: hoursAgo(0.4),
    messages: [
      { id: 'm_1', from: 'u_1', text: 'hey! did you see the new case study I posted?', at: hoursAgo(3) },
      { id: 'm_2', from: 'u_me', text: 'yes! the before/after is so good 🔥', at: hoursAgo(2.6) },
      { id: 'm_3', from: 'u_1', text: 'thanks! took forever honestly 😅', at: hoursAgo(2.5) },
      { id: 'm_4', from: 'u_1', text: 'want to collab on the next one?', at: hoursAgo(0.5) },
      { id: 'm_5', from: 'u_1', text: 'I have a spare Figma license too', at: hoursAgo(0.4) },
    ],
  },
  {
    id: 'c_2', userId: 'u_3', unread: 0, at: hoursAgo(6),
    messages: [
      { id: 'm_6', from: 'u_3', text: 'dropping the EP at midnight 🎧', at: hoursAgo(8) },
      { id: 'm_7', from: 'u_me', text: 'been waiting for this!!', at: hoursAgo(7.5) },
      { id: 'm_8', from: 'u_3', text: 'send me your fave track after you hear it', at: hoursAgo(6) },
    ],
  },
  {
    id: 'c_3', userId: 'u_7', unread: 1, at: hoursAgo(22),
    messages: [
      { id: 'm_9', from: 'u_7', text: 'that CSS trick I sent worked right?', at: hoursAgo(23) },
      { id: 'm_10', from: 'u_me', text: 'perfectly, container queries are magic', at: hoursAgo(22.5) },
      { id: 'm_11', from: 'u_7', text: 'right?? wait till you see part 2', at: hoursAgo(22) },
    ],
  },
  {
    id: 'c_4', userId: 'u_2', unread: 0, at: daysAgo(1.2),
    messages: [
      { id: 'm_12', from: 'u_2', text: 'sending you the itinerary 🚆', at: daysAgo(1.4) },
      { id: 'm_13', from: 'u_me', text: 'legend, adding it to the list', at: daysAgo(1.2) },
    ],
  },
  {
    id: 'c_5', userId: 'u_10', unread: 0, at: daysAgo(2),
    messages: [
      { id: 'm_14', from: 'u_10', text: 'gg last night', at: daysAgo(2.1) },
      { id: 'm_15', from: 'u_me', text: 'that clutch was insane 🎮', at: daysAgo(2) },
    ],
  },
];

// canned auto-replies for outgoing messages
export const AUTO_REPLIES = [
  'haha true 😄',
  'ooh nice one',
  'send it over!',
  'on my way 🚶',
  'let me check and get back to you',
  'that’s awesome 🔥',
  'brb, grabbing coffee ☕',
  'yes! been thinking the same',
  'lol 😂',
  'sounds like a plan',
];
