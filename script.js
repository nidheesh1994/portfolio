const textEl = document.getElementById("loading-text");
const originalText = "Loading";
let scrambleChars = "!@#$%^&*()_+{}|:<>?";
let renderer, camera;

let i = 0;
const scrambleInterval = setInterval(() => {
  let scrambled = originalText
    .split("")
    .map((char, idx) =>
      idx <= i
        ? char
        : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
    )
    .join("");
  textEl.textContent = scrambled;
  i++;
  if (i > originalText.length) {
    clearInterval(scrambleInterval);
    startThreeScene();
  }
}, 100);

let mouseX = 0,
  mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function startThreeScene() {
  const canvas = document.getElementById("bg-canvas");
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.06);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const rectangles = [];
  const geometry = new THREE.BoxGeometry(0.1, 1, 0.1);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.3,
  });

  for (let i = 0; i < 100; i++) {
    const rect = new THREE.Mesh(geometry, material);
    rect.position.x = (Math.random() - 0.5) * 20;
    rect.position.y = Math.random() * 10;
    rect.position.z = (Math.random() - 0.5) * 20;
    scene.add(rect);
    rectangles.push(rect);
  }

  function animate() {
    requestAnimationFrame(animate);

    const targetRotX = mouseY * 0.05;
    const targetRotY = mouseX * 0.05;

    camera.rotation.x += (targetRotX - camera.rotation.x) * 0.05;
    camera.rotation.y += (targetRotY - camera.rotation.y) * 0.05;
    camera.rotation.z += (mouseX * 0.01 - camera.rotation.z) * 0.05;

    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;

    rectangles.forEach((rect) => {
      rect.position.y -= 0.05;
      if (rect.position.y < -5) rect.position.y = 5;
    });

    renderer.render(scene, camera);
  }
  animate();

  setTimeout(() => {
    document.getElementById("loading-container").style.display = "none";

    const mainSection = document.getElementById("main-section");
    mainSection.style.transform = "translateY(0)";

    document.body.style.overflow = "auto";
  }, 2000);
}

window.addEventListener("resize", () => {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || !renderer || !camera) return;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);
  const beginBtn = document.getElementById("begin-button");
  const nextSection = document.getElementById("next-section");

  beginBtn.addEventListener("click", () => {
    beginBtn.disabled = true;
    beginBtn.classList.add("clicked");

    // Smooth scroll to next section
    nextSection.scrollIntoView({ behavior: "smooth" });
  });
});
