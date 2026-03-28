import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MountainParallax = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(".parallax-title", { y: 80, opacity: 0 });
      gsap.set(".parallax-subtitle", { y: 40, opacity: 0 });

      const intro = gsap.timeline();
      intro
        .to(".parallax-title", {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
        })
        .to(
          ".parallax-subtitle",
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.7"
        );

      gsap.to(".parallax-bg", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".parallax-overlay", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".parallax-title", {
        yPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-section",
          start: "top center",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".parallax-subtitle", {
        yPercent: -20,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-section",
          start: "top center",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="parallax-section relative h-[120vh] overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1800&q=80"
          alt="Mountain background"
          className="parallax-bg absolute left-0 top-0 h-[130%] w-full object-cover"
        />
      </div>

      <div className="parallax-overlay absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="parallax-title text-5xl font-semibold leading-none text-white md:text-7xl lg:text-8xl">
          Parallax Effect
        </h1>

        <p className="parallax-subtitle mt-6 max-w-2xl text-base text-white/85 md:text-xl">
          Cinematic scroll-based animation using GSAP ScrollTrigger.
        </p>
      </div>
    </section>
  );
};

export default MountainParallax;