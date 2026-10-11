"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stats = [
  { value: "58%", label: "Increase in pick-up\npoint use" },
  { value: "23%", label: "Fewer customer\nphone calls" },
  { value: "27%", label: "More repeat\ncustomers" },
  { value: "40%", label: "Less time spent\nwaiting" },
];

export default function Home() {
  const root = useRef(null);
  const stage = useRef(null);
  const car = useRef(null);
  const progress = useRef(null);

  useGSAP(
    () => {
      // INTRO ANIMATION
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      intro
        .fromTo(
          ".eyebrow",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65 }
        )
        .fromTo(
          ".headline-char",
          { yPercent: 110, opacity: 0, rotate: 4 },
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.85,
            stagger: 0.035,
          },
          "-=0.25"
        )
        .fromTo(
          ".scroll-cue",
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.15"
        );

      // SCROLL-DRIVEN STATISTICS
      // The cards and percentages remain hidden at scroll progress 0.
      // Each card appears and counts up as the user scrolls down.
      // Scrubbing reverses both animations when scrolling upward.
      const statCards = gsap.utils.toArray(".stat-card");

      const statsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      statCards.forEach((card, index) => {
        const counter = card.querySelector(".stat-value");
        const target = Number(counter.dataset.target);
        const counterState = { value: 0 };

        // Stagger the start of each statistic.
        const position = index * 0.22;

        statsTimeline.to(
          card,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "none",
          },
          position
        );

        statsTimeline.to(
          counterState,
          {
            value: target,
            duration: 0.8,
            ease: "none",
            onUpdate: () => {
              const current = Math.round(counterState.value);

              counter.textContent =
                current === 0 ? "" : `${current}%`;
            },
          },
          position
        );
      });

      // CAR MOVEMENT CONTROLLED BY SCROLL
      gsap.fromTo(
        car.current,
        {
          x: "-12vw",
          y: 28,
          rotate: -7,
          scale: 0.82,
        },
        {
          x: "13vw",
          y: -18,
          rotate: 5,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress.current) {
                progress.current.style.transform =
                  `scaleX(${self.progress})`;
              }
            },
          },
        }
      );

      // ORBIT ANIMATIONS
      gsap.to(".orbit-one", {
        rotate: 360,
        ease: "none",
        scrollTrigger: {
          trigger: stage.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });

      gsap.to(".orbit-two", {
        rotate: -240,
        ease: "none",
        scrollTrigger: {
          trigger: stage.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });

      // CLOSING SECTION ANIMATION
      gsap.fromTo(
        ".closing-line",
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".outro",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Recalculate scroll positions after the page is ready.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: root }
  );

  const headline = "WELCOME ITZ FIZZ";

  return (
    <main ref={root}>
      <section
        className="scroll-stage"
        ref={stage}
        aria-label="Itz Fizz introduction"
      >
        <div className="hero-screen">
          <nav className="topbar" aria-label="Main navigation">
            <a
              className="wordmark"
              href="#top"
              aria-label="Itz Fizz home"
            >
              itz<span>✳</span>fizz
            </a>

            <span className="topbar-note">
              A LITTLE SPARK GOES A LONG WAY
            </span>

            <a className="menu-link" href="#story">
              OUR STORY <span aria-hidden="true">↗</span>
            </a>
          </nav>

          <div className="hero-copy" id="top">
            <p className="eyebrow">
              GOOD VIBRATIONS. GREAT REFRESHMENT.
            </p>

            <h1 className="headline" aria-label={headline}>
              {headline.split("").map((char, index) => (
                <span
                  className={`headline-char ${
                    char === " " ? "space-char" : ""
                  }`}
                  key={`${char}-${index}`}
                  aria-hidden="true"
                >
                  {char === " " ? "\u00a0" : char}
                </span>
              ))}
            </h1>

            <p className="hero-subtitle">
              Fresh thinking. Fizzy energy. A whole new way to move.
            </p>
          </div>

          <div
            className="visual-wrap"
            aria-label="Illustration of a bright red sports car"
          >
            <div className="sun-disc" />

            <div className="orbit orbit-one">
              <span />
            </div>

            <div className="orbit orbit-two">
              <span />
            </div>

            <div className="spark spark-a">✳</div>
            <div className="spark spark-b">✦</div>
            <div className="spark spark-c">✳</div>

            <div className="car-visual" ref={car}>
              <Image
                src="/car.svg"
                alt="Stylized red sports car"
                width={900}
                height={420}
                priority
              />
            </div>

            <div className="visual-caption">
              <span>01 / THE FEELING</span>
              <span>MADE TO MOVE →</span>
            </div>
          </div>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div className="stat-card" key={stat.value}>
                <div className="stat-top">
                  <span>0{index + 1}</span>
                  <span className="stat-arrow">↗</span>
                </div>

                <p
                  className="stat-value"
                  data-target={parseInt(stat.value, 10)}
                  aria-label={stat.value}
                />

                <p className="stat-label">
                  {stat.label.split("\n").map((line, lineIndex) => (
                    <span key={`${index}-${lineIndex}`}>
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>

          <div className="bottomline">
            <span>SCROLL TO FEEL THE FIZZ</span>
            <span className="scroll-cue" aria-hidden="true">
              ↓
            </span>
            <span>EST. GOOD TIMES · 2026</span>
          </div>

          <div className="progress-track">
            <div className="progress-fill" ref={progress} />
          </div>
        </div>
      </section>

      <section className="outro" id="story">
        <p className="outro-kicker">
          KEEP THE GOOD TIMES ROLLING
        </p>

        <h2 className="closing-line">
          Life moves fast.
          <br />
          <em>Make it fizz.</em>
        </h2>

        <div className="outro-footer">
          <span>ITZ FIZZ®</span>
          <span>GOOD ENERGY, ALWAYS.</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </section>
    </main>
  );
}