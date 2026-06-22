# NgRx Complete Learning Guide - File 2

## Effects, Feature Stores, Router Store, DevTools, Forms, Modern Setup, Complete Projects

---

# Chapter 19 - The Biggest Limitation of Reducers

In File 1 we learned:

```text
Component
    ↓
Action
    ↓
Reducer
    ↓
Store
```

This works perfectly for:

```text
Counter
Theme Change
Toggle Sidebar
Change Language
```

Example:

```ts
on(increment, (state) => ({
  ...state,
  count: state.count + 1,
}));
```

No problem.

---

But what about:

```text
Login User
Load Products
Load Documents
Load Folder Contents
Call ACS API
```

These require:

```text
HTTP Requests
Services
Async Operations
```

Reducers cannot do these things.

---

# Chapter 20 - Why Reducers Cannot Call APIs

Imagine:

```ts
on(loadUsers, () => {
  this.http.get('/users');
});
```

This is illegal in NgRx.

Why?

Because reducers must be:

```text
Pure Functions
```

---

## What Is A Pure Function?

Same input.

Same output.

Always.

Example:

```ts
function add(a: number, b: number) {
  return a + b;
}
```

Input:

```text
2 + 3
```

Output:

```text
5
```

Always.

---

API calls are different.

```ts
http.get('/users');
```

Today:

```text
10 users
```

Tomorrow:

```text
15 users
```

Server down:

```text
500 error
```

Output changes.

Not pure.

Therefore:

```text
Reducers cannot call APIs
```

---

# Chapter 21 - Enter Effects

Effects solve this problem.

Think:

```text
Reducer
=
State Change Logic

Effect
=
Side Effects Logic
```

---

## Side Effect Means

Anything outside Store.

Examples:

```text
HTTP Calls
Logging
Navigation
Local Storage
Notifications
File Download
WebSocket
```

All belong in Effects.

---

# Chapter 22 - Effect Workflow

Normal Flow:

```text
Component
    ↓
Action
    ↓
Reducer
```

API Flow:

```text
Component
    ↓
Action
    ↓
Effect
    ↓
API
    ↓
Success Action
    ↓
Reducer
    ↓
Store
```

---

This is the most important NgRx diagram after the Store diagram.

Memorize it.

---

# Chapter 23 - Creating Actions For Effects

Usually three actions exist.

## Load

```ts
export const loadProducts = createAction('[Products] Load');
```

## Success

```ts
export const loadProductsSuccess = createAction('[Products API] Success', props<{ products: any[] }>());
```

## Failure

```ts
export const loadProductsFailure = createAction('[Products API] Failure', props<{ error: any }>());
```

---

# Chapter 24 - Product Service

```ts
@Injectable()
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<any[]>('/api/products');
  }
}
```

---

# Chapter 25 - First Effect

```ts
@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),

      switchMap(() =>
        this.productService.getProducts().pipe(
          map((products) => loadProductsSuccess({ products })),

          catchError((error) => of(loadProductsFailure({ error }))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private productService: ProductService,
  ) {}
}
```

---

# Understanding The Effect

```text
Actions$
    ↓
ofType(loadProducts)
    ↓
switchMap()
    ↓
HTTP Request
    ↓
map()
    ↓
Success Action
    ↓
Reducer
```

---

# Chapter 26 - Understanding Actions$

Think:

```text
Global Action Stream
```

Every action passes through:

```text
increment
login
loadProducts
deleteUser
```

All actions flow through:

```ts
Actions$;
```

---

# Chapter 27 - Understanding ofType()

```ts
ofType(loadProducts);
```

Meaning:

```text
Listen Only For loadProducts Action
```

---

# Chapter 28 - Understanding switchMap()

```ts
switchMap(() => {
  return service.getProducts();
});
```

Meaning:

```text
Switch To API Observable
```

---

# Chapter 29 - Understanding map()

Server returns:

```json
[
  {
    "id": 1,
    "name": "Laptop"
  }
]
```

Convert response into action:

```ts
map((products) => loadProductsSuccess({ products }));
```

---

# Chapter 30 - Understanding catchError()

```ts
catchError((error) => of(loadProductsFailure({ error })));
```

Creates failure action.

---

# Chapter 31 - Reducer For Effects

State:

```ts
export interface ProductState {
  products: any[];

  loading: boolean;

  error: any;
}
```

Initial State:

```ts
export const initialState = {
  products: [],

  loading: false,

  error: null,
};
```

Reducer:

```ts
export const reducer = createReducer(
  initialState,

  on(loadProducts, (state) => ({
    ...state,
    loading: true,
  })),

  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
  })),

  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
);
```

---

# Chapter 32 - Full Effect Workflow

```text
User Clicks Button
         ↓
dispatch(loadProducts())
         ↓
Action Stream
         ↓
Effect
         ↓
Product Service
         ↓
HTTP Request
         ↓
Response
         ↓
loadProductsSuccess
         ↓
Reducer
         ↓
Store Updated
         ↓
Selector
         ↓
Component
         ↓
HTML Updated
```

---

# Chapter 33 - Root Store vs Feature Store

Root Store:

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

This is Root Store.

---

# Chapter 34 - Why Feature Stores Exist

Large application:

```text
Users
Products
Orders
Notifications
Documents
Search
Folders
```

Putting everything inside:

```ts
app: {
}
```

becomes huge.

---

Instead:

```ts
{
 app:{},
 users:{},
 products:{},
 orders:{}
}
```

Each section becomes a Feature State.

---

# Chapter 35 - Feature State

Example:

```ts
export interface UserState {
  users: any[];
}
```

Register:

```ts
provideState('users', userReducer);
```

Store:

```ts
{
  users: {
    users: [];
  }
}
```

---

# Chapter 36 - App Store vs Feature Store

Think:

```text
Root Store
=
Main Building

Feature Store
=
Rooms Inside Building
```

Diagram:

```text
Store
│
├── app
├── users
├── products
├── folders
├── search
└── notifications
```

---

# Chapter 37 - NgRx Router Store

Angular Router already knows:

```text
Current URL
Params
Query Params
```

Example:

```text
/folder/123?sort=name
```

Angular knows:

```text
id = 123
sort = name
```

Router Store copies this information into Store.

Registration:

```ts
provideRouterStore({
  stateKey: 'router',
});
```

Store becomes:

```ts
{
 app:{},
 router:{
   url:'/folder/123'
 }
}
```

---

# Chapter 38 - Why Router Store Exists

Without Router Store:

```text
Effect
    ↓
Needs Route Param
    ↓
Inject ActivatedRoute
```

With Router Store:

```text
Effect
    ↓
Read From Store
```

Cleaner.

---

# Chapter 39 - NgRx DevTools

One of the best reasons to use NgRx.

Install:

```bash
npm install @ngrx/store-devtools
```

Register:

```ts
provideStoreDevtools({
  maxAge: 25,
});
```

Install browser extension:

```text
Redux DevTools
```

---

# Chapter 40 - What DevTools Shows

Every action.

Example:

```text
increment
increment
increment
loadProducts
loadProductsSuccess
```

Store visible:

```ts
{
 app:{},
 products:{},
 router:{}
}
```

---

# Chapter 41 - Time Travel Debugging

```text
Action 1
Action 2
Action 3
Action 4
```

DevTools allows:

```text
Jump Back To Action 2
```

Store rewinds.

---

# Chapter 42 - NgRx Forms

Most Angular apps use:

```ts
Reactive Forms
```

Example:

```ts
this.form = this.fb.group({
  name: [''],
});
```

NgRx Forms means:

```text
Form State Stored In Store
```

Example:

```ts
{
  form: {
    name: 'Abhishek';
  }
}
```

Useful for:

```text
Huge Forms
Multi-Step Forms
Wizard Screens
Draft Saving
```

---

# Chapter 43 - Modern Angular Setup

Angular 19+

No AppModule required.

app.config.ts

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({
      counter: counterReducer,
    }),

    provideEffects([CounterEffects]),
  ],
};
```

---

# Chapter 44 - Project 1 - Counter App

Folder Structure:

```text
store/

 actions/
 reducers/
 selectors/
```

Actions:

```ts
increment;
decrement;
reset;
```

Workflow:

```text
Button
 ↓
Action
 ↓
Reducer
 ↓
Store
 ↓
Selector
 ↓
UI
```

---

# Chapter 45 - Project 2 - User Profile

Store:

```ts
{
 user:{
  name:'',
  email:''
 }
}
```

Actions:

```ts
loadUser;
updateUser;
```

Purpose:

```text
Learn Feature State
```

---

# Chapter 46 - Project 3 - Product API

Actions:

```ts
loadProducts;
loadProductsSuccess;
loadProductsFailure;
```

Effect:

```ts
HTTP Call
```

Reducer:

```ts
loading;
products;
error;
```

Workflow:

```text
Button
 ↓
loadProducts
 ↓
Effect
 ↓
API
 ↓
Success
 ↓
Reducer
 ↓
Store
 ↓
Selector
 ↓
UI
```

---

# Final Summary

You should now understand:

```text
Effects
Actions$
ofType()
switchMap()
map()
catchError()

Root Store
Feature Store

Router Store

DevTools

NgRx Forms

Modern Angular Setup
```

Most important diagrams:

Simple Flow:

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

API Flow:

```text
Component
 ↓
Action
 ↓
Effect
 ↓
API
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

If you understand these two diagrams, you understand most of NgRx.

# examples

When user clicks a button:

Load Products

We want:

Component
↓
Dispatch Action
↓
Effect
↓
API Call
↓
Success Action
↓
Reducer
↓
Store Updated
↓
Selector
↓
Component Shows Data

```



1. API Service

product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})
export class ProductService {

 constructor(private http: HttpClient) {}

 getProducts(): Observable<any[]> {
   return this.http.get<any[]>(
     'https://jsonplaceholder.typicode.com/users'
   );
 }
}



2. Actions

product.actions.ts

import { createAction, props } from '@ngrx/store';

export const loadProducts = createAction(
 '[Products] Load'
);

export const loadProductsSuccess = createAction(
 '[Products API] Success',
 props<{ products: any[] }>()
);

export const loadProductsFailure = createAction(
 '[Products API] Failure',
 props<{ error: any }>()
);



3. State

product.state.ts

export interface ProductState {
 products: any[];
 loading: boolean;
 error: any;
}

export const initialState: ProductState = {
 products: [],
 loading: false,
 error: null
};




4. Reducer

product.reducer.ts

import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';
import { initialState } from './product.state';

export const productReducer = createReducer(

 initialState,

 on(ProductActions.loadProducts, (state) => ({
   ...state,
   loading: true,
   error: null
 })),

 on(ProductActions.loadProductsSuccess, (state, action) => ({
   ...state,
   loading: false,
   products: action.products
 })),

 on(ProductActions.loadProductsFailure, (state, action) => ({
   ...state,
   loading: false,
   error: action.error
 }))
);


5. Effect

product.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ProductActions from './product.actions';
import { ProductService } from './product.service';
import {
 switchMap,
 map,
 catchError,
 of
} from 'rxjs';

@Injectable()
export class ProductEffects {

 constructor(
   private actions$: Actions,
   private productService: ProductService
 ) {}

 loadProducts$ = createEffect(() =>
   this.actions$.pipe(

     ofType(ProductActions.loadProducts),

     switchMap(() =>
       this.productService.getProducts().pipe(

         map(products =>
           ProductActions.loadProductsSuccess({
             products
           })
         ),

         catchError(error =>
           of(
             ProductActions.loadProductsFailure({
               error
             })
           )
         )
       )
     )
   )
 );
}


6. App State

app.state.ts

import { ProductState } from './product.state';

export interface AppState {
 products: ProductState;
}



7. Selectors

product.selectors.ts

import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectProductState =
 (state: AppState) => state.products;

export const selectProducts = createSelector(
 selectProductState,
 (state) => state.products
);

export const selectLoading = createSelector(
 selectProductState,
 (state) => state.loading
);

export const selectError = createSelector(
 selectProductState,
 (state) => state.error
);



8. Component TS

app.component.ts

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as ProductActions from './store/product.actions';

import {
 selectProducts,
 selectLoading
} from './store/product.selectors';

@Component({
 selector: 'app-root',
 templateUrl: './app.component.html'
})
export class AppComponent {

 products$ = this.store.select(selectProducts);

 loading$ = this.store.select(selectLoading);

 constructor(private store: Store) {}

 loadProducts() {
   this.store.dispatch(
     ProductActions.loadProducts()
   );
 }
}


9. Component HTML
app.component.html
<button (click)="loadProducts()">
 Load Products
</button>

<div *ngIf="loading$ | async">
 Loading...
</div>

<ul>
 <li *ngFor="let product of (products$ | async)">
   {{ product.name }}
 </li>
</ul>
Complete Runtime Flow
App Starts

Store:

{
 products: [],
 loading: false,
 error: null
}
User Clicks Button
<button (click)="loadProducts()">

calls:

loadProducts()
Dispatch Action
this.store.dispatch(loadProducts());
Reducer Runs
on(loadProducts, ...)

State becomes:

{
 products: [],
 loading: true,
 error: null
}

UI shows:

Loading...
Effect Hears Action
ofType(loadProducts)

and calls:

this.productService.getProducts()
API Returns Data
[
 { name: 'Leanne Graham' },
 { name: 'Ervin Howell' }
]
Effect Dispatches Success
loadProductsSuccess({
 products
})
Reducer Runs Again
on(loadProductsSuccess, ...)

State becomes:

{
 products: [...],
 loading: false,
 error: null
}
Selector Reads Store
selectProducts

returns:

products
Component Gets New Data
products$

updates automatically.

HTML Updates Automatically
<li>Leanne Graham</li>
<li>Ervin Howell</li>

And that's the complete picture:

Button Click
   ↓
Dispatch Action
   ↓
Reducer (loading=true)
   ↓
Effect
   ↓
API Call
   ↓
Success Action
   ↓
Reducer (store data)
   ↓
Selector
   ↓
Component
   ↓
HTML
```
