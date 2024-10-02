---
sidebar_position: 6
---

# GitHub CI/CD Actions

KAppMaker uses GitHub Actions to automatically build and release the Android and iOS apps. Here are the main workflows (make sure to add necessary [Github Repository Secrets](#github-secrets)):

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

## GitHub Secrets
KAppMaker uses several secrets to securely manage builds, authentication, caching, and publishing. Below are the important secrets you need to add to your GitHub repository:

### How to Add Secrets in GitHub

1. Go to your repository on GitHub.
2. Click on the **Settings** tab.
3. In the left sidebar, click on **Secrets and variables** > **Actions**.
4. Click the **New repository secret** button.
5. Enter the **Name** and **Value** of the secret (details provided below).
6. Click **Add secret**.


### Required Secrets

#### Caching
- **Name**: `GRADLE_CACHE_ENCRYPTION_KEY`
- **Value**: Run the following command to generate and copy value for this key:
```bash
openssl rand -base64 16 | pbcopy
```

For more information on configuring the encryption key, refer to the [Gradle documentation](https://docs.gradle.org/8.6/userguide/configuration_cache.html#config_cache:secrets:configuring_encryption_key)

#### Android Keystore
The keystore and properties files are required to sign the Android app when you need to make release version of the app. For keystore creation, make sure to check [Android Keystore section](../../production/android).

- **Name**: `SIGNING_KEY_STORE_FILE_BASE64`
- **Value**: Run the following command to generate and copy value for this key:
```bash
base64 -i distribution/android/keystore/keystore.jks | pbcopy
```

- **Name**: `SIGNING_KEY_STORE_PROPERTIES_BASE64`
- **Value**: Run the following command to generate and copy value for this key:
```bash
base64 -i distribution/android/keystore/keystore.properties | pbcopy
```

#### Play Store Publishing
To upload the Android app to the Play Store, use a Google Play service account. For details on how to get this file, refer to the [upload-google-play action documentation](https://github.com/r0adkll/upload-google-play?tab=readme-ov-file#configure-access-via-service-account).  

- **Name**: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
- **Value**: Service account JSON file content for Play Store access. 

#### Authentication
- **Name**: `GOOGLE_WEB_CLIENT_ID`
- **Value**: Google web client ID for authentication. See [Authentication](../features/auth)

#### In-App Purchase/Subcription - RevenueCat Keys 

See [In-App Purchases](../features/inapp-purchases-subscription)
- **Name**: `REVENUECAT_ANDROID_API_KEY`
- **Value**: API key for RevenueCat Android integration.

- **Name**: `REVENUECAT_IOS_API_KEY`
- **Value**: API key for RevenueCat iOS integration.  



When you add all the required GitHub secrets, your settings should look something like this:
![GitHub Secrets Example](/img/github-secrets.png)

