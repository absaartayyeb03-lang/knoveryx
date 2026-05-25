"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TextAnimation from "./TextAnimation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

interface PromoSectionProps {
  title: string;
  description: string;
  points: string[];
  buttonText: string;
  buttonHref: string;
  imageSrc: string;
  bgColor: string;
  reverse?: boolean;
  requireAuth?: boolean; // Added this prop
}

const PromoSection = ({
  title,
  description,
  points,
  buttonText,
  buttonHref,
  imageSrc,
  bgColor,
  reverse = false,
  requireAuth = true, // Defaulting to true for your "Become a Tutor" page
}: PromoSectionProps) => {
  const buttonClasses = "w-full md:w-fit px-10 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95";

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div
        className={`flex flex-col md:flex-row overflow-hidden rounded-3xl border border-slate-100 shadow-sm ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Image Side */}
        <div className="relative w-full md:w-1/2 h-[400px] md:h-auto min-h-[520px]">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Content Side */}
        <div
          className={`w-full md:w-1/2 ${bgColor} p-10 md:p-20 flex flex-col justify-center`}
        >
          <TextAnimation>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
              {title}
            </h2>
          </TextAnimation>
          
          <TextAnimation>
            <p className="text-slate-900 text-lg mb-8 font-medium opacity-80">
              {description}
            </p>
          </TextAnimation>

          <ul className="space-y-4 mb-10">
            {points.map((point, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-slate-900 font-bold text-xl"
              >
                <span className="w-2 h-2 rounded-full bg-slate-900" />
                {point}
              </li>
            ))}
          </ul>

          {/* --- AUTH LOGIC START --- */}
          {requireAuth ? (
            <>
              {/* If user is logged in: Normal Link */}
              <SignedIn>
                <Link href={buttonHref} className={buttonClasses}>
                  {buttonText} <ArrowRight size={20} />
                </Link>
              </SignedIn>

              {/* If user is logged out: Trigger Modal */}
              <SignedOut>
                <SignInButton mode="modal" fallbackRedirectUrl={buttonHref}>
                  <button className={buttonClasses}>
                    {buttonText} <ArrowRight size={20} />
                  </button>
                </SignInButton>
              </SignedOut>
            </>
          ) : (
            <Link href={buttonHref} className={buttonClasses}>
              {buttonText} <ArrowRight size={20} />
            </Link>
          )}
          {/* --- AUTH LOGIC END --- */}

          <Link
            href="#"
            className="mt-8 text-slate-900 font-bold underline underline-offset-4 decoration-2 hover:opacity-60 transition-opacity text-sm"
          >
            How our platform works
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;