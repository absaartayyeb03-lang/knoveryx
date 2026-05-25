import TextAnimation from "./TextAnimation";
const HowItWorks = () => {
  return (
    <section className="px-6 lg:px-24 py-16">
      <TextAnimation>
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center lg:text-left">
        How SkillSphere works:
      </h2>
</TextAnimation>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* CARD 1 */}
        <div className="border rounded-2xl p-8 bg-white flex flex-col h-full">
          <div>
            <span className="inline-block bg-[#8ef0d1] px-3 py-1 rounded font-bold">
              1
            </span>
            <h3 className="text-2xl font-semibold mt-4">Find your tutor.</h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We’ll connect you with a tutor who motivates and supports you.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 border rounded-lg p-3">
              <img src="/images/avatar-2.avif" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <strong>Milena</strong>
                <p className="text-sm text-gray-500">⭐ 4.9 · French tutor</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border rounded-lg p-3">
              <img src="/images/avatar-1.webp" className="w-10 h-10 rounded-full" />
              <div>
                <strong>Ahmed</strong>
                <p className="text-sm text-gray-500">⭐ 4.8 · Math tutor</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border rounded-lg p-3">
              <img src="/images/t3.png" className="w-10 h-10 rounded-full" />
              <div>
                <strong>Ava</strong>
                <p className="text-sm text-gray-500">
                  AI Study Companion · Available 24/7
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="border rounded-2xl p-8 bg-white flex flex-col h-full">
          <div>
            <span className="inline-block bg-[#ffe45c] px-3 py-1 rounded font-bold">
              2
            </span>
            <h3 className="text-2xl font-semibold mt-4">Start learning.</h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Lessons tailored to your goals from day one.
            </p>
          </div>

          <div className="mt-auto pt-8 flex justify-center">
            <img
              src="/images/t1.png"
              className="rounded-xl w-full max-w-[180px]"
              alt="Teacher illustration"
            />
          </div>
        </div>

        {/* CARD 3 */}
        <div className="border rounded-2xl p-8 bg-white flex flex-col h-full">
          <div>
            <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded font-bold">
              3
            </span>
            <h3 className="text-2xl font-semibold mt-4">
              Make progress every week.
            </h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Build confidence one conversation at a time.
            </p>
          </div>

          <div className="mt-auto pt-8 flex justify-center">
            <img
              src="/images/t2.png"
              className="rounded-xl w-full max-w-[180px]"
              alt="Teacher illustration"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
