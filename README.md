# Pokedex App – CI/CD Documentation (Expo + EAS + GitHub Actions)

## 1. Purpose

This project is used to test and validate a complete CI/CD pipeline using:

- GitHub Actions (automation runner)
- Expo Application Services (EAS)
- Expo dashboard (expo.dev)
- Apple Developer account
- Android keystore management (via EAS)

The pipeline supports:

- Continuous Integration (lint, typecheck, test)
- Continuous Delivery / Deployment (native builds and OTA updates)

---

# 2. Architecture Overview

## 2.1 Core Components

### GitHub Actions
Runs workflows that execute EAS CLI commands automatically.

### Expo Application Services (EAS)
Provides:

- Cloud builds (Android & iOS)
- OTA updates (EAS Update)
- Credential management (Apple certificates, provisioning profiles, Android keystore)
- Submissions to App Store / Play Store

### Expo Dashboard
https://expo.dev

Used to:

- View builds
- View updates
- Manage credentials
- Manage access tokens

### EXPO_TOKEN
Generated from:

https://expo.dev/accounts/<account>/settings/access-tokens

Used by GitHub Actions to authenticate to Expo.

GitHub → Expo (via EXPO_TOKEN)  
Expo/EAS → Apple/Google (via stored credentials)

GitHub does NOT directly authenticate to Apple or Google.

---

# 3. Initial Setup (One-Time Setup)

## 3.1 Install and Link Project to EAS

```bash
npm i -g eas-cli
eas login
eas init
```

Optional sanity check:
```bash
eas whoami
```

## 3.2 Configure Builds
```bash
eas build:configure
```
 This create eas.json and sets up build profiles

 # 4. Credential Setup
 
 ## 4.1 Android
 First interactive build example"
 ```bash
 eas build -p android --profile preview
 ```
 After credentials are configured, CI can run builds non-interactively

 ## 4.2 iOS
 
 Requirements
- Apple Developer Program memberships (paid)
- Correct team permissions

First interactive build:
```bash
eas build -p ios --profile preview
```
This sets up:
- Signing certificates
- Provisioning profiles
- Bundle identifier
- Capabilites

After setup, CI can use:
```bash
--non-interactive
```

Important:\
If certificates expire, provisioning profiles change, or entitlements are added, you may need another interactive session. 

# 5. app.json Configuration

Important fileds to verify:
- scheme
- ios.bundleIdentifier
- android.package
- owner
- extra.eas.projectId

Example:
```bash
{
  "expo": {
    "name": "pokedex-app",
    "slug": "pokedex-app",
    "platforms": ["ios", "android"],
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "pokedexhl",
    "ios": {
      "bundleIdentifier": "com.lamho.pokedexapp",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "package": "com.lamho.pokedexapp"
    },
    "extra": {
      "eas": {
        "projectId": "18b4d0e8-1f90-4425-b371-9e4d9c8811ab"
      }
    },
    "owner": "lamho"
  }
}
```

# 6. CI - Continuous Integration

Purpose:\
Validate code quality and correctness on pull requests and pushes <br>
<br>
File: .github/workflows/ci.yml
```bash
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - run: npm run lint --if-present
      - run: npm run typecheck --if-present
      - run: npm test --if-present
```

This workflow:
- Install dependencies
- Runs linting
- Runs type checking
- Run tests

# 7. CD - Continuous Delivery/Deploymnet
There are two types of deployment:
1. Native builds (EAS Build)
2. OTA updates (EAS Update)

# 8. Native Build Workflow (release.yml)
Used when:
- Adding native libraries
- Changing permissions
- SDK upgrades
- Changing entitlements
- Adding native AI/ML frameworks
- Any change requiring new iOS/Android binaries
<br>
File: .github/workflows/ci.yml

```bash
name: EAS Build (manual)

on:
  workflow_dispatch:
    inputs:
      platform:
        description: "android | ios | all"
        required: true
        default: "all"
        type: choice
        options:
          - all
          - android
          - ios
      profile:
        description: "development | preview | production"
        required: true
        default: "preview"
        type: choice
        options:
          - development
          - preview
          - production

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - uses: expo/expo-github-action@v8
        with:
          token: ${{ secrets.EXPO_TOKEN }}
          eas-version: latest

      - run: npm ci

      - name: Build
        env:
          PLATFORM: ${{ inputs.platform }}
          PROFILE: ${{ inputs.profile }}
        run: |
          set -e

          if [ "$PLATFORM" = "android" ]; then
            eas build -p android --profile "$PROFILE" --non-interactive
          elif [ "$PLATFORM" = "ios" ]; then
            eas build -p ios --profile "$PROFILE" --non-interactive
          else
            eas build -p android --profile "$PROFILE" --non-interactive
            eas build -p ios --profile "$PROFILE" --non-interactive
          fi
```

# 9. OTA Update Workflow (update.yml)
Used for JS-only changes:
- UI changes
- State logic
- Styling updates
- Bug fixes
- Asset changes
- Most Expo-managed JS changes
<br>
File: .github/workflows/update.yml

```bash
name: EAS Update (manual)

on:
  workflow_dispatch:
    inputs:
      platform:
        description: "android | ios | all"
        required: true
        default: "all"
        type: choice
        options:
          - all
          - android
          - ios
      message:
        description: "Update message"
        required: false
        default: ""
      branch:
        description: "EAS update branch"
        required: false
        default: "main"

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - uses: expo/expo-github-action@v8
        with:
          token: ${{ secrets.EXPO_TOKEN }}
          eas-version: latest

      - run: npm ci

      - name: EAS Update
        env:
          PLATFORM: ${{ inputs.platform }}
          MSG: ${{ inputs.message }}
          BRANCH: ${{ inputs.branch }}
        run: |
          set -e

          if [ "$PLATFORM" = "android" ]; then
            eas update --auto --platform android --branch "$BRANCH" --message "$MSG" --non-interactive
          elif [ "$PLATFORM" = "ios" ]; then
            eas update --auto --platform ios --branch "$BRANCH" --message "$MSG" --non-interactive
          else
            eas update --auto --platform android --branch "$BRANCH" --message "$MSG" --non-interactive
            eas update --auto --platform ios --branch "$BRANCH" --message "$MSG" --non-interactive
          fi
```

# 10. When to Use Build vs Update
Use EAS Build when:
- Adding native modules
- Changing iOS/Android permissions
- SDK upgrade
- Adding native AI/ML frameworks (CoreML, TensorFlow Lite)
- Changing entitlements
- Changing native configuration

Use EAS Update when:
- JS/TS changes only
- UI modifications
- Styling updates
- State logic fixes
- Asset updates
- Bug fixes not involving native code

If unsure: assume build

# 11. Manual Commands

Local build:
```bash
eas build -p ios --profile production
```

Submit to TestFlight:
```bash
eas submit -p ios --latest
```

Local interactive builds are easier because:
- Your machine is already authenticated (eas login)
- EAS can prompt for credentials interactively
- CI requires pre-configured tokens and stored credentials

This does not bypass security — it simply uses local authentication instead of CI token authentication.

