/**
 * External dependencies
 */
import CameraControls from 'camera-controls';
import { Box3, Matrix4, Quaternion, Raycaster, Sphere, Spherical, Vector2, Vector3, Vector4 } from 'three';
import * as THREE from 'three';

/**
 * Internal dependencies
 */
import { settings } from './config';

const { maxFrameRate } = settings;

CameraControls.install({
	THREE: { Box3, Matrix4, Quaternion, Raycaster, Sphere, Spherical, Vector2, Vector3, Vector4 }
});

// Elements
const canvas = document.querySelector('canvas');

// Three
const scene = new THREE.Scene();
const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const cameraControls = new CameraControls(camera, renderer.domElement);
cameraControls.setPosition(0, 0, -3);

// State
let lastFrameTime = 0;

const exampleMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ wireframe: true }));
scene.add(exampleMesh);

const onResize = () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// Events
window.addEventListener('resize', onResize);

// Draw
const tick = () => {
	const time = Date.now();
	const timeElapsed = time - lastFrameTime;
	const minTimeBetweenFrames = 1000 / maxFrameRate;

	if (timeElapsed > minTimeBetweenFrames) {
		lastFrameTime = time;

		const delta = Math.min(timeElapsed, minTimeBetweenFrames) / 1000;

		exampleMesh.rotation.y += 0.01;
		exampleMesh.rotation.z += 0.01;

		cameraControls.update(delta);

		renderer.render(scene, camera);
	}

	requestAnimationFrame(tick);
};

tick();
