
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const slides = [
        {
            title:
                "By focusing on companies transforming the digital landscape, OVA identifies solutions capable of addressing contemporary challenges and generating significant and sustainable returns.",
            image: "./slide-1.jpg",
        },
        {
            title:
                "With expertise in multi-residential, industrial, and commercial properties, OVA capitalizes on stable assets while anticipating growth opportunities through innovative and efficient optimization strategies aligned with current trends.",
            image: "./slide-2.jpg",
        },
        {
            title:
                "By supporting companies at the forefront of innovative treatments and connected devices, OVA maximizes long-term global health impact while ensuring solid and sustainable returns.",
            image: "./slide-3.jpg",
        },
        {
            title:
                "Through international investments, particularly in tourism residences, OVA leverages the positive momentum of a rapidly growing sector, bolstered by a steady recovery following recent challenges.",
            image: "./slide-4.jpg",
        },
        {
            title:
                "By integrating innovative and environmentally friendly approaches, OVA explores opportunities in a dynamic market, anticipating strong growth and long-term returns.",
            image: "./slide-5.jpg",
        },
        {
            title:
                "By staying attuned to emerging trends and evolving consumer needs, OVA identifies strategic opportunities that ensure sustainable returns.",
            image: "./slide-6.jpg",
        },
        {
            title:
                "By leveraging data analysis and campaign optimization, OVA identifies opportunities to capture consumer attention where it matters most.",
            image: "./slide-7.jpg",
        },
        {
            title:
                "By focusing on companies that reinvent the entertainment experience, OVA identifies approaches capable of capturing and retaining audiences while generating sustainable returns.",
            image: "./slide-8.jpg",
        },
    ];

    const pinDistance = window.innerHeight * slides.length;
    const progressBar = document.querySelector(".slider-progress");
    const sliderImages = document.querySelector(".slider-images");
    const sliderTitle = document.querySelector(".slider-title");
    const sliderIndices = document.querySelector(".slider-indices");

    let activeSlide = 0;
    let currentSplit = null;

    function createIndices() {
        sliderIndices.innerHTML = "";

        slides.forEach((_, index) => {
            const indexNum = (index + 1).toString().padStart(2, "0");
            const indicatorElement = document.createElement("p");
            indicatorElement.dataset.index = index;
            indicatorElement.innerHTML = `<span class="marker"></span><span class="index">${indexNum}</span>`;
            sliderIndices.appendChild(indicatorElement);

            if (index === 0) {
                gsap.set(indicatorElement.querySelector(".index"), {
                    opacity: 1,
                });
                gsap.set(indicatorElement.querySelector(".marker"), {
                    scaleX: 1,
                });
            } else {
                gsap.set(indicatorElement.querySelector(".index"), {
                    opacity: 0.35,
                });
                gsap.set(indicatorElement.querySelector(".marker"), {
                    scaleX: 0,
                });
            }
        });
    }

    function animateNewSlide(index) {
        const newSliderImage = document.createElement("img");
        newSliderImage.src = slides[index].image;
        newSliderImage.alt = `Slide ${index + 1}`;

        gsap.set(newSliderImage, {
            opacity: 0,
            scale: 1.1,
        });

        sliderImages.appendChild(newSliderImage);

        gsap.to(newSliderImage, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
        });

        gsap.to(newSliderImage, {
            scale: 1,
            duration: 1,
            ease: "power2.out",
        });

        const allImages = sliderImages.querySelectorAll("img");
        if (allImages.length > 3) {
            const removeCount = allImages.length - 3;
            for (let i = 0; i < removeCount; i++) {
                sliderImages.removeChild(allImages[i]);
            }
        }

        animateNewTitle(index);
        animateIndicators(index);
    }

    function animateIndicators(index) {
        const indicators = sliderIndices.querySelectorAll("p");

        indicators.forEach((indicator, i) => {
            const markerElement = indicator.querySelector(".marker");
            const indexElement = indicator.querySelector(".index");

            if (i === index) {
                gsap.to(indexElement, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out",
                });

                gsap.to(markerElement, {
                    scaleX: 1,
                    duration: 0.3,
                    ease: "power2.out",
                });
            } else {
                gsap.to(indexElement, {
                    opacity: 0.5,
                    duration: 0.3,
                    ease: "power2.out",
                });

                gsap.to(markerElement, {
                    scaleX: 0,
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
        });
    }

    function animateNewTitle(index) {
        if (currentSplit) {
            currentSplit.revert();
        }

        sliderTitle.innerHTML = `<h1>${slides[index].title}</h1>`;

        currentSplit = new SplitText(sliderTitle.querySelector("h1"), {
            type: "lines",
            linesClass: "line",
            mask: "lines",
        });

        gsap.set(currentSplit.lines, {
            yPercent: 100,
            opacity: 0,
        });

        gsap.to(currentSplit.lines, {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
        });
    }

    createIndices();

    ScrollTrigger.create({
        trigger: ".slider",
        start: "top top",
        end: `+=${pinDistance}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
            gsap.set(progressBar, {
                scaleY: self.progress,
            });

            const currentSlide = Math.floor(self.progress * slides.length);
            if (activeSlide !== currentSlide && currentSlide < slides.length) {
                activeSlide = currentSlide;
                animateNewSlide(activeSlide)
            }

        }
    })
});
