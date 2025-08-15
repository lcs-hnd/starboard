'use strict';
import './style.css';
import { SceneManager } from './modules/SceneManager.js';
import { ShaderBackground } from './modules/ShaderBackground.js';

// begin scene and attain references
const sceneManager = new SceneManager();
const scene = sceneManager.getScene();

const shaderBackground = new ShaderBackground(scene);

// animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() * 0.001;
  shaderBackground.update(time);
  sceneManager.render();
}

animate();
