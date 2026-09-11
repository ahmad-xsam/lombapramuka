/* ==========================================================================
   SiPraja - 3D Trophy Canvas & Leaflet Map Component
   ========================================================================== */

const Map3DComponent = {
  init3DTrophy(containerId) {
    const container = document.getElementById(containerId);
    if (!container || !window.THREE) return;

    container.innerHTML = '';

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xa78bfa, 1.5);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 1.2);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Create 3D Trophy Group
    const trophyGroup = new THREE.Group();

    // Base
    const baseGeo = new THREE.CylinderGeometry(0.8, 1.0, 0.5, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e1147, roughness: 0.3, metalness: 0.8 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.75;
    trophyGroup.add(baseMesh);

    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.2, 0.4, 0.8, 32);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2, metalness: 0.9 });
    const stemMesh = new THREE.Mesh(stemGeo, goldMat);
    stemMesh.position.y = -0.1;
    trophyGroup.add(stemMesh);

    // Cup Body
    const cupGeo = new THREE.ConeGeometry(0.9, 1.2, 32, 1, true);
    const cupMesh = new THREE.Mesh(cupGeo, goldMat);
    cupMesh.position.y = 0.8;
    cupMesh.rotation.x = Math.PI;
    trophyGroup.add(cupMesh);

    // Scout Star Top
    const starGeo = new THREE.OctahedronGeometry(0.4);
    const starMesh = new THREE.Mesh(starGeo, goldMat);
    starMesh.position.y = 1.6;
    trophyGroup.add(starMesh);

    scene.add(trophyGroup);

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      trophyGroup.rotation.y += 0.015;
      starMesh.rotation.y += 0.03;
      renderer.render(scene, camera);
    }

    animate();
  },

  renderMapPage(container) {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i data-lucide="map-pin" style="color: var(--primary-400);"></i>
            Peta Denah Pos Perlombaan Pramuka
          </h1>
          <p class="page-subtitle">Denah Bumi Perkemahan & Lokasi Pos 10 Jenis Lomba</p>
        </div>
      </div>

      <div class="card-panel">
        <div class="card-panel-header">
          <h3 class="panel-title">
            <i data-lucide="navigation" style="color: var(--primary-400);"></i>
            Peta Bumi Perkemahan (Leaflet Interactive Map)
          </h3>
        </div>
        <div id="leaflet-map"></div>
      </div>
    `;

    lucide.createIcons();

    setTimeout(() => {
      if (window.L) {
        const map = L.map('leaflet-map').setView([-6.2088, 106.8456], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap SiPraja'
        }).addTo(map);

        const posList = [
          { lat: -6.2088, lng: 106.8456, title: 'Pos Utama & Administrasi' },
          { lat: -6.2095, lng: 106.8470, title: 'Pos Lomba LKBB & Joged Komando' },
          { lat: -6.2075, lng: 106.8440, title: 'Pos Pioneering & P3K' },
          { lat: -6.2100, lng: 106.8430, title: 'Pos Sandi, Morse & Semaphore' },
          { lat: -6.2065, lng: 106.8475, title: 'Pos Ketangkasan & Bank Soal' }
        ];

        posList.forEach(p => {
          L.marker([p.lat, p.lng]).addTo(map).bindPopup(`<b>${p.title}</b>`).openPopup();
        });
      }
    }, 100);
  }
};

window.Map3DComponent = Map3DComponent;
