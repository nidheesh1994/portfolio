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
let ufoMouseX = 0,
  ufoMouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  ufoMouseX = mouseX
  ufoMouseY = mouseY
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
    rect.position.x = (Math.random() - 0.5) * 30;
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
      if (rect.position.y < -5) rect.position.y = 10;
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
    const nextSection = document.getElementById("next-section");
    nextSection.style.display = "flex";
    nextSection.scrollIntoView({ behavior: "smooth" }); 
    
    setTimeout(() => { 
      startUfoScene();// start scene setup
      animateUfoEntry(); // run UFO entry animation
    }, 500);
  });
});

let ufoRenderer, ufoCamera, ufoScene, ufo;
const keyState = {};

function startUfoScene() {
  const canvas = document.getElementById("ufo-canvas");
  if (!canvas) return;

  ufoScene = new THREE.Scene();
  ufoScene.background = new THREE.Color(0x000000);

  ufoCamera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  ufoCamera.position.set(0, 1, 5);

  ufoRenderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  ufoRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
  ufoRenderer.setPixelRatio(window.devicePixelRatio);

  const ambient = new THREE.AmbientLight(0x999999);
  ufoScene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(5, 10, 7);
  ufoScene.add(dir);

  const starCount = 1000;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 100;
    positions[i * 3] = (Math.random() * 2 - 1) * r;
    positions[i * 3 + 1] = (Math.random() * 2 - 1) * r;
    positions[i * 3 + 2] = (Math.random() * 2 - 1) * r;

    const c = new THREE.Color(Math.random(), Math.random(), Math.random());
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const starMat = new THREE.PointsMaterial({ size: 1, vertexColors: true });
  const stars = new THREE.Points(starGeo, starMat);
  ufoScene.add(stars);

  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 1.2, 0.2, 32),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: 0x55aaff,
      transparent: true,
      opacity: 0.8,
    })
  );
  dome.position.y = 0.2;

  ufo = new THREE.Group();
  ufo.add(disc);
  ufo.add(dome);
  ufo.position.set(10, 10, -10);
  ufoScene.add(ufo);

  animateUfo();
}

function animateUfoEntry() {
  const start = { x: 10, y: 10, z: -10 };
  const end = { x: 0, y: 1, z: 0 };
  const duration = 1000; // in ms
  const steps = 60;
  let step = 0;

  const interval = setInterval(() => {
    const t = step / steps;
    ufo.position.x = start.x + (end.x - start.x) * t;
    ufo.position.y = start.y + (end.y - start.y) * t;
    ufo.position.z = start.z + (end.z - start.z) * t;

    step++;
    if (step > steps) {
      clearInterval(interval);
      document.getElementById("chat").classList.add("show");
    }
  }, duration / steps);
}

function animateUfo() {
  requestAnimationFrame(animateUfo);

  if (keyState["ArrowUp"]) ufo.position.z -= 0.1;
  if (keyState["ArrowDown"]) ufo.position.z += 0.1;
  if (keyState["ArrowLeft"]) ufo.position.x -= 0.1;
  if (keyState["ArrowRight"]) ufo.position.x += 0.1;

  const targetX = ufoMouseX * 2;
  const targetY = ufoMouseY * 1.5;

  ufoCamera.position.x += (targetX - ufoCamera.position.x) * 0.05;
  ufoCamera.position.y += (targetY + 1 - ufoCamera.position.y) * 0.05;
  ufoCamera.lookAt(0, 1, 0); // Look at UFO center

  if (ufoRenderer && ufoScene && ufoCamera) {
    ufoRenderer.render(ufoScene, ufoCamera);
  }
}

document.addEventListener("keydown", (e) => {
  keyState[e.code] = true;
});
document.addEventListener("keyup", (e) => {
  keyState[e.code] = false;
});

window.addEventListener("resize", () => {
  const canvas = document.getElementById("ufo-canvas");
  if (!canvas || !ufoRenderer || !ufoCamera) return;
  ufoRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
  ufoCamera.aspect = canvas.clientWidth / canvas.clientHeight;
  ufoCamera.updateProjectionMatrix();
});
