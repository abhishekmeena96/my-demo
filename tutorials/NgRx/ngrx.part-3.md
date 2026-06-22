# ACA + NgRx Architecture Guide

# File 3 - How Alfresco ACA Uses NgRx

---

# Introduction

Now we stop learning generic NgRx.

From this point onward we focus on:

```text
How ACA uses NgRx
```

This is the part that confuses most developers because ACA is:

```text
Large Enterprise Application
Monorepo
Many Libraries
Many Features
Many Store Files
Many Effects
Many Routes
```

When developers open ACA source code for the first time, they usually ask:

```text
Why are there so many store files?

Why are there so many reducers?

Why are there so many effects?

Where is the main store?

Where is AppModule?

Why does ACA use NgModule and Standalone together?

How does ACS connect to NgRx?
```

This document answers those questions.

---

# Chapter 1 - First Understand ACA Architecture

Before NgRx:

Understand ACA structure.

Simplified:

```text
ACA
│
├── aca-content
├── aca-shared
├── aca-login
├── aca-search
├── aca-testing
├── extensions
└── libraries
```

ACA is not a small Angular application.

ACA is a:

```text
Monorepo
```

---

# What Is A Monorepo?

Normal Angular application:

```text
src
│
├── app
├── assets
└── environments
```

Single application.

---

ACA:

```text
projects
│
├── aca-content
├── aca-shared
├── aca-testing
├── ...
```

Multiple libraries.

Multiple features.

Everything inside one repository.

---

# Why This Confuses Beginners

Because they expect:

```text
app.module.ts
app.component.ts
main.ts
```

Instead they see:

```text
content module
store module
extension module
library module
shared module
```

Many modules.

This is normal enterprise architecture.

---

# Chapter 2 - ACA Startup Flow

Simplified startup:

```text
Browser
   ↓
Angular Bootstraps
   ↓
ContentServiceExtensionModule
   ↓
AppStoreModule
   ↓
NgRx Registered
```

This is the first important connection.

---

# Chapter 3 - The NgRx Registration Location

You found:

```ts
@NgModule({
  providers: [provideStore({ app: appReducer }), provideRouterStore({ stateKey: 'router' }), provideEffects([AppEffects, NodeEffects, SearchEffects, RouterEffects])],
})
export class AppStoreModule {}
```

File:

```text
projects/aca-content/src/lib/store/app-store.module.ts
```

This is the ACA NgRx entry point.

Think:

```text
AppStoreModule
=
NgRx Registration Module
```

---

# Chapter 4 - Why AppStoreModule Exists

Job of AppStoreModule:

```text
Register Store
Register Effects
Register Router Store
```

Nothing more.

Think:

```text
DatabaseModule
```

for NgRx.

---

# Chapter 5 - How ACA Loads AppStoreModule

You found:

```ts
imports: [ContentModule.forRoot(), AppStoreModule, HammerModule];
```

inside:

```text
ContentServiceExtensionModule
```

Flow:

```text
ContentServiceExtensionModule
        ↓ imports
AppStoreModule
        ↓
provideStore()
provideEffects()
provideRouterStore()
```

Therefore:

```text
ACA gets NgRx through AppStoreModule
```

---

# Chapter 6 - Understanding ACA Store Structure

Registration:

```ts
provideStore({
  app: appReducer,
});
```

Creates:

```ts
{
  app: {
  }
}
```

inside Store.

Store now contains:

```ts
{
  app: {
  }
}
```

This is Root State.

---

# Chapter 7 - Router Store Registration

ACA also registers:

```ts
provideRouterStore({
  stateKey: 'router',
});
```

Result:

```ts
{
 app:{},
 router:{}
}
```

Now Store contains:

```text
Application State
+
Router State
```

---

# Chapter 8 - What Is Router State?

Suppose URL:

```text
/folder/123?sort=name
```

Angular Router knows:

```text
id=123
sort=name
```

Router Store copies it.

Store becomes:

```ts
{
 app:{},

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

ACA can read route information directly from Store.

---

# Chapter 9 - Why ACA Uses Router Store

Without Router Store:

Effects need:

```ts
ActivatedRoute;
```

Everywhere.

Messy.

---

With Router Store:

```text
Store
   ↓
Route Information
```

Effects and Selectors can read route data.

Much cleaner.

---

# Chapter 10 - The Most Important ACA Concept

Most beginners think:

```text
Store
=
Single File
```

Wrong.

Store is:

```text
Runtime Object
```

Not a file.

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

This entire object is Store.

---

Files are only used to build Store.

---

# Chapter 11 - Why ACA Has Many Store Files

This is probably your biggest confusion.

You see:

```text
app.reducer.ts

search.reducer.ts

node.reducer.ts

router.effects.ts

search.effects.ts

node.effects.ts
```

and think:

```text
Multiple Stores?
```

No.

---

Think:

```text
One Store
Many Features
```

Diagram:

```text
Store
│
├── App State
├── Search State
├── Node State
├── Router State
└── Upload State
```

Still one Store.

---

# Chapter 12 - ACA Feature Organization

ACA separates by feature.

Example:

```text
Search
```

gets:

```text
search.actions.ts

search.reducer.ts

search.effects.ts

search.selectors.ts
```

---

Upload feature:

```text
upload.actions.ts

upload.reducer.ts

upload.effects.ts

upload.selectors.ts
```

---

This is not:

```text
Multiple Stores
```

This is:

```text
One Store
Many Feature States
```

---

# Chapter 13 - Understanding ACA Effects

You found:

```ts
provideEffects([AppEffects, NodeEffects, SearchEffects, DownloadEffects, UploadEffects, RouterEffects]);
```

Many developers panic.

---

Reality:

Each Effect handles one business area.

Example:

```text
SearchEffects
=
Search Logic
```

```text
NodeEffects
=
Node Logic
```

```text
DownloadEffects
=
Download Logic
```

---

# Chapter 14 - Example Search Flow

Imagine user clicks search.

Flow:

```text
User
 ↓
Search Component
 ↓
dispatch(search())
 ↓
SearchEffects
 ↓
Search Service
 ↓
ACS API
 ↓
searchSuccess()
 ↓
SearchReducer
 ↓
Store
 ↓
Selector
 ↓
UI
```

This is real enterprise NgRx.

---

# Chapter 15 - Example Folder Navigation Flow

User clicks folder.

```text
Folder Click
      ↓
Action
      ↓
NodeEffects
      ↓
Nodes API
      ↓
Success Action
      ↓
Reducer
      ↓
Store Updated
      ↓
Selector
      ↓
Document List Updated
```

This is likely one of the most common ACA flows.

---

# Chapter 16 - How ACS Connects To ACA

Many beginners think:

```text
Component
 ↓
ACS
```

Wrong.

ACA usually follows:

```text
Component
 ↓
Action
 ↓
Effect
 ↓
Service
 ↓
ACS REST API
 ↓
Effect
 ↓
Reducer
 ↓
Store
 ↓
Selector
 ↓
Component
```

NgRx sits in the middle.

---

# Chapter 17 - Real ACA Mental Model

Instead of thinking:

```text
Component calls API
```

think:

```text
Component
   ↓
Dispatches Event

Effect
   ↓
Calls API

Reducer
   ↓
Updates State

Selector
   ↓
Provides Data
```

This mindset is critical.

---

# Chapter 18 - How To Trace ACA Code

Suppose you find:

```ts
store.dispatch(...)
```

Do this:

Step 1

Find action.

```ts
createAction(...)
```

---

Step 2

Search action usage.

Usually:

```ts
ofType(...)
```

inside Effect.

---

Step 3

Follow service call.

```ts
nodeService;
searchService;
uploadService;
```

---

Step 4

Find success action.

```ts
searchSuccess;
```

---

Step 5

Find reducer.

```ts
on(searchSuccess,...)
```

---

Step 6

Find selector.

```ts
createSelector(...)
```

---

Step 7

Find component consuming selector.

```ts
store.select(...)
```

Complete chain discovered.

---

# Chapter 19 - ACA NgRx Debugging Strategy

When confused:

Start here:

```text
AppStoreModule
```

Then:

```text
Actions
```

Then:

```text
Effects
```

Then:

```text
Reducers
```

Then:

```text
Selectors
```

Then:

```text
Components
```

Never start from random files.

---

# Chapter 20 - Search Keywords For ACA

Useful searches:

```text
provideStore(
```

Find Store registration.

---

```text
provideEffects(
```

Find Effect registration.

---

```text
provideRouterStore(
```

Find Router Store.

---

```text
createAction(
```

Find Actions.

---

```text
ofType(
```

Find Effects.

---

```text
createReducer(
```

Find Reducers.

---

```text
createSelector(
```

Find Selectors.

---

```text
store.dispatch(
```

Find Event Sources.

---

```text
store.select(
```

Find Data Consumers.

---

# Chapter 21 - ACA NgRx Architecture Summary

The entire ACA architecture can be summarized as:

```text
ContentServiceExtensionModule
        ↓
AppStoreModule
        ↓
provideStore()
provideEffects()
provideRouterStore()

        ↓

Store
│
├── app
├── router
├── search
├── nodes
├── uploads
└── ...

        ↓

Component
        ↓
Action
        ↓
Effect
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

If you understand this diagram, you understand the core relationship between ACA and NgRx.

---

# What To Study Next In ACA

Recommended order:

```text
1. AppStoreModule

2. app.reducer.ts

3. AppEffects

4. NodeEffects

5. SearchEffects

6. RouterEffects

7. Search Selectors

8. Node Selectors

9. Components using dispatch()

10. Components using select()
```

This order will give you the fastest understanding of ACA's NgRx architecture.
