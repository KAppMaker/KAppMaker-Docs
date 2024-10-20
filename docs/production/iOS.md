---
sidebar_position: 2
---

# iOS

## Easiest Way to Publish Using Xcode

The simplest method for publishing your ios app is directly through Xcode. Here are the steps:

1. **Open Your Project**: Launch Xcode and open your project.
2. **Select the Target**: Make sure you select the correct target for your app.
3. **Archive Your App**:
   - Go to **Product > Archive**. 
   - Wait for the archive process to complete, and the Organizer window will appear.
4. **Upload to App Store Connect**:
   - In the Organizer window, select the archive you just created.
   - Click on **Distribute App** and follow the prompts to upload your app to TestFlight or the App Store.

## App Store Publishing with GitHub Actions

If you prefer to automate the process with GitHub Actions, follow these steps:


### 1. Create Certificates

To sign your application, you will need two certificates: **Apple Development** for development and **Apple Distribution** for distribution. Follow these steps:

1. **Request a Certificate**:
   - Open the Keychain app on macOS.
   - Navigate to **Keychain Access > Certificate Assistant > Request a Certificate From a Certificate Authority**.
   - Fill out the form by entering your email address and selecting **Save to disk**.

2. **Create Certificates**:
   - Go to the Apple Developer Certificates page: [Apple Certificates](https://developer.apple.com/account/resources/certificates/list).
   - Create the two certificates by uploading above saved file:
     - **Apple Development** (development.cer)
     - **Apple Distribution** (distribution.cer)

3. **Generate the p12 File**:
   After downloading the certificates, use the Keychain app to export them to p12 format:

   - In Keychain Access, **File > Import**, and import both certificates.
   - After importing choose both certificates from My Certificates section, Right-click and choose **Export 2 Items**.
   - Select the **p12** format and provide a password to secure the file. (`Certificates.p12`).  


### 2. Create Provisioning Profiles

Provisioning profiles are necessary for running your app on physical devices and for submitting to the App Store. Follow these steps:

1. **Create Provisioning Profiles**:
   - Go to the Apple Developer Account page: [Apple Developer Account](https://developer.apple.com/account/resources/profiles/add).
   - Select **Profiles** from the sidebar and click the **+** button to create a new provisioning profile.
   - Choose the type of provisioning profile you need:
     - **iOS App Development**: For testing on devices (for emulator testing you will not need this).
     - **App Store Connect**: For App Store submission.
   - Follow the prompts to select the appropriate app ID, certificates, and devices (for development profiles).
   - Download the created provisioning profile to your macOS system.

2. **Install the Provisioning Profile**:
   - Double-click the downloaded provisioning profile file to install it in Xcode.
   - Verify that the provisioning profile is listed under **Xcode > Preferences > Accounts > Your Apple ID > Manage Certificates**.

3. **Update Your Xcode Project**:
   - Open your Xcode project.
   - Go to the **Signing & Capabilities** tab.
   - Ensure that the correct provisioning profile is selected for both Debug (development) and Release (distribution) configurations.


### 3. Set Up GitHub Secrets for App Store Publishing

To automate the publishing process using GitHub Actions, follow these steps:

1. **Generate API Key**:
   - Go to App Store Connect and log in.
   - Navigate to **Users and Access** and select **API Keys**.
   - Create a new API key with access to `App Manager`, and download the private key.
   
   **Note**: When you create the API key, you will also see the **Issuer ID** and **Key ID**. Make sure to save these, as you will need them when adding secrets to GitHub.

2. **Add Secrets to GitHub**:
   - Go to your GitHub repository, click on **Settings**, then **Secrets and Variables**, and select **Actions**.
   - Add the following secrets:
     - `IOS_APP_CERTIFICATE_P12_BASE64`: Run `base64 -i Certificates.p12 | pbcopy` to get the base64 encoded version of your p12 file.
     - `IOS_APP_CERTIFICATE_P12_PASSWORD`: Enter the password you used to secure the `Certificates.p12` file.
     - `APPSTORE_KEY_ID`: Your API Key ID from App Store Connect.
     - `APPSTORE_ISSUER_ID`: Your Issuer ID from App Store Connect.
     - `APPSTORE_PRIVATE_KEY`: The content of the downloaded private key file.
     - `APPSTORE_TEAM_ID`: Your App Store Connect team ID .
     - `IOS_APP_DEVELOPMENT_PROVISION_UUID`: The UUID of your development provisioning profile (Open the file in a text editor and search for *UUID*).  
     - `IOS_APP_DISTRIBUTION_PROVISION_UUID`: The UUID of your distribution provisioning profile (Open the file in a text editor and search for *UUID*).  






