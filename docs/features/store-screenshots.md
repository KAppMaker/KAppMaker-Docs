---
sidebar_position: 19
---

# Store Screenshots

Render every storefront screenshot — App Store + Play Store, all locales, framed in pure Compose — with a single command. No Fastlane, no ImageMagick, no Ruby toolchain.

```bash
./scripts/generate_store_screenshots.sh
```

Output lands at `distribution/store_screenshots/<locale>/<device>/<tag>_<methodName>.png`, ready to upload.

## Adding a screenshot

Drop a `@Preview @StoreScreenshot @Composable` function anywhere under `com.measify.kappmaker.*`:

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.measify.kappmaker.screenshot.DeviceFrame
import com.measify.kappmaker.screenshot.StoreDevice
import com.measify.kappmaker.screenshot.StoreScreenshot

@Preview
@StoreScreenshot(device = StoreDevice.IPHONE_6_9, locale = "en", tag = "01-home")
@Composable
private fun HomeStoreScreenshot_iPhone_en() {
    DeviceFrame(
        device = StoreDevice.IPHONE_6_9,
        headline = "Track habits effortlessly",
    ) {
        HomeScreen(uiState = HomeUiState.Stub)
    }
}
```

Re-run the script — the new PNG appears in `distribution/store_screenshots/en/iphone_6_9/01-home_HomeStoreScreenshot_iPhone_en.png`. No config edits, no script changes.

## How it works

Three pieces in `shared/src/commonMain/kotlin/com/measify/kappmaker/screenshot/`:

| File | Purpose |
|------|---------|
| `StoreScreenshot.kt` | The annotation + `StoreDevice` enum (storefront pixel sizes). |
| `DeviceFrame.kt` | Compose wrapper: marketing background, headline / subtitle, and the device shell containing your screen content. |
| `DeviceShell.kt` | Per-device bezel / notch / corner-radius rendering. |

The annotation `@StoreScreenshot(device, locale, tag)` is picked up by [`StoreScreenshotGeneratorTest`](https://github.com/KAppMaker/KAppMaker-All/blob/main/MobileApp/shared/src/androidHostTest/kotlin/com/measify/kappmaker/screenshot/StoreScreenshotGeneratorTest.kt), which uses [Roborazzi](https://github.com/takahirom/roborazzi) + [ComposablePreviewScanner](https://github.com/sergio-sastre/ComposablePreviewScanner) to render at the exact dimensions and write the PNG.

## `StoreDevice` enum — built-in storefront sizes

The enum [`StoreDevice`](https://github.com/KAppMaker/KAppMaker-All/blob/main/MobileApp/shared/src/commonMain/kotlin/com/measify/kappmaker/screenshot/StoreScreenshot.kt) ships with current Apple + Google storefront-required sizes:

| Value | Width × Height | Usage |
|-------|-----------------|-------|
| `IPHONE_6_9` | 1320 × 2868 | iPhone 16 Pro Max / 6.9" Display |
| `IPHONE_6_5` | 1284 × 2778 | iPhone 14 Pro Max / 6.5" Display |
| `IPAD_13` | 2064 × 2752 | iPad Pro 13" |
| `PIXEL_PHONE` | 1080 × 1920 | Google Play phone |
| `ANDROID_TABLET_10` | 1920 × 1200 | Google Play 10" tablet |

Add new entries as Apple / Google update specs.

## Localization

The `locale` parameter on `@StoreScreenshot` controls Robolectric's qualifiers and `Locale.setDefault()` so any `stringResource(...)` your composable uses renders in the right language. Author one preview per `(device × locale)` you want to ship.

## Why not Fastlane frameit?

- ComposablePreviewScanner already renders at any pixel size — producing a 1320 × 2868 PNG is trivial.
- Drawing the frame in Compose means the marketing background, bezel, and headline are version-controlled, IDE-previewable, and customizable per-app. Fastlane's `frameit` ships fixed templates and needs an external Ruby toolchain.
- One pipeline (Roborazzi + ComposablePreviewScanner) covers both regression snapshots and storefront screenshots — same mental model, same tooling.

## Excluded from regression tests

`@StoreScreenshot`-tagged previews are filtered out of the regular `:shared:verifyRoborazziAndroidHostTest` task — they render at huge pixel sizes and have different concerns. They only execute when you pass `-PgenerateStoreScreenshots=true` (which the script handles).
