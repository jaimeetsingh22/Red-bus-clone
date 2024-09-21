import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-virtual-bus-tour',
  templateUrl: './virtual-bus-tour.component.html',
  styleUrls: ['./virtual-bus-tour.component.css']
})
export class VirtualBusTourComponent implements AfterViewInit {
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private mesh!: THREE.Mesh;
  private raycaster!: THREE.Raycaster;
  private mouse!: THREE.Vector2;
  private isUserInteracting!: boolean;
  private onMouseDownMouseX!: number;
  private onMouseDownMouseY!: number;
  private lon!: number;
  private lat!: number;
  private phi!: number;
  private theta!: number;
  private autoRotate!: boolean;
  private autoRotateSpeed!: number;
  private busImage!: string;
  private touchStartX!: number;
  private touchStartY!: number;

  constructor(private route: ActivatedRoute) {
    this.autoRotate = true;
    this.autoRotateSpeed = 0.04; 
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.busImage = params['busImage'];
      this.initThreeJS();
    });
  }

  initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('virtualTourCanvas')?.appendChild(this.renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    let imageUrl = this.getImageForBus(this.busImage);
    const texture = textureLoader.load(imageUrl);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({ map: texture });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.camera.position.set(0, 0, 0.1);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isUserInteracting = false;
    this.onMouseDownMouseX = 0;
    this.onMouseDownMouseY = 0;
    this.lon = 0;
    this.lat = 0;
    this.phi = 0;
    this.theta = 0;

    this.animate();

    document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    document.addEventListener('mouseup', this.onMouseUp.bind(this), false);

    document.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    document.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    document.addEventListener('touchend', this.onTouchEnd.bind(this), false);

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  getImageForBus(busImage: string): string {
    switch (busImage) {
      case 'bus1':
        return 'assets/bus1.jpg';
      case 'bus2':
        return 'assets/bus2.jpeg';
      case 'bus3':
        return 'assets/bus3.jpeg';
      case 'bus4':
        return 'assets/bus4.jpg';
      default:
        return 'assets/bus1.jpg';
    }
  }

  update(): void {
    if (this.autoRotate) {
      this.lon += this.autoRotateSpeed;
    }

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = THREE.MathUtils.degToRad(90 - this.lat);
    this.theta = THREE.MathUtils.degToRad(this.lon);

    const vector = new THREE.Vector3(
      Math.sin(this.phi) * Math.cos(this.theta),
      Math.cos(this.phi),
      Math.sin(this.phi) * Math.sin(this.theta)
    );

    this.camera.lookAt(vector);
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());
    this.update();
    this.renderer.render(this.scene, this.camera);
  }

  onMouseDown(event: MouseEvent): void {
    this.isUserInteracting = true;
    this.onMouseDownMouseX = event.clientX;
    this.onMouseDownMouseY = event.clientY;
    this.autoRotate = false;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isUserInteracting) {
      this.lon = (this.onMouseDownMouseX - event.clientX) * 0.1 + this.lon;
      this.lat = (event.clientY - this.onMouseDownMouseY) * 0.1 + this.lat;
    }
  }

  onMouseUp(): void {
    this.isUserInteracting = false;
    this.autoRotate = true;
  }

  onTouchStart(event: TouchEvent): void {
    this.isUserInteracting = true;
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.autoRotate = false;
  }

  onTouchMove(event: TouchEvent): void {
    if (this.isUserInteracting && event.touches.length === 1) {
      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;
      this.lon = (this.touchStartX - touchX) * 0.1 + this.lon;
      this.lat = (touchY - this.touchStartY) * 0.1 + this.lat;
      this.touchStartX = touchX;
      this.touchStartY = touchY;
    }
  }

  onTouchEnd(): void {
    this.isUserInteracting = false;
    this.autoRotate = true;
  }

  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
