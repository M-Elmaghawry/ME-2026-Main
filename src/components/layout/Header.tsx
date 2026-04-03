import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
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
            <img
              src="/Mahmoud Elmekawy Logo.png"
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
              onClick={() => window.open('https://wa.me/201096189832', '_blank')}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden lg:inline">{t('hero.cta.whatsapp')}</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 top-[60px] bg-background z-50 overflow-y-auto"
            >
              <div className="flex flex-col gap-2 p-4 pt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-4 text-base font-medium transition-colors rounded-lg hover:bg-muted ${
                      isActive(item.href) 
                        ? 'text-foreground bg-muted' 
                        : 'text-foreground/80 hover:text-foreground'
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ))}
                <Button
                  variant="whatsapp"
                  className="mt-4"
                  size="lg"
                  onClick={() => {
                    window.open('https://wa.me/201096189832', '_blank');
                    setIsOpen(false);
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('hero.cta.whatsapp')}
                </Button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
