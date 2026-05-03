---
sidebar_position: 16
---

# Scripts

Helper scripts are located in the `MobileApp/scripts/` directory. Run all scripts from the `MobileApp/` directory.

## Update Version

Automatically increments the version code and optionally updates the version name for both Android and iOS in one go.

```bash
# Auto-increment patch version (e.g., 1.0.0 → 1.0.1) and bump version code:
./scripts/update_version.sh

# Set a specific version name:
./scripts/update_version.sh -v "2.0.0"
```

**What it does:**
- Reads current Android `versionCode` and `versionName` from `androidApp/build.gradle.kts`
- Increments Android `versionCode` by 1
- Reads and updates iOS `CURRENT_PROJECT_VERSION` and `MARKETING_VERSION` in `project.pbxproj`
- Updates iOS `Info.plist` (`CFBundleVersion` and `CFBundleShortVersionString`)
- If no `-v` flag is provided, the patch version (last number) is auto-incremented

**Note:** Make sure the script has executable permission: `chmod +x scripts/update_version.sh`

---

## Generate Android Keystore

Generates a signed keystore file and its properties file for Play Store publishing.

```bash
# Using person name only:
./scripts/generate_android_keystore.sh "Your Name" ""

# Using organization only:
./scripts/generate_android_keystore.sh "" "YourCompany"

# Using both:
./scripts/generate_android_keystore.sh "Your Name" "YourCompany"
```

**What it does:**
- Generates a keystore at `distribution/android/keystore/keystore.jks`
- Creates `distribution/android/keystore/keystore.properties` with auto-generated secure passwords
- Default key validity is 10,000 days

---

## Create Local Data Layer

Generates a complete local data layer for a given model, including Entity, DAO, Mapper, LocalDataSource, Room implementation, In-Memory implementation, and DI bindings.

```bash
./scripts/make_local.sh ExampleModel
```

**What it does:**
- Creates/updates the domain model file
- Generates local data layer files under `data/source/local`
- Updates Room database configuration
- Adds DI bindings
- Creates In-Memory implementation for web platform

**Notes:**
- Re-running the script for the same model skips existing domain files to prevent overwriting
- Automatically creates required folders and imports
- Ensure the base package path matches your project structure

---

## Create KMP Module

Scaffolds a new Kotlin Multiplatform library module with the convention plugin applied.

```bash
# Create module in default libs/ directory:
./scripts/create_module.sh my-module

# Create module in a custom directory:
./scripts/create_module.sh my-module custom-dir

# Create module with a custom namespace:
./scripts/create_module.sh my-module libs com.example.mymodule
```

**What it does:**
- Creates the module directory with `build.gradle.kts` using the `configure-kmp-library-module` convention plugin
- Sets up `commonMain` source directory with the correct package structure
- Adds the module to `settings.gradle.kts` automatically

---

## Generate ASO Metadata

Uses OpenAI to generate optimized App Store and Play Store metadata (titles, descriptions, keywords) for your app.

```bash
# Generate from an app idea:
./scripts/generate_aso_metadata.sh --idea "AI photo editor"

# Generate from a PRD file:
./scripts/generate_aso_metadata.sh --idea-file AiGuidelines/project/prd.md --store ios

# Generate with target keywords and multiple locales:
./scripts/generate_aso_metadata.sh --idea "OCR scanner" --keywords "document scanner,ocr app" --locales "en-US,es-ES"

# Translate existing metadata to other locales:
./scripts/generate_aso_metadata.sh --base-locale "en-US" --locales "es-ES,fr-FR"
```

**What it does:**
- Generates ASO-optimized metadata for iOS (name, subtitle, keywords, description) and/or Android (title, short description, full description)
- Outputs files to `distribution/ios/appstore_metadata/` and `distribution/android/playstore_metadata/`
- Supports multiple locales in parallel
- Can translate existing metadata to new locales

**Options:**
- `--idea "<text>"` — Short app idea or description
- `--idea-file <file>` — Path to PRD or idea document
- `--base-locale <path>` — Existing locale folder for translation mode
- `--keywords "<k1,k2>"` — Target ASO keywords
- `--locales "<l1,l2>"` — Comma-separated locales (default: `en-US`)
- `--store ios|android|both` — Target store (default: `both`)

**Requires:** `OPENAI_API_KEY` set in `local.properties`, `~/credentials/credentials.txt`, or in the script itself.

---

## Generate Store Screenshots

Renders every `@Preview @StoreScreenshot` composable into upload-ready PNGs at App Store / Play Store pixel sizes — framed in pure Compose, no Fastlane / ImageMagick / Ruby toolchain.

```bash
./scripts/generate_store_screenshots.sh
```

**What it does:**
- Runs `:shared:generateStoreScreenshots` with `-PgenerateStoreScreenshots=true` so the gated `StoreScreenshotGeneratorTest` actually executes.
- Roborazzi captures each `@Preview @StoreScreenshot` at the dimensions declared in its `StoreDevice` enum value.
- Output: `distribution/store_screenshots/<locale>/<device>/<tag>_<methodName>.png`.

**Add a new screenshot** by writing a `@Preview @StoreScreenshot @Composable` function anywhere under `com.measify.kappmaker.*`. See [Store Screenshots](./store-screenshots.md) for the authoring pattern.
