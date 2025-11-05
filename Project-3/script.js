document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const features = document.querySelectorAll(".feature");
  const featureBgs = document.querySelectorAll(".feature-bg");

  const featureStartPositions = [
    { top: 25, left: 15 },
    { top: 12.5, left: 50 },
    { top: 22.5, left: 75 },
    { top: 30, left: 82.5 },
    { top: 50, left: 20 },
    { top: 80, left: 20 },
    { top: 75, left: 75 },
  ];

  features.forEach((feature, index) => {
    const featurePos = featureStartPositions[index];
    gsap.set(feature, {
      top: `${featurePos.top}%`,
      left: `${featurePos.left}%`,
    });
  });

  const featureStartDimensions = [];
  featureBgs.forEach((bg) => {
    const rect = bg.getBoundingClientRect();
    featureStartDimensions.push({
      width: rect.width,
      height: rect.height,
    });
  });

  const remInPixels = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  const targetWidth = 3 * remInPixels;
  const targetHeight = 3 * remInPixels;

  const getSearchBarFinalWidth = () => {
    return window.innerWidth < 1000 ? 20 : 25;
  };

  let searchBarFinalWidth = getSearchBarFinalWidth();

  window.addEventListener("resize", () => {
    searchBarFinalWidth = getSearchBarFinalWidth();
    ScrollTrigger.refresh();
  });

  ScrollTrigger.create({
    trigger: ".spotlight",
    start: "start",
    end: `+=${window.innerHeight * 3}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      if (progress <= 0.3333) {
        const spotlightHeaderProgress = progress / 0.3333;
        gsap.set(".spotlight-content", {
          y: `${-100 * spotlightHeaderProgress}%`,
        });
      } else {
        gsap.set(".spotlight-content", {
          y: "-100%",
        });
      }

      if (progress >= 0 && progress <= 0.5) {
        const featureProgress = progress / 0.5;

        features.forEach((feature, index) => {
          const original = featureStartPositions[index];
          const currentTop =
            original.top + (50 - original.top) * featureProgress;
          const currentLeft =
            original.left + (50 - original.left) * featureProgress;

          gsap.set(feature, {
            top: `${currentTop}%`,
            left: `${currentLeft}%`,
          });
        });

        featureBgs.forEach((bg, index) => {
          const featureDim = featureStartDimensions[index];
          const currentWidth =
            featureDim.width +
            (targetWidth - featureDim.width) * featureProgress;
          const currentHeight =
            featureDim.height +
            (targetHeight - featureDim.height) * featureProgress;
          const currentBorderRadius = 0.5 + (25 - 0.5) * featureProgress;
          const currentBorderWidth = 0.125 + (0.35 - 0.125) * featureProgress;

          gsap.set(bg, {
            width: `${currentWidth}px`,
            height: `${currentHeight}px`,
            borderRadius: `${currentBorderRadius}rem`,
            borderWidth: `${currentBorderWidth}rem`,
          });
        });

        if (progress >= 0 && progress <= 0.1) {
          const featureTextProgress = progress / 0.1;
          gsap.set(".feature-content", {
            opacity: 1 - featureTextProgress,
          });
        } else if (progress > 0.1) {
          gsap.set(".feature-content", {
            opacity: 0,
          });
        }
      }

      if (progress >= 0.5) {
        gsap.set(".features", {
          opacity: 0,
        });
      } else {
        gsap.set(".features", {
          opacity: 1,
        });
      }

      if (progress >= 0.5) {
        gsap.set(".search-bar", {
          opacity: 1,
        });
      } else {
        gsap.set(".search-bar", {
          opacity: 0,
        });
      }

      if (progress >= 0.5 && progress <= 0.75) {
        const searchBarProgress = (progress - 0.5) / 0.25;

        const width = 3 + (searchBarFinalWidth - 3) * searchBarProgress;
        const height = 3 + (5 - 3) * searchBarProgress;

        const translateY = -50 + (200 - -50) * searchBarProgress;

        gsap.set(".search-bar", {
          width: `${width}rem`,
          height: `${height}rem`,
          transform: `translate(-50%, ${translateY}%)`,
        });

        gsap.set(".search-bar p", {
          opacity: 0,
        });
      } else if (progress > 0.75) {
        gsap.set(".search-bar", {
          width: `${searchBarFinalWidth}rem`,
          height: "5rem",
          transform: "translate(-50%, 200%)",
        });
      }

      if (progress >= 0.75) {
        const finalHeaderProgress = (progress - 0.75) / 0.25;

        gsap.set(".search-bar p", {
          opacity: finalHeaderProgress,
        });

        gsap.set(".header-content", {
          y: -50 + 50 * finalHeaderProgress,
          opacity: finalHeaderProgress,
        });
      } else {
        gsap.set(".search-bar p", {
          opacity: 0,
        });
        gsap.set(".header-content", {
          y: -50,
          opacity: 0,
        });
      }
    },
  });
});
