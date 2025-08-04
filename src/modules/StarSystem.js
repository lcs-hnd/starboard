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

        // group to hold all the star elements
        const starGroup = new THREE.Group();

        // bright center
        const centralGeometry = new THREE.SphereGeometry(0.01, 8, 8);
        const centralMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
        });
        const centralStar = new THREE.Mesh(centralGeometry, centralMaterial);
        starGroup.add(centralStar);

        // lens flare
        const flareGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const flareMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        const flare = new THREE.Mesh(flareGeometry, flareMaterial);
        starGroup.add(flare);

        // stay spikes
        const rayGeometry = new THREE.PlaneGeometry(0.1, 0.01);
        const rayMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4
        });

        // multiplying number of rays in the cross pattern
        for (let i=0; i < 4; i++) {
            const ray = new THREE.Mesh(rayGeometry, rayMaterial);
            ray.rotation.z = (i * Math.PI) / 2; // 0, 90, 180, 270
            starGroup.add(ray)
        }

        // pointlight for illumination (white, intensity, distance)
        const starLight = new THREE.PointLight(0xffffff, 0.5, 2);
        starLight.position.set(0,0,0);
        starGroup.add(starLight);

        // position the group
        starGroup.position.copy(intersectionPoint);

        // storing light/mesh together
        const star = {
            group: starGroup,
            centralStar: centralStar,
            flare: flare,
            light: starLight,
            intensity: 1,
            pulseSpeed: 0.002 + Math.random() * 0.001 
        }
        

        this.scene.add(starGroup);
        this.stars.push(star);

        console.log(`Star created at (${intersectionPoint.x.toFixed(2)}, ${intersectionPoint.y.toFixed(2)}, ${intersectionPoint.z.toFixed(2)})`);
    }
   
    update() {
        this.stars.forEach(star => {
            // pulsing effect
            const twinkle = 0.7 + Math.sin(Date.now() * star.pulseSpeed) * 0.3;
            
            // star brightness
            star.centralStar.material.opacity = twinkle;

            // flare opacity
            star.flare.material.opacity = 0.2 + twinkle * 0.1;

            // update light intensity
            star.light.intensity = 0.3 + twinkle * 0.2;

            // subtle color variations
            const time = Date.now() * 0.0005;
            const colorVariation = Math.sin(time + star.pulseSpeed) * 0.5;
            const warmColor = new THREE.Color().setHSL(0.1, 0.3, 0.9 + colorVariation);
            star.centralStar.material.color.copy(warmColor); 
        });
    }

    getStars() {
        return this.stars;
    }
}