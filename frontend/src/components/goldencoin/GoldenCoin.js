import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import trebolTexture from '../../assets/logos/trebol.png';

const GoldenCoin = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    try {
      // Crear escena, cámara y renderizador
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        precision: 'highp',
      });

      const size = 300;
      renderer.setSize(size, size);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      currentMount.appendChild(renderer.domElement);

      // Cargar textura
      const textureLoader = new THREE.TextureLoader();
      const normalMap = textureLoader.load(trebolTexture);

      // Material de la moneda
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.15,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(1.5, 1.5),
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 1.5,
        envMapIntensity: 2.5, // Aumentado para más reflectividad
      });

      // Geometría de la moneda
      const coinGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 256);
      const coin = new THREE.Mesh(coinGeometry, material);
      coin.rotation.x = Math.PI / 2;
      coin.castShadow = true;
      coin.receiveShadow = true;

      const coinGroup = new THREE.Group();
      coinGroup.add(coin);
      scene.add(coinGroup);

      // Luces mejoradas
      const ambientLight = new THREE.AmbientLight(0xffffff, 2.5); // Aumentada la intensidad
      scene.add(ambientLight);

      const mainLight = new THREE.SpotLight(0x007bff, 3); // Aumentada la intensidad
      mainLight.position.set(5, 5, 6); // Ajustada la posición
      mainLight.angle = Math.PI / 3; // Ángulo más amplio
      mainLight.penumbra = 0.2; // Penumbra reducida para bordes más definidos
      mainLight.castShadow = true;
      scene.add(mainLight);

      const fillLight = new THREE.PointLight(0xffffff, 2.0); // Aumentada la intensidad
      fillLight.position.set(-5, -3, 4); // Ajustada la posición
      scene.add(fillLight);

      const backLight = new THREE.DirectionalLight(0xffffff, 1.5); // Aumentada la intensidad
      backLight.position.set(-4, 5, -6); // Ajustada la posición
      scene.add(backLight);

      // Luz adicional para más brillo
      const rimLight = new THREE.SpotLight(0xffffff, 2.0);
      rimLight.position.set(0, 4, -5);
      rimLight.angle = Math.PI / 4;
      rimLight.penumbra = 0.3;
      scene.add(rimLight);

      camera.position.set(0, 0, 3.5);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false;

      let animationFrameId;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        coinGroup.rotation.y += 0.002;
        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        const containerWidth = currentMount.clientWidth;
        const size = Math.min(containerWidth, 300);
        renderer.setSize(size, size);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        currentMount.removeChild(renderer.domElement);
        renderer.dispose();
        scene.clear();
        controls.dispose();
      };
    } catch (error) {
      console.error('Error initializing WebGL:', error);
    }
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '300px',
        aspectRatio: '1/1',
        margin: '0 auto',
        background: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

export default GoldenCoin;