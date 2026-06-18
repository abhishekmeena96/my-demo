---
name: project-progress-and-learnings
description: Tracking our progress through the Alfresco DMS project and what we've learned
metadata:
  type: project
---

# Project Progress Tracker

## ✅ Completed Milestones

### Phase 1: Workspace Setup
- ✅ Created NX monorepo with Angular 19
- ✅ Installed all ADF dependencies
- ✅ Configured proxy for corporate network
- ✅ Set up Git repository and pushed to GitHub

### Phase 2: Understanding ADF
- ✅ Read ACA documentation and source code
- ✅ Understood `app.config.json` purpose and structure
- ✅ Learned about `AppConfigService` (the bridge pattern)
- ✅ Studied ADF components (`adf-sidenav-layout`)
- ✅ Understood environment files vs runtime config

### Phase 3: Version Management
- ✅ Resolved Node.js version compatibility (24.x)
- ✅ Matched Angular version (19.x) with ADF 8.x
- ✅ Fixed `--legacy-peer-deps` dependency conflicts
- ✅ Created merged `package.json` from ACA

### Phase 4: Knowledge Base Built
- ✅ Created `agent.md` for future reference
- ✅ Documented all core concepts in memory
- ✅ Created comprehensive project understanding doc

---

## 🚧 Next Steps (Priority Order)

### Immediate (This Session)
1. Create `app.config.json` in `apps/my-dms/src/`
2. Declare it as Angular asset
3. Start `nx serve my-dms` to verify setup

### Short-term
4. Build `AppLayoutComponent` wrapping `adf-sidenav-layout`
5. Create login page with `AuthenticationService`
6. Test backend connection
7. Setup routing for basic pages

### Medium-term
8. Build document library view
9. Implement file upload functionality
10. Add file preview support
11. Create search functionality
12. Build sites management page

### Long-term (Share features to add)
13. User/Group management
14. Workflow/task management
15. Advanced search with filters
16. Calendar/Wiki/Links
17. Dashboards with dashlets

---

## 💡 Key Concepts Internalized

### The Three Files Every ADF App Needs
1. **`package.json`** → Installs ADF packages
2. **`app.module.ts`** → Imports ADF modules
3. **`app.config.json`** → Configures ADF at runtime

Without `app.config.json`, ADF services are blind.

### Understanding NX vs Angular CLI
- **`ng`** = Single Angular app commands
- **`nx`** = Monorepo commands (manages multiple apps/libs)
- In our project: `ng` is replaced by `nx`

### npm vs npx
- **`npm install`** → Installs packages locally
- **`npx create-nx-workspace@19`** → Runs without installing globally

---

## 🐛 Known Issues & Solutions

### Issue 1: NX Cloud Connection Attempts
**Error**: 407 Proxy Authentication Required  
**Solution**: Set `$env:NX_NO_CLOUD=1` before workspace creation

### Issue 2: Dependency Conflicts
**Error**: ERESOLVE unable to resolve dependency tree  
**Solution**: Use `--legacy-peer-deps` flag

### Issue 3: Git Authentication
**Error**: Invalid username or token  
**Solution**: Generate GitHub Personal Access Token (PAT)

---

## 📚 Documentation Created

1. `agent.md` - General project knowledge (monorepo, NX, setup)
2. `alfresco-project-understanding.md` - Complete architecture doc
3. `Alfresco-custom-projects.md` - Conversation transcript

---

## 🎯 Current Focus

**Understanding `app.config.json` deeply**:
- Why it's needed (runtime vs build config)
- How `AppConfigService` reads it
- What properties control backend connection
- How to customize for our DMS

**Next major step**: Create our own `app.config.json` and declare as asset

---

## 📖 References

- ACA GitHub: `github.com/Alfresco/alfresco-content-app`
- ADF Core Docs: `alfresco.com/abn/adf/docs`
- NX Docs: `nx.dev`
- Angular Dev: `angular.dev`

---

*Last updated: 2026-06-18*
