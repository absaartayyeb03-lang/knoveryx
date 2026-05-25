import TextAnimation from './TextAnimation';
import { 
  BookOpen, Globe, Laptop, Briefcase, 
  Users, Microscope, ArrowRight, CheckCircle2 
} from 'lucide-react';

const Empower = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="relative pt-20 pb-24 lg:pt-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Main Hero Header */}
          <div className="text-center max-w-4xl mx-auto mb-20">
            <TextAnimation delay={0.3}>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Empowering Learners <br />
              <span className="text-[#46A758]">Across Every Discipline</span>
            </h1>
            </TextAnimation>
            <TextAnimation>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              SkillSphere Education is an interdisciplinary digital learning platform offering 
              academic support, teacher training, and professional development across global curricula. 
              Our mission is to empower learners through accessible, example-rich instruction.
            </p>
            </TextAnimation>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                Get Started <ArrowRight size={20} />
              </button>
              <div className="flex items-center gap-2 px-6 text-gray-500 font-medium">
                <CheckCircle2 size={20} className="text-[#ff6a97]" /> Inclusive Pedagogy
              </div>
            </div>
          </div>

          {/* Integrated Curriculum Grid (The "Extended" Part) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Academic Support */}
            <div className="p-8 bg-gray-50 rounded-[32px] border border-transparent hover:border-[#ff6a97]/30 transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <BookOpen className="text-[#ff6a97]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Academic Support</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Cambridge IGCSE, GCE O/A Levels, IB, STEM, Humanities, and Global Perspectives. 
                Includes research coaching and academic writing.
              </p>
            </div>

            {/* International Test Prep */}
            <div className="p-8 bg-gray-50 rounded-[32px] border border-transparent hover:border-[#ff6a97]/30 transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Globe className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">International Test Prep</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                IELTS, TOEFL, PTE, and Duolingo. Specialized training for TESOL, TEFL, and TESL certifications.
              </p>
            </div>

            {/* Software & Digital Skills */}
            <div className="p-8 bg-gray-50 rounded-[32px] border border-transparent hover:border-[#ff6a97]/30 transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Laptop className="text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Software & Digital</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Microsoft Office, Adobe Suite, Figma, Coding, Data Science, Cybersecurity, and AI tools integration.
              </p>
            </div>

            {/* Teacher Training */}
            <div className="p-8 bg-gray-50 rounded-[32px] border border-transparent hover:border-[#ff6a97]/30 transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Users className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Teacher Training</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                ESL/EFL methodology, curriculum design, digital pedagogy, and professional certification pathways.
              </p>
            </div>

            {/* Professional Development */}
            <div className="p-8 bg-gray-50 rounded-[32px] border border-transparent hover:border-[#ff6a97]/30 transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Briefcase className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Professional Development</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Business Communication, Public Speaking, Leadership, Career Coaching, and Time Management.
              </p>
            </div>

            {/* Academic Tools & Research */}
            <div className="p-8 bg-gray-50 rounded-[32px] border border-transparent hover:border-[#ff6a97]/30 transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Microscope className="text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Research & LMS</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Expertise in SPSS, NVivo, Zotero, Mendeley, and LMS platforms like Moodle, Teams, and Google Classroom.
              </p>
            </div>

          </div>
        </div>

        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#ff6a97]/5 blur-[120px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-500/5 blur-[120px] -z-10 rounded-full"></div>
      </section>
    </div>
  );
};

export default Empower;
