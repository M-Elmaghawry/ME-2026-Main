import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import { useServicePage, serviceSectionId, type ServiceSectionProps } from './useServicePage';

export default function ServiceTestimonials({ service, presentation }: ServiceSectionProps) {
  const { isAr, reveal } = useServicePage();
  const selectedReviews = presentation.testimonialIds.flatMap(id => {
    const review = testimonials.find(item => item.id === id);
    return review ? [review] : [];
  });
  if (!selectedReviews.length) return null;
  return (
    <section className="bt-section bt-proof" aria-labelledby={serviceSectionId(service, 'testimonials')}>
      <div className="section-container">
        <div className="bt-section-head"><p className="bt-eyebrow">{isAr ? 'ماذا يقول عملاؤنا' : 'What Our Clients Say'}</p><h2 id={serviceSectionId(service, 'testimonials')}>{isAr ? 'نتائج حقيقية من عملاء حقيقيين' : 'Real Results from Real Clients'}</h2></div>
        <div className="bt-testimonials">{selectedReviews.map((review, i) => <motion.figure key={review.id} {...reveal} custom={i} className="bt-review">
          <div className="bt-review-top"><span className="bt-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, j) => <Star size={15} key={j} />)}</span><Quote size={25} strokeWidth={1.2} aria-hidden="true" /></div>
          <blockquote><p>{isAr ? review.textAr : review.text}</p></blockquote>
          <figcaption><span className="bt-avatar" aria-hidden="true">{review.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><div><strong dir="auto">{review.name}</strong><span dir="auto">{review.role}</span><span dir="auto">{review.company}</span></div></figcaption>
        </motion.figure>)}</div>
      </div>
    </section>
  );
}
