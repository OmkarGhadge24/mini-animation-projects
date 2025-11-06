document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase);

  CustomEase.create(
    "hop",
    "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
  );

  const clientsPreview = document.querySelector(".clients-preview");
  const clientNames = document.querySelectorAll(".client-name");

  let activeClientIndex = -1;

  clientNames.forEach((client, index) => {
    let activeClientImgWrapper = null;
    let activeClientImg = null;

    client.addEventListener("mouseover", () => {
      if (activeClientIndex === index) return;

      if (activeClientIndex !== -1) {
        const previousClient = clientNames[activeClientIndex];
        const mouseoutEvent = new Event("mouseout");
        previousClient.dispatchEvent(mouseoutEvent);
      }

      activeClientIndex = index;

      const clientImgWrapper = document.createElement("div");
      clientImgWrapper.className = "client-img-wrapper";

      const clientImg = document.createElement("img");
      clientImg.src = `./assets/img${index + 1}.jpg`;
      gsap.set(clientImg, { scale: 1.25, opacity: 0 });

      clientImgWrapper.appendChild(clientImg);
      clientsPreview.appendChild(clientImgWrapper);

      activeClientImgWrapper = clientImgWrapper;
      activeClientImg = clientImg;

      gsap.to(clientImgWrapper, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.5,
        ease: "hop",
      });

      gsap.to(clientImg, {
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      });

      gsap.to(clientImg, {
        scale: 1,
        duration: 1.25,
        ease: "hop",
      });
    });

    client.addEventListener("mouseout", (event) => {
      if (event.relatedTarget && client.contains(event.relatedTarget)) {
        return;
      }

      if (activeClientIndex === index) {
        activeClientIndex = -1;
      }

      if (activeClientImg && activeClientImgWrapper) {
        const clientImgToRemove = activeClientImg;
        const clientImgWrapperToRemove = activeClientImgWrapper;

        activeClientImg = null;
        activeClientImgWrapper = null;

        gsap.to(clientImgToRemove, {
          opacity: 0,
          duration: 0.5,
          ease: "power1.out",
          onComplete: () => {
            clientImgWrapperToRemove.remove();
          },
        });
      }
    });
  });
});
