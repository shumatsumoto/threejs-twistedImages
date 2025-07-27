/**
 * Three.js
 * https://threejs.org/
 */
import * as THREE from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import GUI from "lil-gui";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

init();
async function init() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    10,
    3000
  );

  camera.position.z = 1000;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.cursor = "pointer"; // クリック可能であることを示す
  // renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);

  const control = new OrbitControls(camera, renderer.domElement);

  async function loadTex(url) {
    const texLoader = new THREE.TextureLoader();
    const texture = await texLoader.loadAsync(url);
    return texture;
  }

  function setupGeometry() {
    const wSeg = 30,
      hSeg = 30;
    const geometry = new THREE.PlaneGeometry(600, 300, wSeg, hSeg);
    // 頂点の数：(widthSegment + 1) * (heightSegment + 1)
    const delayVertices = [];

    const maxCount = (wSeg + 1) * (hSeg + 1);
    for (let i = 0; i < maxCount; i++) {
      // 遅延時間は0~1で格納
      const delayDuration = (1 / maxCount) * i;
      delayVertices.push(delayDuration);
    }

    console.log(delayVertices);

    geometry.setAttribute(
      "aDelay",
      new THREE.Float32BufferAttribute(delayVertices, 1)
    );
    // 頂点インデックスは左上から右下に向かって並んでいます（左上が0, 0）

    return geometry;
  }

  const geometry = setupGeometry();
  window.geometry = geometry;
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTex: {
        value: await loadTex(
          "https://static.not-equal.dev/ja_webgl_basic/img/output1.jpg"
        ),
      },
      uTick: { value: 0 },
      uProgress: { value: 0 },
    },
    vertexShader,
    fragmentShader,
    wireframe: true,
  });
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  // クリックイベントの設定
  let isAnimating = false;
  let animationProgress = 0;

  function onCanvasClick(event) {
    if (isAnimating) return; // アニメーション中は無視

    isAnimating = true;
    animationProgress = animationProgress === 0 ? 1 : 0; // 0と1を切り替え

    gsap.to(material.uniforms.uProgress, {
      value: animationProgress,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        isAnimating = false;
      },
    });
  }

  // レンダラーのcanvasにクリックイベントを追加
  renderer.domElement.addEventListener("click", onCanvasClick);

  // ウィンドウリサイズ対応
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // lil gui（デバッグ用として残す）
  const gui = new GUI();
  const folder1 = gui.addFolder("Animation");
  folder1.open();

  folder1
    .add(material.uniforms.uProgress, "value", 0, 1, 0.1)
    .name("progess")
    .listen();
  const datData = { next: !!material.uniforms.uProgress.value };
  folder1.add(datData, "next").onChange(() => {
    if (isAnimating) return; // アニメーション中は無視

    isAnimating = true;
    animationProgress = +datData.next;
    gsap.to(material.uniforms.uProgress, {
      value: animationProgress,
      duration: 2,
      ease: "power2.inOut",
      onComplete: () => {
        isAnimating = false;
      },
    });
  });

  function animate() {
    requestAnimationFrame(animate);

    control.update();

    material.uniforms.uTick.value++;

    renderer.render(scene, camera);
  }

  animate();
}
