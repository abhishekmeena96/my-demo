---
name: alfresco-dms-project-understanding
description: Complete project documentation and workflow for building a Share-like DMS with ADF
metadata:
  type: reference
---

# Alfresco Custom DMS Project

## Project Vision
Build a fully-featured Document Management System (DMS) inspired by Alfresco Share, but using ACA (Alfresco Content App) codebase with modern Angular UI.

**Key Decision**: Use ACA's modern UI (not Share's legacy UI) + Add all Share-level features from backend.

---

## Architecture Overview

### Monorepo Setup
- **Tool**: NX v22.7.5 / v19.8.14 (two versions used during development)
- **Angular**: v19.2.20 (matched with ACA 7.4.x)
- **ADF**: v8.6.0 (latest, compatible with Angular 19)
- **Node.js**: v24.x
- **Preset**: `angular-monorepo`

### Workspace Structure
```
my-dms/
├── apps/
│   └── my-dms/          ← Main application
│       └── src/
│           ├── app/
│           │   └── app.config.json  ← ADF runtime config
│           └── index.html
├── libs/                 ← Shared libraries (to be created)
├── projects/            ← (In ACA) Contains feature libs
├── package.json         ← Merged ACA + NX dependencies
├── nx.json              ← NX configuration
└── tsconfig.base.json   ← TS path mappings
```

---

## Core Concepts Mastered

### 1. Environment Files vs Runtime Config

| File | Purpose | When Loaded | Rebuild Needed? |
|---|---|---|---|
| `environment.ts` | Dev vs Prod values | Build time | ✅ Yes |
| `app.config.json` | ADF runtime config | After app starts | ❌ No |

**Simple rule**: 
- `environment.ts` = Build time config (Angular's standard)
- `app.config.json` = ADF runtime config (backend URL, auth, UI settings)

### 2. How `app.config.json` Works

**The Bridge Pattern**:
```
app.config.json (file)
        ↓
AppConfigService (reads & stores in memory)
        ↓
ADF Services (ask AppConfigService for values)
```

**Flow on App Start**:
1. Browser loads app
2. Angular boots up
3. `AppConfigService.load()` called automatically
4. Fetches `app.config.json` via HTTP
5. Stores all values in memory
6. ADF services ready to use

### 3. Key `app.config.json` Properties

```json
{
    "ecmHost": "http://localhost:8080",          // Backend API URL
    "baseShareUrl": "http://localhost:8080",     // Share link base URL
    "providers": "ECM",                           // ECM (content) vs BPM (workflow) vs ALL
    "authType": "BASIC",                          // BASIC (username/password) vs OAUTH
    "sideNav": {
        "preserveState": true,
        "expandedSidenav": true
    },
    "languages": [{ "key": "en", "label": "English" }]
}
```

### 4. ADF Packages Required

From `package.json`:
```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.6.0-25384976868",
        "@alfresco/adf-content-services": "8.6.0-25384976868",
        "@alfresco/adf-extensions": "8.6.0-25384976868",
        "@alfresco/js-api": "9.6.0-25384976868"
    }
}
```

### 5. NX Commands

| Command | Purpose |
|---|---|
| `nx serve my-dms` | Start dev server |
| `nx build my-dms` | Build production |
| `nx test` | Run tests |
| `nx affected:build` | Build changed apps only |

---

## Development Workflow

### Daily Commands
```bash
# 1. Setup proxy (if on corporate network)
npm config set proxy "http://test1:Tes%4012345@10.20.1.222:3128"
npm config set https-proxy "http://test1:Tes%4012345@10.20.1.222:3128"

# 2. Create workspace (only once)
npx create-nx-workspace@19 my-dms --preset=angular-monorepo \
  --bundler=esbuild --style=scss --ssr=false \
  --e2eTestRunner=none --unitTestRunner=none \
  --nxCloud=skip --skipGit=true --no-interactive

# 3. Install dependencies
cd my-dms
npm install --legacy-peer-deps

# 4. Start dev server
nx serve my-dms
```

### Package Management
- Use `--legacy-peer-deps` to resolve version conflicts
- Keep `@nx/*` packages from NX (critical for monorepo)
- Replace Angular packages with ACA versions

---

## What's Coming Next (Roadmap)

1. **Create `app.config.json`** in `my-dms` apps folder
2. **Setup routing** with `SidenavLayoutComponent`
3. **Build login page** using ADF `AuthenticationService`
4. **Connect to backend** via `AlfrescoApiService`
5. **Document library** using ADF content services
6. **Sites management**
7. **Search functionality**
8. **Upload/download operations**
9. **File previews** (PDF, images, etc.)

---

## Resources

- ACA Repository: `https://github.com/Alfresco/alfresco-content-app.git`
- ADF Core Docs: `https://www.alfresco.com/abn/adf/docs/core/components/sidenav-layout.component/`
- Version Compatibility: ACA 7.4.x → ADF 8.4.1 → Angular 19.x → Node 24.x

---

## Key Learnings

1. **Monorepo advantage**: Share code between apps, smart builds with caching
2. **Runtime config power**: Change backend URL without rebuild
3. **ADF services**: Pre-built, don't rewrite (use as intended)
4. **ACA vs Share**: Modern UI + Share features = best of both worlds
5. **Proxy handling**: Critical for corporate networks, set via `.npmrc`

---

**Current Status**: ✅ Workspace created, dependencies installed, Git setup, ready to create `app.config.json` and start building.
