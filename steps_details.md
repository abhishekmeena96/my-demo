# Step 1 — Create Monorepo Architecture Using NX

We will use **NX** to create our monorepo architecture.

NX is the same tool used by **ACA (Alfresco Content Application)** for managing multiple applications and libraries inside a single repository.

---

# What is NX?

**NX** is a monorepo management tool that helps manage:

- Multiple applications
- Multiple libraries
- Shared code
- Build processes
- Testing
- Deployment workflows

All inside a **single repository**.

### Example

Instead of:

```text
frontend-app/
backend-app/
shared-library/
```

Having separate repositories, NX allows:

```text
my-dms/
├── apps/
│   ├── web-app/
│   └── admin-app/
│
├── libs/
│   ├── shared-ui/
│   ├── shared-services/
│   └── shared-models/
│
└── nx.json
```

Everything is managed from one workspace.

---

# Step 1.1 — Install NX

## Option 1: Install Globally

```bash
npm install -g nx
```

### Meaning

- `npm` → Node Package Manager
- `install` → Install package
- `-g` → Global installation
- `nx` → NX CLI tool

After installation, the `nx` command is available from anywhere on your machine.

---

## Option 2: Project-Wise Installation

```bash
npm install nx
```

### Meaning

Installs NX only inside the current project.

The NX package will be added to:

```text
node_modules/
```

and listed in:

```json
package.json
```

---

# Step 1.2 — Create a New NX Workspace

Run:

```bash
npx create-nx-workspace@latest my-dms --preset=angular-monorepo
npx create-nx-workspace@19 my-dms --preset=angular-monorepo
```

---

# Command Breakdown

## 1. npx

```bash
npx
```

**Meaning:**

Runs a package without permanently installing it globally.

It downloads the package temporarily, executes it, and then exits.

Example:

```bash
npx create-nx-workspace
```

---

## 2. create-nx-workspace@latest

```bash
create-nx-workspace@latest
```

**Meaning:**

NX's official workspace generator.

### @latest

```text
@latest
```

Means:

> Use the newest available version.

---

## 3. my-dms

```bash
my-dms
```

**Meaning:**

Name of the workspace folder that will be created.

Example:

```text
my-dms/
```

You can replace it with any project name.

Example:

```bash
npx create-nx-workspace@latest company-dms
```

Creates:

```text
company-dms/
```

---

## 4. --preset=angular-monorepo

```bash
--preset=angular-monorepo
```

### Meaning

`--preset`

Tells NX which project template should be generated.

`angular-monorepo`

Tells NX to create:

- Angular-ready workspace
- Monorepo structure
- Support for multiple Angular applications
- Support for shared libraries
- NX configuration files

---

# Complete Command

```bash
npx create-nx-workspace@latest my-dms --preset=angular-monorepo
```

---

# What Happens After Running This Command?

NX will:

### 1. Create a New Folder

```text
my-dms/
```

---

### 2. Generate Monorepo Structure

Example:

```text
my-dms/
├── apps/
├── libs/
├── nx.json
├── package.json
└── tsconfig.base.json
```

---

### 3. Configure Angular

Angular dependencies and configuration files are added automatically.

---

### 4. Configure NX

NX build tools, generators, and workspace settings are added.

---

### 5. Prepare for Multiple Applications

You can later create:

```text
apps/
├── content-app
├── admin-app
└── portal-app
```

inside the same repository.

---

# Full Picture

```bash
npx create-nx-workspace@latest my-dms --preset=angular-monorepo
```

This command:

✅ Creates a folder named `my-dms`

✅ Sets up an NX monorepo workspace

✅ Installs Angular support

✅ Installs NX tooling

✅ Creates a structure for multiple apps and shared libraries

✅ Follows the same monorepo concept used by ACA

---

---

# Bundler, SSR, and SSG Basics

These are foundational concepts used in Angular, NX, ACA, and modern web applications.

---

# What is a Bundler?

A **Bundler** is a tool that collects all application files and prepares them for the browser.

Modern applications contain many different types of files:

- TypeScript files (`.ts`)
- HTML files (`.html`)
- CSS/SCSS files (`.css`, `.scss`)
- Images
- Fonts
- Third-party libraries
- Configuration files

---

# Why Do We Need a Bundler?

Browsers cannot directly understand TypeScript.

Example:

```typescript
const user: string = 'Angular';
```

The browser only understands JavaScript.

Additionally, a real Angular application may contain:

```text
500+ TypeScript files
100+ HTML files
100+ CSS files
Many images and libraries
```

Loading hundreds of separate files would be very slow.

---

# What Does a Bundler Do?

The bundler performs several tasks automatically.

```text
Application Files
        ↓
TypeScript → JavaScript
        ↓
Combine files together
        ↓
Remove unused code
        ↓
Compress and optimize
        ↓
Generate production files
        ↓
Browser loads application
```

---

# Simple Mental Model

Without Bundler:

```text
500 Separate Files
        ↓
Many Network Requests
        ↓
Slow Loading
```

With Bundler:

```text
500 Files
        ↓
Bundler
        ↓
3–4 Optimized Files
        ↓
Fast Loading
```

---

# Bundlers Used in Angular Ecosystem

Common bundlers:

| Bundler | Purpose                         |
| ------- | ------------------------------- |
| Webpack | Traditional Angular bundler     |
| Vite    | Modern fast bundler             |
| esbuild | Extremely fast compiler/bundler |
| Rollup  | Library bundling                |

Angular and NX handle these tools automatically.

---

# Where Do We Use It?

When running:

```bash
ng build
```

or

```bash
nx build
```

the bundler runs behind the scenes.

You usually do not interact with it directly.

---

# Build Process Overview

```text
Source Code
(TypeScript, HTML, CSS)
        ↓
ng build / nx build
        ↓
Bundler Starts
        ↓
Optimization
        ↓
Bundle Creation
        ↓
dist/ Folder Generated
        ↓
Ready for Deployment
```

---

# What is SSR (Server-Side Rendering)?

SSR stands for:

```text
Server-Side Rendering
```

The server generates the HTML page before sending it to the browser.

---

# Normal Angular (Client-Side Rendering)

Flow:

```text
Browser Requests Page
        ↓
Server Sends Almost Empty HTML
        ↓
Angular Downloads
        ↓
Angular Executes in Browser
        ↓
Page Gets Built
        ↓
User Sees Content
```

Example:

```html
<body>
  <app-root></app-root>
</body>
```

Initially the page is mostly empty.

Angular must build everything in the browser.

---

# SSR Flow

With SSR:

```text
Browser Requests Page
        ↓
Server Executes Angular
        ↓
Complete HTML Generated
        ↓
HTML Sent To Browser
        ↓
User Sees Content Immediately
```

Example:

```html
<body>
  <h1>Welcome</h1>
  <p>Document List</p>
</body>
```

The content is already present when it reaches the browser.

---

# Benefits of SSR

### Faster First Page Load

User sees content sooner.

### Better SEO

Search engines can read content immediately.

### Better User Experience

Pages appear faster.

---

# Mental Model for SSR

Without SSR:

```text
Request
        ↓
Empty Page
        ↓
Angular Builds Page
        ↓
Content Appears
```

With SSR:

```text
Request
        ↓
Server Builds Page
        ↓
Ready HTML Sent
        ↓
Content Appears Immediately
```

---

# What is SSG (Static Site Generation)?

SSG stands for:

```text
Static Site Generation
```

Pages are generated during the build process.

The HTML files already exist before any user visits the site.

---

# SSG Flow

During Build:

```text
Build Application
        ↓
Generate HTML Pages
        ↓
Store Ready HTML Files
```

When User Visits:

```text
Request Page
        ↓
Serve Existing HTML
        ↓
Instant Response
```

No server-side rendering is required at request time.

---

# Benefits of SSG

### Very Fast

Pages are already generated.

### Low Server Load

No rendering work during requests.

### Excellent SEO

Search engines receive complete HTML.

### Simple Hosting

Can be hosted on static hosting platforms.

---

# SSR vs SSG

| Feature         | SSR             | SSG           |
| --------------- | --------------- | ------------- |
| HTML Generated  | At Request Time | At Build Time |
| Server Required | Yes             | Usually No    |
| Performance     | Fast            | Very Fast     |
| Dynamic Data    | Excellent       | Limited       |
| SEO             | Excellent       | Excellent     |

---

# Quick Revision

## Bundler

```text
Takes all application files
        ↓
Converts TypeScript to JavaScript
        ↓
Bundles files together
        ↓
Optimizes output
        ↓
Creates production build
```

---

## SSR

```text
User Requests Page
        ↓
Server Generates HTML
        ↓
Browser Receives Ready Page
```

---

## SSG

```text
Build Time Generates HTML
        ↓
Pages Stored On Server
        ↓
Users Receive Ready HTML
```

---

# Key Takeaway

### Bundler

Converts and optimizes application files for the browser.

### SSR

Generates HTML on the server when a request arrives.

### SSG

Generates HTML during build time before users visit the application.

## All three are commonly used in modern Angular and NX applications to improve performance and user experience.

---

# Monorepo, NX, and Tooling Overview

## Why We Created a Monorepo

### Traditional Angular Structure

```text
my-app/
└── src/
    └── app/
```

All components, services, models, and features live in one application.

### Challenges

- Code is tightly coupled to a single application.
- Reusing components across projects is difficult.
- As the application grows, maintenance becomes harder.
- Shared functionality often gets duplicated.

### Monorepo Structure

```text
my-dms/
├── apps/
└── libs/
```

### Purpose

**apps/**

- Executable applications
- User-facing Angular applications

**libs/**

- Reusable components
- Shared services
- Shared models
- Common utilities

### Benefits

- Reuse code across multiple applications.
- Keep shared functionality in one place.
- Easier maintenance.
- Better scalability for large projects.

---

# Why We Use NX

NX is a monorepo management tool.

Without NX, developers must manually manage:

- Library dependencies
- Build order
- Testing
- Code sharing
- Project relationships

NX automates these tasks.

### Benefits

- Manages dependencies automatically.
- Builds projects in the correct order.
- Rebuilds only changed code.
- Provides workspace-wide tooling.
- Improves developer productivity.

---

# esbuild

## What is esbuild?

esbuild is a fast JavaScript and TypeScript bundler.

### Responsibilities

- Converts TypeScript to JavaScript.
- Bundles application files.
- Optimizes output.
- Compresses production builds.

### Build Flow

```text
TypeScript
HTML
SCSS
Libraries
      ↓
esbuild
      ↓
Optimized Build Files
```

### Benefits

- Very fast build times.
- Modern architecture.
- Reduced bundle size.
- Faster application loading.

---

# SCSS

## What is SCSS?

SCSS (Sassy CSS) is an extension of CSS that adds developer-friendly features.

### Features

#### Variables

```scss
$primary-color: blue;
```

#### Nesting

```scss
.card {
  .title {
  }

  .body {
  }
}
```

#### Mixins

```scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### Benefits

- Cleaner stylesheets.
- Reusable styling logic.
- Easier maintenance.
- Better organization for large projects.

---

# Jest

## What is Jest?

Jest is a unit testing framework.

### Purpose

Tests individual pieces of code in isolation.

Examples:

- Services
- Components
- Utility functions
- Pipes

### Workflow

```text
Write Test
      ↓
Run Jest
      ↓
Pass / Fail Result
```

### Benefits

- Detects broken code early.
- Supports automated testing.
- Improves code reliability.

---

# Playwright

## What is Playwright?

Playwright is an End-to-End (E2E) testing framework.

### Purpose

Tests the application as a real user would use it.

Examples:

- Login flow
- Navigation
- Form submission
- Page interactions

### Workflow

```text
Open Browser
      ↓
Perform User Actions
      ↓
Validate Results
```

### Benefits

- Tests complete user journeys.
- Detects UI and integration issues.
- Validates real browser behavior.

---

# Jest vs Playwright

| Feature          | Jest                  | Playwright             |
| ---------------- | --------------------- | ---------------------- |
| Testing Type     | Unit Testing          | End-to-End Testing     |
| Focus            | Individual Code Units | Complete Application   |
| Browser Required | No                    | Yes                    |
| Speed            | Fast                  | Slower                 |
| Purpose          | Verify Logic          | Verify User Experience |

---

# Summary

| Tool       | Purpose               |
| ---------- | --------------------- |
| NX         | Monorepo management   |
| esbuild    | Build and bundling    |
| SCSS       | Advanced CSS features |
| Jest       | Unit testing          |
| Playwright | End-to-end testing    |

## Together, these tools provide a scalable and maintainable foundation for modern Angular applications.

---

# Monorepo, NX, and Tooling Overview

## Why We Created a Monorepo

### Traditional Angular Structure

```text
my-app/
└── src/
    └── app/
```

All components, services, models, and features live in one application.

### Challenges

- Code is tightly coupled to a single application.
- Reusing components across projects is difficult.
- As the application grows, maintenance becomes harder.
- Shared functionality often gets duplicated.

### Monorepo Structure

```text
my-dms/
├── apps/
└── libs/
```

### Purpose

**apps/**

- Executable applications
- User-facing Angular applications

**libs/**

- Reusable components
- Shared services
- Shared models
- Common utilities

### Benefits

- Reuse code across multiple applications.
- Keep shared functionality in one place.
- Easier maintenance.
- Better scalability for large projects.

---

# Why We Use NX

NX is a monorepo management tool.

Without NX, developers must manually manage:

- Library dependencies
- Build order
- Testing
- Code sharing
- Project relationships

NX automates these tasks.

### Benefits

- Manages dependencies automatically.
- Builds projects in the correct order.
- Rebuilds only changed code.
- Provides workspace-wide tooling.
- Improves developer productivity.

---

# esbuild

## What is esbuild?

esbuild is a fast JavaScript and TypeScript bundler.

### Responsibilities

- Converts TypeScript to JavaScript.
- Bundles application files.
- Optimizes output.
- Compresses production builds.

### Build Flow

```text
TypeScript
HTML
SCSS
Libraries
      ↓
esbuild
      ↓
Optimized Build Files
```

### Benefits

- Very fast build times.
- Modern architecture.
- Reduced bundle size.
- Faster application loading.

---

# SCSS

## What is SCSS?

SCSS (Sassy CSS) is an extension of CSS that adds developer-friendly features.

### Features

#### Variables

```scss
$primary-color: blue;
```

#### Nesting

```scss
.card {
  .title {
  }

  .body {
  }
}
```

#### Mixins

```scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### Benefits

- Cleaner stylesheets.
- Reusable styling logic.
- Easier maintenance.
- Better organization for large projects.

---

# Jest

## What is Jest?

Jest is a unit testing framework.

### Purpose

Tests individual pieces of code in isolation.

Examples:

- Services
- Components
- Utility functions
- Pipes

### Workflow

```text
Write Test
      ↓
Run Jest
      ↓
Pass / Fail Result
```

### Benefits

- Detects broken code early.
- Supports automated testing.
- Improves code reliability.

---

# Playwright

## What is Playwright?

Playwright is an End-to-End (E2E) testing framework.

### Purpose

Tests the application as a real user would use it.

Examples:

- Login flow
- Navigation
- Form submission
- Page interactions

### Workflow

```text
Open Browser
      ↓
Perform User Actions
      ↓
Validate Results
```

### Benefits

- Tests complete user journeys.
- Detects UI and integration issues.
- Validates real browser behavior.

---

# Jest vs Playwright

| Feature          | Jest                  | Playwright             |
| ---------------- | --------------------- | ---------------------- |
| Testing Type     | Unit Testing          | End-to-End Testing     |
| Focus            | Individual Code Units | Complete Application   |
| Browser Required | No                    | Yes                    |
| Speed            | Fast                  | Slower                 |
| Purpose          | Verify Logic          | Verify User Experience |

---

# Summary

| Tool       | Purpose               |
| ---------- | --------------------- |
| NX         | Monorepo management   |
| esbuild    | Build and bundling    |
| SCSS       | Advanced CSS features |
| Jest       | Unit testing          |
| Playwright | End-to-end testing    |

## Together, these tools provide a scalable and maintainable foundation for modern Angular applications.

---

# Project Folder Structure

```text
my-dms/
│
├── apps/
│   └── my-dms-app/
│       ├── src/
│       │   ├── app/
│       │   ├── assets/
│       │   ├── environments/
│       │   ├── index.html
│       │   └── main.ts
│       │
│       ├── project.json
│       └── tsconfig.app.json
│
├── libs/
│   ├── my-components/
│   ├── my-services/
│   └── my-shared/
│
├── node_modules/
├── package.json
├── nx.json
├── tsconfig.json
└── tsconfig.base.json
```

---

# apps/

Contains runnable Angular applications.

```text
apps/
└── my-dms-app/
```

Main application users access in the browser.

---

# src/

Application source code.

```text
src/
├── app/
├── assets/
├── environments/
├── index.html
└── main.ts
```

---

# app/

Main Angular code.

```text
app/
├── app.component.ts
├── app.component.html
├── app.component.scss
├── app.config.ts
└── app.routes.ts
```

| File               | Purpose                   |
| ------------------ | ------------------------- |
| app.component.ts   | Root component            |
| app.component.html | Root template             |
| app.component.scss | Root styles               |
| app.config.ts      | Application configuration |
| app.routes.ts      | Route definitions         |

---

# assets/

Static files.

```text
assets/
└── app.config.json
```

Examples:

- Images
- Icons
- Configuration files

---

# environments/

Environment-specific settings.

```text
environments/
├── environment.ts
└── environment.prod.ts
```

| File                | Purpose              |
| ------------------- | -------------------- |
| environment.ts      | Development settings |
| environment.prod.ts | Production settings  |

---

# index.html

Main HTML page loaded by the browser.

```text
index.html
```

---

# main.ts

Angular application entry point.

```text
main.ts
```

Bootstraps the Angular application.

---

# libs/

Reusable code shared across applications.

```text
libs/
├── my-components/
├── my-services/
└── my-shared/
```

---

# my-components/

Reusable UI components.

```text
my-components/
├── document-list/
├── viewer/
├── upload/
└── search/
```

---

# my-services/

Reusable services.

```text
my-services/
├── acs-auth.service.ts
├── acs-nodes.service.ts
└── acs-search.service.ts
```

---

# my-shared/

Shared utilities and models.

```text
my-shared/
├── models/
└── utils/
```

---

# node_modules/

Installed npm packages.

```text
node_modules/
```

Contains Angular, ADF, NX, and other dependencies.

---

# package.json

Project dependencies and scripts.

```text
package.json
```

Examples:

- Angular packages
- ADF packages
- NX packages

---

# nx.json

NX workspace configuration.

```text
nx.json
```

Defines workspace-level settings.

---

# tsconfig.json

Base TypeScript configuration.

```text
tsconfig.json
```

---

# tsconfig.base.json

Shared TypeScript configuration for all projects.

```text
tsconfig.base.json
```

---

# ACS Data Flow

```text
app.config.json
        ↓
app.config.ts
        ↓
Service Layer
        ↓
ACS REST API
        ↓
Component
        ↓
Browser UI
```

### Flow

1. Configuration contains ACS URL.
2. Services call ACS APIs.
3. ACS returns data.
4. Components receive data.
5. UI displays the result.

---

# Quick Summary

| Folder/File    | Purpose                     |
| -------------- | --------------------------- |
| apps/          | Angular applications        |
| libs/          | Shared code                 |
| app/           | Main Angular code           |
| assets/        | Static files                |
| environments/  | Environment settings        |
| main.ts        | Application entry point     |
| package.json   | Dependencies                |
| nx.json        | NX configuration            |
| node_modules/  | Installed packages          |
| my-services/   | API communication           |
| my-components/ | UI components               |
| my-shared/     | Shared models and utilities |

```

```

---

---

# Project Folder Structure

```text id="yvf7pj"
my-dms/
│
├── apps/                          → Contains runnable applications
│
│   └── my-dms-app/                → Main Angular application
│       │
│       ├── src/
│       │   │
│       │   ├── app/               → Main Angular code
│       │   │   ├── app.component.ts      → Root component logic
│       │   │   ├── app.component.html    → Root template
│       │   │   ├── app.component.scss    → Root styles
│       │   │   ├── app.config.ts         → Providers and app setup
│       │   │   └── app.routes.ts         → Route definitions
│       │   │
│       │   ├── assets/            → Static files
│       │   │   └── app.config.json → ACS URL and application config
│       │   │
│       │   ├── environments/      → Environment settings
│       │   │   ├── environment.ts        → Development config
│       │   │   └── environment.prod.ts   → Production config
│       │   │
│       │   ├── index.html         → Browser entry HTML
│       │   └── main.ts            → Angular bootstrap entry point
│       │
│       ├── project.json           → NX project configuration
│       └── tsconfig.app.json      → TypeScript config for this app
│
├── libs/                          → Reusable code shared by apps
│   │
│   ├── my-components/             → Reusable UI components
│   │   ├── document-list/
│   │   ├── viewer/
│   │   ├── upload/
│   │   └── search/
│   │
│   ├── my-services/               → API and business logic
│   │   ├── acs-auth.service.ts
│   │   ├── acs-nodes.service.ts
│   │   └── acs-search.service.ts
│   │
│   └── my-shared/                 → Shared models and utilities
│       ├── models/
│       └── utils/
│
├── node_modules/                  → Installed npm packages
│   ├── @angular/                  → Angular framework
│   ├── @alfresco/                 → ADF packages
│   └── ...many other packages
│
├── package.json                   → Dependencies and npm scripts
│
├── nx.json                        → NX workspace configuration
│
├── tsconfig.json                  → Global TypeScript settings
│
└── tsconfig.base.json             → Shared TS config for all projects
```

---

# ACS Integration Flow

```text id="mqk39s"
app.config.json
      │
      └── Stores ACS URL
                │
                ▼
app.config.ts
      │
      └── Loads configuration
                │
                ▼
acs-nodes.service.ts
      │
      └── Calls ACS REST APIs
                │
                ▼
ACS Server (Docker)
      │
      └── Returns JSON data
                │
                ▼
document-list.component.ts
      │
      └── Displays data in UI
                │
                ▼
Browser
```

## Quick Revision

```text id="xwt0y0"
apps/            → Runnable applications
libs/            → Reusable code
components/      → UI
services/        → API calls
shared/          → Models & utilities
assets/          → Static files
environments/    → Environment configs
main.ts          → Application entry point
package.json     → Dependencies
nx.json          → NX settings
node_modules/    → Installed packages
```

---

---

# npm vs npx vs ng vs nx

Understanding these four tools is essential when working with Angular and NX projects.

---

# npm

**Full Form:** Node Package Manager

**Purpose:** Install and manage packages.

### Common Uses

```bash
npm install
npm install @angular/core
npm run start
```

### Responsibilities

- Install dependencies
- Manage `package.json`
- Manage `package-lock.json`
- Run project scripts

### Mental Model

```text
npm = Install & Manage Packages
```

---

# npx

**Full Form:** Node Package Executor

**Purpose:** Run packages without installing them globally.

### Common Uses

```bash
npx create-nx-workspace@latest my-dms
npx prettier --write .
```

### Responsibilities

- Execute packages temporarily
- Avoid global installations
- Useful for one-time commands

### Mental Model

```text
npx = Run Package Without Installing Globally
```

---

# ng

**Full Form:** Angular CLI

**Purpose:** Manage Angular applications.

### Common Uses

```bash
ng new my-app
ng generate component login
ng serve
ng build
```

### Responsibilities

- Create Angular projects
- Generate components and services
- Run Angular applications
- Build Angular applications

### Mental Model

```text
ng = Angular Project Manager
```

---

# nx

**Full Form:** NX Build System

**Purpose:** Manage monorepos and multiple projects.

### Common Uses

```bash
nx serve my-dms
nx build my-dms

nx generate @nx/angular:component login

nx graph

nx run-many --target=build
```

### Responsibilities

- Manage multiple applications
- Manage shared libraries
- Dependency tracking
- Build optimization
- Build caching
- Workspace management

### Mental Model

```text
nx = Monorepo Manager + Build System
```

---

# Comparison Table

| Feature                  | npm | npx | ng  | nx  |
| ------------------------ | --- | --- | --- | --- |
| Install packages         | ✅  | ❌  | ❌  | ❌  |
| Run packages temporarily | ❌  | ✅  | ❌  | ❌  |
| Create Angular apps      | ❌  | ❌  | ✅  | ✅  |
| Generate components      | ❌  | ❌  | ✅  | ✅  |
| Build Angular apps       | ❌  | ❌  | ✅  | ✅  |
| Manage multiple apps     | ❌  | ❌  | ❌  | ✅  |
| Manage libraries         | ❌  | ❌  | ❌  | ✅  |
| Build caching            | ❌  | ❌  | ❌  | ✅  |
| Monorepo support         | ❌  | ❌  | ❌  | ✅  |

---

# How They Work Together

```text
npm
 └── Installs packages

npx
 └── Runs packages temporarily

ng
 └── Manages Angular applications

nx
 └── Manages entire monorepo workspace
```

---

# Our Project Workflow

### Create Workspace

```bash
npx create-nx-workspace@latest my-dms
```

Used once to create the NX workspace.

---

### Install Dependencies

```bash
npm install
```

Installs all project dependencies.

---

### Run Application

```bash
nx serve my-dms
```

Starts the Angular application.

---

### Build Application

```bash
nx build my-dms
```

Creates a production build.

---

### Generate Components

```bash
nx generate @nx/angular:component login
```

Creates new Angular components inside the workspace.

---

# ng vs nx

### Angular Project

```text
Single App
    ↓
Use ng
```

### Enterprise Monorepo

```text
Multiple Apps
Multiple Libraries
Shared Code
    ↓
Use nx
```

---

# Quick Revision

```text
npm → Install packages

npx → Run package once

ng → Angular CLI

nx → Monorepo manager
```

---

# In Our Project

```text
✅ npm  → Install dependencies

✅ npx  → Create workspace

✅ nx   → Build, serve, generate

❌ ng   → Usually replaced by NX commands
```

---

---

# environment.ts vs tsconfig.json vs app.config.json

These files serve completely different purposes and are often confused.

---

# environment.ts

**Purpose:** Store environment-specific values.

Examples:

- API URLs
- Feature flags
- Production mode settings

### Example

```typescript
// environment.ts (Development)

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
};
```

```typescript
// environment.prod.ts (Production)

export const environment = {
  production: true,
  apiUrl: 'https://myserver.com',
};
```

### How It Works

Development build:

```bash
ng build
```

Uses:

```text
environment.ts
```

Production build:

```bash
ng build --configuration=production
```

Uses:

```text
environment.prod.ts
```

Angular automatically replaces the file during the build process.

### Simple Definition

```text
environment.ts = Different configuration values for different environments.
```

---

# tsconfig.json

**Purpose:** Configure the TypeScript compiler.

This file controls how TypeScript is converted into JavaScript.

### Examples

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext"
  }
}
```

### Responsibilities

- TypeScript compilation rules
- Strict mode settings
- Module configuration
- Path mappings
- Target JavaScript version

### Simple Definition

```text
tsconfig.json = Rules for converting TypeScript into JavaScript.
```

---

# app.config.json

**Purpose:** Runtime application configuration.

Typically used to store values loaded when the application starts.

### Example

```json
{
  "ecmHost": "http://localhost:8080"
}
```

### Responsibilities

- ACS URL
- External configuration
- Runtime settings

### Simple Definition

```text
app.config.json = Configuration loaded while the application is running.
```

---

# Comparison

| File            | Purpose                           |
| --------------- | --------------------------------- |
| environment.ts  | Development and production values |
| tsconfig.json   | TypeScript compiler configuration |
| app.config.json | Runtime application configuration |

---

# Quick Revision

```text
environment.ts
    ↓
Dev vs Production values

tsconfig.json
    ↓
TypeScript compilation rules

app.config.json
    ↓
Runtime application settings
```

---

# Common Mistake

❌ Incorrect:

```text
environment.ts converts TypeScript to JavaScript
```

✅ Correct:

```text
tsconfig.json converts/configures TypeScript compilation

environment.ts stores environment-specific values
```

---

---

# app.config.json & AppConfigService — Deep Dive

---

## 1. Why Do We Need It?

Before understanding what it is — understand **why it exists.**

When you build an Angular app with ADF (Alfresco Development Framework), your app needs to know:

- **Where is the Alfresco backend?** (server URL)
- **How should login work?** (Basic auth or OAuth)
- **How should the UI behave?** (sidenav state, language, etc.)

You could put all this inside `environment.ts` — but there is a **big problem:**

---

### The Problem with `environment.ts`:

```
Developer changes backend URL
        ↓
Must rebuild entire app
        ↓
Deploy again
        ↓
Time wasted
```

`environment.ts` is compiled **at build time.** Once built — it is locked inside the JavaScript bundle. You cannot change it without rebuilding.

---

### The Solution — `app.config.json`:

```
Developer changes backend URL in app.config.json
        ↓
No rebuild needed
        ↓
Refresh browser
        ↓
Done ✅
```

`app.config.json` is loaded **at runtime** — after the app starts in the browser. It is just a plain JSON file sitting on the server. Change it anytime without rebuilding.

---

### Simple Comparison:

|                           | `environment.ts` | `app.config.json` |
| ------------------------- | ---------------- | ----------------- |
| When loaded               | Build time       | Runtime           |
| Needs rebuild to change   | ✅ Yes           | ❌ No             |
| Can change on live server | ❌ No            | ✅ Yes            |
| Used by Angular           | ✅               | ❌                |
| Used by ADF               | ❌               | ✅                |
| Format                    | TypeScript       | JSON              |

---

## 2. What is `app.config.json`?

`app.config.json` is a **plain JSON configuration file** for your ADF application.

It lives in your app's `src/` folder and gets served as a static file.

### Basic Structure:

```json
{
  "ecmHost": "http://localhost:8080",
  "baseShareUrl": "http://localhost:8080",
  "providers": "ECM",
  "authType": "BASIC",
  "sideNav": {
    "preserveState": true,
    "expandedSidenav": true
  },
  "languages": [
    {
      "key": "en",
      "label": "English"
    }
  ]
}
```

### Key Properties Explained:

| Property                  | Purpose                | Example                 |
| ------------------------- | ---------------------- | ----------------------- |
| `ecmHost`                 | Alfresco backend URL   | `http://localhost:8080` |
| `providers`               | Which services to use  | `ECM` (content only)    |
| `authType`                | Login method           | `BASIC` or `OAUTH`      |
| `sideNav.preserveState`   | Remember sidenav state | `true`                  |
| `sideNav.expandedSidenav` | Default sidenav state  | `true`                  |
| `languages`               | Available languages    | `en`, `fr`, etc.        |

### Where it lives:

```
my-dms/
└── apps/
    └── my-dms/
        └── src/
            └── app.config.json   ← HERE
```

---

## 3. What is `AppConfigService`?

`AppConfigService` is an **ADF service** (from `@alfresco/adf-core`) that acts as the **bridge** between `app.config.json` and all other ADF services.

It does three things:

1. **Reads** `app.config.json` file via HTTP
2. **Stores** all values in memory
3. **Provides** values to any ADF service that needs them

### Think of it like this:

```
app.config.json          AppConfigService          ADF Services
(JSON file)        →→→   (bridge/reader)    →→→    (consumers)

{ ecmHost: ... }    reads    stores in memory    provides on demand
```

---

## 4. How It Works — Step by Step

### Step 1: App Starts

```
Browser opens your app
        ↓
Angular framework boots up
        ↓
Angular initializes all services
```

### Step 2: AppConfigService.load() is called automatically

ADF registers `AppConfigService` as an **APP_INITIALIZER** in Angular.

This means Angular calls it **automatically before anything else renders.**

```typescript
// ADF does this internally — you don't write this
{
    provide: APP_INITIALIZER,
    useFactory: () => appConfigService.load(),
    multi: true
}
```

### Step 3: app.config.json is fetched

```
AppConfigService makes HTTP request
        ↓
GET /app.config.json
        ↓
Server returns JSON file
        ↓
AppConfigService stores all values in memory
```

### Step 4: ADF Services read from AppConfigService

```typescript
// Inside AlfrescoApiService (ADF internal)
const backendUrl = this.appConfigService.get('ecmHost');
// → "http://localhost:8080"

// Inside SidenavLayoutComponent (ADF internal)
const isExpanded = this.appConfigService.get('sideNav.expandedSidenav');
// → true

// Inside AuthenticationService (ADF internal)
const authType = this.appConfigService.get('authType');
// → "BASIC"
```

### Step 5: App is fully ready

```
All ADF services now have their config values
        ↓
App renders login page
        ↓
User logs in
        ↓
ADF connects to backend using ecmHost
```

---

## 5. Full Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                  BROWSER                            │
│                                                     │
│  1. App starts                                      │
│         ↓                                           │
│  2. Angular boots                                   │
│         ↓                                           │
│  3. APP_INITIALIZER fires                           │
│         ↓                                           │
│  4. AppConfigService.load()                         │
│         ↓                                           │
│  5. GET app.config.json ──────────→ app.config.json │
│         ↓                ←──────── { ecmHost... }   │
│  6. Values stored in memory                         │
│         ↓                                           │
│  ┌──────────────────────────────┐                   │
│  │     AppConfigService         │                   │
│  │  memory: {                   │                   │
│  │    ecmHost: "localhost:8080" │                   │
│  │    authType: "BASIC"         │                   │
│  │    sideNav: { ... }          │                   │
│  │  }                           │                   │
│  └──────────┬───────────────────┘                   │
│             ↓                                       │
│  ┌──────────────────────────────┐                   │
│  │  ADF Services ask for values │                   │
│  │                              │                   │
│  │  AlfrescoApiService          │                   │
│  │  AuthenticationService       │                   │
│  │  SidenavLayoutComponent      │                   │
│  │  TranslationService          │                   │
│  └──────────────────────────────┘                   │
│             ↓                                       │
│  7. App fully configured & ready ✅                 │
└─────────────────────────────────────────────────────┘
```

---

## 6. How it Works in Simple Angular vs ADF Project

### Simple Angular Project (no ADF):

```typescript
// environment.ts — build time only
export const environment = {
  apiUrl: 'http://localhost:8080',
};

// component.ts
import { environment } from '../environments/environment';

@Component({})
export class MyComponent {
  constructor(private http: HttpClient) {
    // uses environment variable — locked at build time
    this.http.get(environment.apiUrl + '/api/data');
  }
}
```

Problems:

- Change URL → must rebuild ❌
- Different environments need different builds ❌

---

### ADF Project (with app.config.json):

```typescript
// app.config.json — runtime, change anytime
{
    "ecmHost": "http://localhost:8080"
}

// component.ts
import { AppConfigService } from '@alfresco/adf-core';

@Component({})
export class MyComponent {
    constructor(private appConfigService: AppConfigService) {
        // reads from memory — loaded from app.config.json at runtime
        const url = this.appConfigService.get('ecmHost');
        // → "http://localhost:8080"
    }
}
```

Benefits:

- Change URL → just edit JSON file ✅
- No rebuild needed ✅
- Works in all environments ✅

---

## 7. How ACA Uses It

ACA's `app.config.json` is much larger — it configures everything:

```json
{
    "ecmHost": "{protocol}//{hostname}{:port}",
    "providers": "ECM",
    "authType": "BASIC",
    "sideNav": {
        "preserveState": true,
        "expandedSidenav": true
    },
    "navigation": {
        "main": [...],
        "secondary": [...]
    },
    "content-metadata": {
        "presets": {...}
    },
    "search": [...],
    "languages": [...]
}
```

Notice `"{protocol}//{hostname}{:port}"` — this is a **template** that ADF resolves at runtime based on where the app is deployed. Very powerful.

---

## 8. In Our Project (my-dms)

We need to:

**1. Create `app.config.json` in:**

```
apps/my-dms/src/app.config.json
```

**2. Minimum content needed:**

```json
{
  "ecmHost": "http://localhost:8080",
  "providers": "ECM",
  "authType": "BASIC",
  "sideNav": {
    "preserveState": true,
    "expandedSidenav": true
  }
}
```

**3. Tell Angular to serve it as asset in `project.json`:**

```json
"assets": [
    "apps/my-dms/src/favicon.ico",
    "apps/my-dms/src/assets",
    "apps/my-dms/src/app.config.json"   ← ADD THIS
]
```

**Without step 3 — Angular build will ignore the file and ADF cannot find it.** ❌

---

## 9. Key Takeaways

| Point                            | Detail                                              |
| -------------------------------- | --------------------------------------------------- |
| `app.config.json` is runtime     | Loaded after app starts, not at build               |
| `AppConfigService` is the bridge | Reads file → stores in memory → serves to ADF       |
| Angular calls it automatically   | Via `APP_INITIALIZER` — you don't call it manually  |
| ADF services are consumers       | They ask `AppConfigService` for their config values |
| Must be declared as asset        | Otherwise Angular build ignores it                  |
| Change without rebuild           | Edit JSON on server → refresh browser → done        |

---

## _Part of: My DMS Project — Agent Knowledge Base_

---

# Setup Guide — app.config.json & project.json

---

## 1. app.config.json — How We Set It Up

### What we did:

We copied `app.config.json` directly from ACA into `my-dms`.

### Where we copied FROM (ACA):

```
alfresco-content-app/
└── app/
    └── src/
        └── app.config.json   ← copied from here
```

### Where we placed it (my-dms):

```
my-dms/
└── apps/
    └── my-dms/
        └── src/
            └── app.config.json   ← placed here
```

---

### Why we copied instead of writing from scratch:

- ACA is a **production grade** Alfresco app
- Its `app.config.json` is **fully tested and complete**
- Writing from scratch = high chance of missing properties
- Copying = **safe starting point** with all required config
- We only need to **modify** a few values for our environment

---

### What we modified after copying:

**Change 1 — `ecmHost`:**

ACA uses a dynamic template (for production deployment):

```json
"ecmHost": "{protocol}//{hostname}{:port}"
```

We changed to our local backend URL:

```json
"ecmHost": "http://localhost:8080"
```

**Why:** ACA's template resolves dynamically on the server. For local development we need a direct URL.

---

### What we kept as is:

| Property           | Value                 | Reason                          |
| ------------------ | --------------------- | ------------------------------- |
| `providers`        | `ECM`                 | We only need content management |
| `authType`         | `BASIC`               | Simple username/password login  |
| `sideNav`          | `preserveState: true` | Remember sidenav state          |
| `pagination`       | `size: 25`            | Standard page size              |
| `search-headers`   | full config           | Complex — copy as is            |
| `content-metadata` | full config           | Complex — copy as is            |
| `viewer`           | full config           | Copy as is                      |

---

### What we removed:

Nothing removed — copied everything as is for safety.

Future cleanup:

- `oauth2` section — not needed (using BASIC auth)
- `aosPlugin` — MS Office integration (needed later)

---

### Final app.config.json location:

```
apps/my-dms/src/app.config.json ✅
```

---

## 2. What is project.json — Deep Dive

### Definition:

`project.json` is the **NX configuration file for each individual app or library** inside the monorepo.

It tells NX:

- How to **build** this specific app/lib
- How to **serve** this specific app/lib
- How to **test** this specific app/lib
- What **assets** to include in the build
- What **styles** to include
- What **scripts** to include

---

### Why every app/lib has its own `project.json`:

In a monorepo each app/lib is **independent** — it has its own:

- Source folder
- Build output path
- Assets
- Test configuration
- Lint configuration

So each needs its own configuration file.

---

### nx.json vs project.json:

|          | `nx.json`          | `project.json`              |
| -------- | ------------------ | --------------------------- |
| Location | Workspace root     | Inside each app/lib folder  |
| Scope    | Entire workspace   | One specific app/lib        |
| Purpose  | Global NX settings | Individual app/lib settings |
| Count    | 1 per workspace    | 1 per app/lib               |

**Think of it like:**

```
nx.json          = Company rules (apply to everyone)
project.json     = Department rules (apply to that team only)
```

---

### Why so many project.json in ACA:

ACA is a large monorepo with many apps and libraries:

```
alfresco-content-app/
├── app/
│   └── project.json              ← main app
└── projects/
    ├── aca-content/
    │   └── project.json          ← content lib
    ├── aca-shared/
    │   └── project.json          ← shared lib
    ├── aca-folder-rules/
    │   └── project.json          ← folder rules lib
    ├── aca-preview/
    │   └── project.json          ← preview lib
    └── ...every lib has its own
```

**Rule: 1 app/lib = 1 project.json** ✅

---

### project.json structure explained:

```json
{
  "name": "my-dms",                    ← app/lib name (must match NX)
  "$schema": "...",                    ← JSON schema for validation
  "projectType": "application",        ← "application" or "library"
  "prefix": "app",                     ← component selector prefix
  "sourceRoot": "apps/my-dms/src",     ← where source files live
  "tags": [],                          ← NX tags for grouping
  "targets": {                         ← all available commands
    "build": { ... },                  ← nx build my-dms
    "serve": { ... },                  ← nx serve my-dms
    "test": { ... },                   ← nx test my-dms
    "lint": { ... },                   ← nx lint my-dms
    "extract-i18n": { ... }            ← extract translations
  }
}
```

---

### Key targets explained:

**build target:**

```json
"build": {
  "executor": "@angular-devkit/build-angular:application",
  "options": {
    "outputPath": "dist/apps/my-dms",      ← where built files go
    "index": "apps/my-dms/src/index.html", ← HTML entry point
    "browser": "apps/my-dms/src/main.ts",  ← TS entry point
    "assets": [...],                        ← files to copy as-is
    "styles": [...],                        ← global styles
    "scripts": [...]                        ← global scripts
  }
}
```

**serve target:**

```json
"serve": {
  "executor": "@angular-devkit/build-angular:dev-server",
  "configurations": {
    "development": {
      "buildTarget": "my-dms:build:development"  ← uses dev build config
    },
    "production": {
      "buildTarget": "my-dms:build:production"   ← uses prod build config
    }
  }
}
```

---

### Why you CANNOT copy ACA's project.json directly:

ACA's `project.json` has paths pointing to ACA's folder structure:

```json
"sourceRoot": "app/src",                    ← ACA path ❌
"index": "app/src/index.html",              ← ACA path ❌
"browser": "app/src/main.ts",               ← ACA path ❌
"outputPath": "dist/content-ce"             ← ACA output ❌
```

Our `my-dms` has different paths:

```json
"sourceRoot": "apps/my-dms/src",            ← our path ✅
"index": "apps/my-dms/src/index.html",      ← our path ✅
"browser": "apps/my-dms/src/main.ts",       ← our path ✅
"outputPath": "dist/apps/my-dms"            ← our output ✅
```

If you copy ACA's `project.json` → build looks for wrong paths → everything breaks ❌

---

## 3. Editing project.json — Adding app.config.json to Assets

### Why we need to edit project.json:

Angular build system **only automatically processes:**

- `.ts` files → compiles to JavaScript
- `.scss/.css` files → compiles to CSS

**Everything else** (JSON files, images, fonts, icons) must be **manually declared** in the `assets` array.

```
app.config.json is a JSON file
        ↓
Angular does NOT process it automatically
        ↓
Must declare in assets
        ↓
Angular copies it to build output
        ↓
Browser can fetch it
        ↓
AppConfigService reads it ✅
```

---

### What happens WITHOUT declaring in assets:

```
Angular builds app
        ↓
app.config.json NOT in assets → NOT copied to dist/
        ↓
Browser requests GET /app.config.json
        ↓
404 Not Found ❌
        ↓
AppConfigService.load() fails
        ↓
ADF services have no config
        ↓
App breaks completely ❌
```

---

### What happens WITH declaring in assets:

```
Angular builds app
        ↓
app.config.json IN assets → copied to dist/
        ↓
Browser requests GET /app.config.json
        ↓
File found ✅
        ↓
AppConfigService reads and stores config
        ↓
ADF services configured correctly
        ↓
App works ✅
```

---

### How we edited project.json:

**Found this section:**

```json
"assets": [
  {
    "glob": "**/*",
    "input": "apps/my-dms/public"
  }
],
```

**Changed to:**

```json
"assets": [
  {
    "glob": "**/*",
    "input": "apps/my-dms/public"
  },
  "apps/my-dms/src/assets",
  "apps/my-dms/src/app.config.json"
],
```

---

### Explaining each asset entry:

| Entry                                               | Purpose                                                   |
| --------------------------------------------------- | --------------------------------------------------------- |
| `{ "glob": "**/*", "input": "apps/my-dms/public" }` | Copies everything from `public/` folder (favicon etc.)    |
| `"apps/my-dms/src/assets"`                          | Copies entire assets folder (images, translations, fonts) |
| `"apps/my-dms/src/app.config.json"`                 | Copies ADF config file — **most important**               |

---

### Simple rule to remember:

> **If it is not `.ts` or `.scss` → declare it in assets → otherwise Angular ignores it.**

---

## 4. Current Project Status

| Task                                         | Status  |
| -------------------------------------------- | ------- |
| NX workspace created                         | ✅      |
| package.json merged and installed            | ✅      |
| app.config.json copied from ACA              | ✅      |
| app.config.json modified (ecmHost)           | ✅      |
| app.config.json added to project.json assets | ✅      |
| Git setup and pushed to GitHub               | ✅      |
| Run `nx serve my-dms`                        | ⬜ Next |

---

## 5. Next Steps

1. Run `nx serve my-dms` → verify app starts
2. Setup Angular app module with ADF imports
3. Build login page using ADF auth service
4. Connect to Alfresco backend
5. Test login works

---

_Part of: My DMS Project — Agent Knowledge Base_
_Last updated: app.config.json and project.json setup complete_

---

---
