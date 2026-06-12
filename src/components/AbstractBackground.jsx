import React from 'react';

const AbstractBackground = ({ activeTheme }) => {
  // Geometries for each theme
  const renderGeometry = () => {
    switch(activeTheme) {
      case 'kurinji': // Mountains (Interlocking Triangles)
        return (
          <svg className="w-full h-full text-term-accent opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.2">
             <polygon points="50,10 90,90 10,90" className="bg-shape-1" />
             <polygon points="50,30 80,90 20,90" className="bg-shape-2" />
             <polygon points="50,50 70,90 30,90" className="bg-shape-3" />
          </svg>
        );
      case 'mullai': // Forests (Concentric circles / leaves)
        return (
          <svg className="w-full h-full text-term-accent opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.2">
             <circle cx="30" cy="50" r="20" className="bg-shape-1" />
             <circle cx="70" cy="50" r="25" className="bg-shape-2" />
             <circle cx="50" cy="30" r="15" className="bg-shape-3" />
          </svg>
        );
      case 'marutham': // Plains (Grids / Waves)
        return (
          <svg className="w-full h-full text-term-accent opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.2">
             <line x1="0" y1="20" x2="100" y2="20" className="bg-shape-1" />
             <line x1="0" y1="50" x2="100" y2="50" className="bg-shape-2" />
             <line x1="0" y1="80" x2="100" y2="80" className="bg-shape-3" />
             <line x1="20" y1="0" x2="20" y2="100" className="bg-shape-1" />
             <line x1="80" y1="0" x2="80" y2="100" className="bg-shape-2" />
          </svg>
        );
      case 'neithal': // Coastal (Sine Waves)
        return (
          <svg className="w-full h-full text-term-accent opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.2">
             <path d="M0,50 Q25,25 50,50 T100,50" className="bg-shape-1" />
             <path d="M0,60 Q25,35 50,60 T100,60" className="bg-shape-2" />
             <path d="M0,70 Q25,45 50,70 T100,70" className="bg-shape-3" />
          </svg>
        );
      case 'palai': // Drylands (Sunburst/Rays)
        return (
          <svg className="w-full h-full text-term-accent opacity-30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.2">
             <line x1="50" y1="50" x2="10" y2="10" className="bg-shape-1" />
             <line x1="50" y1="50" x2="90" y2="10" className="bg-shape-2" />
             <line x1="50" y1="50" x2="10" y2="90" className="bg-shape-3" />
             <line x1="50" y1="50" x2="90" y2="90" className="bg-shape-4" />
          </svg>
        );
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20 transition-all duration-1000">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw]">
        {renderGeometry()}
      </div>
    </div>
  );
};

export default AbstractBackground;
