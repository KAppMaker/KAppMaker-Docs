---
title: Configuration File Reference
---

# Configuration File Reference

A quick map of where each configurable thing lives. Useful while setting up a new
app, wiring features, and again when working through the
[Pre-Publishing Checklist](./production/pre-publishing-checklist.md).

Paths use `.../` to stand in for your package directory
(`shared/src/commonMain/kotlin/com/kotlinfoundation/kmpstarterkit/`).

| What | File path |
|------|-----------|
| Constants (URLs, emails) | `shared/src/commonMain/.../util/Constants.kt` |
| API keys | `MobileApp/local.properties` |
| Subscription provider | `MobileApp/gradle.properties` |
| Feature flags | `shared/src/commonMain/.../data/source/featureflag/FeatureFlagManager.kt` |
| Android icons | `androidApp/src/main/res/mipmap-*/` |
| Android notification icon | `androidApp/src/main/res/drawable/ic_notification.xml` |
| Android colors | `androidApp/src/main/res/values/colors.xml` |
| Android manifest | `androidApp/src/main/AndroidManifest.xml` |
| Android build config | `androidApp/build.gradle.kts` |
| Android keystore | `distribution/android/keystore/` |
| iOS icons | `iosApp/iosApp/Assets.xcassets/AppIcon.appiconset/` |
| iOS project settings | `iosApp/iosApp.xcodeproj/project.pbxproj` |
| iOS Info.plist | `iosApp/iosApp/Info.plist` |
| Firebase Android | `androidApp/google-services.json` |
| Firebase iOS | `iosApp/iosApp/GoogleService-Info.plist` |
