import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import trebolTexture from '../../assets/images/trebol.png';

const GoldenCoin = ({ width = 500, height = 500 }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    // Configuración inicial
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    if (currentMount) {
      currentMount.innerHTML = '';
      currentMount.appendChild(renderer.domElement);
    }

    // Texturas
    const textureLoader = new THREE.TextureLoader();
    const normalMap = textureLoader.load(trebolTexture);

    // Material de la moneda
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffd700,
      metalness: 1.0,
      roughness: 0.3,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    // Geometría de la moneda
    const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 128);
    const coin = new THREE.Mesh(coinGeometry, material);
    coin.rotation.x = Math.PI / 2;

    const coinGroup = new THREE.Group();
    coinGroup.add(coin);
    scene.add(coinGroup);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // Luz ambiental más intensa
    scene.add(ambientLight);

    const spotLight1 = new THREE.SpotLight(0xffffff, 1.5, 10, Math.PI / 6, 0.3, 2);
    spotLight1.position.set(3, 3, 3);
    spotLight1.target = coin;
    spotLight1.castShadow = true;
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xffffff, 1.0, 10, Math.PI / 6, 0.3, 2);
    spotLight2.position.set(-3, 3, -3);
    spotLight2.target = coin;
    spotLight2.castShadow = true;
    scene.add(spotLight2);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-3, 2, -2);
    scene.add(backLight);

    // Configuración inicial de la cámara
    camera.position.set(0, 1.5, 3);

    // Controles de cámara
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    // Animación
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      coinGroup.rotation.y += 0.01; // Rotación constante
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
    };
  }, [width, height]);

  return (
    <div
      ref={mountRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        margin: '0 auto',
      }}
    />
  );
};

export default GoldenCoin;