"use strict";
import * as THREE from 'three';

export class StarSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.stars = []; // array for created stars
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.init();
    }

    init() {
        window.addEventListener('click', (event) => this.handleClick(event));
    }

    handleClick(event) {
        // converting pixels into -1, +1 range for three.js 
        /// divide distance from left and top edge to total width/height
        /// multiply by peak to peak amplitude of range (2) & subtract by its semi amplitude
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1; 
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.createStar();
    }

    createStar() {
        // plane at z 0
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

        // cast ray from camera through mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // find intersection with plane
        const intersectionPoint = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(plane, intersectionPoint);

        // create star at the point
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });

        const star = new THREE.Mesh(geometry, material);
        star.position.copy(intersectionPoint);

        this.scene.add(star);
        this.stars.push(star);

        console.log(`Star created at (${intersectionPoint.x.toFixed(2)}, ${intersectionPoint.y.toFixed(2)}, ${intersectionPoint.z.toFixed(2)})`);
    }
   
    update() {
        this.stars.forEach(star => {
            star.material.opacity = 0.6 + Math.sin(Date.now() * 0.003) * 0.2
        });
    }

    getStars() {
        return this.stars;
    }
}