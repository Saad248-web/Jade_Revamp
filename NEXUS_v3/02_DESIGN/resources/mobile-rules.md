# Mobile Design Rules
## MFRI · Touch Psychology · Platform Defaults · Performance Doctrine

---

## MFRI — Mobile Feasibility Risk Index

Score before any mobile feature. Don't skip this.

```
MFRI = (Platform Clarity + Accessibility Readiness)
       − (Interaction Complexity + Performance Risk + Offline Dependence)

Range: −10 → +10
6–10:  Safe — proceed
3–5:   Moderate — add performance + UX validation
0–2:   Risky — simplify interactions or architecture
< 0:   Dangerous — redesign before implementation
```

---

## Platform Defaults — Know These Before Designing

| Element | iOS | Android |
|---------|-----|---------|
| Font | SF Pro | Roboto |
| Min touch | 44pt | 48dp |
| Back gesture | Edge swipe | System back button |
| Bottom sheets | Native sheet | Dialog or sheet |
| Icons | SF Symbols | Material Icons |
| Status bar | ~44px safe area | ~24px |
| Bottom bar | ~34px safe area (home indicator) | ~16px |

---

## The 4 Laws of Mobile Design

**Law 1: Mobile is NOT a small desktop.**
Every decision starts from touch constraints, not from shrinking a desktop layout.

**Law 2: Thumb zone is king.**
Primary CTAs live in the bottom 40% of the screen. Destructive actions pushed to top.

```
┌──────────────┐
│   Hard       │  ← Avoid primary CTAs here
│   Reach      │
├──────────────┤
│   Easy       │  ← Navigation, secondary actions
│   Reach      │
├──────────────┤
│   Thumb      │  ← Primary CTAs, main actions, FAB
│   Zone ✓✓    │
└──────────────┘
```

**Law 3: 44px is the minimum. 48px is better.**
Finger accuracy is ~10mm. At 96dpi, that's 38px. At 160dpi, that's 44px. Always round up.

**Law 4: Design for interruption.**
Mobile users are distracted, on bad networks, low battery, one-handed. Every interaction must be:
- Completable in one action
- Resumable if interrupted
- Forgiving of errors (easy undo)

---

## Touch Interaction Rules

```css
/* Touch targets */
.touchable {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Never hover-only — always touch alternative */
@media (hover: hover) {
  .element:hover { /* hover effect */ }
}
/* Touch devices get :active instead */
.element:active { transform: scale(0.97); }

/* No :hover for primary interactions — use :focus or :active */
/* Swipe gestures need a button fallback */
```

---

## Safe Area Handling (iOS notch / Dynamic Island)

```css
/* Always use safe-area-inset */
.bottom-nav {
  padding-bottom: max(env(safe-area-inset-bottom), 16px);
}

.fixed-bottom {
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
}

/* Full-bleed hero on mobile */
.hero {
  padding-top: env(safe-area-inset-top);
  min-height: 100dvh;  /* dvh = dynamic viewport height, accounts for browser chrome */
}
```

---

## React Native — Required Performance Patterns

```tsx
// ALWAYS use FlatList for any scrollable list (never ScrollView)
import { FlatList } from 'react-native';

const Item = React.memo(({ item }: { item: ListItem }) => (
  <View><Text>{item.title}</Text></View>
));

const renderItem = useCallback(({ item }) => <Item item={item} />, []);

<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  getItemLayout={(_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}  // Android performance
  maxToRenderPerBatch={10}      // Smooth initial load
  windowSize={5}                // Reduce memory
/>

// NEVER: index as key, inline renderItem, console.log in production
// ALWAYS: stable IDs, memoized renderItem, FlatList not ScrollView
```

---

## Secure Storage (NEVER AsyncStorage for tokens)

```tsx
// ✅ CORRECT
import * as SecureStore from 'expo-secure-store';  // iOS Keychain / Android Keystore

await SecureStore.setItemAsync('auth_token', token);
const token = await SecureStore.getItemAsync('auth_token');

// ❌ NEVER — tokens in AsyncStorage are readable by anyone
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('auth_token', token);  // BAD
```

---

## App Store Design Patterns

### Screenshot Requirements (Apple)
```
6.7" iPhone (required):  1290 × 2796 px
5.5" iPhone (required):  1242 × 2208 px
12.9" iPad Pro (required if iPad): 2048 × 2732 px
```

### Production Screenshot Formula (from felixleezd)
Each screenshot = 1 benefit headline + 1 device mockup + context annotation
```
Screenshot 1: Main benefit — "Your [product], perfected."
Screenshot 2: Key differentiator
Screenshot 3: Glanceable/widget feature
Screenshot 4: Secondary value
Screenshot 5: Social proof or personalization
```

### App Store Optimization (ASO)
```
□ Title: primary keyword in first 30 chars
□ Subtitle: secondary value prop
□ Description: first 3 lines most important (above the fold)
□ Screenshots: first 2 visible in search — make them count
□ Preview video: 15–30s showing core flow
□ Keywords: 100 chars, comma-separated, no spaces
□ Ratings: prompt at a positive moment (not on error)
```

---

## Offline-First Rules

```tsx
// Pattern: Cache-first with network fallback
const getData = async (key: string) => {
  // 1. Try cache first
  const cached = await AsyncStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  // 2. Network if no cache
  const fresh = await fetchFromAPI(key);
  await AsyncStorage.setItem(key, JSON.stringify(fresh));
  return fresh;
};

// Optimistic UI pattern
const updateItem = async (id: string, updates: Partial<Item>) => {
  // 1. Update UI immediately
  setItems(prev => prev.map(i => i.id === id ? {...i, ...updates} : i));

  try {
    // 2. Persist to server
    await api.update(id, updates);
  } catch {
    // 3. Rollback on failure
    setItems(prev => prev.map(i => i.id === id ? original : i));
    showError('Failed to save. Changes reverted.');
  }
};
```

---

## Mobile Release Checklist

```
□ Touch targets ≥ 44pt / 48dp everywhere
□ Safe area insets handled (notch, home indicator)
□ Offline behavior defined and tested
□ SecureStore for sensitive data (not AsyncStorage)
□ SSL pinning for auth endpoints
□ FlatList for all scrollable lists
□ No console.log in production (strip with babel plugin)
□ Tested on low-end device (iPhone SE, Android Go)
□ Accessibility labels on all interactive elements
□ Dynamic font sizes respected (don't override system font size)
□ App loads without network (splash → offline state gracefully)
□ Push notification permissions requested at right moment (not on launch)
□ Deep linking configured and tested
□ MFRI ≥ 3 for all features
```
