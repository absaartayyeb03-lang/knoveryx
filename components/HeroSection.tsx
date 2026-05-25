import Link from "next/link";
import TextAnimation from "./TextAnimation";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden flex flex-col max-md:gap-20 md:flex-row pb-20 items-center justify-between mt-20 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* ================= BACKGROUND SVG ================= */}
      <svg
        className="size-full absolute -z-10 inset-0 pointer-events-none"
        width="1440"
        height="720"
        viewBox="0 0 1440 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke="#E2E8F0" strokeOpacity=".7" d="M-15.227 702.342H1439.7" />
        <circle
          cx="711.819"
          cy="372.562"
          r="308.334"
          stroke="#E2E8F0"
          strokeOpacity=".7"
        />
        <circle
          cx="16.942"
          cy="20.834"
          r="308.334"
          stroke="#E2E8F0"
          strokeOpacity=".7"
        />
        <path
          stroke="#E2E8F0"
          strokeOpacity=".7"
          d="M-15.227 573.66H1439.7M-15.227 164.029H1439.7"
        />
        <circle
          cx="782.595"
          cy="411.166"
          r="308.334"
          stroke="#E2E8F0"
          strokeOpacity=".7"
        />
      </svg>

      {/* ================= CONTENT ================= */}
      <div className="flex flex-col items-center md:items-start z-10 py-4 md:py-5 max-w-xl">
        <div className="flex flex-wrap items-center justify-center p-1.5 rounded-full border border-slate-300 text-gray-600 text-xs bg-white/50 backdrop-blur-sm">
          <div className="flex items-center">
            <img
              className="size-7 rounded-full border-2 border-white"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
              alt="userImage1"
            />
            <img
              className="size-7 rounded-full border-2 border-white -translate-x-2"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
              alt="userImage2"
            />
            <img
              className="size-7 rounded-full border-2 border-white -translate-x-4"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
              alt="userImage3"
            />
          </div>
          {/* Changed context to International / Worldwide */}
          <p className="-translate-x-2 font-medium">
            Empowering a global community of learners
          </p>
        </div>

        <TextAnimation>
          <h1 className="text-center md:text-left text-5xl leading-[60px] md:text-6xl md:leading-[80px] font-bold max-w-xl text-slate-900 mt-6 tracking-tight">
            Empowering Learners <br />
            <span className="text-[#033D8B]">Across the Globe.</span>
          </h1>
        </TextAnimation>

        <TextAnimation>
          <p className="text-center md:text-left text-lg text-slate-600 max-w-lg mt-4 leading-relaxed">
            SkillSphere Education LLC delivers world-class academic support,
            teacher training, and professional development through borderless,
            inclusive pedagogy.
          </p>
        </TextAnimation>

        <div className="flex items-center gap-4 mt-10 text-sm">
          {/* Using your brand color #033D8B */}
          <Link href="/sign-in">
            <button className="bg-[#033D8B] hover:opacity-90 text-white font-bold active:scale-95 rounded-xl px-8 h-12 transition-all shadow-lg shadow-blue-900/20">
              Get started
            </button>
          </Link>
        </div>
      </div>

      <div className="relative z-10">
        {/* Showcase Image */}
        <img
          src="/images/heroimg01.png"
          alt="SkillSphere Global Platform"
          className="object-cover w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg transition-all duration-500"
        />
      </div>
    </section>
  );
};

export default HeroSection;
