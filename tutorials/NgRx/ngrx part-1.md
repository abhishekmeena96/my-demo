# NgRx Complete Learning Guide - File 1

# Foundations, State Management, Store, Actions, Reducers, Selectors

---

# Chapter 1 - What is State?

Before learning NgRx, you must understand State.

Most developers try to learn Actions, Reducers, Effects immediately and become confused because they never understood what State actually is.

---

## Simple Definition

State is simply data that can change over time.

Example:

```ts
let count = 0;
```

Current state:

```text
count = 0
```

After clicking Increment:

```ts
count++;
```

New state:

```text
count = 1
```

The value changed.

Therefore:

```text
count = State
```

---

## Important Clarification

Many beginners think:

```text
Variable ≠ State
```

This is incorrect.

Actually:

```text
State is data stored in variables.
```

Example:

```ts
let username = 'Abhishek';
```

Current state:

```text
username = Abhishek
```

Later:

```ts
username = 'John';
```

New state:

```text
username = John
```

State changed.

---

## Counter Example

```ts
export class CounterComponent {
  count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}
```

Current state:

```text
count = 0
```

After Increment:

```text
count = 1
```

After Increment again:

```text
count = 2
```

State keeps changing.

---

# Chapter 2 - Types of State

---

## Component State

Stored inside component.

```ts
export class UserComponent {
  username = 'Abhishek';
}
```

Only this component uses it.

---

## Shared State

Multiple components use same data.

Example:

```text
Navbar
Profile
Dashboard
Settings
```

All need:

```text
Current Logged In User
```

This becomes shared state.

---

## Application State

Global state used by entire application.

Examples:

```text
Logged In User
Language
Theme
Permissions
Notifications
Cart
```

These usually become NgRx state.

---

# Chapter 3 - What is State Management?

State changes continuously.

Someone must manage:

```text
Creating State
Updating State
Sharing State
Tracking State
```

This process is called:

```text
State Management
```

---

## Without State Management

Example:

```text
App
 ├── Navbar
 ├── Dashboard
 ├── Profile
 └── Settings
```

User information exists in App.

```ts
user = {
  name: 'Abhishek',
};
```

Now:

```text
Navbar needs user
Dashboard needs user
Profile needs user
Settings needs user
```

Problem begins.

---

# Chapter 4 - Angular Without NgRx

---

## Approach 1 - Component Inputs

```text
App
 ├── Navbar
 ├── Dashboard
 ├── Profile
```

Pass user everywhere.

```ts
<app-navbar [user]="user"></app-navbar>
```

Works for small applications.

---

### Problems

Large applications:

```text
App
 ├── Layout
 │   ├── Shell
 │   │   ├── Navbar
 │   │   ├── Sidebar
 │   │   └── Dashboard
```

Now data travels through many layers.

Called:

```text
Prop Drilling
```

Becomes difficult.

---

## Approach 2 - Services

Angular developers usually move state into services.

```ts
@Injectable()
export class UserService {
  user = {
    name: 'Abhishek',
  };
}
```

Usage:

```ts
constructor(private userService: UserService){}
```

---

### Benefits

Easy sharing.

```text
Component A
Component B
Component C
```

All use same service.

---

### Problems in Large Applications

Imagine ACA size project.

Hundreds of components.

Many services.

Many API calls.

Eventually:

```text
Who changed state?
When?
Why?
```

becomes difficult.

---

# Chapter 5 - Why NgRx Exists

NgRx solves:

```text
Centralized State
Predictable Updates
Debugging
Scalability
```

Instead of:

```text
Component
Service
Component
Service
Service
Component
```

everything becomes:

```text
Store
```

---

# Chapter 6 - What is Store?

Store is the central container of application state.

Think:

```text
Database
```

but inside browser memory.

---

Example:

```ts
{
  user: {},
  products: [],
  cart: [],
  settings: {}
}
```

This entire object is Store.

---

## Visualization

```text
Store
│
├── user
├── products
├── cart
└── settings
```

Everything lives here.

---

# Chapter 7 - Store Philosophy

NgRx follows:

```text
Single Source of Truth
```

Meaning:

```text
One Official Place For State
```

Not:

```text
Component A copy
Component B copy
Component C copy
```

Instead:

```text
Store
```

One source.

---

# Chapter 8 - Actions

Action = Event.

Action describes:

```text
What Happened?
```

Not:

```text
How To Change State?
```

---

Examples:

```text
Increment Counter
Load Users
Login Success
Delete Product
```

Actions describe events.

---

## Create Action

```ts
export const increment = createAction('[Counter] Increment');
```

---

Another:

```ts
export const decrement = createAction('[Counter] Decrement');
```

---

With Data

```ts
export const loadUserSuccess = createAction('[User API] Load Success', props<{ user: User }>());
```

---

# Chapter 9 - Why Actions Exist

Without actions:

```ts
count++;
```

works.

But in enterprise applications:

```text
Who changed count?
```

Unknown.

---

With actions:

```ts
store.dispatch(increment());
```

Now history exists.

```text
Increment happened
```

Everything becomes traceable.

---

# Chapter 10 - Dispatch

Dispatch means:

```text
Send Action To Store
```

Example:

```ts
increment() {
  this.store.dispatch(increment());
}
```

Flow:

```text
Component
    ↓
Dispatch
    ↓
Action
```

---

# Chapter 11 - Reducers

Reducer updates state.

Think:

```text
State Change Logic
```

lives here.

---

Example State

```ts
export interface CounterState {
  count: number;
}
```

---

Initial State

```ts
export const initialState: CounterState = {
  count: 0,
};
```

---

Reducer

```ts
export const counterReducer = createReducer(
  initialState,

  on(increment, (state) => ({
    ...state,
    count: state.count + 1,
  })),

  on(decrement, (state) => ({
    ...state,
    count: state.count - 1,
  })),
);
```

---

# Chapter 12 - Reducer Rules

Reducers must be:

```text
Pure
Predictable
Synchronous
```

Reducers MUST NOT:

```text
Call APIs
Call Services
Use Timers
```

Wrong:

```ts
on(loadUsers, () => {

  this.http.get(...)

})
```

Never.

---

# Chapter 13 - Reducer Workflow

User clicks:

```text
Increment
```

Component:

```ts
dispatch(increment());
```

Flow:

```text
Component
    ↓
Action
    ↓
Reducer
```

Reducer receives:

```text
Current State
Action
```

Produces:

```text
New State
```

---

Visualization:

```text
Old State
count = 0

     +
Action
Increment

     ↓

New State
count = 1
```

---

# Chapter 14 - Selectors

Store contains everything.

But components usually need only small pieces.

Selector extracts data.

---

Example Store

```ts
{
  user: {},
  products: [],
  cart: []
}
```

Component only needs:

```text
products
```

Selector returns products.

---

## Create Selector

```ts
export const selectCounterState = (state: AppState) => state.counter;
```

---

Another:

```ts
export const selectCount = createSelector(selectCounterState, (state) => state.count);
```

---

# Chapter 15 - Why Selectors Exist

Without selectors:

```ts
store.select((state) => state.counter.count);
```

everywhere.

Messy.

---

Selectors centralize access.

```ts
store.select(selectCount);
```

Cleaner.

Reusable.

---

# Chapter 16 - Complete NgRx Flow

Most Important Diagram

```text
User Click
    ↓
Component
    ↓
Dispatch Action
    ↓
Action
    ↓
Reducer
    ↓
Store Updated
    ↓
Selector
    ↓
Component Receives Data
    ↓
UI Updates
```

---

Counter Example

```text
Count = 0

User Clicks Increment

Component
    ↓
dispatch(increment())
    ↓
Reducer
    ↓
count = 1
    ↓
Selector
    ↓
Component
    ↓
HTML
```

Screen updates.

---

# Chapter 17 - Folder Structure (Typical)

```text
src/app/store

├── actions
│   └── counter.actions.ts
│
├── reducers
│   └── counter.reducer.ts
│
├── selectors
│   └── counter.selectors.ts
│
├── state
│   └── counter.state.ts
│
└── index.ts
```

Responsibilities:

```text
actions
    Events

reducers
    State updates

selectors
    Read state

state
    Interfaces
```

---

# Chapter 18 - What You Must Understand Before Moving To Effects

You should now understand:

```text
State
State Management
Store
Actions
Dispatch
Reducers
Selectors
```

And the most important workflow:

```text
Component
    ↓
Action
    ↓
Reducer
    ↓
Store
    ↓
Selector
    ↓
Component
```

This workflow is the foundation of all NgRx.

Everything else (Effects, DevTools, Router Store, Feature Stores, ACA Architecture) builds on top of this flow.
