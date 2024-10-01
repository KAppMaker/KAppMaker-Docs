---
sidebar_position: 6
---

# GitHub CI/CD Actions

KAppMaker uses GitHub Actions to automatically build and release the Android and iOS apps. Here are the main workflows:

### 1. Build Workflow

**Name:** Building Debug Application  (`build.yml`)   
**When It Runs:** When you push changes to the `main` branch or create a pull request.  
**What It Does:** Builds the debug version of both android and ios app to check if the latest changes work correctly.

### 2. Publish Android App Workflow

**Name:** Publish Android App  (`publish_android_playstore.yml`)  
**When It Runs:** When you push a new tag that ends with `-android`.  
**What It Does:** Releases the Android app to the Google Play Store Internal Track so testers can download the latest version. You can change internal track to alpha, beta or production as well.

### 3. Publish iOS App Workflow

**Name:** Publish iOS App (`publish_ios_appstore.yml`)   
**When It Runs:** When you push a new tag that ends with `-ios`.  
**What It Does:** Releases the iOS app to the Apple App Store for iOS users to download.

These workflows make it easier to build and release the apps, ensuring that every change is tested and made available automatically.
