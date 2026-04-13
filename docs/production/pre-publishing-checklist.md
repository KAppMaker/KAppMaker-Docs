---
sidebar_position: 0
---

# Pre-Publishing Checklist

Before publishing your app, make sure you have completed all the steps below. This checklist covers everything from branding and configuration to API keys and store setup.

---

## 1. Package Name & App Identity

- [ ] **Refactor package name** using the Gradle task:
  ```bash
  ./gradlew refactorPackage -PnewAppId=com.yourcompany.yourapp -PnewAppName=YourApp
  ```
  This updates the Android `applicationId`, iOS `bundleIdentifier`, package directories, and all related references.

- [ ] **Verify Android app name** in `composeApp/src/androidMain/AndroidManifest.xml` — update the `android:label` attribute.

- [ ] **Verify iOS bundle identifier** in `iosApp/iosApp.xcodeproj/project.pbxproj` — search for `PRODUCT_BUNDLE_IDENTIFIER`.

- [ ] **Update version code & name** for both platforms using the version script:
  ```bash
  # Run from the MobileApp/ directory:
  cd MobileApp

  # Auto-increment patch version (e.g., 1.0.0 → 1.0.1) and bump version code for both Android & iOS:
  ./scripts/update_version.sh

  # Or set a specific version name:
  ./scripts/update_version.sh -v 2.0.0
  ```
  This script updates all of the following in one go:
  - **Android**: `versionCode` and `versionName` in `composeApp/build.gradle.kts`
  - **iOS**: `CURRENT_PROJECT_VERSION` and `MARKETING_VERSION` in `iosApp/iosApp.xcodeproj/project.pbxproj`, and `CFBundleVersion` / `CFBundleShortVersionString` in `iosApp/iosApp/Info.plist`

---

## 2. App Icons

### Android

The easiest way to replace Android app icons is using **Android Studio**:

1. Right-click on `composeApp/src/androidMain/res/` in Android Studio
2. Select **New > Image Asset**
3. Choose your icon source image (at least 1024x1024 recommended)
4. Android Studio will generate all required density sizes automatically

Icon files are located in:
```
composeApp/src/androidMain/res/
├── mipmap-hdpi/      ic_launcher.webp, ic_launcher_foreground.webp, ic_launcher_round.webp
├── mipmap-mdpi/      ...
├── mipmap-xhdpi/     ...
├── mipmap-xxhdpi/    ...
├── mipmap-xxxhdpi/   ...
└── mipmap-anydpi-v26/  ic_launcher.xml, ic_launcher_round.xml
```

### iOS

Use [AppIcon.co](https://www.appicon.co/) to generate all required iOS icon sizes:

1. Upload your icon (1024x1024 PNG recommended)
2. Select **iPhone** and **iPad** platforms
3. Download the generated icon set
4. Replace all files in `iosApp/iosApp/Assets.xcassets/AppIcon.appiconset/`

---

## 3. Notification Icon (Android)

- [ ] Replace the notification icon at `composeApp/src/androidMain/res/drawable/ic_notification.xml`
- The notification icon should be a **simple monochrome vector** (single color, no complex artwork). Android uses it as a silhouette in the status bar.

---

## 4. Android Colors & Branding

- [ ] Update launcher background and primary colors in `composeApp/src/androidMain/res/values/colors.xml`:
  - `ic_launcher_background` — background color for adaptive icons
  - `primary` — primary brand color (used in splash/status bar)
  - `windowBackgroundColor` — app window background color

- [ ] Update dark mode colors in `composeApp/src/androidMain/res/values-night/colors.xml`

---

## 5. Constants Configuration

Update the following fields in `composeApp/src/commonMain/.../util/Constants.kt`:

- [ ] `URL_PRIVACY_POLICY` — your privacy policy URL (required for App Store & Play Store)
- [ ] `URL_TERMS_CONDITIONS` — your terms & conditions URL
- [ ] `CONTACT_EMAIL` — your support email address
- [ ] `APPSTORE_APP_ID` — your iOS App Store app ID (numeric ID, found in App Store Connect)
- [ ] `CLOUD_FUNCTIONS_URL` — your Firebase Cloud Functions URL (e.g., `https://us-central1-YOUR_PROJECT.cloudfunctions.net`). Only needed if using AI integration.

---

## 6. Firebase Setup

- [ ] **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)
- [ ] **Download and replace** `google-services.json` at `composeApp/google-services.json` — make sure the package name matches your Android `applicationId`
- [ ] **Download and replace** `GoogleService-Info.plist` at `iosApp/iosApp/GoogleService-Info.plist` — make sure the bundle ID matches your iOS identifier

---

## 7. Authentication (Google & Apple Sign-In)

If using social login (`AUTH_SOCIAL_LOGIN_ENABLED = true` in Constants):

- [ ] **Google Sign-In**: Add `GOOGLE_WEB_CLIENT_ID` to `local.properties`
- [ ] **iOS Google Sign-In**: Update `iosApp/iosApp/Info.plist`:
  - `GIDServerClientID` — your Google Web Client ID
  - `GIDClientID` — your Google iOS Client ID
  - `CFBundleURLSchemes` — your reversed iOS Client ID
- [ ] **Apple Sign-In (iOS)**: Enable the Sign in with Apple capability in Xcode

See the [Authentication](../features/auth.md) guide for full setup details.

---

## 8. local.properties API Keys

Add the following keys to `MobileApp/local.properties`:

```properties
# Google Auth (required for Google Sign-In)
GOOGLE_WEB_CLIENT_ID=your_web_client_id

# Image hosting (required if using image upload)
IMGBB_TOKEN=your_imgbb_token

# Subscription provider API keys
SUBSCRIPTION_PROVIDER_ANDROID_API_KEY=your_android_key
SUBSCRIPTION_PROVIDER_IOS_API_KEY=your_ios_key

# AdMob (only if using ads)
ADMOB_APP_ID_ANDROID=ca-app-pub-xxxxx~xxxxx
ADMOB_BANNER_AD_ID_ANDROID=ca-app-pub-xxxxx/xxxxx
ADMOB_INTERSTITIAL_AD_ID_ANDROID=ca-app-pub-xxxxx/xxxxx
ADMOB_REWARDED_AD_ID_ANDROID=ca-app-pub-xxxxx/xxxxx
ADMOB_BANNER_AD_ID_IOS=ca-app-pub-xxxxx/xxxxx
ADMOB_INTERSTITIAL_AD_ID_IOS=ca-app-pub-xxxxx/xxxxx
ADMOB_REWARDED_AD_ID_IOS=ca-app-pub-xxxxx/xxxxx
```

---

## 9. Subscription Provider

- [ ] **Choose your provider** in `gradle.properties`:
  ```properties
  # Options: REVENUECAT or ADAPTY
  SUBSCRIPTION_PROVIDER=REVENUECAT
  ```
- [ ] **Update the factory** in `Constants.kt` — set `subscriptionProviderFactory` to match your chosen provider (`SubscriptionProviderFactory.RevenueCat` or `SubscriptionProviderFactory.Adapty`)
- [ ] **Configure products** in your provider's dashboard and link them to App Store / Play Store products
- [ ] **Verify entitlement ID** — `PAYWALL_PREMIUM_ACCESS` in Constants should match the entitlement/access level ID in your provider

See [In-App Purchases & Subscriptions](../features/inapp-purchases-subscription.md) for full setup.

---

## 10. Feature Flags

Review default feature flag values in `data/source/featureflag/FeatureFlagManager.kt`:

- [ ] `IS_ADS_ENABLED` — set to `true` if you want ads enabled by default
- [ ] `IS_ANALYTICS_ENABLED` — keep `true` for production
- [ ] `SHOW_REMOTE_PAYWALL` — `true` for remote paywall (managed from provider dashboard), `false` for custom paywall screen

These can also be controlled remotely via Firebase Remote Config after deployment.

---

## 11. Android Keystore (Signing)

- [ ] **Generate a keystore** using the helper script (generates both the keystore and properties file automatically):
  ```bash
  cd MobileApp
  ./scripts/generate_android_keystore.sh "Your Name" "YourCompany"
  ```
  This creates `distribution/android/keystore/keystore.jks` and `distribution/android/keystore/keystore.properties` with auto-generated secure passwords.

  Alternatively, you can generate the keystore via Android Studio (Build > Generate Signed Bundle/APK) and manually create `keystore.properties`.

See the [Android Production](android.md) guide for details.

---

## 12. Store Metadata & Release Notes

- [ ] **Generate ASO-optimized store metadata** using the helper script:
  ```bash
  cd MobileApp

  # From an app idea:
  ./scripts/generate_aso_metadata.sh --idea "Your app description"

  # From your PRD file:
  ./scripts/generate_aso_metadata.sh --idea-file AiGuidelines/project/prd.md

  # For multiple locales:
  ./scripts/generate_aso_metadata.sh --idea "Your app" --locales "en-US,es-ES,de-DE"
  ```
  This generates optimized titles, descriptions, and keywords for both Play Store and App Store in `distribution/`. Requires `OPENAI_API_KEY` in `local.properties`.

- [ ] **Update release notes** in `distribution/whatsnew/whatsnew-en-US` before each release

---

## 13. Publishing with Fastlane

KAppMaker includes pre-configured Fastlane lanes for building and uploading to both stores. Run from `MobileApp/`:

- [ ] **First Android upload** (generates keystore if needed, builds AAB for manual upload):
  ```bash
  fastlane android first_time_build
  ```
- [ ] **Subsequent Android releases**:
  ```bash
  fastlane android playstore_release                    # internal track
  fastlane android playstore_release track:production   # production
  ```
- [ ] **iOS release**:
  ```bash
  fastlane ios appstore_release
  fastlane ios appstore_release submit_for_review:true  # auto-submit for review
  ```

See the [Fastlane](fastlane.md) guide for all available lanes and options.

---

## 14. CI/CD (Optional)

If using GitHub Actions for automated deployments:

- [ ] Configure GitHub repository secrets (keystore, service accounts, API keys)
- [ ] Set up Fastlane credentials:
  - Android: `~/credentials/google-service-app-publisher.json`
  - iOS: `~/credentials/appstore-publisher.json`

See [GitHub CI/CD](../features/github-ci-cd.md) for full setup.

---

## Quick Reference: File Locations

| What | File Path |
|------|-----------|
| Constants (URLs, emails) | `composeApp/src/commonMain/.../util/Constants.kt` |
| API keys | `MobileApp/local.properties` |
| Subscription provider | `MobileApp/gradle.properties` |
| Feature flags | `composeApp/src/commonMain/.../data/source/featureflag/FeatureFlagManager.kt` |
| Android icons | `composeApp/src/androidMain/res/mipmap-*/` |
| Android notification icon | `composeApp/src/androidMain/res/drawable/ic_notification.xml` |
| Android colors | `composeApp/src/androidMain/res/values/colors.xml` |
| Android manifest | `composeApp/src/androidMain/AndroidManifest.xml` |
| Android build config | `composeApp/build.gradle.kts` |
| Android keystore | `distribution/android/keystore/` |
| iOS icons | `iosApp/iosApp/Assets.xcassets/AppIcon.appiconset/` |
| iOS project settings | `iosApp/iosApp.xcodeproj/project.pbxproj` |
| iOS Info.plist | `iosApp/iosApp/Info.plist` |
| Firebase Android | `composeApp/google-services.json` |
| Firebase iOS | `iosApp/iosApp/GoogleService-Info.plist` |
