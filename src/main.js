'use strict';
import './style.css';
import { SceneManager } from './modules/SceneManager.js';
import { ShaderBackground } from './modules/ShaderBackground.js';

// begin scene and attain references
const sceneManager = new SceneManager();
const scene = sceneManager.getScene();
const camera = sceneManager.getCamera();

const shaderBackground = new ShaderBackground(scene, camera);

window.addEventListener('mousemove', (e) => shaderBackground.onMouseMove(e));

// animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() * 0.001;
  shaderBackground.update(time);

  sceneManager.renderer.autoClear = false;
  sceneManager.renderer.clear();
  sceneManager.renderer.render(
    shaderBackground.scene,
    shaderBackground.bgCamera
  );

  sceneManager.render();
}

animate();
