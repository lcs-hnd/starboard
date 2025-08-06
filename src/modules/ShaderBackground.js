import * as THREE from 'three';

export class ShaderBackground {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.uniforms = {
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
      },
      iMouse: { value: new THREE.Vector2() },
    };

    // fullscreen quad geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // adapted nest shader
    const fragmentShader = `
      uniform float iTime;
      uniform vec3 iResolution;
      uniform vec2 iMouse;

      void main() {
      // get px coords
      vec2 uv = gl_FragCoord.xy / iResolution.xy;

      // simple gradient
      vec3 color = vec3(uv.x, uv.y, 0.5);

      gl_FragColor = vec4(color, 1.0);
      }
        `;

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: fragmentShader,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.frustumCulled = false; // always render bg

    // add to scene
    this.scene.add(this.mesh);

    // handle resize
    window.addEventListener('resize', () => this.onResize());
    this.onResize();
  }

  onResize() {
    this.uniforms.iResolution.value.set(
      window.innerWidth,
      window.innerHeight,
      1
    );
  }

  // onMouseMove(event) {
  //     this.uniforms.iMouse.value.set(event.clientX, window.innerHeight - event.clientY);
  // }

  update(time) {
    this.uniforms.iTime.value = time;
  }
}
