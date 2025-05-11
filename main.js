import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { PointerLockControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/PointerLockControls.js';

let scene, camera, renderer, controls;
let bullets = [];
let enemies = [];
let score = 0;
let isGameStarted = false;
const maxScore = 50;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new PointerLockControls(camera, document.body);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);

  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  camera.position.y = 1.6;

  for (let i = 0; i < 3; i++) {
    const enemy = createEnemy();
    enemies.push(enemy);
    scene.add(enemy);
  }

  document.addEventListener('click', () => {
    if (isGameStarted) shoot();
  });
}

function createEnemy() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const enemy = new THREE.Mesh(geometry, material);
  enemy.position.set(Math.random() * 50 - 25, 0.5, Math.random() * 50 - 25);
  return enemy;
}

function shoot() {
  const bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.05),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  bullet.position.copy(camera.position);
  bullet.userData.velocity = new THREE.Vector3();
  camera.getWorldDirection(bullet.userData.velocity);
  bullet.userData.velocity.multiplyScalar(1);
  scene.add(bullet);
  bullets.push(bullet);
}

function animate() {
  requestAnimationFrame(animate);

  bullets.forEach((b, index) => {
    b.position.add(b.userData.velocity);
    enemies.forEach((e, ei) => {
      if (b.position.distanceTo(e.position) < 1) {
        scene.remove(e);
        enemies.splice(ei, 1);
        const newEnemy = createEnemy();
        enemies.push(newEnemy);
        scene.add(newEnemy);
        score++;
        if (score >= maxScore) alert('You win!');
      }
    });
    if (b.position.length() > 100) {
      scene.remove(b);
      bullets.splice(index, 1);
    }
  });

  renderer.render(scene, camera);
}

window.startGame = () => {
  document.getElementById('overlay').style.display = 'none';
  controls.lock();
  isGameStarted = true;
};

init();
animate();
