# Agent Knowledge Base — My DMS Project

> This file is a living document. Update it as the project progresses.

---

## 1. What is a Monorepo?

A **monorepo** (monolithic repository) is a single repository that contains **multiple projects/apps/libraries** all in one place.

### Normal Repo vs Monorepo

```
Normal Repo (multiple repos):
├── repo-app1/         → separate git repo
├── repo-app2/         → separate git repo
└── repo-shared-lib/   → separate git repo

Monorepo (one repo):
└── my-dms/
    ├── apps/
    │   ├── my-dms/        → main app
    │   └── admin/         → admin app (future)
    └── libs/
        ├── shared/        → shared components
        ├── auth/          → auth feature
        └── document/      → document feature
```

### Why do we need a Monorepo?

- **Share code** between apps easily (no npm publishing)
- **Single `npm install`** for everything
- **Consistent versions** across all apps and libs
- **Easier refactoring** — change shared code in one place
- **ACA (Alfresco Content App) uses monorepo** — so we follow same pattern
- When we build Share-like features, each feature becomes a **lib** inside monorepo

---

## 2. What is NX?

**NX** is a smart build system and monorepo manager built on top of Angular CLI.

Think of NX as a **manager/controller** that:

- Creates and manages multiple apps and libs
- Runs, builds, tests apps efficiently
- Controls which version of Angular is used
- Caches builds so repeated builds are faster
- Understands dependencies between your apps and libs

### NX vs Angular CLI

|                  | Angular CLI | NX  |
| ---------------- | ----------- | --- |
| Single app       | ✅          | ✅  |
| Multiple apps    | ❌          | ✅  |
| Shared libraries | ❌          | ✅  |
| Build caching    | ❌          | ✅  |
| Dependency graph | ❌          | ✅  |
| Used by ACA      | ❌          | ✅  |

### How NX controls Angular version

When you run:

```bash
npx create-nx-workspace@19 ...
```

- `@19` = NX version 19
- NX 19 installs **Angular 19** automatically
- Angular version lives in `node_modules` — project specific
- Your global Node is unaffected

This means you can have:

- Project A → Angular 17
- Project B → Angular 19
- Both on same machine ✅

---

## 3. Why We Used This Specific Command

```powershell
$env:NX_NO_CLOUD=1
npx create-nx-workspace@19 my-dms --preset=angular-monorepo --bundler=esbuild --style=scss --ssr=false --e2eTestRunner=none --unitTestRunner=none --nxCloud=skip --skipGit=true --no-interactive
```

### Breaking it down flag by flag:

| Flag                        | Why                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `$env:NX_NO_CLOUD=1`        | Prevents NX from calling nx.dev cloud API (fixes 407 proxy error)                    |
| `create-nx-workspace@19`    | NX v19 = Angular 19 (matches ACA requirement)                                        |
| `my-dms`                    | Workspace name                                                                       |
| `--preset=angular-monorepo` | Sets up Angular monorepo structure                                                   |
| `--bundler=esbuild`         | Modern fast bundler (same as ACA)                                                    |
| `--style=scss`              | SCSS stylesheets (same as ACA)                                                       |
| `--ssr=false`               | No Server Side Rendering (we are building private DMS behind login — SEO not needed) |
| `--e2eTestRunner=none`      | No E2E test setup (keep it minimal)                                                  |
| `--unitTestRunner=none`     | No unit test setup (keep it minimal)                                                 |
| `--nxCloud=skip`            | Skip NX Cloud remote caching                                                         |
| `--skipGit=true`            | Skip git initialization                                                              |
| `--no-interactive`          | No prompts — fully automated                                                         |

### Why Angular 19 specifically?

From ACA README compatibility table:
| ACA | ADF | Node | Angular |
|---|---|---|---|
| 7.4.x | 8.4.1 | 24.x | 19.x |

We target ACA 7.4.x → requires Angular 19.x ✅

---

## 4. NX Workspace Structure

After creation your workspace looks like:

```
my-dms/                        ← WORKSPACE ROOT
├── apps/
│   └── my-dms/                ← MAIN APPLICATION
│       └── src/
│           ├── app/
│           │   ├── app.component.ts
│           │   ├── app.config.ts
│           │   └── app.routes.ts
│           ├── index.html
│           ├── main.ts
│           └── styles.scss
├── libs/                      ← SHARED LIBRARIES (you will add)
├── node_modules/              ← ALL installed packages
├── nx.json                    ← NX configuration
├── package.json               ← ALL dependencies
└── tsconfig.base.json         ← TypeScript path mappings
```

### Key NX commands used in this project:

```bash
# Run the app in development
nx serve my-dms

# Build the app
nx build my-dms

# Run tests
nx test my-dms

# Generate a new library
nx generate @nx/angular:library my-lib

# Generate a new component
nx generate @nx/angular:component my-component --project=my-dms

# See dependency graph
nx graph
```

---

## 5. package.json — Normal vs Monorepo

### Normal Angular package.json:

```json
{
  "name": "my-app",
  "dependencies": {
    "@angular/core": "19.x"
  },
  "devDependencies": {
    "@angular/cli": "19.x"
  }
}
```

### Monorepo (NX) package.json:

```json
{
  "name": "@my-dms/source",       ← scoped name for monorepo
  "dependencies": {
    "@angular/core": "19.x",
    "@alfresco/adf-core": "8.x"   ← all apps share same deps
  },
  "devDependencies": {
    "@nx/angular": "22.x",        ← NX specific tools
    "@nx/workspace": "22.x",
    "nx": "22.x"                  ← NX itself
  }
}
```

### Key differences:

|                   | Normal            | Monorepo                    |
| ----------------- | ----------------- | --------------------------- |
| `name`            | simple string     | `@scope/name` format        |
| `dependencies`    | app specific      | shared across ALL apps      |
| `devDependencies` | basic Angular CLI | NX tools + Angular CLI      |
| `scripts`         | `ng serve`        | `nx serve app-name`         |
| Multiple apps     | ❌                | ✅ one package.json for all |

---

## 6. Dependencies Installed — What and Why

### Runtime Dependencies (`dependencies`):

| Package                          | Purpose                                           |
| -------------------------------- | ------------------------------------------------- |
| `@alfresco/adf-core`             | Alfresco core components (login, user info, etc.) |
| `@alfresco/adf-content-services` | Document library, file viewer, upload etc.        |
| `@alfresco/adf-extensions`       | Plugin/extension system                           |
| `@alfresco/js-api`               | JavaScript API for Alfresco REST endpoints        |
| `@angular/core`                  | Angular framework core                            |
| `@angular/material`              | Material Design UI components                     |
| `@angular/cdk`                   | Component Dev Kit (overlays, drag-drop etc.)      |
| `@ngrx/store`                    | State management                                  |
| `@ngrx/effects`                  | Side effects for state management                 |
| `@ngx-translate/core`            | i18n translations                                 |
| `rxjs`                           | Reactive programming (used everywhere in Angular) |
| `date-fns`                       | Date utility library                              |
| `pdfjs-dist`                     | PDF rendering in browser                          |
| `zone.js`                        | Angular change detection                          |

### Dev Dependencies (`devDependencies`):

| Package                         | Purpose                |
| ------------------------------- | ---------------------- |
| `@nx/angular`                   | NX Angular plugin      |
| `@nx/workspace`                 | NX workspace tools     |
| `nx`                            | NX build system itself |
| `@angular-devkit/build-angular` | Angular build tools    |
| `typescript`                    | TypeScript compiler    |
| `eslint`                        | Code linting           |
| `prettier`                      | Code formatting        |
| `husky`                         | Git hooks              |

---

## 7. Version Compatibility Reference

| ACA   | ADF   | Node | Angular | NX   |
| ----- | ----- | ---- | ------- | ---- |
| 7.4.x | 8.4.1 | 24.x | 19.x    | 22.x |
| 6.0.x | 7.0.0 | 20.x | 17.x    | —    |

**Our target:** ACA 7.4.x stack ✅

---

## 8. Project Goal & Vision

### What we are building:

A custom DMS (Document Management System) inspired by **Alfresco Share** but built on modern **ACA (Alfresco Content App)** stack.

### Architecture decision:

- **UI Style:** ACA modern Angular UI (not Share's old UI)
- **Features:** Share-level full DMS features
- **Backend:** Alfresco Content Services (unchanged)
- **Frontend:** New Angular project using ADF services

### Why new project instead of modifying ACA directly:

- Learn ADF services deeply first
- Understand how everything connects
- Build confidently with full understanding
- ACA monorepo complexity avoided at start

### Feature roadmap:

1. ✅ Workspace setup
2. ✅ Dependencies installed
3. 🔄 App running (in progress)
4. ⬜ Login page + backend connection
5. ⬜ Document library
6. ⬜ Site management
7. ⬜ User dashboard
8. ⬜ Search
9. ⬜ Workflows
10. ⬜ Admin panel

---

## 9. SSR vs CSR — Why We Chose CSR

|          | CSR (our choice)          | SSR                | SSG                     |
| -------- | ------------------------- | ------------------ | ----------------------- |
| How      | Browser builds page       | Server builds page | Pre-built at build time |
| Good for | Private apps behind login | Public SEO apps    | Static websites/blogs   |
| Our DMS  | ✅ Perfect                | ❌ Not needed      | ❌ Not needed           |

**Our DMS is private, behind login → SEO doesn't matter → CSR is correct.**

---

## 10. Proxy Setup (Office Network)

If on office/corporate network with proxy:

```powershell
# Set proxy in npm config
# Edit C:\Users\<username>\.npmrc
proxy=http://username:password@proxyserver:port
https-proxy=http://username:password@proxyserver:port

# Disable NX cloud to avoid proxy issues
$env:NX_NO_CLOUD=1
```

**Note:** `%40` in password = `@` symbol (URL encoded)

---

_Last updated: Project setup phase — workspace created, dependencies installed_
_Next focus: Running app and building login page_
