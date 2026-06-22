# ACA + NgRx Deep Dive

# Part 1 - Root Architecture Mapping

---

# Goal Of This Document

Most developers learn NgRx first and ACA later.

The problem is:

```text
I understand NgRx.

But when I open ACA source code,
I don't know where Store starts,
where Effects are registered,
or how ACS is connected.
```

This document maps ACA architecture to NgRx concepts.

---

# Step 1 - Understand ACA Is Not A Normal Angular Application

Normal Angular App:

```text
src
│
├── app
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
│
└── main.ts
```

Most tutorials teach this structure.

---

ACA is different.

ACA is:

```text
Monorepo
```

Simplified:

```text
projects
│
├── aca-content
├── aca-shared
├── aca-testing
├── aca-login
└── libraries
```

ACA is much larger than a normal Angular application.

---

# Step 2 - ACA Startup Flow

When Browser Opens ACA

```text
Browser
   ↓
Angular Bootstrap
   ↓
ContentServiceExtensionModule
   ↓
AppStoreModule
   ↓
NgRx Registration
   ↓
Application Ready
```

This is the first important relationship.

---

# Step 3 - The Most Important ACA File

File:

```text
projects/
└── aca-content/
    └── src/
        └── lib/
            └── store/
                └── app-store.module.ts
```

Purpose:

```text
Register NgRx
```

Think:

```text
app-store.module.ts
=
NgRx Bootstrap File
```

---

# Step 4 - AppStoreModule

ACA contains something similar to:

```ts
@NgModule({
  providers: [provideStore({ app: appReducer }), provideRouterStore({ stateKey: 'router' }), provideEffects([AppEffects, NodeEffects, SearchEffects, DownloadEffects, UploadEffects, RouterEffects])],
})
export class AppStoreModule {}
```

---

# Understanding provideStore()

This line:

```ts
provideStore({
  app: appReducer,
});
```

creates:

```ts
{
  app: {
  }
}
```

inside NgRx Store.

---

Think:

```text
Store
│
└── app
```

At runtime:

```ts
{
 app:{
   ...
 }
}
```

---

# Understanding appReducer

Many beginners think:

```text
appReducer = Store
```

Wrong.

Actually:

```text
appReducer
=
One Slice Of Store
```

Store is bigger.

---

Example:

```ts
{
 app:{},
 router:{},
 search:{},
 nodes:{}
}
```

Store is the complete object.

Reducer manages only one section.

---

# Understanding provideEffects()

ACA registers:

```ts
provideEffects([AppEffects, NodeEffects, SearchEffects, DownloadEffects, UploadEffects, RouterEffects]);
```

Many developers think:

```text
Many Effects
=
Many Stores
```

Wrong.

---

Reality:

```text
One Store
Many Features
```

---

Example:

```text
Search Feature
  ↓
SearchEffects

Node Feature
  ↓
NodeEffects

Upload Feature
  ↓
UploadEffects
```

Each Effect handles one business area.

---

# Understanding provideRouterStore()

ACA also registers:

```ts
provideRouterStore({
  stateKey: 'router',
});
```

This creates:

```ts
{
 app:{},
 router:{}
}
```

inside Store.

---

# What Router Store Saves

Suppose URL is:

```text
/folder/123?sort=name
```

Angular Router knows:

```text
id=123
sort=name
```

Router Store copies this information into NgRx.

Runtime Store:

```ts
{
 router:{
   url:'/folder/123',

   params:{
     id:'123'
   },

   queryParams:{
     sort:'name'
   }
 }
}
```

---

# Why ACA Uses Router Store

Without Router Store:

```text
Effect
  ↓
Needs URL
  ↓
Inject ActivatedRoute
```

Again and again.

---

With Router Store:

```text
Effect
  ↓
Read Store
```

Cleaner.

More scalable.

---

# Step 5 - Where AppStoreModule Is Loaded

Another important ACA file:

```text
ContentServiceExtensionModule
```

Contains:

```ts
imports: [ContentModule.forRoot(), AppStoreModule, HammerModule];
```

---

Meaning:

```text
ContentServiceExtensionModule
         ↓
imports
         ↓
AppStoreModule
         ↓
provideStore()
provideEffects()
provideRouterStore()
```

This is how ACA gets NgRx.

---

# ACA Root Architecture Diagram

```text
Browser
   ↓
Angular Bootstrap
   ↓
ContentServiceExtensionModule
   ↓
AppStoreModule
   │
   ├── provideStore()
   │
   ├── provideEffects()
   │
   └── provideRouterStore()
   ↓
NgRx Store Created
```

---

# Understanding ACA Store Mentally

Do NOT think:

```text
Store = File
```

Think:

```text
Store = Runtime Object
```

Example:

```ts
{
 app:{},
 router:{},
 search:{},
 nodes:{},
 uploads:{},
 downloads:{}
}
```

This object exists in browser memory.

Files are only used to build it.

---

# Why ACA Has Many Store Files

You will see:

```text
app.reducer.ts

search.reducer.ts

node.reducer.ts

upload.reducer.ts

download.reducer.ts
```

This does NOT mean:

```text
Multiple Stores
```

Instead:

```text
One Store
Many State Slices
```

Example:

```text
Store
│
├── app
├── search
├── nodes
├── uploads
└── downloads
```

---

# Why ACA Has Many Effects

You will see:

```text
AppEffects

NodeEffects

SearchEffects

UploadEffects

DownloadEffects

RouterEffects
```

This does NOT mean:

```text
Many Applications
```

Instead:

```text
Each Effect File
=
One Business Area
```

Example:

```text
SearchEffects
=
Search Logic
```

```text
NodeEffects
=
Folder Logic
```

```text
UploadEffects
=
Upload Logic
```

---

# ACA NgRx Mental Model

When reading ACA source code, always think:

```text
Component
   ↓
dispatch()
   ↓
Action
   ↓
Effect
   ↓
Service
   ↓
ACS API
   ↓
Success Action
   ↓
Reducer
   ↓
Store
   ↓
Selector
   ↓
Component
```

Everything in ACA follows this pattern.

---

# What We Will Explore Next

Next document:

```text
ACA Search Workflow
```

We will trace:

```text
Search Component
    ↓
dispatch(search)
    ↓
SearchEffects
    ↓
Search Service
    ↓
ACS Search API
    ↓
searchSuccess
    ↓
Reducer
    ↓
Store
    ↓
Selector
    ↓
UI
```

This will be the first real end-to-end ACA feature walkthrough.
