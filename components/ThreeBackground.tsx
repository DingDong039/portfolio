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
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, -20, 80);
    camera.lookAt(0, 15, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    const blackHoleCenter = new THREE.Vector3(0, 15, 0);

    // ===== REALISTIC COLOR PALETTE =====
    const colors = {
      innerHot: new THREE.Color(0xffffff),
      midHot: new THREE.Color(0xffffcc),
      warm: new THREE.Color(0xffaa44),
      cool: new THREE.Color(0xff4400),
      outer: new THREE.Color(0x881100),
      photonRing: new THREE.Color(0xffdd88),
      blueShifted: new THREE.Color(0x88aaff),
      redShifted: new THREE.Color(0xff4400),
      jetCore: new THREE.Color(0x8888ff),
      jetOuter: new THREE.Color(0x4444aa),
      lensedLight: new THREE.Color(0xffffee),
    };

    // ===== LIGHTING =====
    const coreLight = new THREE.PointLight(colors.warm, 20, 200);
    coreLight.position.copy(blackHoleCenter);
    scene.add(coreLight);

    const rimLight1 = new THREE.PointLight(colors.innerHot, 8, 120);
    rimLight1.position.set(20, 25, 15);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(colors.cool, 8, 120);
    rimLight2.position.set(-20, 25, -15);
    scene.add(rimLight2);

    // ===== BLACK HOLE EVENT HORIZON (CORE) =====
    const coreGeometry = new THREE.SphereGeometry(8, 128, 128);
    const coreMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
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
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          // Pure black with Hawking radiation glow
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float rim = 1.0 - abs(dot(vNormal, viewDir));
          rim = pow(rim, 12.0);

          // Hawking radiation (extremely faint)
          vec3 hawkingGlow = vec3(0.03, 0.015, 0.005) * rim;

          gl_FragColor = vec4(hawkingGlow, 1.0);
        }
      `,
      side: THREE.FrontSide
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreMesh.position.copy(blackHoleCenter);
    scene.add(coreMesh);

    // ===== PHOTON SPHERE =====
    const photonSphereGeometry = new THREE.SphereGeometry(12, 128, 128);
    const photonSphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        glowColor: { value: colors.photonRing }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vPosition;

        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 6.0);
          float flicker = 0.8 + 0.2 * sin(time * 15.0 + length(vPosition) * 10.0);
          vec3 color = glowColor * fresnel * flicker * 3.0;
          float alpha = fresnel * 0.95;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const photonSphereMesh = new THREE.Mesh(photonSphereGeometry, photonSphereMaterial);
    photonSphereMesh.position.copy(blackHoleCenter);
    scene.add(photonSphereMesh);

    // ===== EINSTEIN RING =====
    const einsteinRingGeometry = new THREE.TorusGeometry(14, 0.5, 32, 128);
    const einsteinRingMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: colors.lensedLight }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          float pulse = 0.7 + 0.3 * sin(time * 4.0 + vUv.x * 40.0);
          vec3 viewDir = normalize(cameraPosition);
          float edge = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);
          vec3 finalColor = color * pulse * (1.5 + edge * 2.0);
          gl_FragColor = vec4(finalColor, 0.8 * pulse);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const einsteinRingMesh = new THREE.Mesh(einsteinRingGeometry, einsteinRingMaterial);
    einsteinRingMesh.position.copy(blackHoleCenter);
    einsteinRingMesh.rotation.x = Math.PI / 2.3;
    scene.add(einsteinRingMesh);

    // ===== ACCRETION DISK LAYERS =====
    const createAccretionDiskLayer = (
      innerRadius: number,
      outerRadius: number,
      innerColor: THREE.Color,
      outerColor: THREE.Color,
      speed: number,
      opacity: number
    ) => {
      const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 256, 8);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          innerColor: { value: innerColor },
          outerColor: { value: outerColor },
          innerRadius: { value: innerRadius },
          outerRadius: { value: outerRadius },
          baseOpacity: { value: opacity },
          rotationSpeed: { value: speed }
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
          uniform float innerRadius;
          uniform float outerRadius;
          uniform float baseOpacity;
          uniform float rotationSpeed;
          varying vec2 vUv;
          varying vec3 vPosition;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
              f.y
            );
          }

          float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 4; i++) {
              value += amplitude * noise(p);
              p *= 2.0;
              amplitude *= 0.5;
            }
            return value;
          }

          void main() {
            float dist = length(vPosition.xy);
            float normalizedDist = (dist - innerRadius) / (outerRadius - innerRadius);
            float angle = atan(vPosition.y, vPosition.x);

            // Spiral arms
            float spiral = sin(angle * 5.0 - normalizedDist * 12.0 + time * rotationSpeed) * 0.5 + 0.5;

            // Turbulence
            vec2 noiseCoord = vec2(angle * 3.0 + time * 0.5, normalizedDist * 6.0);
            float turb = fbm(noiseCoord * 4.0);

            // Hot spots
            float hotSpots = pow(noise(vec2(angle * 7.0 + time * 1.5, normalizedDist * 4.0)), 3.0);

            // Doppler effect - brighter on approaching side
            float doppler = 0.6 + 0.4 * sin(angle + time * rotationSpeed * 0.5);

            // Color mixing (inner = hotter)
            vec3 color = mix(innerColor, outerColor, normalizedDist);
            color += vec3(1.5, 1.3, 1.0) * hotSpots * 0.7;
            color *= (0.6 + spiral * 0.4);
            color *= (0.7 + turb * 0.5);
            color *= doppler;

            // Opacity
            float alpha = baseOpacity * (1.0 - normalizedDist * 0.6);
            alpha *= (0.5 + spiral * 0.5);
            alpha *= (0.7 + turb * 0.3);

            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(blackHoleCenter);
      mesh.rotation.x = Math.PI / 2.2;
      return { mesh, material };
    };

    const diskLayers = [
      createAccretionDiskLayer(12, 18, colors.innerHot, colors.warm, 3.5, 1.0),
      createAccretionDiskLayer(17, 25, colors.warm, colors.cool, 2.8, 0.8),
      createAccretionDiskLayer(24, 35, colors.cool, colors.outer, 2.2, 0.6),
      createAccretionDiskLayer(33, 50, colors.outer, new THREE.Color(0x440000), 1.6, 0.4),
    ];

    diskLayers.forEach(layer => scene.add(layer.mesh));

    // ===== VOLUMETRIC DISK CYLINDERS =====
    const createVolumeDisk = (innerR: number, outerR: number, height: number, innerCol: THREE.Color, outerCol: THREE.Color, speed: number) => {
      const geo = new THREE.CylinderGeometry(outerR, innerR, height, 128, 1, true);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          innerColor: { value: innerCol },
          outerColor: { value: outerCol },
          innerRadius: { value: innerR },
          outerRadius: { value: outerR },
          rotSpeed: { value: speed }
        },
        vertexShader: `
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 innerColor;
          uniform vec3 outerColor;
          uniform float innerRadius;
          uniform float outerRadius;
          uniform float rotSpeed;
          varying vec3 vPosition;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }

          void main() {
            float dist = length(vPosition.xz);
            float norm = (dist - innerRadius) / (outerRadius - innerRadius);
            float angle = atan(vPosition.z, vPosition.x);

            float spiral = sin(angle * 4.0 - norm * 10.0 + time * rotSpeed) * 0.5 + 0.5;
            float doppler = 0.5 + 0.5 * sin(angle + time * rotSpeed * 0.4);

            vec3 color = mix(innerColor, outerColor, norm);
            color *= (0.4 + spiral * 0.6) * doppler;

            float alpha = (1.0 - norm * 0.8) * (0.3 + spiral * 0.7) * 0.5;

            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(blackHoleCenter);
      mesh.rotation.x = Math.PI / 2.2;
      return { mesh, material: mat };
    };

    const volumeDisks = [
      createVolumeDisk(12, 20, 2.0, colors.innerHot, colors.warm, 3.0),
      createVolumeDisk(19, 30, 3.0, colors.warm, colors.cool, 2.3),
      createVolumeDisk(28, 45, 4.5, colors.cool, colors.outer, 1.8),
    ];
    volumeDisks.forEach(d => scene.add(d.mesh));

    // ===== RELATIVISTIC JETS =====
    const createJet = (direction: number) => {
      const jetGeometry = new THREE.ConeGeometry(3, 60, 32, 1, true);
      const jetMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          coreColor: { value: colors.jetCore },
          outerColor: { value: colors.jetOuter }
        },
        vertexShader: `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 coreColor;
          uniform vec3 outerColor;
          varying vec3 vPos;

          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }

          void main() {
            float heightNorm = (vPos.y + 30.0) / 60.0;
            float radial = length(vPos.xz) / (3.0 * (1.0 - heightNorm * 0.8));

            float turb = noise(vec2(atan(vPos.z, vPos.x) * 4.0 + time * 3.5, heightNorm * 7.0));
            float core = exp(-radial * 5.0);

            vec3 color = mix(outerColor, coreColor, core);
            color *= (0.6 + turb * 0.7);
            color *= 1.0 + sin(time * 2.5 + heightNorm * 12.0) * 0.3;

            float alpha = (1.0 - heightNorm) * core * 0.8 * (0.4 + turb * 0.6);

            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const jet = new THREE.Mesh(jetGeometry, jetMaterial);
      jet.position.set(blackHoleCenter.x, blackHoleCenter.y + direction * 30, blackHoleCenter.z);
      jet.rotation.x = direction > 0 ? 0 : Math.PI;
      return { mesh: jet, material: jetMaterial };
    };

    const topJet = createJet(1);
    const bottomJet = createJet(-1);
    scene.add(topJet.mesh);
    scene.add(bottomJet.mesh);

    // ===== INFALLING PARTICLES =====
    const particleCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors_arr = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 20 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * 0.5;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const temp = 1.0 - (radius - 20) / 100;
      const particleColor = new THREE.Color().lerpColors(colors.outer, colors.innerHot, temp);
      colors_arr[i * 3] = particleColor.r;
      colors_arr[i * 3 + 1] = particleColor.g;
      colors_arr[i * 3 + 2] = particleColor.b;

      sizes[i] = 0.4 + Math.random() * 1.0;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors_arr, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleTexture = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 200, 150, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    })();

    const particlesMaterial = new THREE.PointsMaterial({
      size: 1.2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // ===== BACKGROUND STARS =====
    const starsCount = 3000;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);
    const starsSizes = new Float32Array(starsCount);
    const starsColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      const r = 400 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starsPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starsPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starsPositions[i * 3 + 2] = r * Math.cos(phi);

      starsSizes[i] = 0.8 + Math.random() * 2.5;

      const starTemp = Math.random();
      if (starTemp > 0.9) {
        starsColors[i * 3] = 0.7 + Math.random() * 0.3;
        starsColors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        starsColors[i * 3 + 2] = 1.0;
      } else if (starTemp > 0.7) {
        starsColors[i * 3] = 1.0;
        starsColors[i * 3 + 1] = 1.0;
        starsColors[i * 3 + 2] = 1.0;
      } else if (starTemp > 0.4) {
        starsColors[i * 3] = 1.0;
        starsColors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        starsColors[i * 3 + 2] = 0.7 + Math.random() * 0.2;
      } else {
        starsColors[i * 3] = 1.0;
        starsColors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
        starsColors[i * 3 + 2] = 0.3 + Math.random() * 0.2;
      }
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // ===== NEBULA BACKGROUND =====
    const nebulaGeometry = new THREE.PlaneGeometry(1000, 1000);
    const nebulaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 5; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          vec2 uv = vUv - 0.5;

          float n1 = fbm(uv * 3.5 + time * 0.02);
          float n2 = fbm(uv * 6.0 - time * 0.015);
          float n3 = fbm(uv * 9.0 + vec2(time * 0.01, -time * 0.02));

          vec3 color1 = vec3(0.15, 0.03, 0.3) * n1;
          vec3 color2 = vec3(0.03, 0.08, 0.2) * n2;
          vec3 color3 = vec3(0.2, 0.05, 0.1) * n3;

          vec3 finalColor = color1 + color2 + color3;
          finalColor *= 0.4;

          gl_FragColor = vec4(finalColor, 0.6);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebula.position.z = -250;
    scene.add(nebula);

    // ===== MOUSE INTERACTION =====
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ===== ANIMATION LOOP =====
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.01;

      // Update shader uniforms
      coreMaterial.uniforms.time.value = time;
      photonSphereMaterial.uniforms.time.value = time;
      einsteinRingMaterial.uniforms.time.value = time;
      nebulaMaterial.uniforms.time.value = time;
      topJet.material.uniforms.time.value = time;
      bottomJet.material.uniforms.time.value = time;

      diskLayers.forEach(layer => {
        layer.material.uniforms.time.value = time;
      });
      volumeDisks.forEach(disk => {
        disk.material.uniforms.time.value = time;
      });

      // Rotate elements
      coreMesh.rotation.y += 0.002;
      photonSphereMesh.rotation.y -= 0.003;
      einsteinRingMesh.rotation.z += 0.001;

      diskLayers.forEach((layer, i) => {
        layer.mesh.rotation.z += 0.004 / (i + 1);
      });
      volumeDisks.forEach((disk, i) => {
        disk.mesh.rotation.z += 0.0035 / (i + 1);
      });

      // Pulsate photon sphere
      const photonScale = 1 + Math.sin(time * 2.5) * 0.03;
      photonSphereMesh.scale.setScalar(photonScale);

      // Animate lights
      coreLight.intensity = 20 + Math.sin(time * 1.8) * 4 + Math.sin(time * 3.5) * 2;
      rimLight1.intensity = 8 + Math.sin(time * 2.2 + 1) * 2;
      rimLight2.intensity = 8 + Math.sin(time * 2.8) * 2;

      // Animate particles
      const posArray = particlesGeometry.attributes.position.array as Float32Array;
      const colArray = particlesGeometry.attributes.color.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        let x = posArray[i3];
        let y = posArray[i3 + 1];
        let z = posArray[i3 + 2];

        const dist = Math.sqrt(x * x + y * y + z * z);
        const angle = Math.atan2(z, x);

        const gravity = 0.02 / Math.max(dist * 0.05, 0.1);
        const orbitalSpeed = 0.025 * Math.sqrt(60 / Math.max(dist, 12));

        posArray[i3] -= (x / dist) * gravity;
        posArray[i3 + 1] -= (y / dist) * gravity * 0.3;
        posArray[i3 + 2] -= (z / dist) * gravity;

        posArray[i3] += Math.cos(angle + Math.PI / 2) * orbitalSpeed;
        posArray[i3 + 2] += Math.sin(angle + Math.PI / 2) * orbitalSpeed;

        const newDist = Math.sqrt(
          posArray[i3] * posArray[i3] +
          posArray[i3 + 1] * posArray[i3 + 1] +
          posArray[i3 + 2] * posArray[i3 + 2]
        );
        const temp = Math.min(1.0, 1.0 - (newDist - 10) / 80);
        const particleColor = new THREE.Color().lerpColors(colors.outer, colors.innerHot, Math.max(0, temp));
        colArray[i3] = particleColor.r;
        colArray[i3 + 1] = particleColor.g;
        colArray[i3 + 2] = particleColor.b;

        if (dist < 9) {
          const newRadius = 50 + Math.random() * 80;
          const newTheta = Math.random() * Math.PI * 2;
          const newPhi = (Math.random() - 0.5) * 0.4;

          posArray[i3] = newRadius * Math.cos(newTheta) * Math.cos(newPhi);
          posArray[i3 + 1] = newRadius * Math.sin(newPhi);
          posArray[i3 + 2] = newRadius * Math.sin(newTheta) * Math.cos(newPhi);
        }
      }
      particlesGeometry.attributes.position.needsUpdate = true;
      particlesGeometry.attributes.color.needsUpdate = true;

      // Rotate background
      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00005;

      // Camera parallax
      camera.position.x += (mouseRef.current.x * 12 - camera.position.x) * 0.02;
      camera.position.y += (-20 + mouseRef.current.y * 12 - camera.position.y) * 0.02;
      camera.lookAt(blackHoleCenter);

      // Tilt disks
      const targetRotY = mouseRef.current.x * 0.2;
      diskLayers.forEach((layer) => {
        layer.mesh.rotation.y += (targetRotY * 0.3 - layer.mesh.rotation.y) * 0.02;
      });
      volumeDisks.forEach((disk) => {
        disk.mesh.rotation.y += (targetRotY * 0.3 - disk.mesh.rotation.y) * 0.02;
      });

      renderer.render(scene, camera);
    };

    animate();

    // ===== RESIZE HANDLER =====
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ===== CLEANUP =====
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }

      coreGeometry.dispose();
      coreMaterial.dispose();
      photonSphereGeometry.dispose();
      photonSphereMaterial.dispose();
      einsteinRingGeometry.dispose();
      einsteinRingMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      particleTexture.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      nebulaGeometry.dispose();
      nebulaMaterial.dispose();
      topJet.mesh.geometry.dispose();
      topJet.material.dispose();
      bottomJet.mesh.geometry.dispose();
      bottomJet.material.dispose();

      diskLayers.forEach(layer => {
        layer.mesh.geometry.dispose();
        layer.material.dispose();
      });
      volumeDisks.forEach(disk => {
        disk.mesh.geometry.dispose();
        disk.material.dispose();
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0015 0%, #050008 50%, #000000 100%)'
      }}
    />
  );
}
