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

  document.addEventListener('click', () => {
    if (!isGameStarted) {
      controls.lock();
      isGameStarted = true;
    } else {
      shoot();
    }
  });

  spawnEnemies();
  animate();
}

function shoot() {
  const geometry = new THREE.SphereGeometry(0.1, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const bullet = new THREE.Mesh(geometry, material);
  bullet.position.copy(camera.position);
  bullet.velocity = new THREE.Vector3();
  bullet.velocity.setFromMatrixColumn(camera.matrix, 0);
  bullet.velocity.crossVectors(camera.up, bullet.velocity);
  bullet.velocity.crossVectors(bullet.velocity, camera.up);
  bullet.velocity.normalize().multiplyScalar(1);
  bullets.push(bullet);
  scene.add(bullet);
}

function spawnEnemies() {
  for (let i = 0; i < 3; i++) {
    const enemy = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    enemy.position.set(Math.random() * 20 - 10, 0.5, Math.random() * 20 - 10);
    enemy.velocity = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5);
    enemies.push(enemy);
    scene.add(enemy);
  }
}

function animate() {
  requestAnimationFrame(animate);

  bullets.forEach((bullet, index) => {
    bullet.position.add(bullet.velocity);
    enemies.forEach((enemy, eIndex) => {
      if (bullet.position.distanceTo(enemy.position) < 1) {
        scene.remove(enemy);
        enemies.splice(eIndex, 1);
        score++;
        if (score >= maxScore) alert('You Win!');
      }
    });
  });

  enemies.forEach(enemy => {
    enemy.position.add(enemy.velocity);
    // 簡單邊界反彈
    if (Math.abs(enemy.position.x) > 50 || Math.abs(enemy.position.z) > 50) {
      enemy.velocity.negate();
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

window.onload = init;
