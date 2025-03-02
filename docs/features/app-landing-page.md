---
sidebar_position: 12
---

# App Landing Page Template

This is a simple app landing page template that you can use to showcase your app and deploy it into Firebase easily and free.  You can see the demo of the landing page of [AppIdeaHub](https://appideahub-kappmaker.web.app/). It has sections for a Hero, Problem, Features, and a Call-to-Action (CTA). It includes template Privacy Policy and Terms and Service files as well (but you should write your own according to your app, as this is just a template and not a legal document).

You can also watch the video for App Landing Page setup: [https://www.youtube.com/watch?v=umuaJG4AO_Q](https://www.youtube.com/watch?v=umuaJG4AO_Q)

## Requirements

Before starting, you need to initialize Firebase in your project. First download KAppMaker-Web repo, and navigate into root folder. **`public/`**: Contains the app landing page template.

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


## App Landing Page Setup

### 1. Initialize Firebase Hosting

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
  

### 2. Test Locally
You can test your app locally before deploying it:
```bash
firebase serve
```

### 3. Deployment
  ```bash
  firebase deploy --only hosting
  ```
---


## Configuration

Update `public/images/hero.png`, `public/images/logo.png`, `public/images/favicon.ico` with your own app images.  

Edit the `public/config.js` file to customize the app's details:

```javascript
const CONFIG = {
    APP_NAME: "YOUR_APP_NAME",
    DEVELOPER_OR_COMPANY_NAME: "YOUR_NAME_OR_COMPANY_NAME",
    WEBSITE_TITLE: "App Landing Page", // Used for SEO title
    WEBSITE_DESCRIPTION: "Meta description (120-160 characters)", // Used for SEO description
    CONTACT_EMAIL: "test@example.com",
    PRIVACY_POLICY_LAST_UPDATE_DATE: "2024-12-01",
    TERMS_AND_SERVICE_LAST_UPDATE_DATE: "2024-12-01",
    PLAYSTORE_URL: "https://play.google.com/",
    APPSTORE_URL: "https://apps.apple.com/",
};

const TEXT_CONTENT = {
    // Hero Section
    HERO_TITLE: "[Insert Hero Title Here]",
    HERO_SUBTITLE: "[Insert Hero Subtitle Here. Example: Discover innovative app ideas for your next big project!]",

    // Problem Section
    PROBLEM_SECTION_TITLE: "[Insert Problem Section Title Here]",
    PROBLEM_SECTION_TEXT: "[Insert Problem Description Here. Example: Struggling to come up with unique app ideas? You're not alone.]",
    PROBLEM_CARD_TITLE1: "[Insert Problem Card Title 1 Here. Example: Lack of Inspiration]",
    PROBLEM_CARD_TEXT1: "[Insert Problem Card Text 1 Here. Example: It can be challenging to think of app ideas that stand out from the crowd.]",
    PROBLEM_CARD_TITLE2: "[Insert Problem Card Title 2 Here. Example: Unclear Development Costs]",
    PROBLEM_CARD_TEXT2: "[Insert Problem Card Text 2 Here. Example: Not knowing the development costs can prevent you from moving forward with your idea.]",
    PROBLEM_CARD_TITLE3: "[Insert Problem Card Title 3 Here. Example: Uncertain Earning Potential]",
    PROBLEM_CARD_TEXT3: "[Insert Problem Card Text 3 Here. Example: Without understanding the earning potential, it’s hard to know if an app is worth pursuing.]",

    // Feature Section
    FEATURE_SECTION_TITLE: "[Insert Feature Section Title Here]",
    FEATURE_CARD_TITLE1: "[Insert Feature Card Title 1 Here. Example: Discover New Ideas]",
    FEATURE_CARD_TEXT1: "[Insert Feature Card Text 1 Here. Example: Find unique app ideas across various categories to help you start your project.]",
    FEATURE_CARD_TITLE2: "[Insert Feature Card Title 2 Here. Example: Estimate Development Costs]",
    FEATURE_CARD_TEXT2: "[Insert Feature Card Text 2 Here. Example: Get a ballpark estimate for development costs to plan your budget.]",
    FEATURE_CARD_TITLE3: "[Insert Feature Card Title 3 Here. Example: Evaluate Earning Potential]",
    FEATURE_CARD_TEXT3: "[Insert Feature Card Text 3 Here. Example: See estimated earnings for each idea to help you decide if it’s worth pursuing.]",

    // CTA Section
    CTA_SECTION_TITLE: "[Insert CTA Section Title Here. Example: Start Your Journey Today!]",
    CTA_SECTION_TEXT: "[Insert CTA Section Text Here. Example: Explore app ideas, save your favorites, and begin building your next big app today.]"
};
```

---

### Color Customization

Edit the `:root` CSS variables in `public/styles.css` to customize the colors for your landing page:

```css
:root {
    /* Main Colors */
    --primary: #4A148C; 
    --onPrimary: #FFFFFF; 
    
    /* Complementary Secondary Color */
    --secondary: #2C6B85; 
    --onSecondary: #FFFFFF; 
    
    /* Hero Section */
    --heroBg: #212121; 
    --onHeroBg: #FFFFFF; 
    
    /* Background and Text Colors */
    --background: #F5F5F5; 
    --onBackground: #333333; 
    
    /* Footer */
    --footerBg: #121212; 
    --onFooterBg: #FFFFFF; 
}
```


### AI Prompt for Better Config File

If you're unsure about how to fill out the configuration file or want to improve the content based on your app's description, you can use this prompt to get a better config file:

**Prompt for AI:**

```
"Please generate a configuration file for my app landing page. My app is about ....". 
```

And paste `public/config.js` file at the end of file.

Using this prompt in an AI tool can help you generate a more tailored and effective configuration for your app's landing page.

---

