import { T } from './designTokens';

export const TABS = [
  { id: 'appearance', icon: '🎨', label: 'Appearance', color: T.purple },
  { id: 'notifications', icon: '🔔', label: 'Notifications', color: T.teal },
  { id: 'privacy', icon: '🔒', label: 'Privacy', color: T.blue },
  { id: 'security', icon: '🛡️', label: 'Security', color: T.green },
  { id: 'learning', icon: '📚', label: 'Learning', color: T.amber },
  { id: 'accessibility', icon: '♿', label: 'Accessibility', color: T.cyan },
];

export const NAV = [
  {
    g: 'MAIN',
    items: [
      { i: '⊞', l: 'Dashboard', id: 'dash' },
      { i: '📚', l: 'My Courses', id: 'courses', badge: 4 },
      { i: '🔍', l: 'Explore', id: 'explore' },
      { i: '📝', l: 'Assignments', id: 'assign', badge: 3 },
      { i: '🏅', l: 'Grades', id: 'grades' },
      { i: '📅', l: 'Schedule', id: 'sched' },
    ],
  },
  {
    g: 'COMMUNITY',
    items: [
      { i: '💬', l: 'Messages', id: 'msg', badge: 2 },
      { i: '🔔', l: 'Notifications', id: 'notif', badge: 5 },
      { i: '🏆', l: 'Leaderboard', id: 'lead' },
    ],
  },
  {
    g: 'ACCOUNT',
    items: [
      { i: '👤', l: 'Profile', id: 'profile' },
      { i: '⚙️', l: 'Settings', id: 'settings', on: true },
    ],
  },
];

