---
sidebar_position: 3
---

# Fastlane

KAppMaker includes pre-configured [Fastlane](https://fastlane.tools/) lanes for building and uploading your app to the Google Play Store and Apple App Store. The Fastlane configuration is in `MobileApp/fastlane/Fastfile`.

All Fastlane commands should be run from the `MobileApp/` directory.

## Prerequisites

- **Fastlane** installed: `gem install fastlane` or `brew install fastlane`
- **Android**: A Google Play service account JSON key (see [Android Production](android.md))
- **iOS**: An App Store Connect API key (see [iOS Production](iOS.md))

### Credential Files

Place your credential files at these default paths (or pass custom paths as options):

- **Android**: `~/credentials/google-service-app-publisher.json`
- **iOS**: `~/credentials/appstore-publisher.json`

---

## Android Lanes

### First-Time Build

For your very first Play Store upload, use this lane. It generates a keystore if one doesn't exist, builds a release AAB, and saves it for manual upload.

```bash
# Basic usage (uses applicationId as organization):
fastlane android first_time_build

# With custom name/org for keystore generation:
fastlane android first_time_build first_name:"Your Name" organization:"YourCompany"
```

**What it does:**
1. Checks if a keystore exists at `distribution/android/keystore/` — generates one if missing
2. Builds a release AAB via `./gradlew :composeApp:bundleRelease`
3. Copies the AAB to `distribution/android/app-release.aab`

**Note:** The first upload to Google Play Console must be done manually. After that, you can use the `playstore_release` lane.

### Play Store Release

Builds and uploads the AAB directly to Google Play Store.

```bash
# Upload to internal testing track (default):
fastlane android playstore_release

# Upload to production:
fastlane android playstore_release track:production

# Upload with metadata and screenshots:
fastlane android playstore_release upload_metadata:true upload_screenshots:true upload_images:true

# Custom service account path:
fastlane android playstore_release service_account:"path/to/key.json"
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `track` | `internal` | Play Store track (`internal`, `alpha`, `beta`, `production`) |
| `upload_metadata` | `false` | Upload title, description from `distribution/android/playstore_metadata/` |
| `upload_screenshots` | `false` | Upload screenshots |
| `upload_images` | `false` | Upload logo, feature graphics |
| `submit_for_review` | `true` | Send changes for review in Play Console |
| `release_status` | `draft` (internal) / `completed` (others) | Release status |
| `service_account` | `~/credentials/google-service-app-publisher.json` | Path to service account key |

### Download Play Store Metadata

Fetches current metadata from Google Play Console and saves it locally.

```bash
fastlane android update_local_metadata_from_playstore
```

Saves metadata to `distribution/android/playstore_metadata/`. Useful for syncing local metadata with what's live on the Play Store.

---

## iOS Lanes

### App Store Release

Builds the iOS app and uploads it to App Store Connect.

```bash
# Build and upload (without metadata):
fastlane ios appstore_release

# Upload with metadata:
fastlane ios appstore_release upload_metadata:true

# Upload with screenshots:
fastlane ios appstore_release upload_screenshots:true

# Submit for review automatically:
fastlane ios appstore_release submit_for_review:true
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `upload_metadata` | `false` | Upload metadata from `distribution/ios/appstore_metadata/texts/` |
| `upload_screenshots` | `false` | Upload screenshots from `distribution/ios/appstore_metadata/screenshots/` |
| `submit_for_review` | `false` | Automatically submit for App Store review |

**What it does:**
1. Builds the iOS app using Xcode (`iosApp` scheme, Release configuration)
2. Exports an IPA to `distribution/ios/iosApp.ipa`
3. Uploads to App Store Connect using the API key

### Download App Store Metadata

Fetches current metadata and screenshots from App Store Connect.

```bash
fastlane ios update_local_metadata_from_appstore
```

Saves text metadata to `distribution/ios/appstore_metadata/texts/` and screenshots to `distribution/ios/appstore_metadata/screenshots/`.

---

## Metadata Directory Structure

After generating or downloading metadata, the structure looks like:

```
distribution/
├── android/
│   ├── keystore/                    # Signing keystore
│   └── playstore_metadata/          # Play Store metadata
│       └── en-US/
│           ├── title.txt
│           ├── short_description.txt
│           └── full_description.txt
├── ios/
│   └── appstore_metadata/
│       ├── texts/                   # App Store text metadata
│       │   └── en-US/
│       │       ├── name.txt
│       │       ├── subtitle.txt
│       │       ├── keywords.txt
│       │       └── description.txt
│       └── screenshots/             # App Store screenshots
└── whatsnew/
    └── whatsnew-en-US               # Release notes
```

You can populate this metadata either manually, by downloading from the stores using the lanes above, or by generating it with the [ASO metadata script](../features/scripts.md#generate-aso-metadata).
