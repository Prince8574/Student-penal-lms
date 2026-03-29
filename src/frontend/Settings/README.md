# Settings Module

Complete settings page for LearnVerse with advanced UI/UX features.

## Features

✅ **Account Panel** - Profile editing, personal info, danger zone
✅ **Three.js Background** - Animated 3D particle system
✅ **Custom Cursor** - Gold glowing cursor with ring follower
✅ **GSAP Animations** - Smooth entrance and transition animations
✅ **Toast Notifications** - Success/error/info notifications
✅ **Responsive Design** - Collapsible sidebar, mobile-friendly
✅ **Dark Theme** - Cosmic dark theme with gold accents

## File Structure

```
Settings/
├── Settings.js          # Main component
├── Settings.css         # All styles
├── components/
│   ├── Cursor.js       # Custom cursor
│   ├── NavSidebar.js   # Left navigation
│   ├── SecHead.js      # Section headers
│   ├── Toast.js        # Toast notifications
│   ├── Toggle.js       # Toggle switch
│   └── panels/
│       ├── AccountPanel.js      # ✅ Complete
│       ├── AppearancePanel.js   # TODO
│       ├── NotificationsPanel.js # TODO
│       ├── PrivacyPanel.js      # TODO
│       ├── SecurityPanel.js     # TODO
│       ├── LearningPanel.js     # TODO
│       ├── AccessibilityPanel.js # TODO
│       ├── IntegrationsPanel.js  # TODO
│       └── index.js
├── hooks/
│   ├── useBackground.js # Three.js background hook
│   └── useGSAP.js       # GSAP animation hook
└── utils/
    ├── designTokens.js  # Colors & gradients
    └── settingsData.js  # Tabs & navigation data
```

## Usage

The Settings page is already integrated in App.js:

```javascript
import SettingsPage from './frontend/Settings/Settings';

// Route
<Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
```

Access it at: `http://localhost:3000/settings`

## Adding New Panels

To add remaining panels (Appearance, Notifications, etc.):

1. Create panel component in `components/panels/`
2. Import in `Settings.js`
3. Add to `renderPanel()` switch statement

Example:
```javascript
// components/panels/AppearancePanel.js
export function AppearancePanel({ form, setForm, showToast }) {
  // Your panel code
}

// Settings.js
import { AppearancePanel } from './components/panels/AppearancePanel';

// In renderPanel()
case 'appearance':
  return <AppearancePanel {...props} />;
```

## Design Tokens

All colors and gradients are centralized in `utils/designTokens.js`:

```javascript
import { T, G } from './utils/designTokens';

// Colors
T.gold, T.teal, T.blue, T.purple, etc.

// Gradients
G.gold, G.teal, G.purple, etc.
```

## Dependencies

- React
- Three.js (for 3D background)
- GSAP (loaded from CDN)
- React Router (for navigation)

## Notes

- Custom cursor only works on desktop
- GSAP is loaded dynamically from CDN
- All animations respect `prefers-reduced-motion`
- Form state is managed locally (can be connected to backend)
