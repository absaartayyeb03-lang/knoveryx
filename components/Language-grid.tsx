import React from 'react';

const LanguageGrid = () => {
  const languages = [
    { name: "English", img: "/icons/english.webp", count: "33,602" },
    { name: "Spanish", img: "/icons/spain.webp", count: "10,057" },
    { name: "French", img: "/icons/french.webp", count: "3,713" },
    { name: "German", img: "/icons/germany.webp", count: "1,517" },
    { name: "Italian", img: "/icons/italian.webp", count: "2,542" },
    { name: "Chinese", img: "/icons/chinese.webp", count: "5,253" },
    { name: "Arabic", img: "/icons/arabic.webp", count: "3,653" },
    { name: "Japanese", img: "/icons/japnese.webp", count: "2,902" },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 lg:px-24 py-8">
      {languages.map((lang) => (
        <div
          key={lang.name}
          className="group border border-gray-200 flex items-center justify-between p-5 rounded-xl cursor-pointer hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            {/* Your WebP Image */}
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src={lang.img} 
                alt={`${lang.name} landmark`} 
                className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
            
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-800">{lang.name} tutors</span>
              <span className="text-xs text-gray-500 font-medium">{lang.count} teachers</span>
            </div>
          </div>
          
          <div className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </div>
      ))}
    </section>
  );
};

export default LanguageGrid;