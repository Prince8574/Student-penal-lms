# Profile Utils

This directory contains utility modules for the Profile component, separating concerns for better maintainability.

## Files

### `threeBackground.js`
- Contains the `useBgScene` hook for the main background Three.js scene
- Handles star fields, animated rings, and floating geometric shapes
- Includes mouse interaction and responsive camera movement

### `threeCover.js`
- Contains the `useCoverScene` hook for the cover section Three.js scene
- Handles animated ribbon waves, particle fields, and floating orbs
- Optimized for the cover area with different visual effects

### `designTokens.js`
- Centralized design system with colors, gradients, typography, and spacing
- Shared across all Profile components for consistency
- Includes utility functions for color manipulation and skill color mappings

### `profileData.js`
- All static data for the Profile component (skills, courses, badges, etc.)
- Separated from component logic for better maintainability
- Easy to modify or replace with API calls in the future

### `animations.js`
- CSS-based animation utilities and helpers
- Prepared for future GSAP integration
- Includes scroll animations, hover effects, and timing utilities

### `gsapAnimations.js` (Future)
- Placeholder for advanced GSAP animations
- Currently uses CSS fallbacks for React compatibility
- Ready for GSAP integration when needed

## Usage

```javascript
// Import Three.js hooks
import { useBgScene } from './utils/threeBackground';
import { useCoverScene } from './utils/threeCover';

// Import design tokens
import { T, G, skillColors } from './utils/designTokens';

// Import profile data
import { skills, courses, badges, goals } from './utils/profileData';

// Import animation utilities
import { fadeAnimations, hoverEffects } from './utils/animations';
```

## Benefits

1. **Modularity**: Each utility has a single responsibility
2. **Reusability**: Can be used across different components
3. **Maintainability**: Easier to update and debug
4. **Performance**: Better tree-shaking and code splitting
5. **Testing**: Individual modules can be tested separately
6. **Data Management**: Static data separated from component logic
7. **Design Consistency**: Centralized design tokens ensure consistency

## File Structure
```
utils/
├── threeBackground.js    # Background Three.js scene
├── threeCover.js         # Cover Three.js scene  
├── designTokens.js       # Design system & tokens
├── profileData.js        # Static profile data
├── animations.js         # Animation utilities
├── gsapAnimations.js     # Future GSAP integration
└── README.md            # This documentation
```