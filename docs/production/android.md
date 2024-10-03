---
sidebar_position: 1
---

# Android

## Android Keystore
To publish your Android app, you need to sign it by creating a keystore file. Follow these steps to generate a keystore:

### 1. Generating the Keystore using Android Studio

You can generate the keystore file directly from Android Studio by following these steps:

1. **Open Your Project in Android Studio**:
   Make sure you have your Android project open.

2. **Open the 'Generate Signed Bundle or APK' Dialog**:
   - Go to the top menu and click on `Build` > `Generate Signed Bundle / APK...`.
   - Choose `APK` or `Android App Bundle` based on your preference and click `Next`.

3. **Create a New Keystore**:
   - In the 'Key store path' section, click `Create new...`.
   - In the file dialog, navigate to the `distribution/android/keystore` folder, and create a new keystore file by naming it `keystore.jks`.

4. **Fill in the Keystore Information**:
   - **Key store password**: Choose and enter a password for your keystore.
   - **Key alias**: Create a new alias for the key (e.g., `aliasKey`).
   - **Key password**: Enter a password for the key(**Note:** For some reason this password should be same as key store password).
   - **Validity (years)**: Set how long the key will be valid (e.g., 10000).
   - **Certificate information**: Fill in the required certificate information (such as your name, organization, country, etc.).

5. **Finish Creating the Keystore**:
   After filling in all the details, click `OK` to generate the keystore file and return to the previous dialog.

6. **Complete the APK/Bundle Signing Process**:
   - Once your keystore is selected and filled in, click `Next` to complete the process.
   - Android Studio will use the keystore to sign your APK or App Bundle.
   - Now you have successfully generated a signed version of the app, which can be directly published to the Play Store. For automated publishing, you can proceed to the next step to set up the process. However, for the first release, you need to manually upload this signed App Bundle or APK to Google Play by navigating to the Play Console and selecting the signed bundle/apk.


### 2. Storing the Keystore

After generating your keystore, save it in the `distribution/android/keystore` folder as `keystore.jks`.
Next, create a `keystore.properties` file in the same folder or copy the `keystore.example.properties` file and rename it to `keystore.properties`. Then, update the following values:  

```properties
keystorePassword=yourKeystorePassword
keyPassword=yourKeyPassword
keyAlias=yourAliasKey
storeFile=../distribution/android/keystore/keystore.jks
```  


## Automating Play Store Publishing
To automate the publishing of your Android app to the Google Play Store, you can use GitHub Actions. The workflow, defined in a file named `publish_android_playstore.yml`, will handle the release of your app to the Google Play Store's Internal Track, allowing testers to easily access the latest version. You can also change the track to alpha, beta, or production as needed. This automation helps manage your deployment process by ensuring that every new version of your app is released automatically whenever you push a new tag that ends with `-android`.

**Note:** For the first time, you need to publish your app manually using Google Play Console.  

Make sure you have set up all the necessary GitHub secrets in your repository settings. These include:  

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

- **Name**: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
- **Value**: Service account JSON file content for Play Store access. 

For details on how to get `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` file, refer to the [upload-google-play action documentation](https://github.com/r0adkll/upload-google-play?tab=readme-ov-file#configure-access-via-service-account).  


