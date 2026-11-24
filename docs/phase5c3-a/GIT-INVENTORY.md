> Archived Phase 5C.3-A audit, before the development checkpoint. Git counts and statements about uncommitted work describe audit time. Current setup/status: [DEVELOPMENT-HANDOVER.md](../DEVELOPMENT-HANDOVER.md). Original large evidence folders are intentionally excluded from Git.

# Complete Git release inventory

No source files were changed by Phase 5C.3-A. Branch `fix/seo-language-consistency`; HEAD `616197ee00442cf90a38436a52f6f994b9b84e0a`.

Production baseline: `77ba313d8617a082d349f383e876ac34013eb551`. There are 119 production-relative source paths, including 86 working-tree paths (26 tracked modifications and 60 untracked files). The remaining rows are already committed on the development branch. Exact hashes are in `git-inventory.json`; all 410 original source files are covered by `source-baseline.json`.

| Production-relative status | Path | Working-tree status |
| --- | --- | --- |
| `??` | `docs/PHASE-5C2-F.md` | `??` |
| `??` | `docs/PHASE-5C2-RENDERER-RESOLUTION.md` | `??` |
| `??` | `docs/PHASE-5C2.md` | `??` |
| `M` | `eslint.config.js` | clean; committed branch change |
| `A` | `experiments/bilingual-ssr/App.tsx` | `M` |
| `A` | `experiments/bilingual-ssr/entry-client.tsx` | clean; committed branch change |
| `A` | `experiments/bilingual-ssr/entry-server.tsx` | clean; committed branch change |
| `A` | `experiments/bilingual-ssr/env.d.ts` | clean; committed branch change |
| `A` | `experiments/bilingual-ssr/i18n.ts` | `M` |
| `A` | `experiments/bilingual-ssr/index.html` | `M` |
| `A` | `experiments/bilingual-ssr/language.ts` | clean; committed branch change |
| `A` | `experiments/bilingual-ssr/LanguageContext.tsx` | clean; committed branch change |
| `A` | `experiments/bilingual-ssr/LanguageLink.tsx` | clean; committed branch change |
| `A` | `experiments/bilingual-ssr/navigation.ts` | clean; committed branch change |
| `A` | `experiments/bilingual-ssr/README.md` | `M` |
| `A` | `experiments/bilingual-ssr/render-phase.ts` | clean; committed branch change |
| `A` | `experiments/bilingual-ssr/RenderPhaseProvider.tsx` | clean; committed branch change |
| `A` | `experiments/bilingual-ssr/routes.ts` | clean; committed branch change |
| `A` | `experiments/bilingual-ssr/tsconfig.json` | clean; committed branch change |
| `A` | `experiments/bilingual-ssr/VALIDATION.md` | `M` |
| `A` | `experiments/bilingual-ssr/vite.config.ts` | `M` |
| `M` | `package-lock.json` | clean; committed branch change |
| `M` | `package.json` | `M` |
| `??` | `public/font-licenses.txt` | `??` |
| `??` | `scripts/build-ssg.mjs` | `??` |
| `A` | `scripts/build-ssr-poc.mjs` | clean; committed branch change |
| `??` | `scripts/compare-ssg-renderers.mjs` | `??` |
| `??` | `scripts/inspect-ssg-paint.mjs` | `??` |
| `??` | `scripts/ssg-browser-utils.mjs` | `??` |
| `??` | `scripts/ssg-html.mjs` | `??` |
| `??` | `scripts/ssg-integrity.mjs` | `??` |
| `??` | `scripts/test-contact-retry.mjs` | `??` |
| `??` | `scripts/test-ssg-browser.mjs` | `??` |
| `??` | `scripts/test-ssg-interactions.mjs` | `??` |
| `A` | `scripts/test-ssr-poc.mjs` | clean; committed branch change |
| `??` | `scripts/trace-ssg-layout.mjs` | `??` |
| `??` | `scripts/vendor-site-fonts.mjs` | `??` |
| `M` | `src/App.tsx` | `M` |
| `??` | `src/app/RouteContent.tsx` | `??` |
| `??` | `src/assets/fonts/google-fonts-source.css` | `??` |
| `??` | `src/assets/fonts/inter-cyrillic-71d5ee93cc1e.woff2` | `??` |
| `??` | `src/assets/fonts/inter-cyrillic-ext-ca157063339a.woff2` | `??` |
| `??` | `src/assets/fonts/inter-greek-1be3448e292f.woff2` | `??` |
| `??` | `src/assets/fonts/inter-greek-ext-6e9e020a25f9.woff2` | `??` |
| `??` | `src/assets/fonts/inter-latin-3100e775e861.woff2` | `??` |
| `??` | `src/assets/fonts/inter-latin-ext-34b9c504cab7.woff2` | `??` |
| `??` | `src/assets/fonts/inter-OFL.txt` | `??` |
| `??` | `src/assets/fonts/inter-vietnamese-5c66f9e07e90.woff2` | `??` |
| `??` | `src/assets/fonts/noto-sans-arabic-arabic-ce85091f0209.woff2` | `??` |
| `??` | `src/assets/fonts/noto-sans-arabic-latin-ext-27fe6458d54b.woff2` | `??` |
| `??` | `src/assets/fonts/noto-sans-arabic-latin-fed070abc960.woff2` | `??` |
| `??` | `src/assets/fonts/noto-sans-arabic-math-2c7bffd56133.woff2` | `??` |
| `??` | `src/assets/fonts/noto-sans-arabic-symbols-090786c8626f.woff2` | `??` |
| `??` | `src/assets/fonts/notosansarabic-OFL.txt` | `??` |
| `??` | `src/assets/fonts/sources.json` | `??` |
| `M` | `src/components/ContactForm.tsx` | `M` |
| `A` | `src/components/LanguageLink.tsx` | clean; committed branch change |
| `M` | `src/components/layout/Footer.tsx` | `M` |
| `M` | `src/components/layout/Header.tsx` | clean; committed branch change |
| `M` | `src/components/NavLink.tsx` | clean; committed branch change |
| `M` | `src/components/PageSeo.tsx` | `M` |
| `M` | `src/components/RouteErrorMessage.tsx` | clean; committed branch change |
| `M` | `src/components/sections/CoursesSection.tsx` | clean; committed branch change |
| `M` | `src/components/sections/CTASection.tsx` | clean; committed branch change |
| `M` | `src/components/sections/HeroSection.tsx` | `M` |
| `M` | `src/components/sections/ServicesSection.tsx` | clean; committed branch change |
| `M` | `src/components/services/ServiceFinalCTA.tsx` | clean; committed branch change |
| `M` | `src/components/services/ServiceHero.tsx` | clean; committed branch change |
| `M` | `src/components/services/useServicePage.ts` | `M` |
| `M` | `src/contexts/LanguageContext.tsx` | `M` |
| `??` | `src/contexts/RenderProvider.tsx` | `??` |
| `??` | `src/contexts/renderState.ts` | `??` |
| `??` | `src/contexts/RoutingContext.ts` | `??` |
| `??` | `src/fonts.css` | `??` |
| `A` | `src/hooks/useLocalizedNavigation.ts` | `M` |
| `??` | `src/i18n/createPageI18n.ts` | `??` |
| `M` | `src/i18n/index.ts` | `M` |
| `??` | `src/i18n/resources.ts` | `??` |
| `M` | `src/index.css` | `M` |
| `??` | `src/lib/legacy.ts` | `??` |
| `A` | `src/lib/navigation.ts` | clean; committed branch change |
| `??` | `src/lib/routePaths.ts` | `??` |
| `??` | `src/lib/routes.ts` | `??` |
| `M` | `src/lib/seo.ts` | `M` |
| `A` | `src/lib/urls.ts` | `M` |
| `M` | `src/pages/About.tsx` | `M` |
| `M` | `src/pages/ContactResult.tsx` | `M` |
| `M` | `src/pages/CourseDetail.tsx` | `M` |
| `M` | `src/pages/Courses.tsx` | clean; committed branch change |
| `M` | `src/pages/NotFound.tsx` | `M` |
| `M` | `src/pages/Portfolio.tsx` | clean; committed branch change |
| `M` | `src/pages/PrivacyPolicy.tsx` | `M` |
| `M` | `src/pages/ProjectDetail.tsx` | clean; committed branch change |
| `M` | `src/pages/ServiceDetail.tsx` | clean; committed branch change |
| `M` | `src/pages/Services.tsx` | clean; committed branch change |
| `M` | `src/pages/Terms.tsx` | `M` |
| `??` | `ssg/App.tsx` | `??` |
| `??` | `ssg/compare-entry.tsx` | `??` |
| `??` | `ssg/diagnostics/entry-pipeable.tsx` | `??` |
| `??` | `ssg/diagnostics/probes.ts` | `??` |
| `??` | `ssg/diagnostics/vite.contact.config.ts` | `??` |
| `??` | `ssg/entry-client.tsx` | `??` |
| `??` | `ssg/entry-server.tsx` | `??` |
| `??` | `ssg/index.html` | `??` |
| `??` | `ssg/render-readable.ts` | `??` |
| `??` | `ssg/tsconfig.json` | `??` |
| `??` | `ssg/types.ts` | `??` |
| `??` | `ssg/vite.config.ts` | `??` |
| `??` | `ssg/web-stream.d.ts` | `??` |
| `??` | `tests/fixtures/emailjs-browser.mjs` | `??` |
| `??` | `tests/fixtures/emailjs-config.mjs` | `??` |
| `A` | `tests/navigation-language.test.mjs` | `M` |
| `M` | `tests/routing.test.mjs` | clean; committed branch change |
| `A` | `tests/seo-language.test.mjs` | clean; committed branch change |
| `??` | `tests/ssg-contract.test.mjs` | `??` |
| `??` | `tests/ssg-fonts.test.mjs` | `??` |
| `??` | `tests/ssg-integrity.test.mjs` | `??` |
| `??` | `tests/ssg-renderer.test.mjs` | `??` |
| `M` | `vite.config.ts` | clean; committed branch change |
