# Complete Roadmap — ACA Study + my-dms Development

## Current Status

### my-dms Completed

- ✅ Login page
- ✅ Backend connection
- ✅ Home page (temporary)
- ✅ Basic routing

### ACA Studied

- ✅ Login component
- ✅ app.config.json
- ✅ Basic routing

---

# Feature 1 — Routing & Shell

## What We Need to Study in ACA

- How ACA routing is structured
- What is Shell concept
- How CONTENT_LAYOUT_ROUTES works
- How AuthGuard is applied
- How provideShellRoutes works

## Required Angular Knowledge

- RouterModule
- Routes
- canActivate guards
- Lazy loading
- router-outlet
- Child routes

## Target in my-dms

- Restructure current routing like ACA
- Add Shell route
- Move Home inside Shell
- Fix auth persistence issue
- Place every protected page inside Shell

---

# Feature 2 — Sidenav Layout

## What We Need to Study in ACA

- Which component uses `adf-sidenav-layout`
- How header is built
- How sidebar/navigation is built
- How content area works
- How toggle menu works
- Which services sidenav uses

## Required Angular Knowledge

- @Input()
- @Output()
- ng-template
- ngTemplateOutlet
- ViewChild
- Content projection (`ng-content`)
- Lifecycle hooks (`ngOnInit`, `ngOnDestroy`)

## Target in my-dms

- Build Layout component
- Add header with app name/logo
- Add sidebar with navigation links
- Add content area with router-outlet
- Make sidebar toggle work
- Display Home page inside layout

---

# Feature 3 — Document Library

## What We Need to Study in ACA

- How ACA shows file/folder list
- Which ADF component is used (`adf-document-list`)
- Which services are used (`ContentService`, `NodeService`)
- How navigation between folders works
- How breadcrumb works

## Required Angular Knowledge

- @Input()
- @Output()
- EventEmitter
- Services & Dependency Injection (DI)
- HTTP Client basics
- \*ngFor
- \*ngIf
- Pipes

## Target in my-dms

- Show files and folders from Alfresco
- Navigate between folders
- Basic file actions:
  - Download
  - Delete

- Breadcrumb navigation

---

# Feature 4 — Upload & File Actions

## What We Need to Study in ACA

- How ACA handles file upload
- Which ADF component is used (`adf-upload-button`)
- How context menu works
- How file actions work:
  - Copy
  - Move
  - Delete

- Which services handle these actions

## Required Angular Knowledge

- Event handling
- Service communication
- Observables & Subscriptions
- Error handling
- Dialog components

## Target in my-dms

- Upload files to Alfresco
- Download files
- Delete files
- Copy files
- Move files
- Context menu for files

---

# Feature 5 — Search

## What We Need to Study in ACA

- How ACA search works
- Which ADF component is used (`adf-search`)
- How search filters work
- How search results are displayed

## Required Angular Knowledge

- Reactive Forms
- FormControl
- FormGroup
- debounceTime (RxJS)
- switchMap (RxJS)
- Subject
- BehaviorSubject

## Target in my-dms

- Basic search bar in header
- Search results page
- Filter by:
  - Type
  - Date
  - Size

---

# Feature 6 — User Info & Profile

## What We Need to Study in ACA

- How ACA shows user information
- Which ADF component is used (`adf-userinfo`)
- How logout works
- How user profile data is fetched

## Required Angular Knowledge

- Services (deep understanding)
- Observables
- async pipe
- State management basics

## Target in my-dms

- Show logged-in user name
- Show user avatar in header
- Working logout button
- User profile page

---

# Feature 7 — Sites Management

## What We Need to Study in ACA

- How ACA shows sites
- Which ADF component is used (`adf-sites-dropdown`)
- How Site Document Library works
- How Site Members functionality works

## Required Angular Knowledge

- Component communication
- Services
- Routing with parameters

## Target in my-dms

- List all sites
- Open Site Document Library
- View site members

---

# Feature 8 — NgRx State Management

## What We Need to Study in ACA

- How ACA uses NgRx Store
- What state is stored
- How Actions work
- How Reducers work
- How Effects work

## Required Angular Knowledge

- All previous Angular topics
- Advanced RxJS
- NgRx Store
- Actions
- Reducers
- Effects
- Selectors

## Target in my-dms

- Add global state management
- Store user information in state
- Store current folder in state
- Store search results in state

---

# Summary Table

| Feature             | Study in ACA             | Angular Skills               | my-dms Target              |
| ------------------- | ------------------------ | ---------------------------- | -------------------------- |
| 1. Routing & Shell  | Shell, AuthGuard, Routes | Routes, Guards, Child Routes | Fix routing structure      |
| 2. Sidenav Layout   | Layout Components        | @Input, @Output, ng-template | Header + Sidebar + Content |
| 3. Document Library | adf-document-list        | Services, HTTP, \*ngFor      | Show files/folders         |
| 4. Upload & Actions | adf-upload, Context Menu | Events, Dialogs, Observables | Upload, Delete, Copy, Move |
| 5. Search           | adf-search               | Reactive Forms, RxJS         | Search bar + Results       |
| 6. User Info        | adf-userinfo             | Services, async pipe         | User avatar + Logout       |
| 7. Sites            | adf-sites-dropdown       | Routing params, Services     | Sites list + Library       |
| 8. NgRx             | ACA Store                | NgRx, Advanced RxJS          | Global State Management    |

---

# Recommended Learning Order

### Phase 1

Routing & Shell

### Phase 2

Sidenav Layout

### Phase 3

Document Library

### Phase 4

Upload & File Actions

### Phase 5

Search

### Phase 6

User Info & Profile

### Phase 7

Sites Management

### Phase 8

NgRx State Management

---

# Final Goal

Build a simplified ACA-inspired Document Management System (`my-dms`) while learning:

- Angular Architecture
- ACA Architecture
- ADF Components
- Alfresco APIs
- Routing & Guards
- Layout Systems
- File Management
- Search Systems
- Site Management
- NgRx State Management

By the end of this roadmap, `my-dms` should function as a mini ACA application with authentication, shell layout, document library, upload/download actions, search, user management, site management, and centralized state management.
