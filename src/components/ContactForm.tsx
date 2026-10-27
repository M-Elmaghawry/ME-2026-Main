import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs from '@emailjs/browser';
import { Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { services } from '@/data/services';
import { WHATSAPP_LINK } from '@/config/site';
import { CONTACT_THROTTLE_MS, contactSchema, emailStorage, hasEmailConfiguration, internationalPhone, type ContactValues } from '@/lib/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ContactCaptcha from '@/components/ContactCaptcha';

const countries = [
  ['+20', 'مصر', 'Egypt'], ['+966', 'السعودية', 'Saudi Arabia'], ['+971', 'الإمارات', 'UAE'],
  ['+965', 'الكويت', 'Kuwait'], ['+974', 'قطر', 'Qatar'], ['+973', 'البحرين', 'Bahrain'],
  ['+964', 'العراق', 'Iraq'], ['+90', 'تركيا', 'Turkey'], ['+34', 'إسبانيا', 'Spain'], ['', 'أخرى', 'Other'],
];
const defaults: ContactValues = { name: '', email: '', countryCode: '+20', phone: '', company: '', service: '', message: '', website: '' };

export default function ContactForm() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const text = (ar: string, en: string) => isAr ? ar : en;
  const [status, setStatus] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const inFlight = useRef(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaVersion, setCaptchaVersion] = useState(0);
  const captchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema(language, services.map((service) => service.id))), defaultValues: defaults,
  });
  const configuration = [import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, import.meta.env.VITE_EMAILJS_PUBLIC_KEY];
  const configured = hasEmailConfiguration(configuration);

  const submit = handleSubmit(async (values) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus(null);
    try {
      if (!configured) throw { status: 503 };
      if (captchaKey && !captchaToken) {
        setStatus({ kind: 'error', message: text('أكمل التحقق قبل الإرسال.', 'Complete verification before sending.') });
        return;
      }
      const service = services.find((item) => item.id === values.service);
      await emailjs.send(configuration[0], configuration[1], {
        from_name: values.name, from_email: values.email,
        phone: internationalPhone(values.phone, values.countryCode),
        company: values.company, service: service ? service.title[language] : '', message: values.message,
        ...(captchaKey ? { 'g-recaptcha-response': captchaToken } : {}),
      }, {
        publicKey: configuration[2], blockHeadless: true,
        limitRate: { id: 'elmekawy-contact', throttle: CONTACT_THROTTLE_MS }, storageProvider: emailStorage,
      });
      reset(defaults);
      setStatus({ kind: 'success', message: text('تم إرسال رسالتك بنجاح.', 'Your message has been sent successfully.') });
    } catch (error) {
      const code = (error as { status?: number })?.status;
      setStatus({ kind: 'error', message: code === 429
        ? text('يرجى الانتظار دقيقة قبل المحاولة مرة أخرى.', 'Please wait one minute before trying again.')
        : code === 503
          ? text('إرسال البريد غير متاح حاليًا. يمكنك التواصل عبر واتساب.', 'Email is currently unavailable. Please contact us via WhatsApp.')
          : text('تعذّر إرسال الرسالة. احتفظنا بما كتبته؛ حاول لاحقًا أو تواصل عبر واتساب.', 'Unable to send. Your entries are preserved; try later or contact us via WhatsApp.') });
    } finally {
      inFlight.current = false;
      setCaptchaToken('');
      setCaptchaVersion((version) => version + 1);
    }
  }, () => setStatus(null));

  const field = (name: keyof ContactValues) => ({
    id: `contact-${name}`, 'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
  });
  const error = (name: keyof ContactValues) => errors[name] && (
    <p id={`contact-${name}-error`} className="text-sm text-destructive mt-1">{errors[name]?.message}</p>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-6" aria-busy={isSubmitting}>
      {!configured && <p role="status" className="text-sm text-muted-foreground">{text('نموذج البريد غير متاح حاليًا.', 'The email form is currently unavailable.')} <a className="underline" href={WHATSAPP_LINK}>{text('تواصل عبر واتساب', 'Contact via WhatsApp')}</a></p>}
      <fieldset disabled={isSubmitting || !configured} className="space-y-6">
        <legend className="sr-only">{text('بيانات رسالة التواصل', 'Contact message details')}</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium mb-2">{text('الاسم (مطلوب)', 'Name (required)')}</label>
            <Input {...register('name')} {...field('name')} autoComplete="name" required maxLength={100} />{error('name')}
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium mb-2">{text('البريد الإلكتروني (مطلوب)', 'Email (required)')}</label>
            <Input {...register('email')} {...field('email')} type="email" dir="ltr" autoComplete="email" required maxLength={254} />{error('email')}
          </div>
        </div>
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium mb-2">{text('رقم الهاتف (اختياري)', 'Phone (optional)')}</label>
          <div className="flex gap-2">
            <select {...register('countryCode')} id="contact-countryCode" aria-label={text('مفتاح الدولة', 'Country calling code')} className="h-10 w-2/5 rounded-md border border-input bg-background px-2 text-sm">
              {countries.map(([code, ar, en]) => <option key={code} value={code}>{isAr ? ar : en}{code && ` (${code})`}</option>)}
            </select>
            <Input {...register('phone')} {...field('phone')} type="tel" dir="ltr" autoComplete="tel-national" maxLength={40} />
          </div>{error('phone')}
        </div>
        <div>
          <label htmlFor="contact-company" className="block text-sm font-medium mb-2">{text('الشركة (اختياري)', 'Company (optional)')}</label>
          <Input {...register('company')} {...field('company')} autoComplete="organization" maxLength={150} />{error('company')}
        </div>
        <div>
          <label htmlFor="contact-service" className="block text-sm font-medium mb-2">{text('الخدمة المطلوبة (اختياري)', 'Service (optional)')}</label>
          <select {...register('service')} {...field('service')} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">{text('-- اختر الخدمة --', '-- Select a service --')}</option>
            {services.map((service) => <option key={service.id} value={service.id}>{service.title[language]}</option>)}
          </select>{error('service')}
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium mb-2">{text('الرسالة (مطلوب)', 'Message (required)')}</label>
          <Textarea {...register('message')} {...field('message')} required minLength={10} maxLength={5000} rows={5} />{error('message')}
        </div>
        <div hidden aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input {...register('website')} id="contact-website" tabIndex={-1} autoComplete="off" />
        </div>
        <p className="text-sm text-muted-foreground">{text('تُرسل بيانات الرسالة عبر EmailJS للرد على طلبك. ', 'Your message is sent through EmailJS so we can respond. ')}<Link className="underline" to="/privacy-policy">{text('سياسة الخصوصية', 'Privacy policy')}</Link></p>
        {captchaKey && <ContactCaptcha key={captchaVersion} siteKey={captchaKey} onToken={setCaptchaToken} />}
        <Button type="submit" variant="hero" size="lg" className="w-full"><Send className="w-5 h-5" />{isSubmitting ? text('جاري الإرسال…', 'Sending…') : text('إرسال الرسالة', 'Send message')}</Button>
      </fieldset>
      <div aria-live="polite" aria-atomic="true">
        {status && <p role={status.kind === 'error' ? 'alert' : 'status'} className={status.kind === 'error' ? 'text-destructive' : 'text-green-700'}>{status.message} {status.kind === 'error' && <a href={WHATSAPP_LINK} className="underline">{text('واتساب', 'WhatsApp')}</a>}</p>}
        {errors.website && <p role="alert">{errors.website.message}</p>}
      </div>
    </form>
  );
}
