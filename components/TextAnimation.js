"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText"; 
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function TextAnimation({ 
  children, 
  animateOnScroll = true, 
  delay = 0 
}) {
  const containerRef = useRef(null);
  const elementRef = useRef([]);
  const splitRef = useRef([]);
  const lines = useRef([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Reset refs
    elementRef.current = [];
    splitRef.current = [];
    lines.current = [];

    // Determine elements to animate
    let elements = [];
    if (containerRef.current.hasAttribute("data-copy-wrapper")) {
      elements = Array.from(containerRef.current.children);
    } else {
      elements = [containerRef.current];
    }

    // Split text and setup
    elements.forEach((element) => {
      elementRef.current.push(element);

      const split = new SplitText(element, {
        type: "lines",
        linesClass: "line++",
      });

      splitRef.current.push(split);

      // Handle text-indent for first line
      const computedStyle = window.getComputedStyle(element);
      const textIndent = computedStyle.textIndent;
      if (textIndent && textIndent !== "0px") {
        if (split.lines.length > 0) {
          split.lines[0].style.paddingLeft = textIndent;            
        }
        element.style.textIndent = "0";
      }

      // Wrap lines for overflow masking
      split.lines.forEach((line) => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

      lines.current.push(...split.lines);
    });

    // Initial state
    gsap.set(lines.current, { y: "110%" });

    // Responsive animation settings
    const mm = gsap.matchMedia();

    mm.add({
      // Mobile
      isMobile: "(max-width: 767px)",
      // Tablet
      isTablet: "(min-width: 768px) and (max-width: 1023px)",
      // Desktop
      isDesktop: "(min-width: 1024px)"
    }, (context) => {
      const { isMobile, isTablet } = context.conditions;

      const animationProps = {
        y: "0%",
        duration: isMobile ? 0.8 : isTablet ? 0.9 : 1,
        stagger: isMobile ? 0.05 : isTablet ? 0.075 : 0.1,
        ease: "power4.out",
        delay: delay,
      };

      if (animateOnScroll) {
        gsap.to(lines.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: isMobile ? "top bottom-=50" : isTablet ? "top 90%" : "top 85%",
            once: true,
            // Refresh on mobile orientation change
            invalidateOnRefresh: isMobile,
            markers: false, 
          },
        });
      } else {
        gsap.to(lines.current, animationProps);
      }
    });

    // Cleanup
    return () => {
      mm.revert();
      splitRef.current.forEach((split) => {
        if (split) {
          split.revert();
        }
      });
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, {
    scope: containerRef,
    dependencies: [animateOnScroll, delay],
  });

  // Single child passthrough
  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  // Multiple children wrapper
  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}