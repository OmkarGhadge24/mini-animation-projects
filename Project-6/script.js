const lerp = (start, end, factor) => start + (end - start) * factor;

const config = {
  SCROLL_SPEED: 0.75,
  LERP_FACTOR: 0.05,
  BUFFER_SIZE: 15,
  CLEANUP_THRESHOLD: 50,
  MAX_VELOCITY: 120,
  SNAP_DURATION: 500,
};

const projectData = [
  { title: "Euphoria", image: "./assets/img1.jpeg", isAlternate: false },
  { title: "Scratcher", image: "./assets/img2.jpeg", isAlternate: true },
  { title: "Ember", image: "./assets/img3.jpeg", isAlternate: false },
  { title: "Liquid Soleil", image: "./assets/img4.jpeg", isAlternate: true },
  { title: "Vacuum", image: "./assets/img5.jpeg", isAlternate: false },
  { title: "Synthesis", image: "./assets/img6.jpeg", isAlternate: true },
];

const state = {
  currentY: 0,
  targetY: 0,
  lastY: 0,
  scrollVelocity: 0,
  isDragging: false,
  startY: 0,
  projects: new Map(),
  parallaxImages: new Map(),
  projectHeight: window.innerHeight,
  isSnapping: false,
  snapStartTime: 0,
  snapStartY: 0,
  snapTargetY: 0,
  lastScrollTime: Date.now(),
  isScrolling: false,
};

const createParallaxImage = (imageElement) => {
  let bounds = null;
  let currentTranslateY = 0;
  let targetTranslateY = 0;

  const updateBounds = () => {
    if (imageElement) {
      const rect = imageElement.getBoundingClientRect();
      bounds = {
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
      };
    }
  };

  const update = (scroll) => {
    if (!bounds) return;
    const relativeScroll = -scroll - bounds.top;
    targetTranslateY = relativeScroll * 0.2;
    currentTranslateY = lerp(currentTranslateY, targetTranslateY, 0.1);

    if (Math.abs(currentTranslateY - targetTranslateY) > 0.01) {
      imageElement.style.transform = `translateY(${currentTranslateY}px) scale(1.5)`;
    }
  };

  updateBounds();
  return { update, updateBounds };
};

const getProjectData = (index) => {
  const dataIndex =
    ((Math.abs(index) % projectData.length) + projectData.length) %
    projectData.length;
  return projectData[dataIndex];
};

const createProjectElement = (index) => {
  if (state.projects.has(index)) return;

  const template = document.querySelector(".template");
  const project = template.cloneNode(true);
  project.style.display = "flex";
  project.classList.remove("template");

  const dataIndex =
    ((Math.abs(index) % projectData.length) + projectData.length) %
    projectData.length;
  const data = getProjectData(index);
  const projectNumber = (dataIndex + 1).toString().padStart(2, "0");

  project.innerHTML = data.isAlternate
    ? `<div class="side">
         <div class="img"><img src="${data.image}" alt="${data.title}" /></div>
       </div>
       <div class="side">
         <div class="title">
           <h1>${data.title}</h1>
           <h1>${projectNumber}</h1>
         </div>
       </div>`
    : `<div class="side">
         <div class="title">
           <h1>${data.title}</h1>
           <h1>${projectNumber}</h1>
         </div>
       </div>
       <div class="side">
         <div class="img"><img src="${data.image}" alt="${data.title}" /></div>
       </div>`;

  project.style.transform = `translateY(${index * state.projectHeight}px)`;
  document.querySelector(".project-list").appendChild(project);
  state.projects.set(index, project);

  const img = project.querySelector("img");
  if (img) {
    state.parallaxImages.set(index, createParallaxImage(img));
  }
};

const createInitialProjects = () => {
  for (let i = -config.BUFFER_SIZE; i <= config.BUFFER_SIZE; i++) {
    createProjectElement(i);
  }
};

const getCurrentIndex = () => Math.round(-state.targetY / state.projectHeight);

const checkAndCreateProjects = () => {
  const currentIndex = getCurrentIndex();
  const minNeeded = currentIndex - config.BUFFER_SIZE;
  const maxNeeded = currentIndex + config.BUFFER_SIZE;

  for (let i = minNeeded; i <= maxNeeded; i++) {
    if (!state.projects.has(i)) {
      createProjectElement(i);
    }
  }

  state.projects.forEach((project, index) => {
    if (
      index < currentIndex - config.CLEANUP_THRESHOLD ||
      index > currentIndex + config.CLEANUP_THRESHOLD
    ) {
      project.remove();
      state.projects.delete(index);
      state.parallaxImages.delete(index);
    }
  });
};

const getClosestSnapPoint = () => {
  const currentIndex = Math.round(-state.targetY / state.projectHeight);
  return -currentIndex * state.projectHeight;
};

const initiateSnap = () => {
  state.isSnapping = true;
  state.snapStartTime = Date.now();
  state.snapStartY = state.targetY;
  state.snapTargetY = getClosestSnapPoint();
};

const updateSnap = () => {
  const elapsed = Date.now() - state.snapStartTime;
  const progress = Math.min(elapsed / config.SNAP_DURATION, 1);

  const t = 1 - Math.pow(1 - progress, 3);

  state.targetY = state.snapStartY + (state.snapTargetY - state.snapStartY) * t;

  if (progress >= 1) {
    state.isSnapping = false;
    state.targetY = state.snapTargetY;
  }
};

const animate = () => {
  const now = Date.now();
  const timeSinceLastScroll = now - state.lastScrollTime;

  if (!state.isSnapping && !state.isDragging && timeSinceLastScroll > 100) {
    const snapPoint = getClosestSnapPoint();
    if (Math.abs(state.targetY - snapPoint) > 1) {
      initiateSnap();
    }
  }

  if (state.isSnapping) {
    updateSnap();
  }

  if (!state.isDragging) {
    state.currentY += (state.targetY - state.currentY) * config.LERP_FACTOR;
  }

  checkAndCreateProjects();

  state.projects.forEach((project, index) => {
    const y = index * state.projectHeight + state.currentY;
    project.style.transform = `translateY(${y}px)`;

    const parallaxImage = state.parallaxImages.get(index);
    if (parallaxImage) {
      parallaxImage.update(state.currentY);
    }
  });

  requestAnimationFrame(animate);
};

const handleWheel = (e) => {
  e.preventDefault();
  state.isSnapping = false;
  state.lastScrollTime = Date.now();

  const scrollDelta = e.deltaY * config.SCROLL_SPEED;
  state.targetY -= Math.max(
    Math.min(scrollDelta, config.MAX_VELOCITY),
    -config.MAX_VELOCITY
  );
};

const handleTouchStart = (e) => {
  state.isDragging = true;
  state.isSnapping = false;
  state.startY = e.touches[0].clientY;
  state.lastY = state.targetY;
  state.lastScrollTime = Date.now();
};

const handleTouchMove = (e) => {
  if (!state.isDragging) return;
  const deltaY = (e.touches[0].clientY - state.startY) * 1.5;
  state.targetY = state.lastY + deltaY;
  state.lastScrollTime = Date.now();
};

const handleTouchEnd = () => {
  state.isDragging = false;
};

const handleResize = () => {
  state.projectHeight = window.innerHeight;
  state.projects.forEach((project, index) => {
    project.style.transform = `translateY(${index * state.projectHeight}px)`;
    const parallaxImage = state.parallaxImages.get(index);
    if (parallaxImage) {
      parallaxImage.updateBounds();
    }
  });
};

const initializeScroll = () => {
  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("touchstart", handleTouchStart);
  window.addEventListener("touchmove", handleTouchMove);
  window.addEventListener("touchend", handleTouchEnd);
  window.addEventListener("resize", handleResize);

  createInitialProjects();
  animate();
};

document.addEventListener("DOMContentLoaded", initializeScroll);
