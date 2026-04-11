import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const marqueeItemsEn = ['BIM Implementation', 'BIM Coordination', 'Digital Construction', 'ISO 19650 Standards', '4D/5D BIM', 'Clash Detection', 'Infrastructure Modeling', 'BIM Training & Support', 'BIM Execution Planning', 'Revit Structure', 'Revit Architecture', 'Civil 3D', 'Navisworks', 'AutoCAD', 'InfraWorks', 'Dynamo Scripting', 'Autodesk Construction Cloud', 'Autodesk Forma'];

const marqueeItemsAr = ['تطبيق BIM', 'تنسيق BIM', 'البناء الرقمي', 'معايير ISO 19650', 'BIM رباعي وخماسي الأبعاد', 'كشف التعارضات', 'نمذجة البنية التحتية', 'تدريب ودعم BIM', 'تخطيط تنفيذ BIM', 'ريفيت إنشائي', 'ريفيت معماري', 'Civil 3D', 'Navisworks', 'أوتوكاد', 'InfraWorks', 'برمجة Dynamo', 'Autodesk Construction Cloud', 'Autodesk Forma'];

const MarqueeBar = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const items = isAr ? marqueeItemsAr : marqueeItemsEn;

  const renderItems = () =>
    items.map((item, i) => (
      <span key={i} className="inline-flex items-center mx-3">
        <span className="mr-3 text-gold">•</span>
        <span dir="auto">{item}</span>
      </span>
    ));

  return (
    <div className="w-full overflow-hidden bg-navy py-2 mt-0" style={{ direction: 'ltr' }}>
      <div className="animate-marquee whitespace-nowrap text-white text-lg font-semibold tracking-wide">
        {renderItems()}
        {renderItems()}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          width: max-content;
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MarqueeBar;
