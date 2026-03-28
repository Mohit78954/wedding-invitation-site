import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type InviteCoverProps = {
  onComplete: () => void;
};

const InviteCover = ({ onComplete }: InviteCoverProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const flapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLButtonElement | null>(null);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;

    gsap.fromTo(
      rootRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  const handleOpen = () => {
    if (
      opening ||
      !rootRef.current ||
      !flapRef.current ||
      !cardRef.current ||
      !sealRef.current
    ) {
      return;
    }

    setOpening(true);

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => onComplete(),
    });

    tl.to(sealRef.current, {
      scale: 0.6,
      opacity: 0,
      duration: 0.25,
    })
      .to(
        flapRef.current,
        {
          rotateX: -178,
          duration: 0.9,
          transformOrigin: "top center",
        },
        0.05
      )
      .to(
        cardRef.current,
        {
          y: -220,
          duration: 1,
          ease: "power3.out",
        },
        0.25
      )
      .to(
        rootRef.current,
        {
          opacity: 0,
          duration: 0.6,
        },
        0.95
      );
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#f6f1e8]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(246,241,232,1)_44%,_rgba(236,229,218,1)_100%)]" />

      <div className="relative z-10 text-center">
        <p className="mb-4 text-[0.62rem] uppercase tracking-[0.5em] text-[#9d8b6a]">
          Shyara Invitation
        </p>
        <h2 className="mb-10 text-[clamp(2.2rem,4vw,4rem)] font-light tracking-[-0.03em] text-[#2c2825]">
          Open your invitation
        </h2>

        <div className="relative mx-auto h-[280px] w-[330px] [perspective:1600px] md:h-[360px] md:w-[450px]">
          <div
            ref={cardRef}
            className="absolute left-1/2 top-[34px] z-20 flex h-[200px] w-[235px] -translate-x-1/2 items-center justify-center border border-[#e6dbca] bg-[linear-gradient(180deg,_#fffdf9_0%,_#f7f0e6_100%)] text-center shadow-[0_24px_55px_rgba(0,0,0,0.18)] md:h-[255px] md:w-[310px]"
          >
            <div>
              <p className="text-[0.58rem] uppercase tracking-[0.46em] text-[#9d8b6a]">
                Wedding Invitation
              </p>
              <div className="mx-auto mt-6 h-px w-16 bg-[#cfbf9d]" />
              <h3 className="mt-6 text-3xl font-light tracking-[-0.04em] text-[#2c2825] md:text-[2.5rem]">
                Rahul & Neha
              </h3>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 z-10 h-[190px] w-[305px] -translate-x-1/2 bg-[linear-gradient(180deg,_#ecd6ae_0%,_#d8b277_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.18)] md:h-[240px] md:w-[400px]" />

          <div className="absolute bottom-[80px] left-1/2 z-20 h-[100px] w-[275px] -translate-x-1/2 overflow-hidden bg-[linear-gradient(180deg,_#f7ead4_0%,_#e6c995_100%)] md:bottom-[100px] md:h-[126px] md:w-[360px]" />

          <div className="absolute bottom-0 left-1/2 z-30 h-[126px] w-[305px] -translate-x-1/2 overflow-hidden bg-[linear-gradient(180deg,_#e2c28d_0%,_#cea15d_100%)] md:h-[154px] md:w-[400px]" />

          <div className="absolute bottom-0 left-1/2 z-40 h-[126px] w-[305px] -translate-x-1/2 md:h-[154px] md:w-[400px]">
            <div className="absolute left-0 top-0 h-0 w-0 border-b-[126px] border-l-[152px] border-b-[#d7af6b] border-l-transparent md:border-b-[154px] md:border-l-[200px]" />
            <div className="absolute right-0 top-0 h-0 w-0 border-b-[126px] border-r-[152px] border-b-[#c99a57] border-r-transparent md:border-b-[154px] md:border-r-[200px]" />
          </div>

          <div
            ref={flapRef}
            className="absolute left-1/2 top-[42px] z-50 h-[132px] w-[305px] -translate-x-1/2 md:top-[52px] md:h-[170px] md:w-[400px]"
            style={{ transformOrigin: "top center" }}
          >
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background:
                  "linear-gradient(180deg, #efd8ac 0%, #d9b173 56%, #c49049 100%)",
              }}
            />
          </div>

          <button
            ref={sealRef}
            type="button"
            onClick={handleOpen}
            className="absolute left-1/2 top-[122px] z-[60] flex h-[60px] w-[60px] -translate-x-1/2 items-center justify-center rounded-full border border-[#7f1d1d]/20 bg-[radial-gradient(circle_at_32%_28%,_#c81f1f,_#951515_58%,_#6e0d0d_100%)] text-sm font-semibold tracking-[0.08em] text-[#f6dfbb] shadow-[0_12px_28px_rgba(127,29,29,0.34)] transition hover:scale-105 md:top-[154px] md:h-[74px] md:w-[74px]"
            aria-label="Open invitation"
          >
            RN
          </button>
        </div>

        <button
          type="button"
          onClick={handleOpen}
          className="mt-12 border border-[#2c2825] px-8 py-4 text-[0.62rem] uppercase tracking-[0.34em] text-[#2c2825] transition hover:bg-[#2c2825] hover:text-[#f6f1e8]"
        >
          Open invitation
        </button>
      </div>
    </div>
  );
};

export default InviteCover;