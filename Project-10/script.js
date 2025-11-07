document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const initTextSplit = () => {
    const textElements = document.querySelectorAll(".col-3 h1, .col-3 p");

    textElements.forEach((element) => {
      const split = new SplitText(element, {
        type: "lines",
        linesClass: "line",
      });
      split.lines.forEach(
        (line) => (line.innerHTML = `<span>${line.textContent}</span>`)
      );
    });
  };

  initTextSplit();

  gsap.set(".col-3 .col-content-wrapper .line span", { y: "0%" });
  gsap.set(".col-3 .col-content-wrapper-2 .line span", { y: "-125%" });

  ScrollTrigger.create({
    trigger: ".sticky-cols",
    start: "top top",
    end: `+=${window.innerHeight * 5}px`,
    pin: true,
    pinSpacing: true,
  });

  let currentPhase = 0;

  ScrollTrigger.create({
    trigger: ".sticky-cols",
    start: "top top",
    end: `+=${window.innerHeight * 6}px`,
    onUpdate: (self) => {
      const progress = self.progress;

      if (progress >= 0.33 && currentPhase === 0) {
        currentPhase = 1;

        gsap.to(".col-1", { opacity: 0, scale: 0.75, duration: 0.75 });
        gsap.to(".col-2", { x: "0%", duration: 0.75 });
        gsap.to(".col-3", { y: "0%", duration: 0.75 });

        gsap.to(".col-img-1 img", { scale: 1.25, duration: 0.75 });
        gsap.to(".col-img-2", {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.75,
        });
        gsap.to(".col-img-2 img", { scale: 1, duration: 0.75 });
      }

      if (progress >= 0.66 && currentPhase === 1) {
        currentPhase = 2;

        gsap.to(".col-2", { opacity: 0, scale: 0.75, duration: 0.75 });
        gsap.to(".col-3", { x: "0%", duration: 0.75 });
        gsap.to(".col-4", { y: "0%", duration: 0.75 });

        gsap.to(".col-3 .col-content-wrapper .line span", {
          y: "-125%",
          duration: 0.75,
        });
        gsap.to(".col-3 .col-content-wrapper-2 .line span", {
          y: "0%",
          duration: 0.75,
          delay: 0.5,
        });
      }

      if (progress < 0.33 && currentPhase >= 1) {
        currentPhase = 0;

        gsap.to(".col-1", { opacity: 1, scale: 1, duration: 0.75 });
        gsap.to(".col-2", { x: "100%", duration: 0.75 });
        gsap.to(".col-3", { y: "100%", duration: 0.75 });

        gsap.to(".col-img-1 img", { scale: 1, duration: 0.75 });
        gsap.to(".col-img-2", {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 0.75,
        });
        gsap.to(".col-img-2 img", { scale: 1.25, duration: 0.75 });
      }

      if (progress < 0.66 && currentPhase === 2) {
        currentPhase = 1;

        gsap.to(".col-2", { opacity: 1, scale: 1, duration: 0.75 });
        gsap.to(".col-3", { x: "100%", duration: 0.75 });
        gsap.to(".col-4", { y: "100%", duration: 0.75 });

        gsap.to(".col-3 .col-content-wrapper .line span", {
          y: "0%",
          duration: 0.75,
          delay: 0.5,
        });
        gsap.to(".col-3 .col-content-wrapper-2 .line span", {
          y: "-125%",
          duration: 0.75,
        });
      }
    },
  });
});
