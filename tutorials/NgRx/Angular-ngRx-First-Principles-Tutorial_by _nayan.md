# Angular ngRx — A Tutorial from First Principles

> "Start with why ngRx exists, not with how to import it."

---

## Table of Contents

1. [The Problem: State in Vanilla JavaScript](#1-the-problem-state-in-vanilla-javascript)
2. [The Simple Angular Way (No ngRx)](#2-the-simple-angular-way-no-ngrx)
3. [Where Simple Angular Breaks Down](#3-where-simple-angular-breaks-down)
4. [Enter ngRx: What It Solves](#4-enter-ngrx-what-it-solves)
5. [RxJS vs ngRx — They Are NOT the Same Thing](#5-rxjs-vs-ngrx-they-are-not-the-same-thing)
6. [Core ngRx Building Blocks (Standalone)](#6-core-ngrx-building-blocks-standalone)
7. [How Everything Connects Together](#7-how-everything-connects-together)
8. [A Complete Working Example](#8-a-complete-working-example)
9. [When to Use (and When NOT to Use) ngRx](#9-when-to-use-and-when-not-to-use-ngrx)

---

## 1. The Problem: State in Vanilla JavaScript

### Let's start without Angular. Just plain JavaScript.

Imagine you're building a todo app. In vanilla JS, you might do this:

```javascript
// State lives in a plain variable
let todos = [];
let filter = 'all';
let userId = 1;

// A function to add a todo — it MUTATES the state directly
function addTodo(text) {
  todos.push({
    id: Date.now(),
    text,
    done: false,
  });
  render();
}

// Another function to toggle
function toggleTodo(id) {
  todos.forEach((todo) => {
    if (todo.id === id) {
      todo.done = !todo.done;
    }
  });
  render();
}

// And a render function that reads state and updates the DOM
function render() {
  const container = document.getElementById('app');
  container.innerHTML = `
    <h1>Todos (${filter})</h1>
    <ul>
      ${todos
        .filter((t) => filter === 'all' || (filter === 'done' && t.done) || (filter === 'active' && !t.done))
        .map((t) => `<li>${t.text} ${t.done ? '✓' : ''}</li>`)
        .join('')}
    </ul>
  `;
}
```

### So what's wrong with this?

For a tiny demo, nothing. But real apps have problems:

| Problem                       | What Happens                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| **No single source of truth** | State is scattered across `let` variables, closures, DOM attributes, and component class properties. |
| **Mutation is silent**        | Any function can call `todos.push(...)` and no one knows. Who called this? When? Why?                |
| **No undo/history**           | You overwrote state; the old values are gone.                                                        |
| **No replay/debugging**       | You can't step through "what happened" because mutations are fire-and-forget.                        |
| **Testing is hard**           | `addTodo()` does DOM updates AND state mutation mixed together.                                      |
| **Time travel is impossible** | You don't have a log of "what happened."                                                             |

### The core insight

> **The biggest problem in complex apps isn't rendering — it's tracking WHO changed WHAT, WHEN, and WHY.**

This is the problem ngRx was built to solve.

---

## 2. The Simple Angular Way (No ngRx)

### Let's move to Angular (without ngRx)

```typescript
// todo.model.ts
export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// todo.service.ts — the "service" pattern
@Injectable({ providedIn: 'root' })
export class TodoService {
  private todos: Todo[] = [];
  private filter = 'all';

  getTodos() {
    return this.todos.filter(t => this.filter === 'all' || /* ... */);
  }

  addTodo(text: string) {
    this.todos.push({ id: Date.now(), text, done: false });
  }

  toggleTodo(id: number) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
  }

  setFilter(f: string) {
    this.filter = f;
  }
}

// todo-list.component.ts
@Component({
  selector: 'app-todo-list',
  template: `
    <h2>Todos</h2>
    <input (keyup.enter)="addTodo(input.value)" #input />
    <ul>
      <li *ngFor="let todo of todos">
        {{ todo.text }}
        <button (click)="toggle(todo.id)">{{ todo.done ? '✓' : '○' }}</button>
      </li>
    </ul>
  `
})
export class TodoListComponent {
  todos: Todo[] = [];

  constructor(private todoService: TodoService) {
    this.todos = todoService.getTodos();
  }

  addTodo(text: string) {
    this.todoService.addTodo(text);
    this.todos = this.todoService.getTodos();  // 🚨 manual refresh
  }

  toggle(id: number) {
    this.todoService.toggleTodo(id);
    this.todos = this.todoService.getTodos();  // 🚨 manual refresh
  }
}
```

### What this gets us — and does NOT get us

**What's good:**

- Shared state in a single service (better than vanilla JS).
- Components inject the same service, so they share data.
- Simple to understand.
- No extra library.

**What's broken:**

- **Manual refresh problem:** After every service mutation, you must set `this.todos = ...` to see the change. If you forget → stale UI. This is called "sync drift."
- **No history:** You still mutate `private todos` in-place. No record of what happened.
- **No undo:** Same problem. No log.
- **Tight coupling:** The component knows about `TodoService` and calls `getTodos()` after every action. Every derived component does this.
- **Debugging is opaque:** If `todos` is wrong, you have no way to ask "what actions were taken before it went wrong?"

This works fine for small apps. Up to a point where it doesn't.

---

## 3. Where Simple Angular Breaks Down

You'll hit these wall moments:

### Wall #1: Shared state across deep component trees

```
AppComponent
  └── DashboardComponent
       └── UserProfileComponent
            └── SettingsComponent
                 └── NotificationPreferencesComponent
```

Component A at the top and Component Z at the bottom need shared state. You could pass it through every level (prop drilling), inject a service everywhere, or... ngRx gives them both a direct read/write path via the Store.

### Wall #2: "Why didn't my UI update?"

In the simple service pattern, you must remember to call `getTodos()` after every mutation. Miss one, and a sibling component shows stale data. ngRx eliminates this by design — state changes flow through a single, predictable path.

### Wall #3: You need to undo/redo, or time-travel debug

With ngRx, every state change is recorded as an action. You can replay from the beginning.

### Wall #4: You need middleware for logging, persistence, or analytics

ngRx has a middleware pipeline. Every action is visible. You can log every state change, persist to localStorage, or track analytics.

### Wall #5: Server-state caching

When you're talking to a backend API, the simple pattern mixes API side-effects directly into your components. ngRx separates: "what happened" (actions) from "side effects" (effects) from "what the state looks like" (reducers).

---

## 4. Enter ngRx — What It Solves

ngRx brings the **Redux** pattern to Angular. The core philosophy:

> **There is ONE source of truth (the Store). State is READ-ONLY. State changes via UNIDIRECTIONAL FLOWS: User Action → Action → Reducer → New State → View Update.**

### The Unidirectional Data Flow

```
User clicks button
       │
       ▼
Component dispatches an ACTION
       │
       ▼
ACTION goes to REDUCER (pure function: prevState + action → newState)
       │
       ▼
NEW STATE is IMMUTABLY stored in the STORE
       │
       ▼
SELECTORS read from state (reactively, like observables)
       │
       ▼
COMPONENTS receive new state and update their templates
       │
       ▼
[CIRCLE STARTS AGAIN]
```

### What ngRx changes vs. the service pattern:

| Aspect              | Service Pattern                  | ngRx                                           |
| ------------------- | -------------------------------- | ---------------------------------------------- |
| State lives in      | Service properties               | A single Store object                          |
| State mutation      | Direct `.push()`, `.done = true` | **Never allowed directly** — only via Reducers |
| State change record | None                             | **Every action is logged**                     |
| UI sync             | Manual — you must refresh        | Automatic — Store emits to Observables         |
| Undo/Redo           | Not built in                     | Built in (`@ngrx/store-devtools`)              |
| Debugging           | Stepping through code            | Replay every action in the DevTools            |
| Server effects      | Mixed in components              | Separated into Effects                         |
| Predictability      | Any code can mutate              | Only Reducers change state                     |

---

## 5. RxJS vs ngRx — They Are NOT the Same Thing

This is the most common confusion. Let's clarify:

### RxJS is a LIBRARY for reactive programming with Observables

- It's about **streams of values over time**.
- Subjects, operators (`map`, `filter`, `mergeMap`, `debounceTime`), observables.
- You use RxJS in regular Angular for HTTP calls, EventEmitter equivalents, etc.
- **RxJS does NOT manage state.** It manages data flow.

```typescript
// RxJS example — a stream of button clicks
clicks$ = fromEvent(button, 'click');

clicks$
  .pipe(
    debounceTime(300),
    map(() => 'user clicked'),
  )
  .subscribe(console.log);
```

### ngRx is a STATE MANAGEMENT LIBRARY that BUILDS ON TOP of RxJS

- It uses RxJS Observables under the hood (the Store IS an Observable).
- It provides a **pattern** (Redux pattern): State + Actions + Reducers.
- **ngRx manages state.** RxJS just helps it do so reactively.

### Analogy

Think of it like this:

|                | RxJS                                      | ngRx                                                |
| -------------- | ----------------------------------------- | --------------------------------------------------- |
| **What it is** | Plumbing (pipes, valves, filters)         | Water heater (takes water flow, produces hot water) |
| **Manages**    | Data flowing over time                    | Application state                                   |
| **Without it** | You could still have state, just manually | You'd use services + manual refresh                 |
| **Dependency** | Independent library                       | Depends on RxJS + Angular                           |

### Key insight

> **ngRx is ReactorX (Redux) for Angular. RxJS is the reactive engine ngRx runs on top of.**

You can use RxJS without ngRx (and you always should in Angular for HTTP, etc.).
You can't use ngRx without RxJS (it would fail to compile).

---

## 6. Core ngRx Building Blocks (Standalone)

Let's meet each piece individually, then connect them.

### 6a. STATE — "What the app knows right now"

State is just a TypeScript interface that describes everything your application knows.

```typescript
// todo.state.ts
export interface TodoState {
  todos: Array<{
    id: number;
    text: string;
    done: boolean;
  }>;
  filter: 'all' | 'active' | 'done';
  loading: boolean;
  error: string | null;
}

// The initial state — the blank slate
export const initialTodoState: TodoState = {
  todos: [],
  filter: 'all',
  loading: false,
  error: null,
};
```

**Think of State as:** A frozen picture of everything your app knows at any given moment.

**In the Store:** The Store holds exactly one State object. There is ONE truth.

### 6b. ACTIONS — "Something happened"

Actions are plain objects that describe WHAT happened. They are the ONLY way to notify the system that something occurred.

```typescript
// todo.actions.ts
import { createAction, props } from '@ngrx/store';

// The format: 'Feature / Event' — a string identifier
// props() carries data along with the action

export const addTodo = createAction('[Todo] Add Todo', props<{ text: string }>());

export const toggleTodo = createAction('[Todo] Toggle Todo', props<{ id: number }>());

export const removeTodo = createAction('[Todo] Remove Todo', props<{ id: number }>());

export const setFilter = createAction('[Todo] Set Filter', props<{ filter: 'all' | 'active' | 'done' }>());

export const loadTodosSuccess = createAction('[Todo API] Load Success', props<{ todos: Array<{ id: number; text: string; done: boolean }> }>());
```

**Key rules for Actions:**

1. They are **plain objects** with a `type` string and optional `payload`.
2. They say **what** happened, not **how** to change state.
3. The `type` string follows the convention `'[Feature] Description'`.
4. You dispatch actions — nothing else changes state.

### 6c. REDUCERS — "How state changes"

A reducer is a **pure function** that takes the current state and an action, and returns a new state.

```typescript
// todo.reducer.ts
import { Action, createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';
import { initialTodoState } from './todo.state';

export const todoFeatureReducer = createReducer(
  initialTodoState, // ← The default state (used when the app starts)

  on(TodoActions.addTodo, (state, { text }): typeof state => {
    // Return a NEW state object — never mutate the input!
    return {
      ...state,
      todos: [
        ...state.todos,
        {
          id: Date.now(),
          text,
          done: false,
        },
      ],
    };
  }),

  on(TodoActions.toggleTodo, (state, { id }): typeof state => {
    return {
      ...state,
      todos: state.todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
    };
  }),

  on(TodoActions.removeTodo, (state, { id }): typeof state => {
    return {
      ...state,
      todos: state.todos.filter((todo) => todo.id !== id),
    };
  }),

  on(TodoActions.setFilter, (state, { filter }): typeof state => {
    return { ...state, filter };
  }),

  on(TodoActions.loadTodosSuccess, (state, { todos }): typeof state => {
    return { ...state, todos, loading: false };
  }),
);
```

**Key rules for Reducers:**

1. **Pure function** — same input always gives same output. No HTTP calls. No randomness.
2. **Never mutate** the input state — always return a new object (spread operator, `map`, `filter`).
3. **Always return a state** — even if you don't change anything.
4. A reducer can handle many different actions.
5. If the action doesn't match any `on()`, return the original state (ngRx handles this by default).

### 6d. SELECTORS — "Reading state reactively"

Selectors are functions that extract pieces of state. They return **Observables** (via `createSelector`).

```typescript
// todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState, initialTodoState } from './todo.state';

// Feature selector — reads the 'todos' slice from the root state
export const selectTodoFeature = createFeatureSelector<TodoState>('todos');

// Derived selectors — composable, cached
export const selectAllTodos = createSelector(
  selectTodoFeature,
  (state: TodoState) => state.todos
);

export const selectActiveTodos = createSelector(
  selectTodoFeature,
  selectTodoFeature  // Note: in real code you'd compose carefully
  (state: TodoState) => state.todos.filter(t => !t.done)
);

export const selectFilter = createSelector(
  selectTodoFeature,
  (state: TodoState) => state.filter
);

export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectFilter,
  (todos, filter) => {
    if (filter === 'all') return todos;
    if (filter === 'active') return todos.filter(t => !t.done);
    return todos.filter(t => t.done);
  }
);
```

**Key rules for Selectors:**

1. They are **derived** — they compute values from state; they don't change it.
2. They return **Observables** — components subscribe and get updates automatically.
3. They are **cached** — `createSelector` remembers the last computation. If state hasn't changed for that slice, it returns the cached result (performance benefit).
4. They are **composable** — one selector can feed into another.

### 6e. EFFECTS — "Side effects"

Effects handle anything that is NOT a state change: HTTP calls, logging, navigation, timers, etc.

```typescript
// todo.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, mergeMap, map, catchError } from 'rxjs';
import { of } from 'rxjs';
import * as TodoActions from './todo.actions';
import { TodoApiService } from './todo.api.service';

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions); // The stream of dispatched actions
  private apiService = inject(TodoApiService);

  // Side effect: When addTodo is dispatched, call the API
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo), // Listen for this action
      mergeMap(
        (
          action, // Handle it asynchronously
        ) =>
          this.apiService.addTodo(action.text).pipe(
            map(
              (
                response, // Transform the response
              ) => TodoActions.loadTodosSuccess({ todos: response.todos }),
            ),
            catchError(
              (
                error, // Handle errors
              ) => of(null), // or an error action
            ),
          ),
      ),
    ),
  );

  // Side effect: Log every action (pure logging, no state change)
  logActions$ = createEffect(
    () =>
      this.actions$.pipe(
        tap((action) => console.log('Actiondispatched:', action)),
        map(() => null), // Must map to an action (even null)
      ),
    { dispatch: false }, // ⚠️ This effect does NOT dispatch anything
  );
}
```

**Key rules for Effects:**

1. Effects respond to actions — they `pipe` off the `Actions` stream.
2. Effects handle **side effects** — HTTP, logging, console, routes.
3. Effects can **dispatch new actions** — e.g., an API success dispatches a different action.
4. Effects use RxJS operators (`mergeMap`, `switchMap`, `catchError`) because HTTP calls are async streams.
5. Non-dispatching effects need `{ dispatch: false }` — otherwise ngWarns.
6. Effects should NOT change state directly — they dispatch actions, and Reducers handle state.

### 6f. STORE — "The single source of truth"

The Store is where state lives. It's both an Observable (you `.select()` from it) and a dispatcher (you `.dispatch()` actions to it).

```typescript
// In app.config.ts
import { provideStore } from '@ngrx/store';
import { todoFeatureReducer } from './todo/todo.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({
      todos: todoFeatureReducer, // The key 'todos' names this slice in the root state
    }),
  ],
};

// In a component:
@Component({
  selector: 'app-todo-list',
  template: `
    <ul>
      <li *ngFor="let todo of todos$ | async">
        {{ todo.text }}
        <button (click)="toggleTodo(todo.id)">Toggle</button>
      </li>
    </ul>
  `,
})
export class TodoListComponent {
  private store = inject(Store);
  readonly todos$ = this.store.select(selectFilteredTodos); // Observable!

  dispatchAdd(text: string) {
    this.store.dispatch(addTodo({ text }));
  }

  dispatchToggle(id: number) {
    this.store.dispatch(toggleTodo({ id }));
  }
}
```

---

## 7. How Everything Connects Together

### The Complete Flow — Step by Step

Here's the lifecycle of a single user click, tracing every component:

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER CLICKS "ADD TODO" BUTTON                │
│                                                                 │
│  1. Component calls:                                            │
│     this.store.dispatch(addTodo({ text: 'Buy milk' }))          │
│         │                                                       │
│         ▼                                                       │
│  2. The STORE receives the action and sends it to:              │
│     ALL EFFECTS (to check for side effects)                     │
│     AND the REDUCER (to update state)                           │
│         │                                                       │
│         ├──────────────────────┐                                │
│         ▼                      ▼                                │
│     Effects pipe             Reducer function                   │
│     checks: is this an      receives: (prevState, action)      │
│     action it handles?      returns: newState                 │
│         │                      │                                │
│         ▼                      ▼                                │
│     If yes → calls API      New state is stored in            │
│          └→ API responds     the STORE atomically             │
│             └→ dispatches   ───────────────────────┐          │
│               new action (loadTodosSuccess)        │          │
│                                                    ▼          │
│                         The STORE now has NEW STATE          │
│                                                    │          │
│  3. SELECTORS that depend on state notice the       │          │
│     change (Store emits). They compute derived data.│          │
│                                                    ▼          │
│  4. Components SUBSCRIBED to selectors              │          │
│     receive the new values (async pipe).             │          │
│                                                    │          │
│  5. Angular change detection re-renders the         │          │
│     components with fresh data.                     │          │
│                                                    ▼          │
│  6. User sees the updated UI.                         │          │
└─────────────────────────────────────────────────────────────────┘
```

### Connection Summary in Diagram Form

```
┌──────────────┐
│   COMPONENT   │
│  (UI Layer)   │
└──────┬───────┘
       │ 1. dispatch(action)
       ▼
┌──────────────┐
│     STORE     │ ←── 3. emits new state to selectors
│  (State Store)│
└──────┬───────┘
       │ 2. sends action → Reducer
       ▼
┌──────────────┐
│   REDUCER     │ ←── Updates (never mutates) state
│ (Pure Func)    │
└──────────────┘

Simultaneously...

┌──────────────┐
│    EFFECTS    │ ←── Listens for actions, handles side effects
│  (RxJS Pipes) │     (HTTP, logging, navigation)
└──────────────┘
       │ 4. can dispatch NEW actions
       ▼
   (back to Store — the cycle continues)

And on the read side...

┌──────────────┐
│  SELECTORS    │ ←── Derived from state, return Observables
│  (computed)   │
└──────┬───────┘
       │ 5. emits to component subscriptions
       ▼
┌──────────────┐
│   COMPONENT   │
│  (UI renders) │
└──────────────┘
```

---

## 8. A Complete Working Example

Here's a minimal, complete ngRx example showing everything working together.

### Step 1 — Define the State

```typescript
// counter.state.ts
export interface CounterState {
  value: number;
  history: number[]; // Every value the counter has ever been
}

export const initialCounterState: CounterState = {
  value: 0,
  history: [0],
};
```

### Step 2 — Define the Actions

```typescript
// counter.actions.ts
import { createAction, props } from '@ngrx/store';

export const increment = createAction('[Counter] Increment');
export const decrement = createAction('[Counter] Decrement');
export const incrementBy = createAction('[Counter] Increment By', props<{ amount: number }>());
export const reset = createAction('[Counter] Reset');
```

### Step 3 — Define the Reducer

```typescript
// counter.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as CounterActions from './counter.actions';
import { initialCounterState } from './counter.state';

export const counterReducer = createReducer(
  initialCounterState,

  on(CounterActions.increment, (state) => ({
    ...state,
    value: state.value + 1,
    history: [...state.history, state.value + 1],
  })),

  on(CounterActions.decrement, (state) => ({
    ...state,
    value: state.value - 1,
    history: [...state.history, state.value - 1],
  })),

  on(CounterActions.incrementBy, (state, { amount }) => ({
    ...state,
    value: state.value + amount,
    history: [...state.history, state.value + amount],
  })),

  on(CounterActions.reset, (state) => ({
    ...state,
    value: 0,
    history: [...state.history, 0],
  })),
);
```

### Step 4 — Define Selectors

```typescript
// counter.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CounterState } from './counter.state';

export const selectCounterFeature = createFeatureSelector<CounterState>('counter');

export const selectValue = createSelector(selectCounterFeature, (state: CounterState) => state.value);

export const selectHistory = createSelector(selectCounterFeature, (state: CounterState) => state.history);

// Composite selector — derived computation
export const selectIsPositive = createSelector(selectValue, (value: number) => value > 0);
```

### Step 5 — Define Effects (if needed)

In this simple counter app, we don't need Effects (no HTTP). But if we did:

```typescript
// counter.effects.ts — example: log every action
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs';
import * as CounterActions from './counter.actions';

@Injectable()
export class CounterEffects {
  private actions$ = inject(Actions);

  log$ = createEffect(
    () =>
      this.actions$.pipe(
        tap((action) => console.log('Action:', action.type)),
        map(() => null),
      ),
    { dispatch: false },
  );
}
```

### Step 6 — Configure the Store

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { counterReducer } from './counter/counter.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools'; // for time-travel debug

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({
      counter: counterReducer,
    }),
    provideStoreDevtools({ maxAge: 25 }), // Enables the Redux DevTools extension
  ],
};
```

### Step 7 — Use It in a Component

```typescript
// counter.component.ts
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as CounterActions from './counter/counter.actions';
import { selectValue, selectHistory, selectIsPositive } from './counter/counter.selectors';

@Component({
  selector: 'app-counter',
  template: `
    <h1>Counter: {{ value$ | async }}</h1>
    <p ngProject="If positive: {{ (isPositive$ | async) ? 'YES' : 'NO' }}" />

    <button (click)="increment()">+1</button>
    <button (click)="decrement()">-1</button>
    <button (click)="incrementBy(5)">+5</button>
    <button (click)="reset()">Reset</button>

    <h3>History: {{ history$ | async | json }}</h3>
  `,
})
export class CounterComponent {
  private store = inject(Store);
  private readonly value$: Observable<number> = this.store.select(selectValue);
  private readonly history$: Observable<number[]> = this.store.select(selectHistory);
  private readonly isPositive$: Observable<boolean> = this.store.select(selectIsPositive);

  increment() {
    this.store.dispatch(CounterActions.increment());
  }
  decrement() {
    this.store.dispatch(CounterActions.decrement());
  }
  incrementBy() {
    this.store.dispatch(CounterActions.incrementBy({ amount: 5 }));
  }
  reset() {
    this.store.dispatch(CounterActions.reset());
  }
}
```

### Walk Through What Happens on a Click

```
User clicks "+1" button
  │
  ▼
Component.dispatch(CounterActions.increment())
  │
  ▼
Store sends action to Reducer
  │
  ▼
Reducer runs: (state, action) → newState
  Input:  { value: 0, history: [0] }
  Output: { value: 1, history: [0, 1] }
  │
  ▼
New state replaces old state in Store (atomically)
  │
  ▼
Store emits — Selectors detect change
  │
  ▼
value$ observable emits: 1
  │
  ▼
Async pipe in template updates "Counter: 1"
  │
  ▼
UI updates. Cycle complete.
```

---

## 9. When to Use (and When NOT to Use) ngRx

### ✓ Use ngRx when:

| Scenario                                                  | Why                                         |
| --------------------------------------------------------- | ------------------------------------------- |
| Complex shared state across many components               | Single source of truth, no prop drilling    |
| Debugging is important                                    | DevTools, action logging, time-travel       |
| Undo/Redo functionality                                   | Action history is naturally maintained      |
| Team of 5+ developers                                     | Predictable patterns prevent state chaos    |
| Server-state caching (with `@ngrx/entity` + `@ngrx/data`) | Structured, cacheable state management      |
| Enterprise app with frequent state changes                | The unidirectional flow is self-documenting |

### ✗ DON'T use ngRx when:

| Scenario                                      | Better Alternative                                          |
| --------------------------------------------- | ----------------------------------------------------------- |
| Simple form or single-page app                | `@Input` / `@Output`, simple service with `BehaviorSubject` |
| Parent↔child communication                    | `@Input` + `@Output`, or `@ViewChild`                       |
| Local temporary UI state                      | Component `@Input`/`@Output` or `state`                     |
| You're learning Angular                       | Learn RxJS + services first, then ngRx                      |
| 3 or fewer components need state              | A service with `BehaviorSubject` is lighter                 |
| Performance is critical (millions of changes) | Signals or plain objects may be faster                      |

### Rule of thumb

> **"If you'd write more boilerplate configuring ngRx's Store, Effects, Selectors, Reducers, and Actions than actual business logic, don't use it."**

ngRx adds boilerplate because it enforces discipline. For complex apps, the discipline is worth it. For simple apps, it's overhead.

---

## Quick Reference Card

```
┌───────────────────┬──────────────────────────────────────────────────┐
│     Concept       │             What It Is                         │
├───────────────────┼──────────────────────────────────────────────────┤
│ State             │ A single object describing EVERYTHING            │
│                   │ your app knows. Lives in the Store.              │
├───────────────────┼──────────────────────────────────────────────────┤
│ Store             │ Holds ONE State. You dispatch TO it and         │
│                   │ SELECT FROM it. Is an Observable + dispatcher.   │
├───────────────────┼──────────────────────────────────────────────────┤
│ Action            │ A plain object describing WHAT happened.         │
│                   │ Format: { type: '[Feature] Event', payload? }    │
├───────────────────┼──────────────────────────────────────────────────┤
│ Reducer           │ A pure function: (prevState, action) → newState. │
│                   │ Never mutates. Always returns new state.          │
├───────────────────┼──────────────────────────────────────────────────┤
│ Selector          │ A derived, cached function that reads state.     │
│                   │ Returns an Observable for reactive subscriptions. │
├───────────────────┼──────────────────────────────────────────────────┤
│ Effects           │ RxJS pipes that listen for actions and handle    │
│                   │ side effects (HTTP, logging, etc.).              │
├───────────────────┼──────────────────────────────────────────────────┤
│ Dispatch          │ Component → Store: "Something happened!"         │
├───────────────────┼──────────────────────────────────────────────────┤
│ Select            │ Component ← Store: "What's the current state?"   │
└───────────────────┴──────────────────────────────────────────────────┘
```

---

## TL;DR

1. **Vanilla JS** scatters state everywhere — hard to track.
2. **Simple Angular** (services) is better but still mutable and manual.
3. **ngRx** enforces: ONE state, immutable changes, action logging, unidirectional flow.
4. **RxJS** is reactive streams. **ngRx** is state management. ngRx uses RxJS.
5. **Actions** = what happened. **Reducers** = how state changes. **Effects** = side effects. **Selectors** = reactive reads. **Store** = the container that ties them all together.
6. Use ngRx for complex apps. Use simpler patterns for simple ones.

---

_Built from first principles. No assumptions. No "just trust me" explanations._
