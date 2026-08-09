# Project Change Reference

Last updated: 2026-08-04

## Project overview for future edits

This project is a bilingual marketing website (Arabic/English) built with React + Vite + TypeScript + Tailwind + shadcn/ui.

### High-level structure

- Root configuration:
  - package.json
  - vite.config.ts
  - tailwind.config.ts
  - eslint.config.js
  - tsconfig.json
- Public assets:
  - public/hero/
  - public/clients/
  - public/courses/
  - public/projects/
- App source:
  - src/main.tsx
  - src/App.tsx
  - src/index.css
  - src/components/
  - src/pages/
  - src/data/
  - src/contexts/
  - src/i18n/
  - src/config/
  - src/lib/

### Core files map (what to edit and where)

- App bootstrap and routing:
  - src/main.tsx (application mount)
  - src/App.tsx (routes, providers, router basename)
- Build and base path behavior:
  - vite.config.ts (VITE_BASE_PATH handling)
  - src/lib/utils.ts (assetUrl helper uses BASE_URL)
- Global style system:
  - src/index.css (CSS variables, theme, global components/utilities)
  - tailwind.config.ts (Tailwind extensions, animations, color tokens)
- Language and localization:
  - src/contexts/LanguageContext.tsx (language state + RTL/LTR direction)
  - src/i18n/index.ts (Arabic/English translation resources)
- Main layout and navigation:
  - src/components/layout/Header.tsx
  - src/components/layout/Footer.tsx
  - src/components/ScrollToTop.tsx
- Main page sections:
  - src/components/sections/HeroSection.tsx
  - src/components/sections/ExperienceTimeline.tsx
  - src/components/sections/ServicesSection.tsx
  - src/components/sections/CoursesSection.tsx
  - src/components/sections/TestimonialsSection.tsx
- Key pages:
  - src/pages/Index.tsx
  - src/pages/Services.tsx
  - src/pages/ServiceDetail.tsx
  - src/pages/Courses.tsx
  - src/pages/CourseDetail.tsx
  - src/pages/Contact.tsx
- Data sources:
  - src/data/services.ts
  - src/data/projects.ts
  - src/data/testimonials.ts
  - Note: courses data currently lives in src/pages/Courses.tsx (not in src/data).

## Technical audit completed (already done)

### What was checked

- Entry flow and route setup correctness.
- Vite base path support and asset URL generation consistency.
- Tailwind and global CSS variables, gradients, and animation setup.
- Language switching, direction handling, and translation resources.
- Header/Footer/home sections and major service/course/contact pages.
- Content data sources and cross-file imports.
- Hardcoded contact links and reusable configuration usage.
- Current diagnostics status with TypeScript/ESLint problems scan.

### Key findings from the audit

- No active compile/lint errors were reported during checks.
- Multiple WhatsApp links were hardcoded across several components/pages instead of always using src/config/site.ts.
- dangerouslySetInnerHTML is used in selected translated content blocks:
  - src/components/sections/HeroSection.tsx
  - src/components/layout/Footer.tsx
- Service detail page previously included a completed-projects subsection that has now been removed.
- Experience timeline data is now bilingual for year labels (ar/en) to support localized date display.

### Editing guidance for future updates

- If a change affects text in both languages, update both Arabic and English in the same pass.
- Prefer centralized constants for shared external links (for example WhatsApp URLs).
- When changing route paths or deployment base, review both src/App.tsx and vite.config.ts.
- For visual changes, align src/index.css tokens with tailwind.config.ts theme extensions.
- When editing course content, note that the source is in src/pages/Courses.tsx.

## Summary of recent updates

### 1) Experience timeline updated
Location: src/components/sections/ExperienceTimeline.tsx

Changes:
- Added a new latest experience entry for MOBCO GROUP.
- English timeline entry:
  - 2026 - Present
  - Senior BIM Engineer | BIM Coordinator
  - Lead Technical Office BIM tasks.
  - Multi-disciplinary BIM models coordination in line with ISO 19650 standards.
  - KFUPM Central Laboratory Building - Alkhobar.
- Arabic timeline entry:
  - 2026 - حتى الآن
  - Senior BIM Engineer / BIM Coordinator
  - قيادة مهام المكتب الفني لنمذجة معلومات المباني (BIM).
  - تنسيق نماذج BIM متعددة التخصصات وفقًا لمعايير ISO 19650.
  - مبنى المختبر المركزي بجامعة الملك فهد للبترول والمعادن - الخبر.
- Updated the previous IDS Consulting date to:
  - 2025 - 2026 (Arabic and English)

Implementation note:
- Timeline year structure was converted to bilingual year fields (ar/en) to support localized date display.

### 2) Service detail page cleanup
Location: src/pages/ServiceDetail.tsx

Changes:
- Removed the full section:
  - من مشاريعنا المنجزة
  - From Our Completed Projects
- Removed related project cards and portfolio links from that section.
- Cleaned related unused code:
  - Removed projects import from src/data/projects.ts
  - Removed local proofProjects variable

## Why this file exists
This document is a quick project reference for recent content and structure changes, to help future edits stay consistent.
