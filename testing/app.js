import * as THREE from "three";

const main = () => {
  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  function render(time) {
    time *= 0.001; // convert time to seconds

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    lines.rotation.x = time;
    lines.rotation.y = time;

    renderer.render(scene, camera);

    console.log(time);
    // if (time >= 5.0) {
    //   console.log("stopping");
    //   cancelAnimationFrame(reqId);
    //   return;
    // }
    reqId = requestAnimationFrame(render);
  }

  const canvas = document.getElementById("canvas");

  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  console.log(renderer);

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 2;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  const scene = new THREE.Scene();
  const bgColor = new THREE.Color().setHex(0x333333);
  scene.background = bgColor;

  const boxWidth = 2;
  const boxHeight = 2;
  const boxDepth = 2;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const cubes = [
    makeInstance(geometry, 0x44aa88, -2.5),
    makeInstance(geometry, 0xff5555, 0),
    makeInstance(geometry, 0xaa8844, 2.5),
  ];

  const edges = new THREE.EdgesGeometry(geometry);
  const lines = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff }),
  );
  lines.position.x = -2.5;
  scene.add(lines);

  const color = 0xffffff;
  const intensity = 10;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0, 0, 6);
  scene.add(light);

  renderer.render(scene, camera);

  let reqId;
  reqId = requestAnimationFrame(render);
};

main();
