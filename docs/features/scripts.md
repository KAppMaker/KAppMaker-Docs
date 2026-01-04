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

## Create Local Data Layer

The `make_local.sh` script generates a complete local data layer for a given model, including Entity, DAO, Mapper, LocalDataSource, Room implementation, In-Memory implementation, and DI bindings.

### Usage

`./scripts/make_local.sh ExampleModel`

Run the script with the model name as a parameter. The script will create/update:

- Domain model file
- Local data layer files under `data/source/local`
- Room database updates
- DI bindings
- In-Memory implementation for web

### Notes

- Re-running the script for the same model skips existing domain files to prevent overwriting.  
- Automatically creates required folders and imports.  
- Useful for quickly syncing local data layer changes across multiple apps or modules.  
- Ensure the base package path matches your project structure.