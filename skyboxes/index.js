import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

let scene, camera, renderer, skyboxGeo, skybox, controls;
const canvasContainer = document.getElementById("viewer");

const createSkyBoxTexture = () => {
  // load the textures
  const front = new THREE.TextureLoader().load(
    "./assets/space-skybox/skybox_front.png",
  );
  const back = new THREE.TextureLoader().load(
    "./assets/space-skybox/skybox_back.png",
  );
  const right = new THREE.TextureLoader().load(
    "./assets/space-skybox/skybox_right.png",
  );
  const left = new THREE.TextureLoader().load(
    "./assets/space-skybox/skybox_left.png",
  );
  const top = new THREE.TextureLoader().load(
    "./assets/space-skybox/skybox_up.png",
  );
  const bottom = new THREE.TextureLoader().load(
    "./assets/space-skybox/skybox_down.png",
  );

  let materialArray = [right, left, top, bottom, front, back];
  materialArray = materialArray.map((texture) => {
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
};

const getCubeTexuture = () => {
  const loader = new THREE.CubeTextureLoader();
  loader.setPath("./assets/space-skybox/");

  const texture = loader.load([
    "skybox_right.png",
    "skybox_left.png",
    "skybox_up.png",
    "skybox_down.png",
    "skybox_front.png",
    "skybox_back.png",
  ]);

  console.log(texture);
  return texture;
};

const loadModel = async () => {
  // load the model
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load("./assets/castle_of_loarre.glb", (gltf) => resolve(gltf)),
      undefined,
      (error) => reject(error);
  });
};

async function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color().setHex(0x333333);

  camera = new THREE.PerspectiveCamera(
    55,
    canvasContainer.clientWidth / canvasContainer.clientHeight,
    10,
    30000,
  );
  camera.position.set(1200, -250, 300);
  // camera.position.set(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  renderer.domElement.id = "canvas";
  canvasContainer.appendChild(renderer.domElement);

  // creating the controls
  controls = new OrbitControls(camera, renderer.domElement);
  // controls.autoRotate = true;
  controls.enabled = true;
  controls.minDistance = 50;
  controls.maxDistance = 5000;

  // // load the skybox old method
  // skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
  // const skyboxMaterial = createSkyBoxTexture();
  // skybox = new THREE.Mesh(skyboxGeo, skyboxMaterial);
  // scene.add(skybox);

  const skyboxTexture = getCubeTexuture();
  scene.background = skyboxTexture;

  const model = await loadModel();
  scene.add(model.scene);

  animate();
}

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

init();
