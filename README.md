# Naz İçen | Personal Blog & Portfolio 

[![Website Live](https://img.shields.io/badge/Website-Live-00f2fe?style=for-the-badge\&logo=vercel\&logoColor=white)](https://naz-blog.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?style=for-the-badge\&logo=nextdotjs\&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Database-3ECF8E?style=for-the-badge\&logo=supabase\&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge\&logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)

A modern personal blog and portfolio application built with Next.js, React, TypeScript, and Supabase.

The project focuses on scalable architecture, dynamic content management, and a responsive user experience with a developer-oriented design language.

🌐 **Live Demo:** [naz-blog.vercel.app](https://naz-blog.vercel.app)

---

## 📸 Preview

> Add screenshots here later for:

* Homepage
* Blog page
* Admin dashboard
* Comment system
* Mobile responsive layout

---

#  Features

* Built with the modern **Next.js App Router** architecture
* Fully responsive UI optimized for desktop, tablet, and mobile devices
* Secure authentication system powered by **Supabase Auth**
* Dynamic markdown-based blogging system
* Advanced nested comment system

  * Replies
  * Likes
  * Comment editing & deletion
  * Moderation support
* Admin dashboard for:

  * Blog management
  * Project management
  * Comment moderation
* JSON-driven project architecture
* Profanity filtering for user-generated content
* SEO-friendly structure and server-side rendering support

---

#  Motivation

I built this project to explore scalable full-stack architecture while creating a fully customizable blogging platform.

The project helped me improve my skills in:

* authentication systems
* database design
* dynamic routing
* markdown rendering
* state management
* responsive UI development

---

#  Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* TailwindCSS
* CSS Modules
* Font Awesome

## Backend & Infrastructure

* Supabase

  * PostgreSQL Database
  * Authentication
* Vercel Deployment

## Content Processing

* gray-matter
* react-markdown

---

# 📁 Project Structure

```text
├── app/                  # Next.js App Router
│   ├── admin/            # Admin dashboard
│   ├── blog/             # Blog pages & dynamic routes
│   ├── profile/          # User profiles
│   ├── api/              # API route handlers
│   └── layout.tsx        # Global layout
│
├── components/           # Reusable UI components
├── lib/                  # Utilities & Supabase configuration
├── content/              # Markdown blog posts
├── data/                 # JSON-based project data
└── public/               # Static assets
```

---

# ⚙️ Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/naz-blog.git
cd naz-blog
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Run the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

#  About the Developer

Naz İçen

Computer Programming student focused on:

* Full-stack web development
* Desktop software engineering
* Game development

Interested in:

* scalable architectures
* modern UI systems
* performance-focused applications
* low-level Windows technologies

---

# 📄 License

This project is licensed under the MIT License.
