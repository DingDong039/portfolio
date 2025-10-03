'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, -20, 50); // ย้ายกล้องลงเพื่อมอง BlackHole จากด้านล่าง

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Black Hole Colors - More realistic spectrum
    const innerEventHorizon = new THREE.Color(0xFF4500); // Deep Orange-Red
    const outerEventHorizon = new THREE.Color(0xFF8C00); // Dark Orange
    const hotAccretion = new THREE.Color(0xFFFFFF); // White hot
    const warmAccretion = new THREE.Color(0xFFA500); // Orange
    const coolerAccretion = new THREE.Color(0xFF6347); // Tomato
    const gravitationalLensing = new THREE.Color(0x1E90FF); // Dodger Blue

    // Advanced Lighting Setup
    const innerGlow = new THREE.PointLight(innerEventHorizon, 8, 150);
    innerGlow.position.set(0, 15, 0);
    scene.add(innerGlow);

    const outerGlow = new THREE.PointLight(warmAccretion, 4, 200);
    outerGlow.position.set(0, 15, 0);
    scene.add(outerGlow);

    const rimLight1 = new THREE.PointLight(hotAccretion, 3, 100);
    rimLight1.position.set(20, 15, 0);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(warmAccretion, 3, 100);
    rimLight2.position.set(-20, 15, 0);
    scene.add(rimLight2);

    const ambientLight = new THREE.AmbientLight(0x0a0015, 0.3);
    scene.add(ambientLight);

    // Custom Shader for Black Hole Core with Gravitational Lensing
    const blackHoleCoreGeometry = new THREE.SphereGeometry(5, 128, 128);
    const blackHoleCoreMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x000000) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          float intensity = pow(0.3 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 glow = vec3(0.1, 0.05, 0.0) * intensity;
          gl_FragColor = vec4(color + glow, 1.0);
        }
      `,
      transparent: false,
      side: THREE.FrontSide,
    });
    const blackHoleMesh = new THREE.Mesh(blackHoleCoreGeometry, blackHoleCoreMaterial);
    blackHoleMesh.position.set(0, 15, 0); // ย้าย BlackHole ขึ้นไปด้านบน
    scene.add(blackHoleMesh);

    // Multi-layered Event Horizon with Fresnel Effect
    const eventHorizonGeometry = new THREE.SphereGeometry(6.5, 128, 128);
    const eventHorizonMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        glowColor: { value: innerEventHorizon }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
          float pulse = sin(time * 2.0) * 0.3 + 0.7;
          vec3 glow = glowColor * fresnel * pulse;
          float alpha = fresnel * 0.8;
          gl_FragColor = vec4(glow, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const eventHorizonMesh = new THREE.Mesh(eventHorizonGeometry, eventHorizonMaterial);
    eventHorizonMesh.position.set(0, 15, 0);
    scene.add(eventHorizonMesh);

    // Outer Event Horizon Layer
    const outerHorizonGeometry = new THREE.SphereGeometry(8, 128, 128);
    const outerHorizonMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        glowColor: { value: outerEventHorizon }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 4.0);
          float pulse = sin(time * 1.5 + 1.0) * 0.2 + 0.8;
          vec3 glow = glowColor * fresnel * pulse;
          float alpha = fresnel * 0.5;
          gl_FragColor = vec4(glow, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const outerHorizonMesh = new THREE.Mesh(outerHorizonGeometry, outerHorizonMaterial);
    outerHorizonMesh.position.set(0, 15, 0);
    scene.add(outerHorizonMesh);

    // Realistic Accretion Disk - Inner Ring (Hottest, White)
    const innerDiskGeometry = new THREE.RingGeometry(9, 11, 128);
    const innerDiskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        innerColor: { value: hotAccretion },
        outerColor: { value: warmAccretion }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 innerColor;
        uniform vec3 outerColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          float dist = length(vPosition.xy);
          float normalizedDist = (dist - 9.0) / 2.0;

          // Create turbulence
          float angle = atan(vPosition.y, vPosition.x);
          float turbulence = sin(angle * 8.0 + time * 3.0) * 0.3 +
                            sin(angle * 16.0 - time * 5.0) * 0.2;

          vec3 color = mix(innerColor, outerColor, normalizedDist + turbulence * 0.3);
          float alpha = (1.0 - normalizedDist) * (0.9 + turbulence * 0.1);

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const innerDiskMesh = new THREE.Mesh(innerDiskGeometry, innerDiskMaterial);
    innerDiskMesh.rotation.x = Math.PI / 2.3;
    innerDiskMesh.position.set(0, 15, 0);
    scene.add(innerDiskMesh);

    // Middle Accretion Disk Ring
    const middleDiskGeometry = new THREE.RingGeometry(11, 14, 128);
    const middleDiskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        innerColor: { value: warmAccretion },
        outerColor: { value: coolerAccretion }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 innerColor;
        uniform vec3 outerColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          float dist = length(vPosition.xy);
          float normalizedDist = (dist - 11.0) / 3.0;

          float angle = atan(vPosition.y, vPosition.x);
          float turbulence = sin(angle * 6.0 + time * 2.5) * 0.4 +
                            cos(angle * 12.0 - time * 4.0) * 0.3;

          vec3 color = mix(innerColor, outerColor, normalizedDist + turbulence * 0.2);
          float alpha = (1.0 - normalizedDist) * (0.7 + turbulence * 0.15);

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const middleDiskMesh = new THREE.Mesh(middleDiskGeometry, middleDiskMaterial);
    middleDiskMesh.rotation.x = Math.PI / 2.3;
    middleDiskMesh.position.set(0, 15, 0);
    scene.add(middleDiskMesh);

    // Outer Accretion Disk Ring (Coolest)
    const outerDiskGeometry = new THREE.RingGeometry(14, 18, 128);
    const outerDiskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        innerColor: { value: coolerAccretion },
        outerColor: { value: new THREE.Color(0x8B0000) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 innerColor;
        uniform vec3 outerColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          float dist = length(vPosition.xy);
          float normalizedDist = (dist - 14.0) / 4.0;

          float angle = atan(vPosition.y, vPosition.x);
          float turbulence = sin(angle * 4.0 + time * 2.0) * 0.5 +
                            sin(angle * 9.0 - time * 3.0) * 0.4;

          vec3 color = mix(innerColor, outerColor, normalizedDist + turbulence * 0.25);
          float alpha = (1.0 - normalizedDist) * (0.5 + turbulence * 0.2);

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const outerDiskMesh = new THREE.Mesh(outerDiskGeometry, outerDiskMaterial);
    outerDiskMesh.rotation.x = Math.PI / 2.3;
    outerDiskMesh.position.set(0, 15, 0);
    scene.add(outerDiskMesh);

    // Particle System - Stars being pulled into Black Hole
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Distribute particles in a sphere around the black hole
      const radius = 30 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + 15; // ย้าย particles ตาม BlackHole
      positions[i * 3 + 2] = radius * Math.cos(phi);

      velocities.push(new THREE.Vector3(0, 0, 0));

      // Colors - realistic accretion colors with gravitational lensing
      const colorChoice = Math.random();
      let color: THREE.Color;
      if (colorChoice < 0.3) {
        color = hotAccretion;
      } else if (colorChoice < 0.6) {
        color = warmAccretion;
      } else if (colorChoice < 0.85) {
        color = coolerAccretion;
      } else {
        color = gravitationalLensing;
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    // Create circular particle texture
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d')!;

      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);

      return new THREE.CanvasTexture(canvas);
    };

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
      map: createCircleTexture(),
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Background Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 1000;
    const starsPositions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      starsPositions[i * 3] = (Math.random() - 0.5) * 200;
      starsPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(starsPositions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Mouse movement tracking
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationFrameId: number;
    let time = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.01;

      // Update shader uniforms
      blackHoleCoreMaterial.uniforms.time.value = time;
      eventHorizonMaterial.uniforms.time.value = time;
      outerHorizonMaterial.uniforms.time.value = time;
      innerDiskMaterial.uniforms.time.value = time;
      middleDiskMaterial.uniforms.time.value = time;
      outerDiskMaterial.uniforms.time.value = time;

      // Rotate Black Hole Core slowly
      blackHoleMesh.rotation.y += 0.001;
      eventHorizonMesh.rotation.y += 0.0015;
      outerHorizonMesh.rotation.y -= 0.001;

      // Rotate Accretion Disks at different speeds (inner faster, outer slower)
      innerDiskMesh.rotation.z += 0.008;
      middleDiskMesh.rotation.z += 0.006;
      outerDiskMesh.rotation.z += 0.004;

      // Subtle pulsating for event horizons
      const scale1 = 1 + Math.sin(time * 0.8) * 0.03;
      eventHorizonMesh.scale.set(scale1, scale1, scale1);

      const scale2 = 1 + Math.sin(time * 0.6 + Math.PI) * 0.04;
      outerHorizonMesh.scale.set(scale2, scale2, scale2);

      // Animate lights for dynamic effect
      innerGlow.intensity = 8 + Math.sin(time * 2) * 2;
      outerGlow.intensity = 4 + Math.sin(time * 1.5) * 1;

      // Animate Particles - Pull towards Black Hole (at y=15)
      const positionsArray = particlesGeometry.attributes.position.array as Float32Array;
      const blackHoleY = 15; // ตำแหน่ง Y ของ BlackHole

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positionsArray[i3];
        const y = positionsArray[i3 + 1] - blackHoleY;
        const z = positionsArray[i3 + 2];

        // Calculate distance from black hole center
        const distance = Math.sqrt(x * x + y * y + z * z);

        // Gravitational pull - stronger when closer
        const pullStrength = 0.02 / (distance * 0.1);

        // Pull particles towards center
        positionsArray[i3] -= (x / distance) * pullStrength;
        positionsArray[i3 + 1] -= (y / distance) * pullStrength;
        positionsArray[i3 + 2] -= (z / distance) * pullStrength;

        // Add orbital motion
        const angle = Math.atan2(y, x);
        positionsArray[i3] += Math.cos(angle + Math.PI / 2) * pullStrength * 0.5;
        positionsArray[i3 + 1] += Math.sin(angle + Math.PI / 2) * pullStrength * 0.5;

        // Reset particles that get too close
        if (distance < 7) {
          const radius = 30 + Math.random() * 70;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;

          positionsArray[i3] = radius * Math.sin(phi) * Math.cos(theta);
          positionsArray[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + blackHoleY;
          positionsArray[i3 + 2] = radius * Math.cos(phi);
        }
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Rotate background stars slowly
      stars.rotation.y += 0.0002;
      stars.rotation.x += 0.0001;

      // Mouse interaction - tilt black hole and disks
      const targetX = mouseRef.current.x * 0.2;
      const targetY = mouseRef.current.y * 0.2;

      blackHoleMesh.rotation.x += (targetY - blackHoleMesh.rotation.x) * 0.03;
      eventHorizonMesh.rotation.x += (targetY - eventHorizonMesh.rotation.x) * 0.03;
      outerHorizonMesh.rotation.x += (targetY - outerHorizonMesh.rotation.x) * 0.025;

      innerDiskMesh.rotation.y += (targetX - innerDiskMesh.rotation.y) * 0.04;
      middleDiskMesh.rotation.y += (targetX - middleDiskMesh.rotation.y) * 0.035;
      outerDiskMesh.rotation.y += (targetX - outerDiskMesh.rotation.y) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }

      // Dispose of Three.js objects
      blackHoleCoreGeometry.dispose();
      blackHoleCoreMaterial.dispose();
      eventHorizonGeometry.dispose();
      eventHorizonMaterial.dispose();
      outerHorizonGeometry.dispose();
      outerHorizonMaterial.dispose();
      innerDiskGeometry.dispose();
      innerDiskMaterial.dispose();
      middleDiskGeometry.dispose();
      middleDiskMaterial.dispose();
      outerDiskGeometry.dispose();
      outerDiskMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{
        background: 'linear-gradient(135deg, #0a0015 0%, #1a0a2e 50%, #0f0520 100%)'
      }}
    />
  );
}
