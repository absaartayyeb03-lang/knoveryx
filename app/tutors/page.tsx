import { Suspense } from "react";
import SearchInput from "@/components/SearchInput";
import FilterDropdown from "@/components/FilterDropdown";
import TeacherCard from "@/components/TeacherCard";
import { getAllTeachers } from "@/lib/actions/teacher";

export default async function Page({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  
  const topic = params.topic || "";
  const subject = params.subject || "";
  const page = params.page ? parseInt(params.page) : 1;

  const teachers = await getAllTeachers({
    topic,
    subject,
    page,
    limit: 10
  });

  return (
    <main className="bg-gray-50 min-h-screen font-sans">
      {/* NEW: Landing Section Header */}
      <div className="bg-[#002657] pt-28 pb-24 px-4 md:px-10 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#366740] opacity-10 blur-[100px] -mr-32 -mt-32" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-[#eaffee] font-bold uppercase tracking-[0.2em] text-sm mb-4">
            International Faculty
          </h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-2xl">
            Find the Perfect Tutor for <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to from-white to-gray-100">
              Global Excellence.
            </span>
          </h1>
          <p className="text-blue-100/70 mt-6 text-lg max-w-xl leading-relaxed">
            Connect with expert educators specialized in British, International, and Professional curriculums across the globe.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 -mt-10">
        {/* Filter Bar Layout */}
        <div className="bg-white p-6 rounded-[2rem] border-none mb-10 flex flex-wrap items-end gap-6 shadow-xl shadow-blue-900/5 relative z-20">
          <FilterDropdown 
            label="I want to learn" 
            name="subject" 
            options={["English", "Spanish", "French", "German"]} 
          />
          
          <div className="flex-1 min-w-[250px]">
            <label className="text-[10px] text-gray-400 mb-2 font-black block uppercase tracking-wider">
              Search by name or keyword
            </label>
            <Suspense fallback={<div className="h-10 bg-gray-100 animate-pulse rounded-lg"/>}>
               <SearchInput placeholder="Search by name or keyword..." />
            </Suspense>
          </div>

          <button className="bg-[#366740] hover:bg-[#2d5635] text-white font-bold h-12 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-900/20">
            Apply Filters
          </button>
        </div>

        {/* Results Info */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-2 h-8 bg-[#033D8B] rounded-full inline-block" />
            {teachers.length} tutors available
          </h1>
        </div>

        {/* The Teacher List */}
        <div className="space-y-6 pb-20">
          {teachers.length > 0 ? (
            teachers.map((teacher: any) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-300 flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                 <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900">No tutors found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}