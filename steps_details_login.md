# Login Component — Complete Setup Guide

---

## Overview

This document covers how we built the Login page in `my-dms` by:

1. Studying ACA's login implementation
2. Understanding each file and line of code
3. Building our own simplified version
4. Fixing errors step by step

---

## Part 1 — Study ACA Login First

### Why study ACA first?

> ACA is a production-grade Alfresco app. It shows us REAL world usage of ADF components. We learn from it — then build our own version.

---

### ACA Login File Structure:

```
alfresco-content-app/
└── app/
    └── src/
        └── app/
            └── components/
                └── login/
                    ├── app-login.component.ts    ← logic
                    └── app-login.component.html  ← template
```

---

### ACA — `app-login.component.ts` Analysis:

```typescript
import { LoginComponent } from '@alfresco/adf-core';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AppSettingsService } from '@alfresco/aca-shared';

@Component({
  imports: [LoginComponent, TranslatePipe],
  templateUrl: './app-login.component.html',
  styles: [
    `
      .adf-login {
        background-color: var(--theme-white-background);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppLoginComponent {
  settings = inject(AppSettingsService);
}
```

**Line by line:**

| Import                                                      | Purpose                                                                                |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `LoginComponent` from `@alfresco/adf-core`                  | ADF built-in login UI — username, password, button. ACA does NOT build from scratch ✅ |
| `Component, inject, ViewEncapsulation` from `@angular/core` | Angular decorator, DI, CSS scope control                                               |
| `TranslatePipe` from `@ngx-translate/core`                  | i18n translations support                                                              |
| `AppSettingsService` from `@alfresco/aca-shared`            | ⚠️ ACA internal service — NOT available in our project                                 |

**Key findings:**

- ACA uses `LoginComponent` from ADF directly ✅ — we can do the same
- `AppSettingsService` is ACA internal ❌ — we skip it
- Standalone component — no module needed ✅
- `ViewEncapsulation.None` — CSS applies globally to override ADF styles

---

### ACA — `app-login.component.html` Analysis:

```html
<adf-login [copyrightText]="settings.appCopyright | translate" successRoute="/personal-files" logoImageUrl="./assets/images/updated-alfresco-logo.svg" backgroundImageUrl="./assets/images/Wallpaper-BG-generic.svg" [showRememberMe]="false" [showLoginActions]="false" />
```

**Line by line:**

| Property                         | Purpose                                                     |
| -------------------------------- | ----------------------------------------------------------- |
| `<adf-login>`                    | ADF built-in login component — entire UI in one tag         |
| `[copyrightText]`                | Copyright text from `AppSettingsService` — we skip this     |
| `successRoute="/personal-files"` | Redirect here after successful login — we change to `/home` |
| `logoImageUrl`                   | Logo image — we can use our own                             |
| `backgroundImageUrl`             | Background image — we can use our own                       |
| `[showRememberMe]="false"`       | Hides "Remember Me" checkbox                                |
| `[showLoginActions]="false"`     | Hides "Need help?", "Register", "Forgot password?" links    |

**Why hide RememberMe:**

- Building corporate DMS — users should login fresh every time
- Security reason — shared office computers
- No persistent sessions needed right now

**Why hide LoginActions:**

- No self-registration in DMS (admin managed)
- No forgot password page yet
- Keep login clean and simple

---

### ACA — `app.routes.ts` Analysis:

```typescript
import { AppLoginComponent } from './components/login/app-login.component';

export const APP_ROUTES = [
  {
    path: 'login',
    component: AppLoginComponent,
    data: {
      title: 'APP.SIGN_IN',
    },
  },
];
```

**Flow:**

```
User visits /login
        ↓
Angular loads AppLoginComponent
        ↓
AppLoginComponent shows adf-login
        ↓
User logs in
        ↓
Redirects to successRoute
```

---

### ACA — `app.config.ts` Key Providers:

```typescript
provideCoreAuth({ useHash: true })   ← registers all auth services
provideAppConfig()                    ← loads app.config.json
provideI18N({ assets: [...] })       ← translations
```

These are the key ADF providers we need to copy.

---

## Part 2 — Build Login in my-dms

### Step 1 — Create Login Component Files

**Why manual instead of NX generator:**

- NX generator creates extra files (spec, module) we don't need
- ACA also has only 2 files
- More control, cleaner structure

**Create folder structure:**

```
apps/my-dms/src/app/
└── components/
    └── login/
        ├── login.component.ts    ← create manually
        └── login.component.html  ← create manually
```

In VS Code:

- Right click `app` folder → New Folder → `components`
- Right click `components` → New Folder → `login`
- Right click `login` → New File → `login.component.ts`
- Right click `login` → New File → `login.component.html`

---

### Step 2 — Add Login Component Code

**`login.component.html`:**

```html
<adf-login successRoute="/home" [showRememberMe]="false" [showLoginActions]="false"> </adf-login>
```

**`login.component.ts`:**

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { LoginComponent } from '@alfresco/adf-core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './login.component.html',
  styles: [
    `
      .adf-login {
        background-color: #fff;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppLoginComponent {}
```

**Understanding styles:**

```
ViewEncapsulation.None   = opens the door (CSS goes global)
.adf-login { }           = walks through the door (overrides ADF styles)
```

Both needed together:

- Without `ViewEncapsulation.None` → CSS cannot reach inside ADF component ❌
- Without `.adf-login { }` → nothing to override ❌

---

### Step 3 — Setup Routing

**`app.routes.ts`:**

```typescript
import { Route } from '@angular/router';
import { AppLoginComponent } from './components/login/login.component';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: AppLoginComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
```

**How routing works:**

```
Visit http://localhost:4200
        ↓
path '' matches (empty URL)
        ↓
redirectTo: 'login'
        ↓
http://localhost:4200/#/login
        ↓
AppLoginComponent loads
        ↓
adf-login shows
```

**`pathMatch: 'full'`** — matches COMPLETE URL only, not partial.

---

### Step 4 — Setup ADF Providers in app.config.ts

**`app.config.ts`:**

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAppConfig, provideCoreAuth, provideI18N } from '@alfresco/adf-core';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideCoreAuth({ useHash: true }),
    provideAppConfig(),
    provideI18N({
      assets: [['app', 'assets']],
    }),
    provideRouter(appRoutes, withHashLocation()),
  ],
};
```

**Why each provider:**

| Provider                                       | Why needed                                                                               |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `provideAnimations()`                          | ADF components use Angular animations                                                    |
| `provideHttpClient(withInterceptorsFromDi())`  | ADF uses HTTP to call Alfresco API. `withInterceptorsFromDi` allows ADF auth interceptor |
| `provideCoreAuth({ useHash: true })`           | Registers ALL ADF auth services including `RedirectAuthService`                          |
| `provideAppConfig()`                           | Loads `app.config.json` at runtime via `AppConfigService`                                |
| `provideI18N()`                                | Sets up ADF translations                                                                 |
| `provideRouter(appRoutes, withHashLocation())` | Routing with hash (`#`) in URL                                                           |

---

### Step 5 — Setup App Component

**`app.component.ts`:**

```typescript
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule, provideTranslations } from '@alfresco/adf-core';

@Component({
  standalone: true,
  imports: [RouterModule, CoreModule],
  providers: [provideTranslations('app', 'assets/i18n')],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-dms';
}
```

**`app.component.html`:**

```html
<router-outlet></router-outlet>
```

`<router-outlet>` = renders whatever route is currently active.

---

### Step 6 — Configure project.json Assets, Styles, Scripts

---

#### Why we need to configure assets?

> Any file that is NOT TypeScript or SCSS must be declared in assets — otherwise Angular ignores it completely and browser gets 404 error.

```
app.config.json is a JSON file
        ↓
Angular does NOT process it automatically
        ↓
Must declare in assets
        ↓
Angular copies it to build output
        ↓
Browser can fetch it ✅
```

---

#### First — Study ACA's project.json

Before touching our project — we looked at ACA's assets, styles, scripts:

**ACA assets:**

```json
"assets": [
  "app/src/assets",
  { "glob": "app.config.json", "input": "app/src", "output": "/" },
  { "glob": "**/*", "input": "node_modules/@alfresco/adf-core/bundles/assets", "output": "/assets" },
  { "glob": "**/*", "input": "node_modules/@alfresco/adf-content-services/bundles/assets", "output": "/assets" },
  { "glob": "openjpeg*", "input": "node_modules/pdfjs-dist/wasm", "output": "/wasm/" },
  { "glob": "pdf.worker.min.mjs", "input": "node_modules/pdfjs-dist/build", "output": "/" },
  { "glob": "**/*", "input": "node_modules/@alfresco/aca-content/ms-office/assets", "output": "./assets/ms-office" },
  { "glob": "**/*", "input": "projects/aca-content/assets", "output": "./assets" }
  ...
]
```

**ACA styles:**

```json
"styles": [
  "node_modules/cropperjs/dist/cropper.min.css",
  "node_modules/pdfjs-dist/web/pdf_viewer.css",
  "node_modules/katex/dist/katex.min.css",
  "node_modules/prismjs/themes/prism-okaidia.css",
  "projects/aca-content/src/lib/ui/application.scss",
  "app/src/styles.scss"
]
```

**ACA scripts:**

```json
"scripts": [
  "node_modules/mermaid/dist/mermaid.min.js",
  "node_modules/katex/dist/katex.min.js",
  "node_modules/katex/dist/contrib/auto-render.min.js",
  "node_modules/prismjs/prism.js",
  "node_modules/prismjs/components/prism-csharp.min.js",
  "node_modules/prismjs/components/prism-css.min.js"
]
```

---

#### What we skipped from ACA and why:

**Assets skipped:**

| ACA Asset               | Why Skipped                                         |
| ----------------------- | --------------------------------------------------- |
| `aca-content` assets    | ACA internal library — not available in our project |
| `ms-office` assets      | AOS/MS Office plugin — not needed yet               |
| `extension.schema.json` | ACA extensions — not needed yet                     |
| Plugin JSON files       | ACA plugins — not needed yet                        |

**Styles skipped:**

| ACA Style                                          | Why Skipped                             |
| -------------------------------------------------- | --------------------------------------- |
| `cropperjs/dist/cropper.min.css`                   | Image cropping feature — not needed yet |
| `projects/aca-content/src/lib/ui/application.scss` | ACA internal library — not available    |

**Scripts skipped:**

| ACA Script            | Why Skipped                               |
| --------------------- | ----------------------------------------- |
| `prism-csharp.min.js` | Extra language highlight — not needed yet |
| `prism-css.min.js`    | Extra language highlight — not needed yet |

---

#### Now apply to my-dms project.json:

Open `apps/my-dms/project.json` and replace assets, styles, scripts sections.

**Assets — replace existing with:**

```json
"assets": [
  {
    "glob": "**/*",
    "input": "apps/my-dms/public"
  },
  "apps/my-dms/src/assets",
  {
    "glob": "app.config.json",
    "input": "apps/my-dms/src",
    "output": "/"
  },
  {
    "glob": "**/*",
    "input": "node_modules/@alfresco/adf-core/bundles/assets",
    "output": "/assets"
  },
  {
    "glob": "**/*",
    "input": "node_modules/@alfresco/adf-content-services/bundles/assets",
    "output": "/assets"
  },
  {
    "glob": "openjpeg*",
    "input": "node_modules/pdfjs-dist/wasm",
    "output": "/wasm/"
  },
  {
    "glob": "pdf.worker.min.mjs",
    "input": "node_modules/pdfjs-dist/build",
    "output": "/"
  }
],
```

**Styles — replace existing with:**

```json
"styles": [
  "node_modules/pdfjs-dist/web/pdf_viewer.css",
  "node_modules/katex/dist/katex.min.css",
  "node_modules/prismjs/themes/prism-okaidia.css",
  "apps/my-dms/src/styles.scss"
],
```

**Scripts — replace existing with:**

```json
"scripts": [
  "node_modules/mermaid/dist/mermaid.min.js",
  "node_modules/katex/dist/katex.min.js",
  "node_modules/katex/dist/contrib/auto-render.min.js",
  "node_modules/prismjs/prism.js"
]
```

---

#### Also create translation file:

ADF looks for `assets/i18n/en.json` at startup. If missing → 404 error.

**Step 1 — Create folder:**

```
apps/my-dms/src/assets/i18n/
```

**Step 2 — Create file `en.json` inside it:**

```json
{}
```

**Why empty `{}`:**

- File must exist → no 404 error ✅
- Empty means no custom translations yet
- ADF uses its own built-in translations as fallback
- We add our own translations later as we build features

---

## Part 3 — Errors We Faced & How We Fixed Them

---

### Error 1 — NullInjectorError: No provider for RedirectAuthService

**Error:**

```
NullInjectorError: No provider for _RedirectAuthService!
```

**Why it happened:**

- `LoginComponent` needs `AuthenticationService`
- `AuthenticationService` needs `RedirectAuthService`
- These were not registered in our app

**Fix:**
Added `provideCoreAuth({ useHash: true })` to `app.config.ts`
This registers ALL ADF auth services automatically. ✅

---

### Error 2 — 404 Missing Assets

**Errors:**

```
assets/adf-core/i18n/en.json — 404
assets/i18n/en.json — 404
updated-alfresco-logo.svg — 404
```

**Why it happened:**

- ADF needs its own asset files (translations, images)
- These were not copied to build output

**Fix:**
Added ADF asset paths to `project.json` assets section:

```json
{
  "glob": "**/*",
  "input": "node_modules/@alfresco/adf-core/bundles/assets",
  "output": "/assets"
}
```

Also created `assets/i18n/en.json` with `{}` ✅

---

### Error 3 — CORS Error (Pending Fix)

**Error:**

```
Access to XMLHttpRequest at 'http://localhost:8080/alfresco/api/...'
has been blocked by CORS policy
```

**Why it happens:**

```
Browser (port 4200) → requests → Alfresco (port 8080)
        ↓
Alfresco: "I don't trust requests from port 4200" ❌
        ↓
Browser blocks the request
```

**Fix — Create proxy:**

Create `apps/my-dms/proxy.conf.json`:

```json
{
  "/alfresco": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

Update `project.json` serve target:

```json
"serve": {
  "executor": "@angular-devkit/build-angular:dev-server",
  "configurations": {
    "development": {
      "buildTarget": "my-dms:build:development",
      "proxyConfig": "apps/my-dms/proxy.conf.json"
    }
  },
  "defaultConfiguration": "development"
}
```

**Status: ⬜ To be fixed next session**

---

## Part 4 — Current Status

| Task                                          | Status  |
| --------------------------------------------- | ------- |
| NX workspace created                          | ✅      |
| package.json merged + installed               | ✅      |
| app.config.json copied + modified             | ✅      |
| project.json assets/styles/scripts configured | ✅      |
| Login component created                       | ✅      |
| Routing setup                                 | ✅      |
| ADF providers configured                      | ✅      |
| Login page showing in browser                 | ✅      |
| CORS proxy setup                              | ⬜ Next |
| Backend login test                            | ⬜ Next |
| Home page after login                         | ⬜ Next |

---

## Part 5 — Key Concepts Learned

| Concept                  | Understanding                                                                 |
| ------------------------ | ----------------------------------------------------------------------------- |
| ADF `LoginComponent`     | Ready-made login UI from `@alfresco/adf-core` — no need to build from scratch |
| `successRoute`           | Where to redirect after successful login                                      |
| `ViewEncapsulation.None` | Opens CSS scope globally — allows overriding ADF internal styles              |
| `provideCoreAuth`        | Registers all ADF auth services                                               |
| `provideAppConfig`       | Makes `AppConfigService` load `app.config.json`                               |
| `withHashLocation`       | Adds `#` to URLs — required by ADF routing                                    |
| CORS                     | Browser security blocking cross-origin requests — fixed with proxy            |
| Assets in project.json   | Non-TS/SCSS files must be declared — otherwise Angular ignores them           |

---

_Part of: My DMS Project — Agent Knowledge Base_
_Last updated: Login page working, CORS fix pending_
_Next: Fix CORS proxy, test backend login, build home page_

---

---

---

# Login to Home — Problems, Fixes & Current Status

---

## Overview

This document covers everything we did after the login page was showing:

- CORS error and how we fixed it
- Proxy setup journey
- Bundler issue (Vite vs Webpack)
- File changes with before/after
- ACA vs my-dms comparison
- Current pending issue (AuthGuard/Shell)

---

## Part 1 — CORS Error

### What is CORS?

```
Browser (port 4200) → requests → Alfresco (port 8080)
        ↓
Alfresco says: "I don't trust requests from port 4200" ❌
        ↓
Browser blocks the request
```

CORS = Cross Origin Resource Sharing.
Different ports = Different origins = Browser blocks it.

### Error we got:

```
Access to XMLHttpRequest at 'http://localhost:8080/alfresco/api/
-default-/public/authentication/versions/1/tickets' from origin
'http://localhost:4200' has been blocked by CORS policy
```

### Why it happened:

ADF `LoginComponent` calls Alfresco API directly:

```
POST http://localhost:8080/alfresco/api/.../tickets
```

Browser sees request going from `4200` to `8080` → blocks it.

### Solution — Proxy:

```
Browser (4200)
        ↓
requests go to proxy (still 4200)
        ↓
proxy forwards to Alfresco (8080)
        ↓
Alfresco thinks request came from itself ✅
        ↓
No CORS block ✅
```

---

## Part 2 — Proxy Setup Journey

### Attempt 1 — proxy.conf.json (FAILED ❌)

**Created:** `apps/my-dms/proxy.conf.json`

```json
{
  "/alfresco": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

**project.json serve:**

```json
"development": {
  "buildTarget": "my-dms:build:development",
  "proxyConfig": "apps/my-dms/proxy.conf.json"
}
```

**Result:** Still CORS error ❌

---

### Attempt 2 — proxy.conf.js (FAILED ❌)

**Created:** `apps/my-dms/proxy.conf.js`

```javascript
module.exports = {
  '/alfresco': {
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
  },
};
```

**Result:** Still CORS error ❌

---

### Root Cause Found — Vite vs Webpack

**This was the real problem.**

Our `my-dms` was using **Vite** bundler — which does NOT support `proxy.conf.js` format.

ACA uses **Webpack** bundler — which DOES support `proxy.conf.js` format.

|               | ACA        | my-dms (original) |
| ------------- | ---------- | ----------------- |
| Bundler       | Webpack    | Vite/esbuild      |
| Executor      | `:browser` | `:application`    |
| proxy.conf.js | ✅ Works   | ❌ Ignored        |

**How to identify which bundler:**

```json
// Webpack (ACA)
"executor": "@angular-devkit/build-angular:browser"

// Vite (our original my-dms)
"executor": "@angular-devkit/build-angular:application"
```

---

### Fix — Change Executor in project.json

**Before (Vite):**

```json
"build": {
  "executor": "@angular-devkit/build-angular:application",
  "options": {
    "browser": "apps/my-dms/src/main.ts"  ← application uses "browser"
  }
}
```

**After (Webpack):**

```json
"build": {
  "executor": "@angular-devkit/build-angular:browser",
  "options": {
    "main": "apps/my-dms/src/main.ts"  ← browser uses "main"
  }
}
```

**Important:** When changing `:application` to `:browser` — must also change `browser` property to `main`.

---

### Also fixed serve section in project.json

**ACA serve section (reference):**

```json
"serve": {
  "executor": "@angular-devkit/build-angular:dev-server",
  "options": {
    "buildTarget": "content-ce:build",
    "port": 4200,
    "disableHostCheck": true,
    "proxyConfig": "app/proxy.conf.js"
  }
}
```

**Our my-dms serve section (after fix):**

```json
"serve": {
  "executor": "@angular-devkit/build-angular:dev-server",
  "options": {
    "buildTarget": "my-dms:build",
    "port": 4200,
    "disableHostCheck": true,
    "proxyConfig": "apps/my-dms/proxy.conf.js"
  },
  "configurations": {
    "production": {
      "buildTarget": "my-dms:build:production"
    },
    "development": {
      "buildTarget": "my-dms:build:development"
    }
  },
  "defaultConfiguration": "development"
}
```

**Key differences ACA vs my-dms:**
| | ACA | my-dms |
|---|---|---|
| `proxyConfig` location | inside `options` (global) | inside `options` (global) ✅ |
| proxy file | `app/proxy.conf.js` | `apps/my-dms/proxy.conf.js` |
| `disableHostCheck` | ✅ | ✅ |

---

### Final proxy.conf.js

```javascript
console.log('Proxy config loaded - target: http://localhost:8080');

module.exports = {
  '/alfresco': {
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (request) => {
      if (request['method'] !== 'GET') {
        request.setHeader('origin', 'http://localhost:8080');
      }
    },
  },
};
```

**How to verify proxy is loading:**
When you run `nx serve my-dms` — terminal should show:

```
Proxy config loaded - target: http://localhost:8080 ✅
```

---

## Part 3 — Proxy Loading But Still CORS

### Problem:

Even after proxy was loading correctly — CORS error was still happening.

**Terminal showed:**

```
Proxy config loaded - target: http://localhost:8080 ✅
```

**But browser showed:**

```
POST http://localhost:8080/alfresco/... CORS error ❌
```

### Root Cause:

`app.config.json` had `ecmHost` pointing directly to backend:

```json
"ecmHost": "http://localhost:8080"  ← bypasses proxy completely!
```

ADF was calling `http://localhost:8080/alfresco/...` directly — skipping proxy entirely.

### Fix — Change ecmHost in app.config.json

**Before:**

```json
"ecmHost": "http://localhost:8080"
```

**After:**

```json
"ecmHost": "http://localhost:4200"
```

**Why this works:**

```
ADF calls http://localhost:4200/alfresco/...
        ↓
Proxy intercepts /alfresco requests
        ↓
Forwards to http://localhost:8080
        ↓
No CORS ✅
```

**ACA comparison:**
ACA uses dynamic template:

```json
"ecmHost": "{protocol}//{hostname}{:port}"
```

This resolves to same server where app is running — so proxy always works.

---

## Part 4 — Login Success but /home Route Missing

### Error:

```
ERROR RuntimeError: NG04002: Cannot match any routes. URL Segment: 'home'
```

### Why:

Login was successful! But `successRoute="/home"` in login component pointed to `/home` route which didn't exist.

### Fix — Create HomeComponent and add route

**Created files:**

```
apps/my-dms/src/app/components/home/
├── home.component.ts
└── home.component.html
```

**Command used:**

```bash
nx generate @nx/angular:component apps/my-dms/src/app/components/home/home --standalone --inline-style
```

**Updated app.routes.ts:**

**Before:**

```typescript
export const appRoutes: Route[] = [
  {
    path: 'login',
    component: AppLoginComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
```

**After:**

```typescript
import { Route } from '@angular/router';
import { AppLoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from '@alfresco/adf-core';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: AppLoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
```

---

## Part 5 — All File Changes Summary

### app.config.json changes:

| Property  | Before                  | After                   | Why                 |
| --------- | ----------------------- | ----------------------- | ------------------- |
| `ecmHost` | `http://localhost:8080` | `http://localhost:4200` | Route through proxy |

---

### project.json changes:

| What          | Before                      | After                     | Why                    |
| ------------- | --------------------------- | ------------------------- | ---------------------- |
| `executor`    | `:application`              | `:browser`                | Switch to Webpack      |
| entry point   | `"browser": "main.ts"`      | `"main": "main.ts"`       | `:browser` uses `main` |
| `proxyConfig` | inside `development` config | inside `options` (global) | Apply to all configs   |
| proxy file    | `.json`                     | `.js`                     | Webpack supports JS    |

---

### proxy.conf.js changes:

| Version           | What changed                 | Result                   |
| ----------------- | ---------------------------- | ------------------------ |
| v1 (json)         | Basic JSON config            | Failed — Vite ignored it |
| v2 (js)           | JS module format             | Failed — still Vite      |
| v3 (js + webpack) | Same JS but webpack executor | Works ✅                 |

---

### app.routes.ts changes:

| What      | Before     | After            |
| --------- | ---------- | ---------------- |
| Routes    | only login | login + home     |
| AuthGuard | ❌ none    | ✅ on home route |

---

## Part 6 — ACA vs my-dms Comparison

|                  | ACA                             | my-dms                        |
| ---------------- | ------------------------------- | ----------------------------- |
| Bundler          | Webpack (`:browser`)            | Webpack (`:browser`) ✅ fixed |
| proxy file       | `app/proxy.conf.js`             | `apps/my-dms/proxy.conf.js`   |
| `ecmHost`        | `{protocol}//{hostname}{:port}` | `http://localhost:4200`       |
| AuthGuard        | Via Shell routes                | Added on home route           |
| Shell/Layout     | `adf-sidenav-layout`            | ⬜ Not yet                    |
| Protected routes | Inside Shell                    | Direct routes                 |

---

## Part 7 — Current Pending Issue (AuthGuard/Shell)

### Current problem:

When server restarts → app goes directly to `/home` without showing login.

### Why:

ADF saves auth token in browser localStorage. When app restarts:

```
App loads
        ↓
Reads token from localStorage
        ↓
Token exists → goes to /home
        ↓
No verification against backend
```

### How ACA solves it:

ACA uses **Shell** pattern:

```
Visit any protected route
        ↓
Shell checks AuthGuard
        ↓
AuthGuard calls /tickets API to verify token
        ↓
Valid → allow ✅
Invalid → redirect to /login ✅
```

### What Shell is:

Shell = Main layout wrapper that:

- Has `adf-sidenav-layout` (header + sidebar + content)
- Has `AuthGuard` built in
- All protected routes go inside Shell

### Our next step:

Build Layout component with `adf-sidenav-layout`:

```
/login          → LoginComponent (public)
/               → LayoutComponent (Shell with AuthGuard)
                    ↓
                  adf-sidenav-layout
                    ├── header
                    ├── sidebar
                    └── router-outlet
                          ↓
                        /home → HomeComponent
                        /files → FilesComponent (future)
```

This solves TWO problems at once:

1. AuthGuard on all protected routes ✅
2. Sidenav layout for all pages ✅

---

## Part 8 — Current File States

### proxy.conf.js (final):

```javascript
console.log('Proxy config loaded - target: http://localhost:8080');

module.exports = {
  '/alfresco': {
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (request) => {
      if (request['method'] !== 'GET') {
        request.setHeader('origin', 'http://localhost:8080');
      }
    },
  },
};
```

### app.config.json (key change):

```json
"ecmHost": "http://localhost:4200"
```

### app.routes.ts (final):

```typescript
import { Route } from '@angular/router';
import { AppLoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from '@alfresco/adf-core';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: AppLoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
```

### app.config.ts (final):

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideCoreAuth({ useHash: true }),
    provideAppConfig(),
    provideI18N({
      assets: [['app', 'assets']],
    }),
    provideRouter(appRoutes, withHashLocation()),
  ],
};
```

### app.component.ts (final):

```typescript
@Component({
  standalone: true,
  imports: [RouterModule, CoreModule],
  providers: [provideTranslations('app', 'assets/i18n')],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-dms';
}
```

---

## Part 9 — Current Status

| Task                                | Status  |
| ----------------------------------- | ------- |
| Login page working                  | ✅      |
| CORS fixed via proxy                | ✅      |
| Webpack bundler configured          | ✅      |
| Backend login working               | ✅      |
| Home page created                   | ✅      |
| AuthGuard on home route             | ✅      |
| Shell/Layout component              | ⬜ Next |
| `adf-sidenav-layout`                | ⬜ Next |
| Proper auth verification on restart | ⬜ Next |

---

_Part of: My DMS Project — Agent Knowledge Base_
_Last updated: Login working, CORS fixed, Shell/Layout next_
