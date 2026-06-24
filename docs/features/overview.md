---
sidebar_position: 0
title: Features Overview
---

# Features Overview

KMPStarterKit ships with a lot of features already wired up. Before building
something yourself, scan this page — chances are it is already provided.

The features are grouped into four areas:

- **Core app features** — user-facing building blocks shared across apps.
- **Exposed APIs** — Kotlin APIs you call from your own code.
- **Infrastructure** — the build, test, and tooling backbone you configure once.
- **Standalone** — self-contained extras you can keep, replace, or drop.

## Core App Features

User-facing building blocks most apps need.

| Feature | What it gives you |
|---|---|
| [Authentication](./auth.md) | Google and Apple sign-in. |
| [UI Components](./ui-components.md) | A reusable design-system component library. |
| [Screen Generator](./screen-generator.md) | Scaffold a new screen (Screen + UiState + UiStateHolder) wired into navigation and DI. |
| [Runtime Permissions](./permissions.md) | Permission requests via a single `AppPermissionState` API. |
| [In-App Review / Rating](./inapp-review.md) | Prompt users for a store rating in-app. |

## Exposed APIs

Kotlin APIs you call directly from your own features.

| Feature | What it gives you |
|---|---|
| [Push Notification](./notifications.md) | Local and push notifications across platforms. |
| [In-App Purchases & Subscriptions](./inapp-purchases-subscription.md) | Subscriptions and one-off purchases behind a provider-agnostic API (Adapty or RevenueCat). |
| [Flexible Local Credit System](./credits-system.md) | Local credit balance, transactions, and configuration. |
| [Local Storage](./local-storage.md) | On-device database with Room 3 (`@Database` / `@Dao` in `commonMain`). |
| [User Preferences](./user-preferences.md) | Type-safe key/value storage via DataStore (`UserPreferences`). |
| [Network](./network.md) | HTTP via a pre-configured Ktor client. |
| [Google AdMob Ads](./admob-ads.md) | Banner, interstitial, and rewarded ads. |
| [Feature Flag / Remote Config](./feature-flag.md) | Toggle features locally or remotely via Firebase Remote Config. |

## Infrastructure

CI/CD, testing, logging, AI backend setup, store assets, and helper scripts.

| Feature | What it gives you |
|---|---|
| [Firebase Integration](./firebase-integration.md) | Analytics, Crashlytics, Messaging, and Remote Config wiring. |
| [AI Integration](./ai-integration.md) | Replicate / OpenAI calls proxied through Firebase Cloud Functions to keep keys secret. |
| [Logging](./logging.md) | Multiplatform logging via `AppLogger` (backed by Napier). |
| [Testing & Quality Gates](./testing.md) | Unit, UI, and screenshot test setup plus the lint/format gates CI runs. |
| [GitHub CI/CD Actions](./github-ci-cd.md) | Ready-made workflows for PR checks and store publishing. |
| [Scripts](./scripts.md) | Helper scripts for screens, models, package refactor, versioning, and releases. |
| [Store Screenshots](./store-screenshots.md) | Generate App Store / Play Store screenshots at storefront pixel sizes. |

## Standalone

Self-contained extras you can keep, replace, or remove.

| Feature | What it gives you |
|---|---|
| [Splash Screen](./splash-screen.md) | Native launch screens for each platform. |
| [App Landing Page Template](./app-landing-page.md) | A marketing landing page deployable to Firebase Hosting. |
