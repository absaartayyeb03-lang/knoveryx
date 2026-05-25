import { ReactLenis } from "lenis/react";
import TextAnimation from "@/components/TextAnimation";
import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import HowItWorks from "@/components/HowItWorks";
import LanguageGrid from "@/components/Language-grid";
import { recentSessions } from "@/constants";
import Empower from "@/components/Empower";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import PromoSection from "@/components/PromoSection";
import { TeacherAttraction } from "@/components/TeacherAttraction";

const Page = () => {
  return (
    <ReactLenis root>
      <main>
        {/* ================= HERO SECTION ================= */}
        {/* <section className="bg-[#174933] px-6 py-10 md:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center lg:text-left">
            <TextAnimation delay={0.3}>
              <h1 className="text-3xl text-[#ffffff] md:text-4xl lg:text-6xl font-bold">
                Learn faster with your best tutor.
              </h1>
            </TextAnimation>
            <TextAnimation delay={0.5}>
              <p className="mt-4 text-[#ffffffaf] text-base md:text-lg">
                1-on-1 online lessons for students and professionals.
              </p>
            </TextAnimation>
            <button className="mt-6 btn-primary">Find your tutor</button>
          </div>

          <img
            src="/images/heroimg.png"
            alt="Tutor"
            className="w-full max-w-sm lg:max-w-md"
          />
        </section> */}
        <HeroSection />

        {/* ================= STATS ================= */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 text-center px-6 lg:px-24 bg-white">
          {[
            ["100+", "Tutors"],
            ["300,000+", "5-star reviews"],
            ["15+", "Subjects"],
            ["4.8 ★", "Average rating"],
          ].map(([value, label]) => (
            <div key={label}>
              <strong className="text-xl">{value}</strong>
              <span className="block text-sm text-gray-500">{label}</span>
            </div>
          ))}
        </section>
        <Empower />
        <TeacherAttraction/>
        <HowItWorks />
        {/* founder section */}
        <article>
          {/* Founder Section */}
          <section className="founder-about flex flex-col justify-between h-[80vh] px-6 py-10 md:px-12 lg:px-24">
            <TextAnimation>
              <span className="block uppercase font-bold text-[1.2rem] sm:text-[1.5rem] md:text-[1.5rem] text-black">
                Leadership & Vision
              </span>
            </TextAnimation>

            <div className="founder-header mt-6">
              <TextAnimation>
                <h1 className="text-3xl sm:text-4xl md:text-6xl -tracking-[.05rem] leading-snug md:leading-none font-medium text-black sm:indent-[10%] md:indent-[30%]">
                  We partner with passionate educators to transform learning
                  experiences worldwide, designing spaces where ideas grow,
                  voices are heard, and education moves beyond the classroom.
                </h1>
              </TextAnimation>
            </div>
          </section>

          {/* Founder Image */}
          <section className="founder-about-img h-max pt-16 pb-16 px-4 sm:px-8 md:px-16 flex justify-center">
            <img
              className="w-1/2 sm:w-1/4 md:w-[20%] aspect-4/5 object-cover rounded-lg"
              src="/images/education.webp"
              alt="Founder"
            />
          </section>

          {/* Story Section */}
          <section className="story flex flex-col lg:flex-row gap-6 mt-16 px-6 md:px-12 lg:px-24">
            <div className="col flex-1 mb-6 lg:mb-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl -tracking-[.05rem] leading-snug md:leading-none font-medium">
                The Story Behind <br /> Our Stillness
              </h1>
            </div>
            <div className="col flex-1 mb-6">
              <TextAnimation>
                <p className="text-base sm:text-lg md:text-[1.125rem] font-medium tracking-[1.25] leading-relaxed">
                  SkillSphere Education LLC is an interdisciplinary digital
                  learning platform co-founded by{" "}
                  <span className="font-bold text-[#063B8D]">
                    Muhammad Tayyeb Akram
                  </span>{" "}
                  and{" "}
                  <span className="font-bold text-[#ff6a97]">
                    Dr. Asmara Shafqat
                  </span>
                  , offering academic support, teacher training, and
                  professional development across global curricula. Designed to
                  meet the evolving needs of students and educators in Oman,
                  Pakistan, and beyond, SkillSphere combines rigorous content
                  with flexible delivery.
                </p>
              </TextAnimation>
            </div>
          </section>

          {/* Philosophy Section */}
          <section className="philosophy flex flex-col justify-between bg-[#202020] min-h-[80vh] px-6 py-10 md:px-12 lg:px-24">
            <TextAnimation>
              <span className="block uppercase font-bold text-[1.2rem] sm:text-[1.5rem] text-white">
                The Thought Beneath
              </span>
            </TextAnimation>

            <div className="header mt-6">
              <TextAnimation>
                <h1 className="text-3xl sm:text-4xl md:text-6xl -tracking-[.15rem] leading-snug md:leading-none font-medium text-white sm:indent-[10%] md:indent-[30%]">
                  To empower learners across every discipline through
                  accessible, example-rich instruction and inclusive pedagogy.
                </h1>
              </TextAnimation>
            </div>
          </section>
        </article>

        <LanguageGrid />

        {/* THE PROMO SECTION */}
        <div className="py-10 space-y-10">
          {/* STUDENT CARD - Goes to Find Tutors */}
          <PromoSection
            title="Unlock Your Learning Journey"
            buttonText="Start Learning Today"
            buttonHref="/tutors" // This fixes the link for students
            imageSrc="/images/student-girl.png"
            bgColor="bg-[#ff6a97]"
            description="Connect with expert educators..."
            points={["Find Your Perfect Tutor", "Explore New Subjects"]}
          />

          {/* TEACHER CARD - Goes to Profile Setup */}
          <PromoSection
            title="Become a tutor"
            buttonText="Become a tutor"
            buttonHref="/dashboard/tutor/profile" // This keeps the link for teachers
            imageSrc="/images/tutor-man.png"
            bgColor="bg-[#43d2b1]"
            reverse={true}
            description="Earn money sharing your expert knowledge..."
            points={["Find new students", "Grow your business"]}
          />
        </div>

        {/* ================= AI COMPANION SECTION ================= */}
        <div className="mb-10 mt-10 text-left">
          <TextAnimation>
            <h1 className="text-6xl font-black text-gray-900 mb-2">
              Smart AI{" "}
              <span className="text-[#366740]">Learning Companions</span>
            </h1>
          </TextAnimation>
          <TextAnimation>
            <p className="text-gray-500 max-w-2xl">
              Unlock personalized 24/7 support. Our AI companions are designed
              to help you master complex topics through interactive,
              example-rich guidance.
            </p>
          </TextAnimation>
        </div>

        <section className="home-section">
          <CompanionCard
            id="123"
            name="Ava — Artificial Intelligence Study Companion"
            topic="Understanding the Human Brain"
            subject="science"
            duration={45}
            color="#ffda6e"
          />

          <CompanionCard
            id="456"
            name="Leo — Math Learning Companion"
            topic="Derivatives & Integrals"
            subject="maths"
            duration={30}
            color="#e5d0ff"
          />

          <CompanionCard
            id="789"
            name="Maya — Language Practice Companion"
            topic="English Reading & Vocabulary"
            subject="language"
            duration={30}
            color="#BDE7FF"
          />
        </section>

        <section className="home-section">
          <CompanionsList
            title="Recently completed lessons"
            companions={recentSessions}
            classNames="w-2/3 max-lg:w-full"
          />
          <CTA />
        </section>
        <Footer />
      </main>
    </ReactLenis>
  );
};

export default Page;
