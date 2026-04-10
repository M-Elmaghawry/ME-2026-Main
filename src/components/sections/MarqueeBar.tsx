import React from 'react';

const marqueeText = `BIM Implementation • BIM Coordination • Digital Construction • ISO 19650 Standards • 4D/5D BIM • Clash Detection • Infrastructure Modeling • BIM Training & Support • BIM Execution Planning • Revit Structure • Revit Architecture • Civil 3D • Navisworks • AutoCAD • InfraWorks • Dynamo Scripting •  Autodesk Construction Cloud •`;

const MarqueeBar = () => {
  return (
    <div className="w-full overflow-hidden bg-navy py-2 mt-0">
      <div className="whitespace-nowrap animate-marquee text-white text-lg font-semibold tracking-wide">
        {marqueeText}
        <span className="mx-8" />
        {marqueeText}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          min-width: 200%;
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MarqueeBar;
