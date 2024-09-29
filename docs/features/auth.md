---
sidebar_position: 2
---

# Authentication

KAppMaker provides an easy setup for authentication using Firebase Authentication and the [KMPAuth](https://github.com/mirzemehdi/KMPAuth) library. KAppMaker already supports multiple authentication providers, including Google and Apple, as well as functionality for getting the current user, logging out, and deleting a user. This section guides you through the necessary steps to configure user authentication in your application.


### Setting Up Firebase Authentication

1. **Create a Firebase Project**:
   - Navigate to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project or select an existing one.

2. **Enable Authentication Providers**:
   - In the Firebase console, go to the **Authentication** section.
   - Click on the **Sign-in method** tab.
   - Enable the desired authentication providers (e.g., Google, Apple) by enabling them on and providing any required configuration, such as OAuth credentials.

3. **Add Configuration Files**:
    After enabling desired sign-in methods, download firebase configuration file again.  
   - For Android, download the `google-services.json` file and place it in the `composeApp` folder of your project.
   - For iOS, download the `GoogleService-Info.plist` file and add it to the `iosApp/iosApp` folder.


### Implementing Authentication

1. **Google Sign In**:

For Google sign-in, you need to set `GOOGLE_WEB_CLIENT_ID` in `local.properties` file to the **Web Client ID** from your Firebase project.

#### Updating `Info.plist` for iOS

In your iOS project, update the following fields in the `Info.plist` file (located in `iosApp/iosApp`) with values from Firebase:

- Replace `YOUR_WEB_CLIENT_ID` with the **Web Client ID** (same as `GOOGLE_WEB_CLIENT_ID` value).
- Replace `YOUR_IOS_CLIENT_ID` with the **iOS CLIENT_ID**.
- Replace `YOUR_DOT_REVERSED_IOS_CLIENT_ID` with the **ios REVERSED_CLIENT_ID**.

You can find `CLIENT_ID` and `REVERSED_CLIENT_ID` values from `GoogleService-Info.plist` file.


```xml
<key>GIDServerClientID</key>
<string>YOUR_WEB_CLIENT_ID</string>

<key>GIDClientID</key>
<string>YOUR_IOS_CLIENT_ID</string>

<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>YOUR_DOT_REVERSED_IOS_CLIENT_ID</string>
    </array>
  </dict>
</array>
```


2. **Apple Sign In**:  

For Apple Sign-In, follow these steps:

    - In Xcode, go to your project settings.
    - Select your target, then navigate to the **Signing & Capabilities** tab.
    - Click the "+" button and add the **Sign In with Apple** capability.

### User Management

The `ProfileScreen` and `SignInScreen` already handles the current user, logging out, and deleting the user for you. If you need, the core functionality is managed by `UserRepository`. You can manage the current user, log out, and delete the user using `UserRepository`:

#### Sign Out

To sign out a user, call the `logOut()` method. This logs the user out of the app and any linked services.

#### Current User

You can get information about the current user, such as their ID, email, and subscription status, using the `currentUser` field.

#### Delete Account

To delete a user's account, call the `deleteAccount()` method.





