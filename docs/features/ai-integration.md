---
sidebar_position: 12
---

# AI Integration

Serverless backend built with Firebase Cloud Functions, for AI integrations like ChatGPT and Replicate AI. The AI Module in KAppMaker is ready to use with minimal setup. Add your OpenAI or Replicate AI API keys to Google Secret Manager, deploy Firebase Cloud Functions, and set your `CLOUD_FUNCTIONS_URL` in `util/Constants` file. Firebase Cloud Functions are free to start with generous free limits, but be sure to set a budget limit to avoid unexpected charges. 

## Requirements

Before starting, you need to initialize Firebase in your project. First download KAppMaker-Web repo, and navigate into root folder. **`functions/`**: 


  ### 1. Install Firebase CLI

If not already installed:
```bash
npm install -g firebase-tools
```  

  ### 2. Login to Firebase
```bash
firebase login
```
---

## AI Backend functions setup

### 1. Initialize Firebase Functions

Set up Firebase Functions:
```bash
firebase init functions
```
1. Choose your Firebase project or create a new one.
2. When prompted:
   - Select `JavaScript` as the language for functions.
   - Install dependencies when asked.

### 2. Test Locally
You can test your app locally before deploying it:
```bash
firebase emulators:start --only functions
```
### 3. Deployment

```bash
  firebase deploy --only functions
  ```

After Deploy it you can see your `CLOUD_FUNCTIONS_URL` in terminal. Add that url into `util/Constants.kt` file.
```kotlin
 /**
     * CLOUD_FUNCTIONS_URL should be something like: "https://REGION-PROJECT_ID.cloudfunctions.net"
     * Regions:
     * US(Default): us-central1
     * EU: europe-west1
     */
    const val CLOUD_FUNCTIONS_URL="" 

 ```   
---

## Configuration


The AI backend functions are pre-configured to support integration with popular APIs like **[Replicate](https://replicate.com/)** and **[OpenAI](https://platform.openai.com/docs/api-reference/)**. By default, all available functions are enabled and are implemented in the `functions/index.js` file. You can easily disable or customize any function by modifying this file.

### Available AI Functions

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

### API Key Management

To securely store and access your API keys, you can use **Google Cloud Secret Manager**. This is a secure and scalable way to manage sensitive information like API keys. Below are the steps to retrieve and store your keys securely.

#### Steps to Obtain API Keys

1. **OpenAI API Key**:
   - To use OpenAI’s API, you need an API key. You can obtain it by signing up for OpenAI at [OpenAI's API page](https://platform.openai.com/signup).
   - After signing in, go to the **API Keys** section under your account settings to create and retrieve your API key.

2. **Replicate API Key**:
   - To use Replicate's API, create an account on [Replicate](https://replicate.com/).
   - Once logged in, go to the **API** section of your account dashboard, where you can generate and retrieve your API key.

#### Saving API Keys with Google Cloud Secret Manager

Once you have your API keys, you can securely store them in Google Cloud Secret Manager.

1. **Enable Secret Manager**:
   - In the Google Cloud Console, go to the **Secret Manager** page and enable the API.
   
2. **Create Secrets**:
   - Click **Create Secret** and enter the name for the secret (e.g., `OPENAI_API_KEY` or `REPLICATE_API_KEY`).
   - Paste your API key in the **Secret Value** field and click **Create**.

3. **Grant Access**:
   - Ensure that the service account running your application has **access to the secret**. You can grant access by setting the appropriate permissions to allow your app to retrieve secrets.


### Disabling Functions

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

### API Response Structure

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

### Validation

By default, all API requests require **user authentication** via Firebase, primarily to secure access to the AI APIs due to their potential cost. Before making any API request, the user must be authenticated. If you want to allow unauthenticated access to any endpoint (e.g., for testing or development purposes), you can disable authentication by setting `requireAuth: false` in the validation function:

```javascript
createPrediction: onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (!await Validation.validateAll(req, res, { requireAuth: false })) return; <--- IN THIS LINE WE SET AUTH REQUIREMENT FALSE
        await makeApiRequest(`${REPLICATE_API_BASE_URL}/predictions`, "post", getReplicateApiKey(), req.body, res);
    });
}),
```

