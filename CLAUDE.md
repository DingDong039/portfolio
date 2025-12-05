# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Next.js 16, React 19, and TypeScript. Features a sophisticated 3D black hole visualization using Three.js with custom GLSL shaders.

## Development Commands

```bash
npm run dev      # Start dev server with Turbopack (port 3000)
npm run build    # Production build with Turbopack
npm run start    # Run production server
npm run lint     # Run ESLint
```

## Architecture

### App Structure (Next.js App Router)
- `app/page.tsx` - Main page (SSG), composes all section components
- `app/layout.tsx` - Root layout with metadata, fonts (Kanit, Inter), Vercel Analytics
- `app/api/contact/route.ts` - POST endpoint for contact form (uses Resend email service)
- `app/globals.css` - Tailwind CSS with dark mode support

### Component Pattern
All section components are client components (`"use client"`):
- `Hero.tsx` - Hero section with animated gradients and social links
- `About.tsx` - About section
- `Projects.tsx` - Work experience and projects (data-driven)
- `Skills.tsx` - Skills grid organized by category
- `Contact.tsx` - Contact form with email submission and QR code modal
- `Footer.tsx` - Footer (server component)
- `ThreeBackground.tsx` - 3D black hole scene with custom shaders

### Data-Driven Components
Skills, Projects, and Experience sections use arrays of objects for content. When adding new items, follow existing data structures in each component.

## Technical Stack

- **Framework:** Next.js 16 with Turbopack, standalone output mode
- **Runtime:** React 19, TypeScript (strict mode)
- **Styling:** Tailwind CSS 4, PostCSS
- **3D Graphics:** Three.js with custom GLSL shaders
- **Email:** Resend API
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics

## Environment Variables

Required for contact form functionality:
```
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=recipient_email
```

## Key Patterns

### Three.js Resource Cleanup
ThreeBackground demonstrates proper cleanup pattern - always dispose geometries, materials, textures, and renderer in useEffect cleanup:
```typescript
return () => {
  geometry.dispose();
  material.dispose();
  renderer.dispose();
};
```

### Client vs Server Components
- Use `"use client"` for components with interactivity, hooks, or browser APIs
- Footer is intentionally a server component (no directive needed)

### Styling
- Utility-first Tailwind CSS
- CSS-in-JS for dynamic animations (inline style objects)
- Dark mode via CSS variables and `prefers-color-scheme`
- Responsive breakpoints: sm, md, lg

## Deployment

- **Vercel:** Primary deployment target (configured in metadata)
- **Docker:** Multi-stage Dockerfile with standalone output, runs as non-root user on port 3000
