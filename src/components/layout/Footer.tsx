import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Youtube, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Twitter,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const socialLinks = [
  { icon: Youtube, href: 'https://www.youtube.com/@Elmekawy-Bim', label: 'YouTube' },
  { icon: Facebook, href: 'https://www.facebook.com/elmekawybim', label: 'Facebook' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/elmekawybim/', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/m.elmekawy20/', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/MElmekawy3', label: 'Twitter' },
];

const Footer = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const navLinks = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'services', href: '/services' },
    { key: 'courses', href: '/courses' },
    { key: 'portfolio', href: '/portfolio' },
    { key: 'contact', href: '/contact' },
  ];

  return (
    <footer className="bg-navy text-white">
      <div className="section-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <p className="font-bold text-xl mb-6">
              {language === 'ar' ? 'المهندس محمود المكاوى' : 'Eng. Mahmoud Elmekawy'}
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-baby-blue transition-colors text-sm"
                  >
                    {t(`nav.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6">{t('footer.contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="w-5 h-5 text-baby-blue" />
                <a
                  href="https://wa.me/201096189832"
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="transition-colors duration-200 group-hover:text-baby-blue hover:text-baby-blue"
                  style={{ textDecoration: 'none' }}
                >
                  +20 109 618 9832
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70 group">
                <Phone className="w-5 h-5 text-baby-blue" />
                <a
                  href="https://wa.me/99531175199"
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="transition-colors duration-200 group-hover:text-baby-blue hover:text-baby-blue"
                  style={{ textDecoration: 'none' }}
                >
                  +99 53 117 5199
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="w-5 h-5 text-baby-blue" />
                <span>contact@elmekawy-bim.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <MapPin className="w-5 h-5 text-baby-blue" />
                <div className="flex flex-col">
                  <span>{language === 'ar' ? 'المنصورة - مصر' : 'Mansoura - Egypt'}</span>
                  <span>{language === 'ar' ? 'الرياض - السعودية' : 'Riyadh - KSA'}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-6">{t('footer.followUs')}</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-baby-blue transition-colors group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-white group-hover:text-navy transition-colors" />
                  </a>
                );
              })}
            </div>
            <img
              src="/Mahmoud Elmekawy Logo-2.png"
              alt="Mahmoud Elmekawy Logo"
              className="w-3/4 mx-auto block object-contain opacity-90"
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/50">
          <p>
            © {new Date().getFullYear()}{' '}
            {language === 'ar' ? 'م. محمود المكاوى' : 'Eng. Mahmoud Elmekawy'}.{' '}
            {t('footer.rights')}.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a href="/privacy-policy" className="hover:text-baby-blue transition-colors">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </a>
            <span>|</span>
            <a href="/terms" className="hover:text-baby-blue transition-colors">
              {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
