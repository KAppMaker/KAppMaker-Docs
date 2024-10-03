---
sidebar_position: 1
---

# Push Notification

KAppMaker supports push notifications through Firebase Cloud Messaging (FCM) for both Android and iOS platforms. It uses [KMPNotifier](https://github.com/mirzemehdi/KMPNotifier) library. This section guides you through the process of setting up push notifications in your app.

## Step 1: Create a Firebase Project

1. **Go to the Firebase Console**: Visit the [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
2. **Create a New Project**:
   - Click on “Add project.”
   - Enter a name for your project and follow the prompts to complete the setup.
3. **Add Android and iOS Apps**:
   - Click on the “Add app” button and choose the Android icon to add your Android app.
   - Enter your Android package name (e.g., `com.yourcompany.yourapp`) and complete the setup. Download the `google-services.json` file when prompted.
   - Repeat the process for your iOS app, providing the iOS bundle ID and downloading the `GoogleService-Info.plist` file.

## Step 2: Add Firebase Configuration Files

1. **For Android**:
   - Place the `google-services.json` file you downloaded in the `composeApp` directory of your project.
  
2. **For iOS**:
   - Place the `GoogleService-Info.plist` file in the `iosApp/iosApp` folder of your project.

## Step 3: Configure Firebase Cloud Messaging

1. **Firebase Console**:
   - In the Firebase Console, navigate to your project and select “Cloud Messaging.”
   - Ensure that your project is configured to use FCM.

2. **Test Notifications**:
   - First, ensure that your app can receive notifications. You will need the device's Firebase token for testing.

### Getting the Firebase Token

To get the Firebase token for testing, follow these steps:

1. Open your `AppInitializer` file (located at `composeApp/{packageName}/commonMain/root/`) and  
add the following code snippet in `initializeNotification` method to retrieve the token.

```kotlin
   //GlobalScope is added just for testing. After testing remove this
   GlobalScope.launch {
       val token = NotifierManager.getPushNotifier().getToken()
       AppLogger.d("FirebaseToken: $token")
   }
```

3. Run your app and check the logs for the `FirebaseToken`. Use this token to send test notifications.

## Step 4: Sending Test Notifications

1. **Send a Test Message**:
   - In the Firebase Console, go to the “Cloud Messaging” section.
   - Click on “Send a message” and follow the prompts to send a test notification to your Android device using the token you retrieved.

2. **Verify Notifications on iOS**:
   - Before sending notifications to your iOS app, ensure that you have set up APNs (Apple Push Notifications) correctly.

### Setting Up APNs for iOS

1. **Add Capabilities in Xcode**:
   - Open your iOS project in Xcode and select your project target.
   - Go to the "Signing & Capabilities" tab.
   - Add the following capabilities:
     - Push Notifications
     - Background Modes (check the Remote Notifications option)

2. **Upload APNs Key**:
   - To use APNs with Firebase, you'll need an APNs Authentication Key. Here's how to obtain it:
     - Log in to the [Apple Developer Account](https://developer.apple.com/account/).
     - Go to the "Certificates, Identifiers & Profiles" section.
     - Under "Keys," click the "+" button to create a new key.
     - Provide a name for your key and select the "Apple Push Notifications service (APNs)" option.
     - Click "Continue," then "Register" to generate the key.
     - Download the key (it will have a `.p8` extension) and keep it secure. You will use this key in the Firebase Console.
     - In the Firebase Console, go to your project settings.
     - Under the “Cloud Messaging” tab, upload your APNs key that you generated from the Apple Developer portal.

3. **Ensure Team ID is Set in Signing & Capabilities**

   - In Xcode, open your project and select your target.
   - Go to the **Signing & Capabilities** tab.
   - Under the "Team" section, make sure the correct **Team ID** is selected. This ensures your app is properly signed and linked to your Apple Developer account.
   - The Team ID can be found in your [Apple Developer Account](https://developer.apple.com/account/).
   - Ensure this matches the Team ID associated with the APNs key you generated earlier and uploaded to Firebase.


## Conclusion

Congratulations! You have successfully set up notifications for your KAppMaker app. You can now send push notifications to your users, enhancing their experience and keeping them engaged with your app.

For advanced usage and customization, you can explore the [KMPNotifier](https://github.com/mirzemehdi/KMPNotifier#usage) library, which provides additional functionality for handling notifications in your Kotlin Multiplatform project.



