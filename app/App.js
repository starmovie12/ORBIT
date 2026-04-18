// ═══════════════════════════════════════════════════════
//  ORBIT v5.0 — The Minimalist Edition
//  Single-file React Native Expo App (Telegram-Style UI)
//  Built for Replit + Expo Go
// ═══════════════════════════════════════════════════════

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// ─────────────────────────────────────────────
//  DESIGN TOKENS — Telegram Dark Palette
// ─────────────────────────────────────────────
const C = {
  bg:       '#17212B',
  surface:  '#1C2733',
  surface2: '#242F3D',
  surface3: '#2B3A4A',
  border:   '#2E3E50',
  text:     '#FFFFFF',
  sub:      '#8796A5',
  muted:    '#5A6B7A',
  blue:     '#2481CC',
  blueLight:'#3A9FE8',
  green:    '#34B461',
  red:      '#E53935',
  gold:     '#F4A522',
  yellow:   '#F4D13A',
  purple:   '#7B68EE',
};

// ─────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────
const ROOMS = [
  { id: '1', emoji: '🎮', color: '#2481CC', name: 'Gaming Lounge',   preview: 'ghost_player: Bhai koi Valorant khelta hai?', time: '14:32', unread: 24, online: 312, muted: false },
  { id: '2', emoji: '🎵', color: '#F4A522', name: 'Music Junction',  preview: 'new_artist99: Check out my latest track 🎧',   time: '13:15', unread: 7,  online: 187, muted: false },
  { id: '3', emoji: '💼', color: '#7B68EE', name: 'Business Hub',    preview: 'typing…',                                     time: '12:58', unread: 0,  online: 94,  muted: false, typing: 'noor_bhai' },
  { id: '4', emoji: '📸', color: '#34B461', name: 'Creative Studio', preview: '📷 Photo',                                    time: 'Yesterday', unread: 3,  online: 256, muted: true  },
  { id: '5', emoji: '🌱', color: '#E53935', name: 'Startup Circle',  preview: 'sk_promo99: Series A announcement coming…',   time: 'Mon',  unread: 0,  online: 51,  muted: false },
];

const DISCOVER_POSTS = [
  { id: '1',  emoji: '🎮', color: '#2481CC', title: 'Best Minecraft Build 2025 🏰',       author: 'ghost_player',  tag: '⚡', room: 'Gaming Lounge',  views: '1.2K', duration: '15s', category: 'Gaming'   },
  { id: '2',  emoji: '🎵', color: '#F4A522', title: 'My New Single — "Neon Nights"',      author: 'new_artist99', tag: '🎖️', room: 'Music Junction', views: '876',  duration: '30s', category: 'Music'    },
  { id: '3',  emoji: '💼', color: '#7B68EE', title: 'How I Got 10k Users in 30 Days',     author: 'sk_promo99',   tag: '🔥', room: 'Startup Circle', views: '3.4K', duration: '15s', category: 'Business' },
  { id: '4',  emoji: '📸', color: '#34B461', title: 'Street Photography — Delhi 2025',    author: 'lens_wala',    tag: '⚡', room: 'Creative Studio',views: '654',  duration: '15s', category: 'Art'      },
  { id: '5',  emoji: '🎮', color: '#E53935', title: 'CS2 Clutch Play Highlights',         author: 'aimgod_47',    tag: '🎖️', room: 'Gaming Lounge',  views: '2.1K', duration: '30s', category: 'Gaming'   },
  { id: '6',  emoji: '🌱', color: '#3A9FE8', title: 'Zero to ₹1L/month — My Journey',    author: 'freelancer_x', tag: '🔥', room: 'Business Hub',   views: '5.6K', duration: '15s', category: 'Business' },
  { id: '7',  emoji: '🎵', color: '#F4A522', title: 'Chill Lofi Mix for Studying 📚',     author: 'beats_by_rk',  tag: '⚡', room: 'Music Junction', views: '901',  duration: '30s', category: 'Music'    },
  { id: '8',  emoji: '💼', color: '#7B68EE', title: 'Top 5 SaaS Tools You Never Heard Of',author: 'tech_orbit',  tag: '⚡', room: 'Startup Circle', views: '1.8K', duration: '15s', category: 'Business' },
];

const INBOX_CHATS = [
  { id: '1', emoji: '👤', color: '#2481CC', name: 'Aryan Verma',   preview: 'Bhai kal milte hain?',          time: '14:44', unread: 2,  ticks: 'none',     online: true  },
  { id: '2', emoji: '👤', color: '#34B461', name: 'Priya Singh',   preview: 'Thanks for the tip! 🙏',        time: '13:20', unread: 0,  ticks: 'read',     online: false },
  { id: '3', emoji: '👤', color: '#F4A522', name: 'Rahul Sharma',  preview: 'Voice note 🎤 (0:12)',          time: '11:55', unread: 0,  ticks: 'delivered',online: true  },
  { id: '4', emoji: '👤', color: '#7B68EE', name: 'Sneha Kapoor',  preview: 'Kab aaugi tum? 👀',             time: '10:30', unread: 5,  ticks: 'none',     online: false },
  { id: '5', emoji: '👤', color: '#E53935', name: 'Dev Nair',      preview: 'OK done ✅',                    time: 'Yesterday', unread: 0, ticks: 'read',  online: false },
  { id: '6', emoji: '👤', color: '#3A9FE8', name: 'Aditi Joshi',  preview: 'Photo 📷',                      time: 'Yesterday', unread: 1, ticks: 'none',  online: true  },
  { id: '7', emoji: '👤', color: '#F4A522', name: 'Karan Mehta',  preview: 'Checking in — how\'s the app?', time: 'Mon',   unread: 0,  ticks: 'sent',     online: false },
];

const RANKS_DATA = [
  { id: '1',  rank: 1,  emoji: '👑', name: 'ghost_player',  karma: 9820, badge: 'LEGEND',    trophies: ['🏆','🥇','⭐','🔥','💎'] },
  { id: '2',  rank: 2,  emoji: '⚡', name: 'sk_promo99',    karma: 8741, badge: 'CHAMPION',   trophies: ['🥇','⭐','🔥','💎']      },
  { id: '3',  rank: 3,  emoji: '🔥', name: 'new_artist99',  karma: 7654, badge: 'MASTER',     trophies: ['⭐','🔥','💎']           },
  { id: '4',  rank: 4,  emoji: '💎', name: 'lens_wala',     karma: 6210, badge: 'MASTER',     trophies: ['🔥','💎']                },
  { id: '5',  rank: 5,  emoji: '🌟', name: 'aimgod_47',     karma: 5890, badge: 'PRO',        trophies: ['💎']                     },
  { id: '6',  rank: 6,  emoji: '🎯', name: 'tech_orbit',    karma: 4320, badge: 'PRO',        trophies: ['⭐']                     },
  { id: '7',  rank: 7,  emoji: '🚀', name: 'beats_by_rk',   karma: 3850, badge: 'RISING',     trophies: []                         },
  { id: '8',  rank: 8,  emoji: '💫', name: 'freelancer_x',  karma: 3210, badge: 'RISING',     trophies: []                         },
  { id: '9',  rank: 9,  emoji: '🎮', name: 'noor_bhai',     karma: 2740, badge: 'ACTIVE',     trophies: []                         },
  { id: '10', rank: 10, emoji: '📸', name: 'orbit_user01',  karma: 2100, badge: 'ACTIVE',     trophies: []                         },
];

const MY_PROFILE = {
  name: 'You (ghost_player)',
  handle: '@ghost_player',
  emoji: '👑',
  color: '#2481CC',
  karma: 9820,
  rank: 1,
  credits: 12,
  badge: 'LEGEND',
  joined: 'Jan 2025',
  posts: 142,
  watches: 3410,
  trophies: ['🏆','🥇','⭐','🔥','💎'],
  achievements: [
    { icon: '🏆', label: 'First Place', desc: 'Top #1 on the Leaderboard'       },
    { icon: '🔥', label: 'On Fire',     desc: '7-day posting streak'             },
    { icon: '💎', label: 'Diamond',     desc: '5000+ Karma points earned'        },
    { icon: '⭐', label: 'Star Creator', desc: '100+ Discover posts uploaded'    },
    { icon: '🤝', label: 'Connector',   desc: 'Sent 500+ DMs via Message button' },
  ],
};

// ─────────────────────────────────────────────
//  REUSABLE COMPONENTS
// ─────────────────────────────────────────────

/** Coin Pill shown in Discover header */
const CreditPill = ({ credits, onPress }) => (
  <TouchableOpacity style={styles.creditPill} onPress={onPress} activeOpacity={0.75}>
    <Text style={styles.creditPillText}>🪙 {credits}</Text>
  </TouchableOpacity>
);

/** Animated tick indicator for Inbox */
const Ticks = ({ state }) => {
  if (state === 'none')      return null;
  if (state === 'sent')      return <Text style={[styles.tick, { color: C.muted }]}>✓</Text>;
  if (state === 'delivered') return <Text style={[styles.tick, { color: C.muted }]}>✓✓</Text>;
  if (state === 'read')      return <Text style={[styles.tick, { color: C.blueLight }]}>✓✓</Text>;
  return null;
};

/** Karma badge pill */
const KarmaBadge = ({ badge }) => {
  const badgeColor = {
    LEGEND:   C.gold,
    CHAMPION: C.purple,
    MASTER:   C.blueLight,
    PRO:      C.green,
    RISING:   C.blue,
    ACTIVE:   C.muted,
  }[badge] || C.muted;

  return (
    <View style={[styles.karmaBadge, { borderColor: badgeColor + '55', backgroundColor: badgeColor + '15' }]}>
      <Text style={[styles.karmaBadgeText, { color: badgeColor }]}>{badge}</Text>
    </View>
  );
};

/** Screen header bar */
const ScreenHeader = ({ title, right }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
    {right && <View style={styles.headerRight}>{right}</View>}
  </View>
);

/** Search bar */
const SearchBar = ({ placeholder, value, onChangeText }) => (
  <View style={styles.searchContainer}>
    <Text style={styles.searchIcon}>🔍</Text>
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder}
      placeholderTextColor={C.muted}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

/** Separator */
const Divider = () => <View style={styles.divider} />;

// ─────────────────────────────────────────────
//  WALLET DRAWER MODAL
// ─────────────────────────────────────────────
const WalletDrawer = ({ visible, onClose, credits }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
      <View style={styles.walletDrawer}>
        <View style={styles.walletHandle} />
        <Text style={styles.walletTitle}>🪙 Credit Wallet</Text>
        <Divider />

        <View style={styles.walletBalanceRow}>
          <Text style={styles.walletBalanceLabel}>Available Credits</Text>
          <Text style={styles.walletBalance}>{credits}</Text>
        </View>

        <View style={styles.walletInfoCard}>
          <Text style={styles.walletInfoText}>
            💡 Watch a 15s promo to earn +1 credit. Daily limit: 20 credits/day.
          </Text>
        </View>

        <View style={styles.walletStatsRow}>
          <View style={styles.walletStat}>
            <Text style={styles.walletStatVal}>20</Text>
            <Text style={styles.walletStatLbl}>Daily Cap</Text>
          </View>
          <View style={styles.walletStatDivider} />
          <View style={styles.walletStat}>
            <Text style={styles.walletStatVal}>8</Text>
            <Text style={styles.walletStatLbl}>Used Today</Text>
          </View>
          <View style={styles.walletStatDivider} />
          <View style={styles.walletStat}>
            <Text style={styles.walletStatVal}>12</Text>
            <Text style={styles.walletStatLbl}>Remaining</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.walletTopUpBtn} activeOpacity={0.8}>
          <Text style={styles.walletTopUpText}>⚡ Top Up — ₹49 for 50 Credits</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.walletCloseBtn} onPress={onClose} activeOpacity={0.75}>
          <Text style={styles.walletCloseTxt}>Close</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

// ─────────────────────────────────────────────
//  SCREEN 1 — ROOMS
// ─────────────────────────────────────────────
const RoomsScreen = () => {
  const [search, setSearch] = useState('');
  const filtered = ROOMS.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderRoom = ({ item }) => (
    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
      {/* Avatar with online dot */}
      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, { backgroundColor: item.color + '22', borderColor: item.color + '44' }]}>
          <Text style={styles.avatarEmoji}>{item.emoji}</Text>
        </View>
        <View style={styles.onlineDot} />
      </View>

      {/* Body */}
      <View style={styles.listBody}>
        <View style={styles.listNameRow}>
          <Text style={styles.listName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.listTime}>{item.time}</Text>
        </View>
        <View style={styles.listPreviewRow}>
          {item.typing ? (
            <View style={styles.typingRow}>
              <Text style={styles.typingDots}>• • •</Text>
              <Text style={styles.typingText}>{item.typing} typing…</Text>
            </View>
          ) : (
            <Text style={styles.listPreview} numberOfLines={1}>{item.preview}</Text>
          )}
          {item.unread > 0 && (
            <View style={[styles.unreadBadge, item.muted && styles.unreadBadgeMuted]}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
        <Text style={styles.onlineCount}>🟢 {item.online.toLocaleString()} online</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScreenHeader title="Rooms" />
      <SearchBar
        placeholder="Search rooms..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Spotlight bar */}
      <View style={styles.spotlightBar}>
        <Text style={styles.spotlightText}>⭐ Spotlight Live · Gaming Lounge · 38 min left</Text>
        <TouchableOpacity>
          <Text style={styles.spotlightBid}>Bid →</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderRoom}
        ItemSeparatorComponent={Divider}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────
//  SCREEN 2 — DISCOVER
// ─────────────────────────────────────────────
const DiscoverScreen = () => {
  const [search, setSearch]         = useState('');
  const [activeFilter, setFilter]   = useState('All');
  const [walletVisible, setWallet]  = useState(false);
  const [watchedIds, setWatched]    = useState({});

  const FILTERS = ['All', 'Gaming', 'Music', 'Business', 'Art'];

  const filtered = DISCOVER_POSTS.filter(p => {
    const matchFilter = activeFilter === 'All' || p.category === activeFilter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.author.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleWatch = (id) => {
    setWatched(prev => ({ ...prev, [id]: true }));
  };

  const renderPost = ({ item }) => (
    <View style={styles.discoverItem}>
      {/* Thumbnail */}
      <View style={[styles.discoverThumb, { backgroundColor: item.color + '22', borderColor: item.color + '44' }]}>
        <Text style={styles.discoverThumbEmoji}>{item.emoji}</Text>
      </View>

      {/* Content */}
      <View style={styles.discoverBody}>
        <Text style={styles.discoverTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.discoverSub} numberOfLines={1}>
          by {item.author} {item.tag} · {item.room} · {item.views} views
        </Text>

        {/* Action buttons */}
        <View style={styles.discoverActions}>
          <TouchableOpacity
            style={[styles.btnWatch, watchedIds[item.id] && styles.btnWatchDone]}
            onPress={() => handleWatch(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.btnWatchText}>
              {watchedIds[item.id] ? `✓ Watched` : `▶ Watch (${item.duration})`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMsg} activeOpacity={0.8}>
            <Text style={styles.btnMsgText}>✉ Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScreenHeader
        title="Discover"
        right={<CreditPill credits={MY_PROFILE.credits} onPress={() => setWallet(true)} />}
      />
      <SearchBar
        placeholder="Search promos, rooms..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Category filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingVertical: 8 }}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterPillText, activeFilter === f && styles.filterPillTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Divider />

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderPost}
        ItemSeparatorComponent={Divider}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <WalletDrawer
        visible={walletVisible}
        onClose={() => setWallet(false)}
        credits={MY_PROFILE.credits}
      />
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────
//  SCREEN 3 — INBOX
// ─────────────────────────────────────────────
const InboxScreen = () => {
  const [search, setSearch] = useState('');
  const filtered = INBOX_CHATS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderChat = ({ item }) => (
    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, { backgroundColor: item.color + '22', borderColor: item.color + '44' }]}>
          <Text style={[styles.avatarEmoji, { fontSize: 22 }]}>
            {item.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </Text>
        </View>
        {item.online && <View style={styles.onlineDot} />}
      </View>

      {/* Body */}
      <View style={styles.listBody}>
        <View style={styles.listNameRow}>
          <Text style={styles.listName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.listTime}>{item.time}</Text>
        </View>
        <View style={styles.listPreviewRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ticks state={item.ticks} />
            <Text style={[styles.listPreview, { flex: 1 }]} numberOfLines={1}>
              {item.ticks !== 'none' ? ' ' : ''}{item.preview}
            </Text>
          </View>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScreenHeader title="Inbox" />
      <SearchBar
        placeholder="Search messages..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderChat}
        ItemSeparatorComponent={Divider}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      {/* Compose button */}
      <TouchableOpacity style={styles.composeFab} activeOpacity={0.85}>
        <Text style={styles.composeFabIcon}>✏️</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────
//  SCREEN 4 — RANKS
// ─────────────────────────────────────────────
const RanksScreen = () => {
  const podiumColors = { 1: C.gold, 2: '#C0C0C0', 3: '#CD7F32' };
  const podiumEmojis = { 1: '🥇', 2: '🥈', 3: '🥉' };

  const renderRank = ({ item, index }) => {
    const isTop3 = item.rank <= 3;
    const isMe   = item.name === 'ghost_player';

    return (
      <TouchableOpacity
        style={[
          styles.rankItem,
          isMe && styles.rankItemMe,
          isTop3 && styles.rankItemTop,
        ]}
        activeOpacity={0.75}
      >
        {/* Rank number */}
        <View style={styles.rankNumWrap}>
          {isTop3 ? (
            <Text style={styles.rankMedal}>{podiumEmojis[item.rank]}</Text>
          ) : (
            <Text style={[styles.rankNum, isMe && { color: C.blueLight }]}>
              #{item.rank}
            </Text>
          )}
        </View>

        {/* Avatar */}
        <View style={[
          styles.avatarSmall,
          { backgroundColor: C.surface2, borderColor: isTop3 ? podiumColors[item.rank] + '66' : C.border }
        ]}>
          <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
        </View>

        {/* Name + badge */}
        <View style={styles.rankBody}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.rankName, isMe && { color: C.blueLight }]}>{item.name}</Text>
            {isMe && <Text style={styles.rankYouTag}>YOU</Text>}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <KarmaBadge badge={item.badge} />
            <Text style={styles.rankTrophies}>{item.trophies.join(' ')}</Text>
          </View>
        </View>

        {/* Karma score */}
        <View style={styles.rankScore}>
          <Text style={[styles.rankKarmaVal, isTop3 && { color: podiumColors[item.rank] }]}>
            {item.karma.toLocaleString()}
          </Text>
          <Text style={styles.rankKarmaLbl}>karma</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScreenHeader title="Ranks — Top 100" />

      {/* Podium summary strip */}
      <View style={styles.podiumStrip}>
        {[1, 2, 3].map(r => {
          const u = RANKS_DATA.find(x => x.rank === r);
          return (
            <View key={r} style={styles.podiumCard}>
              <Text style={{ fontSize: 24 }}>{podiumEmojis[r]}</Text>
              <Text style={[styles.podiumName, { color: podiumColors[r] }]}>{u.name}</Text>
              <Text style={styles.podiumKarma}>{u.karma.toLocaleString()}</Text>
            </View>
          );
        })}
      </View>

      <Divider />

      {/* Full leaderboard */}
      <FlatList
        data={RANKS_DATA}
        keyExtractor={i => i.id}
        renderItem={renderRank}
        ItemSeparatorComponent={Divider}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────
//  SCREEN 5 — PROFILE
// ─────────────────────────────────────────────
const ProfileScreen = () => {
  const p = MY_PROFILE;

  const StatBox = ({ val, lbl }) => (
    <View style={styles.statBox}>
      <Text style={styles.statVal}>{val}</Text>
      <Text style={styles.statLbl}>{lbl}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScreenHeader title="Profile" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile hero */}
        <View style={styles.profileHero}>
          <View style={[styles.profileAvatar, { backgroundColor: p.color + '22', borderColor: p.color + '66' }]}>
            <Text style={styles.profileAvatarEmoji}>{p.emoji}</Text>
          </View>
          <Text style={styles.profileName}>{p.name}</Text>
          <Text style={styles.profileHandle}>{p.handle}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <KarmaBadge badge={p.badge} />
            <Text style={styles.profileRank}>#{p.rank} Global</Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <StatBox val={p.karma.toLocaleString()} lbl="Karma"   />
          <View style={styles.statDivider} />
          <StatBox val={p.posts}               lbl="Posts"   />
          <View style={styles.statDivider} />
          <StatBox val={p.watches.toLocaleString()} lbl="Watches" />
          <View style={styles.statDivider} />
          <StatBox val={`🪙 ${p.credits}`}     lbl="Credits" />
        </View>

        {/* Trophy Room */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Trophy Room</Text>
          <View style={styles.trophyRow}>
            {p.trophies.map((t, i) => (
              <View key={i} style={styles.trophyBadge}>
                <Text style={{ fontSize: 28 }}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        <Divider />

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Achievements</Text>
          {p.achievements.map((a, i) => (
            <View key={i} style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Text style={{ fontSize: 22 }}>{a.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.achievementLabel}>{a.label}</Text>
                <Text style={styles.achievementDesc}>{a.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <Divider />

        {/* Info rows */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Account Info</Text>
          {[
            { label: 'Member Since', value: p.joined },
            { label: 'Karma Points', value: p.karma.toLocaleString() },
            { label: 'Total Posts',  value: p.posts.toString() },
            { label: 'Videos Watched', value: p.watches.toLocaleString() },
          ].map((row, i) => (
            <View key={i} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <Divider />

        {/* Settings options */}
        <View style={styles.section}>
          {[
            { icon: '🔔', label: 'Notifications'       },
            { icon: '🔒', label: 'Privacy & Security'  },
            { icon: '🎨', label: 'Appearance'          },
            { icon: '⚡', label: 'Top Up Credits'       },
            { icon: '🚪', label: 'Log Out', danger: true },
          ].map((opt, i) => (
            <TouchableOpacity key={i} style={styles.settingsRow} activeOpacity={0.7}>
              <Text style={styles.settingsIcon}>{opt.icon}</Text>
              <Text style={[styles.settingsLabel, opt.danger && { color: C.red }]}>
                {opt.label}
              </Text>
              <Text style={styles.settingsChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────
//  BOTTOM TAB NAVIGATOR
// ─────────────────────────────────────────────
const Tab = createBottomTabNavigator();

const TabIcon = ({ emoji, label, focused }) => (
  <View style={styles.tabIcon}>
    <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>{emoji}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
  </View>
);

// ─────────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Rooms"
          component={RoomsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🏠" label="Rooms" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Discover"
          component={DiscoverScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🔭" label="Discover" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Inbox"
          component={InboxScreen}
          options={{
            tabBarBadge: 7,
            tabBarBadgeStyle: { backgroundColor: C.red, fontSize: 10 },
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="💬" label="Inbox" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Ranks"
          component={RanksScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🏆" label="Ranks" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="👤" label="Profile" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ─────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Screens ──────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // ── Header ───────────────────────────────
  header: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingHorizontal: 16,
    paddingVertical:  12,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: {
    color:      C.text,
    fontSize:   18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems:    'center',
  },

  // ── Credit Pill ──────────────────────────
  creditPill: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: C.green + '20',
    borderWidth:     1,
    borderColor:     C.green + '55',
    borderRadius:    20,
    paddingHorizontal: 10,
    paddingVertical:   4,
  },
  creditPillText: {
    color:      C.green,
    fontSize:   13,
    fontWeight: '700',
  },

  // ── Search ───────────────────────────────
  searchContainer: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: C.surface2,
    marginHorizontal: 12,
    marginVertical:   8,
    borderRadius:     10,
    paddingHorizontal: 12,
    paddingVertical:   8,
    borderWidth:      1,
    borderColor:      C.border,
  },
  searchIcon: {
    fontSize:    14,
    marginRight: 8,
  },
  searchInput: {
    flex:      1,
    color:     C.text,
    fontSize:  14,
    padding:   0,
  },

  // ── Divider ──────────────────────────────
  divider: {
    height:          1,
    backgroundColor: C.border,
    marginLeft:      72,
  },

  // ── Spotlight Bar ────────────────────────
  spotlightBar: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    marginHorizontal: 12,
    marginBottom:     4,
    paddingHorizontal: 12,
    paddingVertical:   8,
    backgroundColor:  C.gold + '18',
    borderWidth:      1,
    borderColor:      C.gold + '44',
    borderRadius:     8,
  },
  spotlightText: {
    color:      C.gold,
    fontSize:   12,
    fontWeight: '600',
    flex:       1,
  },
  spotlightBid: {
    color:      C.gold,
    fontSize:   12,
    fontWeight: '700',
  },

  // ── List Item (shared: Rooms + Inbox) ────
  listItem: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingHorizontal: 12,
    paddingVertical:   10,
    backgroundColor: C.bg,
  },

  // ── Avatar ───────────────────────────────
  avatarWrap: {
    position:    'relative',
    width:       50,
    height:      50,
    marginRight: 12,
  },
  avatar: {
    width:        50,
    height:       50,
    borderRadius: 25,
    borderWidth:  1,
    alignItems:   'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  avatarSmall: {
    width:        44,
    height:       44,
    borderRadius: 22,
    borderWidth:  1,
    alignItems:   'center',
    justifyContent: 'center',
    marginRight:  10,
  },
  onlineDot: {
    position:        'absolute',
    bottom:          1,
    right:           1,
    width:           12,
    height:          12,
    borderRadius:    6,
    backgroundColor: C.green,
    borderWidth:     2,
    borderColor:     C.bg,
  },

  // ── List Body ────────────────────────────
  listBody: {
    flex: 1,
  },
  listNameRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   3,
  },
  listName: {
    color:      C.text,
    fontSize:   15,
    fontWeight: '600',
    flex:       1,
    marginRight: 8,
  },
  listTime: {
    color:    C.muted,
    fontSize: 11,
  },
  listPreviewRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  listPreview: {
    color:    C.sub,
    fontSize: 13,
    flex:     1,
  },
  onlineCount: {
    color:     C.green,
    fontSize:  11,
    marginTop: 2,
    fontWeight: '500',
  },

  // ── Typing indicator ─────────────────────
  typingRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
  },
  typingDots: {
    color:    C.blueLight,
    fontSize: 14,
    letterSpacing: 2,
  },
  typingText: {
    color:     C.blueLight,
    fontSize:  13,
    fontStyle: 'italic',
  },

  // ── Unread badge ─────────────────────────
  unreadBadge: {
    minWidth:        20,
    height:          20,
    borderRadius:    10,
    backgroundColor: C.blue,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 5,
    marginLeft:      8,
  },
  unreadBadgeMuted: {
    backgroundColor: C.muted,
  },
  unreadText: {
    color:      '#fff',
    fontSize:   11,
    fontWeight: '700',
  },

  // ── Ticks ────────────────────────────────
  tick: {
    fontSize:    13,
    marginRight: 2,
  },

  // ── Discover ─────────────────────────────
  discoverItem: {
    flexDirection:   'row',
    alignItems:      'flex-start',
    paddingHorizontal: 12,
    paddingVertical:   12,
    backgroundColor: C.bg,
  },
  discoverThumb: {
    width:        54,
    height:       54,
    borderRadius: 8,
    borderWidth:  1,
    alignItems:   'center',
    justifyContent: 'center',
    marginRight:  12,
  },
  discoverThumbEmoji: {
    fontSize: 26,
  },
  discoverBody: {
    flex: 1,
  },
  discoverTitle: {
    color:      C.text,
    fontSize:   14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 3,
  },
  discoverSub: {
    color:    C.sub,
    fontSize: 12,
    marginBottom: 8,
  },
  discoverActions: {
    flexDirection: 'row',
    gap:           8,
  },
  btnWatch: {
    backgroundColor:  C.blue,
    paddingHorizontal: 12,
    paddingVertical:   5,
    borderRadius:     6,
  },
  btnWatchDone: {
    backgroundColor: C.green,
  },
  btnWatchText: {
    color:      '#fff',
    fontSize:   12,
    fontWeight: '700',
  },
  btnMsg: {
    backgroundColor:  'transparent',
    paddingHorizontal: 12,
    paddingVertical:   5,
    borderRadius:     6,
    borderWidth:      1,
    borderColor:      C.border,
  },
  btnMsgText: {
    color:      C.sub,
    fontSize:   12,
    fontWeight: '600',
  },

  // ── Filter pills ─────────────────────────
  filterRow: {
    flexGrow: 0,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical:   5,
    borderRadius:     20,
    backgroundColor:  C.surface2,
    borderWidth:      1,
    borderColor:      C.border,
  },
  filterPillActive: {
    backgroundColor: C.blue,
    borderColor:     C.blue,
  },
  filterPillText: {
    color:      C.sub,
    fontSize:   12,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#fff',
  },

  // ── Compose FAB ──────────────────────────
  composeFab: {
    position:        'absolute',
    bottom:          20,
    right:           20,
    width:           52,
    height:          52,
    borderRadius:    26,
    backgroundColor: C.blue,
    alignItems:      'center',
    justifyContent:  'center',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.3,
    shadowRadius:    8,
    elevation:       8,
  },
  composeFabIcon: {
    fontSize: 22,
  },

  // ── Ranks ────────────────────────────────
  podiumStrip: {
    flexDirection:   'row',
    justifyContent:  'space-around',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: C.surface,
  },
  podiumCard: {
    alignItems: 'center',
    gap:        4,
  },
  podiumName: {
    fontSize:   11,
    fontWeight: '700',
  },
  podiumKarma: {
    color:    C.sub,
    fontSize: 11,
  },
  rankItem: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingHorizontal: 12,
    paddingVertical:   10,
    backgroundColor: C.bg,
  },
  rankItemTop: {
    backgroundColor: C.surface + '88',
  },
  rankItemMe: {
    backgroundColor: C.blue + '15',
    borderLeftWidth: 3,
    borderLeftColor: C.blue,
  },
  rankNumWrap: {
    width:    42,
    alignItems: 'center',
  },
  rankNum: {
    color:      C.muted,
    fontSize:   13,
    fontWeight: '700',
  },
  rankMedal: {
    fontSize: 22,
  },
  rankBody: {
    flex:        1,
    marginLeft:  4,
  },
  rankName: {
    color:      C.text,
    fontSize:   14,
    fontWeight: '600',
  },
  rankYouTag: {
    fontSize:         10,
    fontWeight:       '800',
    color:            C.blueLight,
    backgroundColor:  C.blueLight + '22',
    paddingHorizontal: 5,
    paddingVertical:   1,
    borderRadius:     4,
  },
  rankTrophies: {
    fontSize: 13,
    marginTop: 1,
  },
  rankScore: {
    alignItems: 'flex-end',
  },
  rankKarmaVal: {
    color:      C.text,
    fontSize:   15,
    fontWeight: '800',
  },
  rankKarmaLbl: {
    color:    C.muted,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  karmaBadge: {
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      4,
    borderWidth:       1,
  },
  karmaBadgeText: {
    fontSize:   9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ── Profile ──────────────────────────────
  profileHero: {
    alignItems:      'center',
    paddingVertical: 24,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  profileAvatar: {
    width:        80,
    height:       80,
    borderRadius: 40,
    borderWidth:  2,
    alignItems:   'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  profileAvatarEmoji: {
    fontSize: 38,
  },
  profileName: {
    color:      C.text,
    fontSize:   18,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileHandle: {
    color:    C.sub,
    fontSize: 13,
  },
  profileRank: {
    color:    C.blueLight,
    fontSize: 12,
    fontWeight: '600',
  },

  statsStrip: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: C.surface,
    paddingVertical: 14,
    marginBottom:    4,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  statBox: {
    flex:       1,
    alignItems: 'center',
  },
  statVal: {
    color:      C.text,
    fontSize:   18,
    fontWeight: '800',
  },
  statLbl: {
    color:    C.muted,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width:           1,
    height:          32,
    backgroundColor: C.border,
  },

  section: {
    paddingHorizontal: 16,
    paddingVertical:   14,
  },
  sectionTitle: {
    color:      C.sub,
    fontSize:   11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  trophyRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           10,
  },
  trophyBadge: {
    width:           52,
    height:          52,
    borderRadius:    26,
    backgroundColor: C.surface2,
    borderWidth:     1,
    borderColor:     C.border,
    alignItems:      'center',
    justifyContent:  'center',
  },

  achievementItem: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: 10,
    gap:            12,
  },
  achievementIcon: {
    width:        42,
    height:       42,
    borderRadius: 21,
    backgroundColor: C.surface2,
    borderWidth:  1,
    borderColor:  C.border,
    alignItems:   'center',
    justifyContent: 'center',
  },
  achievementLabel: {
    color:      C.text,
    fontSize:   14,
    fontWeight: '600',
  },
  achievementDesc: {
    color:    C.sub,
    fontSize: 12,
    marginTop: 1,
  },

  infoRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  infoLabel: {
    color:    C.sub,
    fontSize: 14,
  },
  infoValue: {
    color:      C.text,
    fontSize:   14,
    fontWeight: '600',
  },

  settingsRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap:            12,
  },
  settingsIcon: {
    fontSize: 20,
    width:    28,
    textAlign: 'center',
  },
  settingsLabel: {
    flex:       1,
    color:      C.text,
    fontSize:   15,
    fontWeight: '500',
  },
  settingsChevron: {
    color:    C.muted,
    fontSize: 20,
  },

  // ── Bottom Tab Bar ────────────────────────
  tabBar: {
    backgroundColor: C.surface,
    borderTopWidth:  1,
    borderTopColor:  C.border,
    height:          Platform.OS === 'ios' ? 82 : 64,
    paddingBottom:   Platform.OS === 'ios' ? 22 : 6,
    paddingTop:      6,
  },
  tabIcon: {
    alignItems: 'center',
    gap:        2,
  },
  tabEmoji: {
    fontSize: 20,
    opacity:  0.5,
  },
  tabEmojiFocused: {
    opacity: 1,
  },
  tabLabel: {
    fontSize:   9,
    fontWeight: '700',
    color:      C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tabLabelFocused: {
    color: C.blue,
  },

  // ── Wallet Drawer ─────────────────────────
  modalOverlay: {
    flex:            1,
    justifyContent:  'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  walletDrawer: {
    backgroundColor: C.surface,
    borderTopLeftRadius:  20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom:    40,
    paddingTop:       14,
    borderTopWidth:   1,
    borderTopColor:   C.border,
  },
  walletHandle: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: C.muted,
    alignSelf:       'center',
    marginBottom:    18,
  },
  walletTitle: {
    color:      C.text,
    fontSize:   18,
    fontWeight: '700',
    marginBottom: 14,
  },
  walletBalanceRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: 16,
  },
  walletBalanceLabel: {
    color:    C.sub,
    fontSize: 14,
  },
  walletBalance: {
    color:      C.green,
    fontSize:   28,
    fontWeight: '800',
  },
  walletInfoCard: {
    backgroundColor: C.surface2,
    borderWidth:     1,
    borderColor:     C.border,
    borderRadius:    10,
    padding:         12,
    marginBottom:    14,
  },
  walletInfoText: {
    color:    C.sub,
    fontSize: 13,
    lineHeight: 20,
  },
  walletStatsRow: {
    flexDirection:   'row',
    justifyContent:  'space-around',
    backgroundColor: C.surface2,
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     C.border,
    paddingVertical: 14,
    marginBottom:    16,
  },
  walletStat: {
    alignItems: 'center',
    flex:       1,
  },
  walletStatVal: {
    color:      C.text,
    fontSize:   22,
    fontWeight: '800',
  },
  walletStatLbl: {
    color:    C.muted,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 3,
  },
  walletStatDivider: {
    width:           1,
    height:          36,
    backgroundColor: C.border,
  },
  walletTopUpBtn: {
    backgroundColor: C.blue,
    borderRadius:    12,
    paddingVertical: 14,
    alignItems:      'center',
    marginBottom:    10,
  },
  walletTopUpText: {
    color:      '#fff',
    fontSize:   15,
    fontWeight: '700',
  },
  walletCloseBtn: {
    borderWidth:     1,
    borderColor:     C.border,
    borderRadius:    12,
    paddingVertical: 12,
    alignItems:      'center',
  },
  walletCloseTxt: {
    color:      C.sub,
    fontSize:   14,
    fontWeight: '600',
  },
});
