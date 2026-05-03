---
name: nexus-mobile
description: "React Native, Expo, mobile-first design, push notifications (FCM/APNs), deep linking, offline-first patterns, App Store screenshots and ASO, secure storage (Keychain/Keystore), OTA updates, EAS Build, biometrics. MFRI scoring before any feature. Mobile is NOT a small desktop. Use when building native or cross-platform mobile apps, or designing for App Store submission."
triggers: ["react native", "expo", "mobile app", "ios", "android", "push notification", "deep link", "offline", "app store", "eas build", "eas submit", "biometric", "face id", "touch id", "secure store", "keychain", "app store screenshots", "aso", "apple", "google play", "native app", "cross-platform", "flutter", "swiftui", "compose", "mobile"]
---

# NEXUS MOBILE Engine v3.0
**Touch-first. Battery-conscious. Platform-respectful. Mobile is NOT a small desktop.**

---

## Phase 0 — MFRI Scoring

Score every feature before implementation.

```
MFRI = (Platform Clarity + Accessibility Readiness)
       − (Interaction Complexity + Performance Risk + Offline Dependence)

Range: −10 → +10
6–10: Proceed normally
3–5:  Add performance + UX validation
0–2:  Simplify interactions or architecture
< 0:  Redesign before implementation
```

---

## Phase 1 — Platform Decision

```
Need OTA updates + web team → React Native + Expo
High-performance custom UI  → Flutter
iOS only                    → SwiftUI
Android only                → Jetpack Compose
Hybrid/PWA                  → Next.js PWA (last resort)
```

No debate without explicit justification against this tree.

---

## Phase 2 — Project Setup (Expo — recommended)

```bash
npx create-expo-app@latest MyApp --template blank-typescript
cd MyApp

# Essential packages
npx expo install expo-router
npx expo install expo-secure-store
npx expo install expo-notifications
npx expo install expo-linking
npx expo install @react-native-async-storage/async-storage

# EAS (for builds and OTA)
npm install -g eas-cli
eas login
eas build:configure
```

---

## Phase 3 — Navigation (Expo Router)

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Home, Search, Profile } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#3B82F6' }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: ({ color }) => <Search color={color} size={24} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Profile color={color} size={24} /> }} />
    </Tabs>
  );
}
```

---

## Phase 4 — Performance (Non-Negotiable)

```tsx
// ALWAYS FlatList — never ScrollView for lists
import { FlatList } from 'react-native';
import { FlashList } from '@shopify/flash-list';  // 10x faster for large lists

const ITEM_HEIGHT = 80;

const Item = React.memo(({ item }: { item: ListItem }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{item.title}</Text>
  </View>
));

const renderItem = useCallback(({ item }) => <Item item={item} />, []);

// FlashList (preferred for > 100 items)
<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={ITEM_HEIGHT}
  keyExtractor={item => item.id}
/>

// FlatList (standard)
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  getItemLayout={(_, i) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * i, index: i })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>

// NEVER: index as key, inline arrow in renderItem, ScrollView for lists
```

---

## Phase 5 — Secure Storage

```tsx
import * as SecureStore from 'expo-secure-store';

// Store sensitive data (Keychain on iOS, Keystore on Android)
await SecureStore.setItemAsync('auth_token', token);
const token = await SecureStore.getItemAsync('auth_token');
await SecureStore.deleteItemAsync('auth_token');

// NEVER use AsyncStorage for:
// - Auth tokens
// - Passwords or PINs
// - Personal data
// - API keys

// AsyncStorage OK for:
// - User preferences
// - Theme settings
// - Non-sensitive cache
```

---

## Phase 6 — Push Notifications

```tsx
import * as Notifications from 'expo-notifications';

// Request permissions (ask at a positive moment — NOT on app launch)
const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  });

  // Send token to your server
  await api.post('/users/push-token', { token: token.data });
  return token.data;
};

// Handle incoming notification
Notifications.addNotificationReceivedListener(notification => {
  console.log('Received:', notification);
});

// Handle notification tap
Notifications.addNotificationResponseReceivedListener(response => {
  const { data } = response.notification.request.content;
  // Navigate to relevant screen
  router.push(`/orders/${data.orderId}`);
});
```

---

## Phase 7 — Deep Linking

```tsx
// app.json
{
  "expo": {
    "scheme": "myapp",
    "ios": { "bundleIdentifier": "com.company.myapp" },
    "android": { "package": "com.company.myapp" }
  }
}

// Link handling in Expo Router is automatic for file-based routes
// myapp://products/123 → app/products/[id].tsx

// Web to app redirect
// https://myapp.com/products/123 → myapp://products/123
// Set up in apple-app-site-association + assetlinks.json
```

---

## Phase 8 — Offline-First

```tsx
import NetInfo from '@react-native-community/netinfo';

// Offline detection
const [isOnline, setIsOnline] = useState(true);
useEffect(() => {
  return NetInfo.addEventListener(state => {
    setIsOnline(state.isConnected ?? false);
  });
}, []);

// Optimistic updates with rollback
const updateItem = async (id: string, updates: Partial<Item>) => {
  const original = items.find(i => i.id === id);
  // 1. Update UI immediately
  setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  try {
    await api.update(id, updates);
  } catch {
    // 2. Rollback on failure
    setItems(prev => prev.map(i => i.id === id ? original! : i));
    showToast('Failed to save. Changes reverted.');
  }
};

// Queue mutations when offline
const [queue, setQueue] = useState<PendingMutation[]>([]);
useEffect(() => {
  if (isOnline && queue.length > 0) {
    processQueue(queue).then(() => setQueue([]));
  }
}, [isOnline]);
```

---

## Phase 9 — App Store Design

### Screenshot Formula (production-grade)
```
Each screenshot = Benefit headline + Device mockup + Context annotation

Screenshot 1: Main benefit   → "Your [product], perfected."
Screenshot 2: Differentiator → "The only app that [unique value]"
Screenshot 3: Key feature    → Glanceable/widget/widget kit
Screenshot 4: Personalization → "Made for how you [use case]"
Screenshot 5: Social proof   → Ratings or testimonial overlay
```

### Required Sizes (Apple)
```
6.7" iPhone  (required): 1290 × 2796 px
5.5" iPhone  (required): 1242 × 2208 px
12.9" iPad   (required if iPad): 2048 × 2732 px
```

### ASO Checklist
```
□ Title: primary keyword in first 30 chars
□ Subtitle: secondary value proposition
□ First 3 lines of description visible without "more" tap
□ Screenshots: first 2 carry the conversion weight
□ Keywords field: 100 chars, no spaces after commas
□ App preview video: 15–30s showing core flow
□ Ratings prompt at positive moment (post-success action)
□ Category: primary + secondary chosen for keyword coverage
```

---

## EAS Build & Submit

```bash
# Development build (for testing)
eas build --profile development --platform ios

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android

# OTA update (no store review)
eas update --branch production --message "Fix checkout bug"
```

---

## Mobile Release Checklist

```
□ MFRI ≥ 3 for all shipped features
□ Touch targets ≥ 44pt / 48dp everywhere
□ Safe area insets handled (notch, home indicator, Dynamic Island)
□ FlatList or FlashList for all scrollable lists
□ SecureStore for all sensitive data (not AsyncStorage)
□ Offline behavior defined and tested on airplane mode
□ Push permission requested at positive moment (not launch)
□ Deep linking tested for all entry points
□ console.log stripped in production
□ Tested on low-end device (iPhone SE / Android Go level)
□ Accessibility labels on all interactive elements
□ Dynamic type / font scaling respected
□ App Store screenshots at all required sizes
□ Privacy manifest complete (Apple requirement since 2024)
□ EAS build passes — no local-only workarounds
```
