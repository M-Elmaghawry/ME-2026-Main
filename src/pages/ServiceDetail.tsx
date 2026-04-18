import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { services } from '@/data/services';
import { testimonials } from '@/data/testimonials';
import { projects } from '@/data/projects';
import { assetUrl } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  CheckCircle,
  Users,
  Star,
  Award,
  Phone,
  UserCheck,
} from 'lucide-react';

/* ───────── trust stats ───────── */
const trustStats = [
  { value: '+13', labelAr: 'سنوات خبرة', labelEn: 'Years Experience' },
  { value: '+250', labelAr: 'مشروع منجز', labelEn: 'Projects Completed' },
  { value: '+1500', labelAr: 'متدرب', labelEn: 'Students Trained' },
  { value: '+20', labelAr: 'شركة', labelEn: 'Companies' },
];

/* ───────── certifications ───────── */
const certifications = [
  { ar: 'Autodesk Certified Professional', en: 'Autodesk Certified Professional' },
  { ar: 'BIM Professional – ISO 19650', en: 'BIM Professional – ISO 19650' },
  { ar: 'Revit Structure & Architecture', en: 'Revit Structure & Architecture' },
  { ar: 'Navisworks Manage', en: 'Navisworks Manage' },
];

/* ───────── client logos (first 8) ───────── */
const clientLogos = [
  { name: 'دار وإعمار', logo: '/clients/01-شركة-دار-وإعمار.png' },
  { name: 'الصالح للمقاولات', logo: '/clients/02-شركة-الصالح-للمقاولات.png' },
  { name: 'Gulf Consult', logo: '/clients/03-Gulf-Consult.png' },
  { name: 'مكتب فارس', logo: '/clients/04-مكتب-فارس-الهندسى.png' },
  { name: 'Saudi Railways', logo: '/clients/05-خطوط-سكك-الحديد-السعودية-sar.png' },
  { name: 'الغانم للمقاولات', logo: '/clients/10-شركة-الغانم-للمقاولات.png' },
  { name: 'IDS Consulting', logo: '/clients/08-IDS-Consulting.png' },
  { name: 'Kayan Academy', logo: '/clients/13-Kayan-Academy.png' },
];

/* ───────── fade-up variant ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

/* ═══════════════════════════════════════════════════════════════ */
const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language, direction } = useLanguage();
  const isAr = language === 'ar';
  const BackArrow = direction === 'rtl' ? ArrowRight : ArrowLeft;

  const service = services.find(s => s.id === id);

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 text-center">
          <h1 className="text-2xl">{isAr ? 'الخدمة غير موجودة' : 'Service not found'}</h1>
          <Link to="/services" className="text-blue-grotto mt-4 inline-block">
            {isAr ? 'العودة للخدمات' : 'Back to Services'}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = service.icon;
  const t = (obj: { ar: string; en: string }) => (isAr ? obj.ar : obj.en);

  /* pick 3 testimonials */
  const proofTestimonials = testimonials.slice(0, 3);
  /* pick 3 project images */
  const proofProjects = projects.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>

        {/* ══════════════════════════════════════
            1. HOOK — full-width gradient hero
        ══════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[linear-gradient(to_bottom,hsl(var(--background))_0%,hsl(var(--navy))_65%)] pt-32 pb-20">
          {/* decorative blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -start-40 h-96 w-96 rounded-full bg-blue/10 blur-3xl" />
            <div className="absolute -bottom-32 -end-32 h-80 w-80 rounded-full bg-blue/30 blur-3xl" />
          </div>

          <div className="section-container relative z-10">
            {/* back button */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <Link to="/services">
                <Button variant="ghost" className="mb-8 text-foreground/70 hover:text-foreground hover:bg-muted/50">
                  <BackArrow className="w-4 h-4 me-2" />
                  {isAr ? 'العودة للخدمات' : 'Back to Services'}
                </Button>
              </Link>
            </motion.div>

            <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
              {/* icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-navy to-blue flex items-center justify-center shadow-2xl"
              >
                <Icon className="w-12 h-12 text-white" />
              </motion.div>

              {/* title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold text-white leading-tight"
              >
                {t(service.title)}
              </motion.h1>

              {/* subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-white/75 leading-relaxed"
              >
                {t(service.fullDescription)}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Button
                  variant="whatsapp"
                  size="lg"
                  onClick={() => window.open('https://wa.me/201096189832', '_blank')}
                >
                  <MessageCircle className="w-5 h-5" />
                  {isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
                </Button>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    <Phone className="w-5 h-5 me-2" />
                    {isAr ? 'تواصل معنا' : 'Contact Us'}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            2. TRUST — stats + certs + logos
        ══════════════════════════════════════ */}
        <section className="py-16 bg-muted/40 border-b border-border">
          <div className="section-container space-y-12">

            {/* stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustStats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="neu-card p-6 text-center"
                >
                  <p className="text-4xl font-bold text-blue">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{isAr ? stat.labelAr : stat.labelEn}</p>
                </motion.div>
              ))}
            </div>

            {/* star rating visual */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {isAr ? 'تقييم المتدربين والعملاء على جميع المنصات' : 'Trainees & clients rating across all platforms'}
              </p>
            </div>

            {/* certifications */}
            <div>
              <h3 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                {isAr ? 'الشهادات والاعتمادات' : 'Certifications & Credentials'}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {certifications.map((cert, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue/30 bg-blue/5 text-sm font-medium text-foreground"
                  >
                    <Award className="w-4 h-4 text-blue" />
                    {t(cert)}
                  </span>
                ))}
              </div>
            </div>

            {/* client logos marquee */}
            <div>
              <h3 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                {isAr ? 'عملاء وثقوا بنا' : 'Clients Who Trusted Us'}
              </h3>
              <div className="overflow-hidden" style={{ direction: 'ltr' }}>
                <div className="flex gap-6 animate-client-logos" style={{ width: 'max-content' }}>
                  {[...clientLogos, ...clientLogos].map((client, i) => (
                    <div
                      key={i}
                      className="neu-card flex-shrink-0 p-3 flex items-center justify-center"
                      style={{ width: '148px', height: '96px' }}
                    >
                      <img
                        src={assetUrl(client.logo)}
                        alt={client.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <style>{`
                @keyframes client-logos {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-client-logos {
                  animation: client-logos 35s linear infinite;
                }
              `}</style>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════
            3. TARGET — who is this for?
        ══════════════════════════════════════ */}
        <section className="py-20">
          <div className="section-container">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-blue/10 text-blue text-sm font-semibold mb-4">
                {isAr ? 'لمن هذه الخدمة؟' : 'Who Is This For?'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">
                {isAr ? 'هذه الخدمة مناسبة لك إذا كنت…' : 'This service is right for you if you are…'}
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {service.targets.map((target, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex items-start gap-4 neu-card p-5"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <UserCheck className="w-5 h-5 text-blue" />
                  </div>
                  <p className="font-medium leading-relaxed">{t(target)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            4. VALUE — benefits
        ══════════════════════════════════════ */}
        <section className="py-20 bg-muted/30">
          <div className="section-container">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-semibold mb-4">
                {isAr ? 'القيمة التي ستحصل عليها' : 'What You Will Get'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">
                {isAr ? 'لماذا تختارنا لهذه الخدمة؟' : 'Why Choose Us for This Service?'}
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {service.benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex items-start gap-3 p-5 neu-card"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t(benefit)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            5. PROCESS — how we work
        ══════════════════════════════════════ */}
        <section className="py-20">
          <div className="section-container">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-blue/10 text-blue text-sm font-semibold mb-4">
                {isAr ? 'منهجية العمل' : 'Our Process'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">
                {isAr ? 'كيف نعمل معك خطوة بخطوة' : 'How We Work With You, Step by Step'}
              </h2>
            </motion.div>

            <div className="relative max-w-3xl mx-auto">
              {/* vertical connector line */}
              <div className="absolute start-8 top-6 bottom-6 w-px bg-border hidden md:block" />

              <div className="space-y-6">
                {service.process.map((step, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    className="relative flex gap-6 items-start"
                  >
                    {/* step number */}
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-navy to-blue text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                      {i + 1}
                    </div>
                    {/* content */}
                    <div className="neu-card flex-1 p-5">
                      <h3 className="font-bold text-base mb-1">{t(step.title)}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t(step.desc)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            6. PROOF — testimonials + projects
        ══════════════════════════════════════ */}
        <section className="py-20 bg-muted/30">
          <div className="section-container">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 text-sm font-semibold mb-4">
                {isAr ? 'ماذا يقول عملاؤنا' : 'What Our Clients Say'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">
                {isAr ? 'نتائج حقيقية من عملاء حقيقيين' : 'Real Results from Real Clients'}
              </h2>
            </motion.div>

            {/* testimonials */}
            <div className="grid md:grid-cols-3 gap-6 mb-14">
              {proofTestimonials.map((t_, i) => (
                <motion.div
                  key={t_.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="neu-card p-6 flex flex-col gap-4"
                >
                  {/* stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    "{isAr ? t_.textAr : t_.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy to-blue flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {t_.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t_.name}</p>
                      <p className="text-xs text-muted-foreground">{t_.role} — {t_.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* project images */}
            <div>
              <h3 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                {isAr ? 'من مشاريعنا المنجزة' : 'From Our Completed Projects'}
              </h3>
              <div className="grid md:grid-cols-3 gap-5">
                {proofProjects.map((proj, i) => (
                  <motion.div
                    key={proj.id}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                  >
                    <Link to={`/portfolio/${proj.id}`} className="group block neu-card overflow-hidden">
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={assetUrl(proj.image)}
                          alt={isAr ? proj.title.ar : proj.title.en}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {isAr ? 'عرض المشروع' : 'View Project'}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-sm">{isAr ? proj.title.ar : proj.title.en}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isAr ? proj.location.ar : proj.location.en} · {proj.year}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            7. CONVERSION — final CTA (two cards)
        ══════════════════════════════════════ */}
        <section className="py-16">
          <div className="section-container">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto"
            >
              {/* WhatsApp card — blue */}
              <div className="neu-card p-8 bg-gradient-to-br from-navy to-blue text-white flex flex-col items-center justify-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold">
                  {isAr ? 'تواصل سريع عبر واتساب' : 'Quick WhatsApp Chat'}
                </h3>
                <p className="text-white/75 text-sm">
                  {isAr ? 'رد سريع خلال دقائق' : 'Quick reply within minutes'}
                </p>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-navy"
                  onClick={() => window.open('https://wa.me/201096189832', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 me-2" />
                  {isAr ? 'ابدأ المحادثة' : 'Start Chat'}
                </Button>
              </div>

              {/* Contact page card — white */}
              <div className="neu-card p-8 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue/10 flex items-center justify-center">
                  <Phone className="w-7 h-7 text-blue" />
                </div>
                <h3 className="text-xl font-bold">
                  {isAr ? 'أرسل طلبك بالتفصيل' : 'Send Your Request in Detail'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {isAr ? 'ملأ نموذج التواصل بتفاصيل مشروعك' : 'Fill the contact form with your project details'}
                </p>
                <Link to="/contact">
                  <Button variant="outline">
                    <Phone className="w-4 h-4 me-2" />
                    {isAr ? 'صفحة التواصل' : 'Contact Page'}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ServiceDetail;
