"use strict";
import './style.css';
import { SceneManager } from './modules/SceneManager.js';
import { StarSystem } from './modules/StarSystem.js';

// begin scene and attain references
const sceneManager = new SceneManager();
const scene = sceneManager.getScene();
const camera = sceneManager.getCamera();

const starSystem = new StarSystem(scene, camera);

// animation loop
function animate() {
    requestAnimationFrame(animate);
    
    starSystem.update();

    sceneManager.render();
}

animate();
