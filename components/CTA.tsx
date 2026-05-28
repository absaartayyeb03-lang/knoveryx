import Image from "next/image"
import Link from "next/link"

const CTA = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-16 bg-white">
      
      {/* Top Image / Logo */}
      <Image
        src="/images/main-logo.png"
        alt="CTA Image"
        width={120}
        height={120}
        className="mb-6"
      />

      {/* Brand / Badge */}
      <div className="text-blue-600 font-semibold text-lg mb-2">
        Knoveryx <span className="text-green-700">Education</span>
      </div>

      {/* Main Heading */}
      <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
        Now <br /> Enrolling
      </h2>

      {/* Divider */}
      <div className="w-24 h-[2px] bg-green-700 my-6"></div>

      {/* Subtitle */}
      <p className="text-green-700 text-lg max-w-md mb-8">
        Master Every Skill. <br /> Shape Your Future.
      </p>

      {/* CTA Button */}
      <Link href="/companion/new">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
          <Image src="/icons/plus.svg" alt="plus" width={14} height={14} />
          Build a New Companion
        </button>
      </Link>

    </section>
  )
}

export default CTA
