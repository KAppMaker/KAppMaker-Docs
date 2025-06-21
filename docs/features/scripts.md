---
sidebar_position: 16
---

# Scripts

Some scripts that is available in the project.

## Increase version code

Running `./scripts/update_version.sh -v "1.0.5"` will increase both android and ios app version code, and set `versionName` to `1.0.5`. 
Make sure you give executable permission to `./scripts/update_version.sh`. 
(Running this code in terminal should give permission: `chmod +x scripts/update_version.sh` )

___

```bash

: '
Script to automatically increment Android and iOS versionCode and optionally update versionName.
Usage:
  ./update_versions.sh [-v version_name]

Options:
  -v version_name   Set a new version name (e.g., "1.2.3").
                   If not provided, the current version name is kept.
What it does:
- Reads the current Android versionCode and versionName from build.gradle.kts.
- Increments Android versionCode by 1.
- Updates Android build file with new versionCode and versionName.
- Reads and updates iOS project version (CURRENT_PROJECT_VERSION) and marketing version (MARKETING_VERSION).
- Updates iOS Info.plist CFBundleVersion and CFBundleShortVersionString.
'
```