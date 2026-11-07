import { WHATSAPP_LINK } from '@/config/site';
import ResponsiveImage from '@/components/ResponsiveImage';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (desktop.matches) setIsOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'services', href: '/services' },
    { key: 'courses', href: '/courses' },
    { key: 'portfolio', href: '/portfolio' },
    { key: 'contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? 'bg-background shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <ResponsiveImage priority sizes="200px"
              src={'/Mahmoud Elmekawy Logo.png'}
              alt="Mahmoud Elmekawy Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-muted ${
                  isActive(item.href) 
                    ? 'text-foreground bg-muted' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{t('common.language')}</span>
            </Button>

            {/* WhatsApp Button - Desktop */}
            <Button
              variant="whatsapp"
              size="sm"
              className="hidden md:flex"
              aria-label={language === 'ar' ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
              onClick={() => window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer')}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden lg:inline">{t('hero.cta.whatsapp')}</span>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label={language === 'ar' ? 'فتح قائمة التنقل' : 'Open navigation menu'}>
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'ar' ? 'right' : 'left'} dir={language === 'ar' ? 'rtl' : 'ltr'}
                closeLabel={language === 'ar' ? 'إغلاق القائمة' : 'Close menu'} aria-describedby={undefined} className="overflow-y-auto">
                <SheetTitle>{language === 'ar' ? 'التنقل' : 'Navigation'}</SheetTitle>
                <nav aria-label={language === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'} className="flex flex-col gap-2 pt-6">
                  {navItems.map((item) => <Link key={item.key} to={item.href} onClick={() => setIsOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className="px-4 py-4 rounded-lg hover:bg-muted focus-visible:outline focus-visible:outline-2">
                    {t(`nav.${item.key}`)}
                  </Link>)}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>


      </div>
    </motion.header>
  );
};

export default Header;
