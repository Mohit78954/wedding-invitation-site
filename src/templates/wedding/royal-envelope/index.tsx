import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Observer from "gsap/Observer";
import weddingConfig from "./config";
import CanvasParticles from "../../../components/CanvasParticles";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, Observer);

const RoyalEnvelopePage = () => {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const heroWrapRef = useRef<HTMLDivElement | null>(null);
  const heroCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pageRef.current || !heroRef.current) return;

    const cleanupFns: Array<() => void> = [];
    let isAnimating = false;
    let lastActionTime = 0;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      gsap.set(".hero-kicker", { y: 20, opacity: 0 });
      gsap.set(".hero-title-line", { y: 80, opacity: 0 });
      gsap.set(".hero-sub", { y: 24, opacity: 0 });
      gsap.set(".hero-date", { y: 24, opacity: 0 });

      gsap.set(".overlap-inner", { y: 50, opacity: 0 });
      gsap.set(".schedule-card", { y: 40, opacity: 0, rotateX: 8 });

      const heroTl = gsap.timeline();
      heroTl
        .to(".hero-kicker", {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        })
        .to(
          ".hero-title-line",
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.14,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .to(
          ".hero-sub",
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.55"
        )
        .to(
          ".hero-date",
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.45"
        );

      gsap.utils.toArray<HTMLElement>(".overlap-inner").forEach((section) => {
        gsap.to(section, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".schedule-card").forEach((card, index) => {
        gsap.to(card, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.75,
          delay: index * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".schedule-grid",
            start: "top 88%",
          },
        });
      });

      gsap.to(".celebration-image", {
        yPercent: -10,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".celebration-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      const heroWrap = heroWrapRef.current;
      const heroCard = heroCardRef.current;

      if (heroWrap && heroCard) {
        const moveCard = (event: MouseEvent) => {
          const rect = heroWrap.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          const rotateY = ((x / rect.width) - 0.5) * 10;
          const rotateX = ((y / rect.height) - 0.5) * -10;

          gsap.to(heroCard, {
            rotateY,
            rotateX,
            duration: 0.45,
            ease: "power3.out",
            transformPerspective: 1400,
          });
        };

        const resetCard = () => {
          gsap.to(heroCard, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "power3.out",
          });
        };

        heroWrap.addEventListener("mousemove", moveCard);
        heroWrap.addEventListener("mouseleave", resetCard);

        cleanupFns.push(() => {
          heroWrap.removeEventListener("mousemove", moveCard);
          heroWrap.removeEventListener("mouseleave", resetCard);
        });
      }

      const hero = heroRef.current;
      const sections = gsap.utils.toArray<HTMLElement>(".overlap-section");

      const getTargets = () => [hero, ...sections];

      const getClosestIndex = () => {
        const targets = getTargets();
        const y = window.scrollY;

        let closestIndex = 0;
        let minDistance = Number.POSITIVE_INFINITY;

        targets.forEach((section, index) => {
          const distance = Math.abs(section.offsetTop - y);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        return closestIndex;
      };

      const canTrigger = () => {
        const now = Date.now();
        if (now - lastActionTime < 900) return false;
        lastActionTime = now;
        return true;
      };

      const goToSection = (index: number) => {
        const targets = getTargets();
        const clampedIndex = Math.max(0, Math.min(index, targets.length - 1));
        const target = targets[clampedIndex];
        if (!target || isAnimating) return;

        isAnimating = true;

        lenis.scrollTo(target, {
          duration: 1.4,
          lock: true,
          force: true,
          onComplete: () => {
            isAnimating = false;
          },
        });
      };

      const observer = Observer.create({
        target: window,
        type: "wheel,touch",
        wheelSpeed: 1,
        tolerance: 20,
        preventDefault: true,
        allowClicks: true,
        ignore: "input, textarea, select, option, button",
        onDown: () => {
          if (isAnimating || !canTrigger()) return;
          const current = getClosestIndex();
          goToSection(current + 1);
        },
        onUp: () => {
          if (isAnimating || !canTrigger()) return;
          const current = getClosestIndex();
          goToSection(current - 1);
        },
      });

      cleanupFns.push(() => observer.kill());

      const onKeyDown = (event: KeyboardEvent) => {
        if (isAnimating) return;

        if (["ArrowDown", "PageDown", " "].includes(event.key)) {
          event.preventDefault();
          const current = getClosestIndex();
          goToSection(current + 1);
        }

        if (["ArrowUp", "PageUp"].includes(event.key)) {
          event.preventDefault();
          const current = getClosestIndex();
          goToSection(current - 1);
        }
      };

      window.addEventListener("keydown", onKeyDown);
      cleanupFns.push(() => window.removeEventListener("keydown", onKeyDown));
    }, pageRef);

    cleanupFns.push(() => {
      lenis.destroy();
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen overflow-hidden bg-[#f6f1e8] text-[#2c2825]"
    >
      <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85"
          alt="Luxury wedding background"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 text-center"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85"
            alt="Luxury wedding background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <CanvasParticles particleCount={90} />

        <div
          ref={heroWrapRef}
          className="relative z-10 mx-auto w-full max-w-5xl [perspective:1400px]"
        >
          <div
            ref={heroCardRef}
            className="rounded-[28px] border border-white/15 bg-white/10 px-6 py-16 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-md md:px-12"
          >
            <p className="hero-kicker text-[0.65rem] uppercase tracking-[0.5em] text-white/80">
              Together with their families
            </p>

            <div className="mt-8 space-y-2">
              <div className="overflow-hidden">
                <h1 className="hero-title-line text-5xl font-light leading-none tracking-[-0.04em] text-white md:text-7xl lg:text-8xl">
                  Rahul
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-title-line text-4xl font-light italic leading-none text-[#d7c29a] md:text-6xl">
                  &
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-title-line text-5xl font-light leading-none tracking-[-0.04em] text-white md:text-7xl lg:text-8xl">
                  Neha
                </h1>
              </div>
            </div>

            <p className="hero-sub mx-auto mt-8 max-w-2xl text-base leading-8 text-white/85 md:text-xl">
              Invite you to celebrate their wedding in an evening of love,
              dinner, and dancing.
            </p>

            <div className="hero-date mt-10 inline-flex rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm uppercase tracking-[0.28em] text-white backdrop-blur-sm">
              {weddingConfig.weddingDate} · {weddingConfig.weddingTime}
            </div>
          </div>
        </div>
      </section>

      <section className="overlap-section flex min-h-screen items-center justify-center px-6 py-10 md:px-12">
        <div className="overlap-inner overlap-panel p-6 md:p-10">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="overflow-hidden rounded-[20px]">
              <img
                src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=80"
                alt="Couple portrait"
                className="h-[360px] w-full object-cover md:h-[520px]"
              />
            </div>

            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#9d8b6a]">
                Our Story
              </p>
              <h2 className="text-4xl font-semibold tracking-wide md:text-5xl">
                {weddingConfig.storyTitle}
              </h2>
              <p className="mt-8 text-lg leading-9 text-[#5c554c]">
                {weddingConfig.storyText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="overlap-section flex min-h-screen items-center justify-center px-6 py-10 md:px-12">
        <div className="overlap-inner overlap-panel p-6 md:p-10">
          <div className="text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#9d8b6a]">
              Wedding Evening
            </p>
            <h2 className="text-4xl font-semibold tracking-wide md:text-5xl">
              Schedule
            </h2>
          </div>

          <div className="schedule-grid mt-12 grid gap-5 md:grid-cols-3">
            {weddingConfig.schedule.map((item) => (
              <div
                key={`${item.time}-${item.title}`}
                className="schedule-card rounded-[20px] border border-[#eadfce] bg-white/70 p-6"
              >
                <p className="text-sm uppercase tracking-[0.22em] text-[#9d8b6a]">
                  {item.time}
                </p>
                <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-[#5c554c]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="celebration-section overlap-section flex min-h-screen items-center justify-center px-6 py-10 md:px-12">
        <div className="overlap-inner overlap-panel overflow-hidden p-0">
          <div className="full-media-card">
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2200&q=85"
              alt="Celebration hall"
              className="celebration-image"
            />
            <div className="absolute inset-0 bg-black/32" />
            <div className="noise-soft" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-[0.7rem] uppercase tracking-[0.5em] text-white/80 md:text-sm">
                One Beautiful Evening
              </p>
              <div className="mt-5 h-px w-28 bg-white/55" />
              <h2 className="mt-8 max-w-5xl text-4xl font-light leading-[1.02] tracking-[-0.03em] text-white md:text-6xl lg:text-7xl">
                A celebration of love,
                <br />
                elegance, and forever.
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="overlap-section flex min-h-screen items-center justify-center px-6 py-10 md:px-12">
        <div className="overlap-inner overlap-panel p-6 md:p-10">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#9d8b6a]">
                Venue
              </p>
              <h2 className="text-4xl font-semibold tracking-wide md:text-5xl">
                {weddingConfig.venueName}
              </h2>
              <p className="mt-8 text-lg leading-9 text-[#5c554c]">
                {weddingConfig.venueAddress}
              </p>
              <button className="mt-8 rounded-full bg-[#2c2825] px-8 py-4 text-sm uppercase tracking-[0.24em] text-white transition hover:scale-[1.03]">
                View Directions
              </button>
            </div>

            <div className="overflow-hidden rounded-[20px]">
              <img
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80"
                alt="Venue exterior"
                className="h-[360px] w-full object-cover md:h-[520px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="overlap-section flex min-h-screen items-center justify-center px-6 py-10 md:px-12">
        <div className="overlap-inner overlap-panel max-w-3xl p-8 text-center md:p-12">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#9d8b6a]">
            RSVP
          </p>
          <h2 className="text-4xl font-semibold tracking-wide md:text-5xl">
            Please Join Us
          </h2>
          <p className="mt-5 text-[#5c554c]">
            Kindly respond by {weddingConfig.rsvpDeadline}
          </p>

          <div className="mt-10 grid gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="rounded-full border border-[#e6d9c7] bg-white/70 px-5 py-4 outline-none transition focus:border-[#c6a76a]"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="rounded-full border border-[#e6d9c7] bg-white/70 px-5 py-4 outline-none transition focus:border-[#c6a76a]"
            />
            <select className="rounded-full border border-[#e6d9c7] bg-white/70 px-5 py-4 outline-none transition focus:border-[#c6a76a]">
              <option>Attendance</option>
              <option>Joyfully Accept</option>
              <option>Regretfully Decline</option>
            </select>
            <textarea
              placeholder="Message"
              rows={5}
              className="rounded-[24px] border border-[#e6d9c7] bg-white/70 px-5 py-4 outline-none transition focus:border-[#c6a76a]"
            />
            <button className="rounded-full bg-[#2c2825] px-6 py-4 text-sm uppercase tracking-[0.22em] text-white transition hover:scale-[1.03]">
              Send Response
            </button>
          </div>
        </div>
      </section>

      <section className="overlap-section flex min-h-screen items-center justify-center px-6 py-10">
        <div className="overlap-inner overlap-panel max-w-3xl p-10 text-center md:p-14">
          <p className="text-3xl font-semibold text-[#2c2825] md:text-5xl">
            {weddingConfig.groomName} & {weddingConfig.brideName}
          </p>
          <p className="mt-4 text-sm uppercase tracking-[0.22em] text-[#6f655d] md:text-base">
            Powered by Shyara
          </p>
        </div>
      </section>
    </div>
  );
};

export default RoyalEnvelopePage;