# Naz İçen | Blog & Portfolio System

[![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge\&logo=vercel)](https://naz-blog.vercel.app)
[![Framework](https://img.shields.io/badge/Next.js-App%20Router-000000?style=for-the-badge\&logo=nextdotjs)](https://nextjs.org/)
[![Runtime](https://img.shields.io/badge/React-19-20232A?style=for-the-badge\&logo=react)](https://react.dev/)
[![Language](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge\&logo=typescript)](https://www.typescriptlang.org/)
[![Backend](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ECF8E?style=for-the-badge\&logo=supabase)](https://supabase.com/)

A full-stack blog and portfolio system built with a server-centric architecture using Next.js App Router and Supabase (PostgreSQL + Auth).

The system is designed around modular content delivery, role-based access control, and database-driven dynamic rendering.

**[ LIVE DEMO](https://naz-blog.vercel.app)** 

---

#  System Overview

The application is structured as a server-first web platform:

* Server Components handle initial rendering and data fetching
* Client Components manage interactive UI layers
* Supabase provides authentication and persistent relational storage
* Markdown + metadata layer drives blog content
* JSON-based schema drives project portfolio rendering

---

#  Architecture

## High-Level Flow

```
Client Request
   ↓
Next.js App Router (Server Components)
   ↓
Data Layer (Supabase / Markdown / JSON)
   ↓
Rendering Layer (React Server + Client Components)
   ↓
Hydrated UI (Client Interactivity)
```

---

## Data Sources

### 1. Authentication Layer (Supabase Auth)

* Email-based authentication
* Session-based user state
* Role differentiation (user / admin)

### 2. Database Layer (PostgreSQL via Supabase)

Core tables:

* users
* posts
* comments
* likes
* projects

### 3. Content Layer

* Markdown posts (`gray-matter` parsing)
* Frontmatter-driven metadata
* Static + dynamic hybrid rendering

---

#  Comment System Architecture

Nested comment system implemented using adjacency list model:

* `parent_id` → recursive threading
* depth-based UI indentation
* optimistic UI updates
* moderation flags

Supported operations:

* create comment
* edit comment
* delete comment (soft delete recommended)
* like/unlike
* threaded replies (N-level recursion)

---

#  Security Model

* Supabase Row Level Security (RLS) policies
* Auth-gated API routes
* Admin-only mutation endpoints
* Input sanitization layer (profanity filter)
* Client-side validation + server-side enforcement

---

#  Rendering Strategy

## Hybrid Rendering Model

| Route Type   | Strategy                               |
| ------------ | -------------------------------------- |
| Blog posts   | Static generation (SSG) + revalidation |
| Admin panel  | Client-side rendering (CSR)            |
| User profile | Server-side rendering (SSR)            |
| Comments     | ISR + client hydration                 |

---

#  Performance Considerations

* App Router streaming enabled
* Component-level code splitting
* Lazy hydration for comment system
* Minimal client JS footprint for blog pages
* Edge-optimized deployment via Vercel

---

#  Project Structure

```text id="proj_structure"
app/
 ├── admin/        # Admin dashboard (CSR)
 ├── blog/         # Dynamic blog routes (SSG/ISR)
 ├── profile/      # User profile (SSR)
 ├── api/          # Route handlers (server logic)
 └── layout.tsx    # Root layout

components/
 ├── ui/           # Atomic UI components
 ├── blog/         # Blog-specific components
 ├── comments/     # Comment system UI

lib/
 ├── supabase/     # DB client + auth helpers
 ├── utils/        # helper functions

content/
 ├── posts/*.md    # Markdown-based posts

data/
 ├── projects.json # Portfolio schema
```

---

#  API Layer

REST-like internal API routes:

* `POST /api/comment/create`
* `POST /api/comment/delete`
* `POST /api/comment/like`
* `POST /api/post/create` (admin only)

All routes:

* validated via Supabase session
* protected with role checks
* sanitized input layer

---

#  Local Development

```bash id="dev_setup"
git clone https://github.com/your-username/naz-blog.git
cd naz-blog
npm install
```

```env id="env"
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

```bash id="run_dev"
npm run dev
```

---

# 📊 Design Decisions

* Supabase chosen over custom backend to reduce infrastructure overhead
* Markdown used to separate content from UI logic
* App Router used for server-first architecture
* Hybrid rendering chosen for balancing SEO + interactivity

---

#  Author

Naz İçen
Computer Programming Student

Focus areas:

* full-stack web systems
* UI architecture
* game development systems (Unity/C#)
* desktop tooling & low-level Windows development


 (She hasn't chosen a field yet :p ) 
