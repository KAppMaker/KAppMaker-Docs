---
sidebar_position: 21
---

# Splash Screen

KAppMaker ships a **native launch screen** on both Android and iOS — no third‑party library. Each
platform uses its own built‑in mechanism, so the splash appears instantly at cold start before the
Compose UI loads.

## Android

Uses the official **`androidx.core:core-splashscreen`** API.

- Theme `Theme.App.Starting` in `androidApp/src/main/res/values/styles.xml`.
- It **reuses the launcher icon's own colors** — the background is `@color/ic_launcher_background`
  and the icon is `@mipmap/ic_launcher_foreground`. So the splash follows your app icon
  automatically: change the icon and the splash matches, nothing else to edit.
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
| Android | `ic_launcher_background` (colors.xml) — same as the app icon | `ic_launcher_foreground` — same as the app icon |
| iOS | `SplashBackground.colorset` | `ic_logo.imageset/ic_logo.png` |

> Tip: keep the iOS `SplashBackground` color in sync with your Android `ic_launcher_background`
> so both platforms look identical.
