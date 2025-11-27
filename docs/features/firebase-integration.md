---
sidebar_position: 17
---

# Firebase Integration

KAppMaker has a support for **Firebase** as a serverless backend for AI integration and other features like **Authentication**, **Push Notifications**, and **Landing Page Hosting**. Follow these steps carefully to set up Firebase and connect it with your app.


## 1. Create New or Choose Existing a Firebase Project

1. Open the Firebase console: https://console.firebase.google.com/  
2. Click **Add Project** (or select an existing one).  
3. Give your project a **unique project ID** and a **project name**.  
4. Click **Continue** and follow the prompts.  

> ⚠️ Important: For backend functions, you will need **Blaze (pay-as-you-go) plan**. Firebase has generous free limits and it’s cheap for small projects. In order to enable **Firebase Blaze Plan** Go to **Project Overview → Usage and billing → Details&Settings →  Modify Plan → Blaze plan**. This is required for Firebase Functions (serverless backend) to work correctly.




## 2. Store your API Keys Securely

To securely store and access your API keys, [**Google Cloud Secret Manager**](https://console.cloud.google.com/security/secret-manager) is used. This is a secure and scalable way to manage sensitive information like API keys. Below are the steps to retrieve and store your keys securely.

### 2.1 Enable Secret Manager

In the Google Cloud Console, go to the [**Secret Manager**](https://console.cloud.google.com/security/secret-manager) page and enable the API. Make sure you chose correct project.


### 2.2 Get your API Keys

1. **OpenAI API Key**:
   - To use OpenAI’s API, you need an API key. You can obtain it by signing up for OpenAI at [OpenAI's API page](https://platform.openai.com/signup).
   - After signing in, go to the **API Keys** section under your account settings to create and retrieve your API key.

2. **Replicate API Key**:
   - To use Replicate's API, create an account on [Replicate](https://replicate.com/).
   - Once logged in, go to the **API** section of your account dashboard, where you can generate and retrieve your API key.

### 2.3 Store API Keys

Once you have your API keys, you can securely store them in [Google Cloud Secret Manager](https://console.cloud.google.com/security/secret-manager).

1. **Navigate to Secret Manager**: 
 - https://console.cloud.google.com/security/secret-manager?project=YOUR_PROJECT_ID. Replace `YOUR_PROJECT_ID` with your project id.
   
2. **Create Secrets**:
   - Click **Create Secret** and enter exact name for the secret (either `OPENAI_API_KEY` or `REPLICATE_API_KEY`).
   - Paste your API key in the **Secret Value** field and click **Create**.

3. **Grant Access**:
   - Ensure that the service account running your application has **access to the secret**. You can grant access by setting the appropriate permissions to allow your app to retrieve secrets.



## 2. Install Firebase CLI in your device

Open your terminal and install Firebase CLI globally in your device. Make sure you have **Node.js** installed. 

```bash
npm install -g firebase-tools
```

## 3. Login to Firebase in Your Project
Navigate to your Project's `Web` root folder and login to Firebase:

```bash
firebase login
```
Follow the browser prompts to authorize Firebase CLI access.

## 4. Configure Necessary Features

Before starting, you need to initialize Firebase in your project. Make sure you followed above steps and you are in your Project's **Web** directory.


### 4.1 Backend - Firebase Functions Setup

The AI backend functions are pre-configured to support integration with popular APIs like **[Replicate](https://replicate.com/)** and **[OpenAI](https://platform.openai.com/docs/api-reference/)** securely. By default, all available functions are enabled and are implemented in the `functions/index.js` file. You can easily disable or customize any function by modifying that file.

#### 1. Initialize Firebase Functions

Set up Firebase Functions:
```bash
firebase init functions
```
1. Choose your Firebase project or create a new one.
2. When prompted:
   - Select `JavaScript` as the language for functions.
   - Install dependencies when asked.
   - When asked, to override some files, select **NO**.


#### 2. Deployment
Deploy your backend functions to Firebase:

```bash
  firebase deploy --only functions
```

> After deploy is finished you will see your `CLOUD_FUNCTIONS_URL` in terminal. You will need this URL.  `CLOUD_FUNCTIONS_URL` should be something like: `https://REGION-PROJECT_ID.cloudfunctions.net`. By default `REGION` value is `us-central1`. Make sure, in your mobile app `CLOUD_FUNCTIONS_URL` inside `util/Constants.kt` file is same as what you see.

#### 3. Test Locally
You can test your app backend locally before deploying it:
```bash
firebase emulators:start --only functions
```

#### 4. Available AI Functions

1. **Replicate API Functions**:
   These functions handle interactions with the Replicate API.
   - `replicateCreatePrediction`
   - `replicateCreateModelPrediction`
   - `replicateGetPredictionStatus`
   - `replicateCancelPrediction`

   You can find these functions in the `api/replicate.js` file. Replicate API documentation for request and response: https://replicate.com/docs/topics/predictions 

2. **OpenAI API Functions**:
   These functions interact with the OpenAI API for generating text and images.
   - `openAiCreateTextCompletion`
   - `openAiCreateImage`

   These are located in the `api/openai.js` file. OpenAI API documentation for request and response: https://platform.openai.com/docs/api-reference/chat


#### 5. Disabling Functions

If you don't need any of the API endpoints, simply **comment out the respective line** in the `functions/index.js` file:

```javascript
// Replicate API Function exports
exports.replicateCreatePrediction = replicateFunctions.createPrediction;
exports.replicateCreateModelPrediction = replicateFunctions.createModelPrediction;
exports.replicateGetPredictionStatus = replicateFunctions.getPredictionStatus;
exports.replicateCancelPrediction = replicateFunctions.cancelPrediction;

// OpenAI API Function exports
exports.openAiCreateTextCompletion = openAiFunctions.createTextCompletion;
exports.openAiCreateImage = openAiFunctions.createImage;
```

#### 6. API Response Structure

All API responses are returned in JSON format. The structure follows this format:

```json
{
  "statusCode": <statusCode>,
  "errorMessage": <errorMessage>,
  "data": <data>
}
```

- `statusCode`: Represents the HTTP status code of the response.
- `errorMessage`: If an error occurs, this field contains the error message. If there’s no error, this field will be empty or `null`.
- `data`: This field contains the actual response data returned by the AI API, such as predictions, results, or generated content based on each AI api's response object.

#### 7. Validation

By default, all API requests require **user authentication** via Firebase, primarily to secure access to the AI APIs due to their potential cost. Before making any API request, the user must be authenticated. If you want to allow unauthenticated access to any endpoint (e.g., for testing or development purposes), you can disable authentication by setting `requireAuth: false` in the validation function:

```javascript
createPrediction: onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (!await Validation.validateAll(req, res, { requireAuth: false })) return; <--- IN THIS LINE WE SET AUTH REQUIREMENT FALSE
        await makeApiRequest(`${REPLICATE_API_BASE_URL}/predictions`, "post", getReplicateApiKey(), req.body, res);
    });
}),
```

### 4.2 Authentication - Firebase Authentication Setup
1. Go to **Authentication** → **Sign-in methods** in Firebase Console.
2. Enable **Anonymous Auth** for easy access.
3. Optionally, enable **Google** and **Apple Sign-In** if your app requires them.
4. Make sure your app correctly handles authenticated users when calling Firebase Functions.

For more detailed information you can check  **[Auth](auth)** section.

### 4.3 Notifications - Firebase Push Notifications Setup
1. Go to **Messaging** in Firebase Console.
2. Test push notifications locally or on a real device before production.

For more detailed information you can check  **[Notifications](notifications)** section.

### 4.4 App Landing Page - Firebase Hosting Setup

This is a simple app landing page template that you can use to showcase your app and deploy it into Firebase easily and free.  You can see the demo of the landing page of [AppIdeaHub](https://appideahub-kappmaker.web.app/). It has sections for a Hero, Problem, Features, and a Call-to-Action (CTA). It includes template Privacy Policy and Terms and Service files as well (but you should write your own according to your app, as this is just a template and not a legal document).

You can also watch the video for App Landing Page setup: [https://www.youtube.com/watch?v=umuaJG4AO_Q](https://www.youtube.com/watch?v=umuaJG4AO_Q).

#### 1. Initialize Firebase Hosting

Set up Firebase Hosting:
```bash
firebase init hosting
```
1. Choose your Firebase project or create a new one.
2. When prompted:
   - **What do you want to use as your public directory?** Press **Enter** (default: `public`).
   - **Configure as a single-page app?** Press **N** (No).
   - **Set up automatic builds and deploys with GitHub?** Press **N** (No).
   - **File public/index.html already exists. Overwrite?** Press **N** (No).


#### 2. Customize

Update `public/images/hero.png`, `public/images/logo.png`, `public/images/favicon.ico` with your own app images.  
Edit the `public/config.js` file to customize the app's details. Check out **[App Landing Page](app-landing-page)** section for more details.


#### 3. Deployment
Deploy your landing page to Firebase:
  ```bash
  firebase deploy --only hosting
  ```


#### 4. Test Locally
You can test your landing page locally before deploying it:
```bash
firebase serve
```


