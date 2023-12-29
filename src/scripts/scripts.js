import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import bridge from "../image/tears_of_steel_bridge_2k.jpg";
import cloud from "../image/cloud.jpg";

const suzanneURL = new URL("../asset/suzanne.glb", import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-10, 30, 30);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update();

const axesHelper = new THREE.AxesHelper(5);
const gridHelper = new THREE.GridHelper(30);

// scene.fog = new THREE.Fog(0xcccccc, 0, 300);
scene.fog = new THREE.FogExp2(0xcccccc, 0.01);

// Add skybox background
// renderer.setClearColor(0xbbbbbb);
const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load(bridge, () => {
  backgroundTexture.mapping = THREE.EquirectangularReflectionMapping;
  backgroundTexture.colorSpace = THREE.SRGBColorSpace;
  scene.background = backgroundTexture;
});
scene.background = backgroundTexture;

// box2
const boxGeometry2 = new THREE.BoxGeometry(4, 4, 4);
const boxMaterial2 = new THREE.MeshBasicMaterial({
  //   color: 0x00ff00,
  //     map: textureLoader.load(cloud),
});
const boxMultiMaterial = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load(cloud) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(cloud) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(cloud) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(cloud) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(bridge) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(cloud) }),
];
const box2 = new THREE.Mesh(boxGeometry2, boxMultiMaterial);
box2.position.set(0, 15, 0);
box2.material.map = textureLoader.load(cloud);

// plane 2
const planeGeometry2 = new THREE.PlaneGeometry(10, 10, 10, 10);
const planeMaterial2 = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
plane2.position.set(10, 10, 15);

// modify geometry plane2
// const planeArray = plane2.geometry.attributes.position.array;

// sphere 2

// const vShader = `
//     void main(){
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
// `;

// const fShader = `
//     void main(){
//         gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
//     }
// `;

const sphereGeometry2 = new THREE.SphereGeometry(4);
// const sphereMaterial2 = new THREE.ShaderMaterial({
//   vertexShader: vShader,
//   fragmentShader: fShader,
// });
const sphereMaterial2 = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
});
const sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
sphere2.position.set(-5, 10, 10);

// box
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const box = new THREE.Mesh(boxGeometry, boxMaterial);

// plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

// sphere
const sphereGeometry = new THREE.SphereGeometry(4, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaffff,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 10, 5);
sphere.castShadow = true;

// suzanne
const assetLoader = new GLTFLoader();

assetLoader.load(
  suzanneURL.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-10, 5, -5);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// ambient light
const ambientLight = new THREE.AmbientLight(0x555555);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// directionalLight.position.set(-20, 20, 20);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;
// directionalLight.shadow.camera.right = 8;

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   5
// );

// const directionalLightShadowHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );

// spot light
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-50, 50, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

// const spotLightHelper = new THREE.SpotLightHelper(spotLight);

scene.add(axesHelper);
scene.add(gridHelper);
scene.add(box);
scene.add(box2);
scene.add(plane);
scene.add(plane2);
scene.add(sphere);
scene.add(sphere2);
scene.add(ambientLight);
// scene.add(directionalLight);
// scene.add(directionalLightHelper);
// scene.add(directionalLightShadowHelper);
scene.add(spotLight);
// scene.add(spotLightHelper);

const settingGUI = new dat.GUI();
const options = {
  sphereColor: "#aaffff",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1000,
};

settingGUI.addColor(options, "sphereColor").onChange((value) => {
  sphere.material.color.set(value);
});
settingGUI.add(options, "wireframe").onChange((value) => {
  sphere.material.wireframe = value;
});
settingGUI.add(options, "speed", 0, 0.1);
settingGUI.add(options, "angle", 0, 1);
settingGUI.add(options, "penumbra", 0, 1);
settingGUI.add(options, "intensity", 0, 50000);

let step = 0;

const mousePosition = new THREE.Vector2();
window.addEventListener("mousemove", function (value) {
  mousePosition.x = (value.clientX / this.window.innerWidth) * 2 - 1;
  mousePosition.y = -(value.clientY / this.window.innerHeight) * 2 + 1;
});
const rayCaster = new THREE.Raycaster();

function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  //   spotLightHelper.update();

  // object selection
  rayCaster.setFromCamera(mousePosition, camera);
  const intersectData = rayCaster.intersectObjects(scene.children);
  //   console.log(intersectData);

  for (let i = 0; i < intersectData.length; i++) {
    if (intersectData[i].object.id === sphere.id) {
      sphere.material.color.set("#00ff00");
    }

    if (intersectData[i].object.id === 13) {
      intersectData[i].object.rotation.x = time / 1000;
      intersectData[i].object.rotation.y = time / 1000;
    }
  }

  //   for (let i = 0; i < planeArray.length; i++) {
  //     planeArray[i] = 20 * Math.random();
  //   }
  //   plane2.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// add canvas responsive
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
