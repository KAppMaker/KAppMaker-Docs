---
sidebar_position: 21
---

# Splash Screen

KMPStarterKit ships a **native launch screen** on both Android and iOS — no third‑party library. Each
platform uses its own built‑in mechanism, so the splash appears instantly at cold start before the
Compose UI loads.

## Android

Uses the official **`androidx.core:core-splashscreen`** API.

- Theme `Theme.App.Starting` in `androidApp/src/main/res/values/styles.xml`.
- The background is `@color/windowBackgroundColor` — **the same as the app window** — so the splash
  hands off to your UI with no color flash. The icon is the **adaptive launcher icon**
  `@mipmap/ic_launcher`. (The system masks the splash icon to a circle; adaptive icons are built for
  that, so it stays crisp and uncropped — a full-bleed brand logo would lose its corners. The native
  theme also can't reference Compose resources, only `res/` ones.) Your **brand logo** (`ic_logo`)
  is shown uncropped by the in-app Compose splash (the onboarding loading screen).
- Wired via `android:theme="@style/Theme.App.Starting"` on `AppActivity`, plus
  `installSplashScreen()` (before `super.onCreate()`) in `App.android.kt`. After launch,
  `postSplashScreenTheme` hands off to `AppTheme`.

To keep the splash on screen while the app finishes loading:

```kotlin
installSplashScreen().setKeepOnScreenCondition { !isReady }
```

## iOS

Uses the declarative **`UILaunchScreen`** key in `iosApp/iosApp/Info.plist` (iOS 14+, no storyboard,
no `.xcodeproj` changes).

iOS can't point a launch screen at the `AppIcon` set, so the splash logo is a single image you
replace:

- **Logo** → `iosApp/iosApp/Assets.xcassets/ic_logo.imageset/ic_logo.png`
- **Background** → `iosApp/iosApp/Assets.xcassets/SplashBackground.colorset`

The `Info.plist` keys reference those by name:

```xml
<key>UILaunchScreen</key>
<dict>
    <key>UIColorName</key>
    <string>SplashBackground</string>
    <key>UIImageName</key>
    <string>ic_logo</string>
    <key>UIImageRespectsSafeAreaInsets</key>
    <true/>
</dict>
```

## Rebrand checklist

| Platform | Background | Logo |
| --- | --- | --- |
| Android | `windowBackgroundColor` (colors.xml) — same as the app window | `@mipmap/ic_launcher` — the adaptive launcher icon (circle-masked) |
| iOS | `SplashBackground.colorset` | `ic_logo.imageset/ic_logo.png` — your brand logo |

> Tip: keep the iOS `SplashBackground` color in sync with your Android `windowBackgroundColor`
> (the app window background) so both platforms look identical and transition seamlessly.

The **brand logo** shown right after the native splash (the in-app Compose splash, sign-in, and
onboarding) is `designsystem/.../composeResources/drawable/ic_logo.webp`. Replace that one file to
rebrand the in-app logo across all platforms — it's the same asset the native iOS launch screen uses
(copied to `ic_logo.imageset/ic_logo.png`, since the launch screen can't read Compose resources).
