/* ─────────────────────────────────────────────────────────────
   Norwegian Satellites — Live Orbital Tracker
   Three.js globe + satellite.js SGP4 propagation
   TLE data from CelesTrak (cached in localStorage, 24h TTL)
───────────────────────────────────────────────────────────── */

/* ── SATELLITE CATALOG ── */
const CATALOG = [

  /* GOVERNMENT / SPACE NORWAY */
  {
    id: 'norsat-1', name: 'NorSat-1', noradId: 42826,
    category: 'government', orbit: 'LEO',
    operator: 'Space Norway / Norwegian Space Agency',
    launched: '2017-07-14', status: 'dead',
    mission: 'AIS / VDES',
    description: 'First of the NorSat microsatellite series, carrying an AIS receiver and VHF Data Exchange System (VDES) payload. Operated for over 8 years — well beyond its 5-year design life. Decommissioned circa 2025.',
  },
  {
    id: 'norsat-2', name: 'NorSat-2', noradId: 42827,
    category: 'government', orbit: 'LEO',
    operator: 'Space Norway / Norwegian Space Agency',
    launched: '2017-07-14', status: 'dead',
    mission: 'AIS',
    description: 'Twin to NorSat-1, providing overlapping AIS coverage for maritime domain awareness. Also exceeded its 5-year design life significantly. Decommissioned circa 2025.',
  },
  {
    id: 'norsat-3', name: 'NorSat-3', noradId: 54361,
    category: 'government', orbit: 'LEO',
    operator: 'Space Norway',
    launched: '2022-01-13', status: 'active',
    mission: 'AIS / GNSS-RO',
    description: 'Third-generation AIS microsatellite with an added GNSS Radio Occultation payload for atmospheric profiling. Launched as a rideshare on SpaceX Transporter-3.',
  },
  {
    id: 'norsat-td', name: 'NorSat-TD', noradId: 43694,
    category: 'government', orbit: 'LEO',
    operator: 'Space Norway / KSAT',
    launched: '2018-11-19', status: 'dead',
    mission: 'Technology Demonstration',
    description: 'Technology demonstrator for the NorSat series. Sustained damage during intense solar storm activity in 2024 and was taken out of service. Operated for approximately 6 years.',
  },

  {
    id: 'norsat-4', name: 'NorSat-4', noradId: 62702,
    category: 'government', orbit: 'LEO',
    operator: 'Space Norway / SFL Missions',
    launched: '2025-01-14', status: 'active',
    mission: 'AIS / Low-Light Imaging',
    description: 'Latest NorSat spacecraft, launched on SpaceX Transporter-12. Carries a fifth-generation AIS receiver and a first-of-its-kind low-light camera to detect "dark ships" not broadcasting AIS. Built by SFL Missions.',
  },

  /* DEFENCE — FFI */
  {
    id: 'aissat-1', name: 'AISSat-1', noradId: 37375,
    category: 'defence', orbit: 'LEO',
    operator: 'Norwegian Defence Research Establishment (FFI)',
    launched: '2010-07-12', status: 'active',
    mission: 'AIS Maritime Surveillance',
    description: 'Norway\'s first military microsatellite, built by University of Toronto Institute for Aerospace Studies (UTIAS). Monitors global maritime traffic via Automatic Identification System (AIS) signals for the Norwegian Armed Forces.',
  },
  {
    id: 'aissat-2', name: 'AISSat-2', noradId: 40075,
    category: 'defence', orbit: 'LEO',
    operator: 'Norwegian Defence Research Establishment (FFI)',
    launched: '2014-06-19', status: 'active',
    mission: 'AIS Maritime Surveillance',
    description: 'Improved successor to AISSat-1. Provides overlapping coverage and enhanced AIS detection capability, particularly in high-traffic Arctic shipping lanes critical to Norwegian security.',
  },

  /* COMMERCIAL — TELENOR */
  {
    id: 'thor-5', name: 'Thor 5', noradId: 32487,
    category: 'commercial', orbit: 'GEO',
    operator: 'Telenor Satellite',
    launched: '2008-02-11', status: 'active',
    mission: 'Broadcasting / Communications',
    description: 'Geostationary broadcasting satellite serving Scandinavia, Europe and the Middle East. Positioned at 1° West. Launched by Sea Launch Zenit-3SL.',
  },
  {
    id: 'thor-6', name: 'Thor 6', noradId: 37775,
    category: 'commercial', orbit: 'GEO',
    operator: 'Telenor Satellite',
    launched: '2010-10-29', status: 'active',
    mission: 'Direct-to-Home Broadcasting',
    description: 'Direct-to-home broadcasting satellite for the Nordic, Baltic and Eastern European markets. Co-located with Thor 5 at 1° West. Launched by Ariane 5.',
  },
  {
    id: 'thor-7', name: 'Thor 7', noradId: 40613,
    category: 'commercial', orbit: 'GEO',
    operator: 'Telenor Satellite',
    launched: '2015-04-26', status: 'active',
    mission: 'Broadband / Broadcasting',
    description: 'Dual-payload satellite with Ku-band broadcast capacity and Ka-band broadband (maritime and government). Also co-located at 1° West. Built by SSL, launched on Ariane 5.',
  },

  /* ACADEMIC — NTNU */
  {
    id: 'hypso-1', name: 'HYPSO-1', noradId: 51053,
    category: 'academic', orbit: 'LEO',
    operator: 'NTNU SmallSat Lab',
    launched: '2022-01-13', status: 'active',
    mission: 'Hyperspectral Ocean Imaging',
    description: '6U CubeSat carrying a hyperspectral push-broom imager for ocean color monitoring, algal bloom detection, and water quality assessment. Developed at NTNU. Launched on SpaceX Transporter-3.',
  },
  {
    id: 'hypso-2', name: 'HYPSO-2', noradId: 57166,
    category: 'academic', orbit: 'LEO',
    operator: 'NTNU SmallSat Lab',
    launched: '2023-04-15', status: 'active',
    mission: 'Hyperspectral Ocean Imaging',
    description: 'Second hyperspectral ocean-color CubeSat from NTNU\'s SmallSat Lab. Features improved spectral resolution and onboard processing for Earth observation and climate research.',
  },

  /* STUDENT — ORBIT NTNU */
  {
    id: 'selfiesat', name: 'SelfieSat', noradId: 53951,
    category: 'student', orbit: 'LEO',
    operator: 'ORBIT NTNU',
    launched: '2022-05-25', status: 'dead',
    mission: 'Imaging / Education',
    description: '1U CubeSat built by students at NTNU\'s ORBIT organisation. Carried a wide-angle camera and delivered over 118 space selfies during its 2-year mission. Final signal received September 2024. Deorbited naturally from ~480 km.',
  },

  /* DEAD */
  {
    id: 'thor-2', name: 'Thor 2', noradId: 24833,
    category: 'commercial', orbit: 'GEO',
    operator: 'Telenor Satellite',
    launched: '1997-05-21', status: 'dead',
    mission: 'Broadcasting',
    description: 'Early Telenor geostationary broadcasting satellite. Decommissioned and moved to a graveyard orbit after Thor 5 entered service.',
  },
  {
    id: 'thor-3', name: 'Thor 3', noradId: 25233,
    category: 'commercial', orbit: 'GEO',
    operator: 'Telenor Satellite',
    launched: '1998-06-09', status: 'dead',
    mission: 'Broadcasting',
    description: 'Second-generation Thor broadcasting satellite. Replaced by the next generation fleet and decommissioned.',
  },
  {
    id: 'aissat-3-launch', name: 'AISSat-3 (launch failure)', noradId: null,
    category: 'defence', orbit: 'LEO',
    operator: 'Norwegian Defence Research Establishment (FFI)',
    launched: '2016-12-28', status: 'dead',
    mission: 'AIS Maritime Surveillance',
    description: 'Lost in the Soyuz-2 launch failure from Baikonur on 28 December 2016. The Fregat upper stage failed to relight after separation, and the payload section re-entered the atmosphere.',
  },

  /* PLANNED / FUTURE */
  {
    id: 'framsat', name: 'FramSat', noradId: null,
    category: 'student', orbit: 'LEO',
    operator: 'ORBIT NTNU',
    launched: null, status: 'planned',
    mission: 'TBD',
    description: 'Next-generation student satellite project from ORBIT NTNU. Named after the legendary polar exploration vessel Fram. Expected launch in the 2025–2026 timeframe.',
  },
  {
    id: 'hypso-3', name: 'HYPSO-3', noradId: null,
    category: 'academic', orbit: 'LEO',
    operator: 'NTNU SmallSat Lab',
    launched: null, status: 'planned',
    mission: 'Hyperspectral Earth Observation',
    description: 'Third in NTNU\'s hyperspectral imaging series. Expected to carry advanced hyperspectral payloads with improved signal-to-noise ratio and onboard AI inference.',
  },
  {
    id: 'aissat-4', name: 'AISSat-4', noradId: null,
    category: 'defence', orbit: 'LEO',
    operator: 'Norwegian Defence Research Establishment (FFI) / SFL Missions',
    launched: null, status: 'planned',
    mission: 'AIS Maritime Surveillance',
    description: 'Fourth FFI maritime surveillance nanosatellite, under fast-turnaround development by SFL Missions Inc. (contract awarded 2025). Aims to plug the coverage gap left by the ageing AISSat constellation.',
  },
  {
    id: 'thor-8', name: 'Thor 8', noradId: null,
    category: 'commercial', orbit: 'GEO',
    operator: 'Telenor Satellite',
    launched: null, status: 'planned',
    mission: 'Broadband / Broadcasting',
    description: 'Planned replacement for ageing Thor 5/6 capacity at the 1° West orbital slot. Expected to provide high-throughput Ka-band capacity for Nordic broadband services.',
  },
];

/* ── CATEGORY CONFIG ── */
const CAT = {
  government: { label: 'Government', color: '#4a9eff' },
  defence:    { label: 'Defence',    color: '#f87171' },
  commercial: { label: 'Commercial', color: '#fbbf24' },
  academic:   { label: 'Academic',   color: '#a78bfa' },
  student:    { label: 'Student',    color: '#34d399' },
};

function catColor(sat) {
  if (sat.status === 'dead') return '#4a5568';
  if (sat.status === 'planned') return '#60a5fa';
  return (CAT[sat.category] || { color: '#4a9eff' }).color;
}

/* ── STATE ── */
const state = {
  tles: {},           // noradId → { tle1, tle2, name, fetched }
  satrecs: {},        // noradId → satrec
  positions: {},      // noradId → { lat, lng, alt, vel }
  filter: 'all',
  search: '',
  selectedId: null,
  globeMeshes: {},    // noradId → THREE.Mesh
};

/* ── TLE CACHE (localStorage, 24h TTL) ── */
const TLE_CACHE_KEY  = 'norsat_tles_v1';
const TLE_CACHE_TTL  = 24 * 60 * 60 * 1000; // 24h

function loadTleCache() {
  try {
    const raw = localStorage.getItem(TLE_CACHE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (Date.now() - data.ts > TLE_CACHE_TTL) return {};
    return data.tles || {};
  } catch { return {}; }
}

function saveTleCache(tles) {
  try {
    localStorage.setItem(TLE_CACHE_KEY, JSON.stringify({ ts: Date.now(), tles }));
  } catch {}
}

/* ── FETCH TLEs ── */
// Primary: CelesTrak GP endpoint (CORS-enabled on HTTPS)
// Fallback: tle.ivanstanojevic.me (CORS-friendly, per-satellite)
async function fetchTles() {
  const cached  = loadTleCache();
  const toFetch = CATALOG
    .filter(s => s.noradId && !cached[s.noradId])
    .map(s => s.noradId);

  if (toFetch.length === 0) return cached;

  const results = { ...cached };

  // Try CelesTrak first (batched, comma-separated)
  let celestrakOk = false;
  const batchSize = 10;
  for (let i = 0; i < toFetch.length; i += batchSize) {
    const batch = toFetch.slice(i, i + batchSize);
    const ids   = batch.join(',');
    try {
      const res = await fetch(
        `https://celestrak.org/satcat/gp.php?CATNR=${ids}&FORMAT=TLE`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text   = await res.text();
      const parsed = parseTleText(text);
      if (Object.keys(parsed).length > 0) {
        Object.assign(results, parsed);
        celestrakOk = true;
      }
    } catch (e) {
      console.warn('CelesTrak batch failed', ids, e.message);
    }
  }

  // Fallback: fetch individually from tle.ivanstanojevic.me
  const stillMissing = toFetch.filter(id => !results[id]);
  if (stillMissing.length > 0) {
    await Promise.allSettled(stillMissing.map(async noradId => {
      try {
        const res  = await fetch(
          `https://tle.ivanstanojevic.me/api/tle/${noradId}`,
          { signal: AbortSignal.timeout(8000) }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.line1 && data.line2) {
          results[noradId] = { name: data.name, tle1: data.line1, tle2: data.line2 };
        }
      } catch (e) {
        console.warn('Fallback TLE fetch failed', noradId, e.message);
      }
    }));
  }

  saveTleCache(results);
  return results;
}

function parseTleText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const result = {};
  for (let i = 0; i + 2 < lines.length; i += 3) {
    const name = lines[i].replace(/^0 /, '').trim();
    const tle1 = lines[i + 1];
    const tle2 = lines[i + 2];
    if (tle1.startsWith('1 ') && tle2.startsWith('2 ')) {
      const noradId = parseInt(tle1.substring(2, 7).trim(), 10);
      result[noradId] = { name, tle1, tle2 };
    }
  }
  return result;
}

/* ── PROPAGATE ALL SATELLITES ── */
function propagateAll() {
  const now = new Date();
  for (const sat of CATALOG) {
    if (!sat.noradId || !state.satrecs[sat.noradId]) continue;
    try {
      const pv  = satellite.propagate(state.satrecs[sat.noradId], now);
      if (!pv || !pv.position) continue;
      const gmst = satellite.gstime(now);
      const gd   = satellite.eciToGeodetic(pv.position, gmst);
      const vel  = pv.velocity
        ? Math.sqrt(pv.velocity.x**2 + pv.velocity.y**2 + pv.velocity.z**2).toFixed(2)
        : null;
      state.positions[sat.noradId] = {
        lat: satellite.degreesLat(gd.latitude),
        lng: satellite.degreesLong(gd.longitude),
        alt: gd.height,          // km
        vel,                     // km/s
      };
    } catch {}
  }
}

/* ── THREE.JS GLOBE ── */
const GLOBE_R    = 2;
const EARTH_R_KM = 6371;

let renderer, scene, camera, earthMesh, atmosphereMesh;
let isDragging = false, prevMouse = { x: 0, y: 0 };
let globeGroup;
let autoRotate = true;

function latLngToVec3(lat, lng, r) {
  const phi   = (90 - lat)  * Math.PI / 180;
  const theta = (lng + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

function altToRadius(altKm) {
  // Compress altitude logarithmically so LEO and GEO are both visible
  const factor = Math.log1p(altKm / 500) * 0.22;
  return GLOBE_R + Math.min(factor, 1.8);
}

function initGlobe() {
  const wrap = document.getElementById('globeWrap');
  const canvas = document.getElementById('globeCanvas');

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 6.5);

  /* Lighting */
  const ambient = new THREE.AmbientLight(0x334466, 1.2);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 1.8);
  sun.position.set(5, 3, 5);
  scene.add(sun);

  globeGroup = new THREE.Group();
  scene.add(globeGroup);

  /* Earth sphere */
  const earthGeo  = new THREE.SphereGeometry(GLOBE_R, 64, 64);

  // Load blue marble texture; fall back to solid colour
  const loader = new THREE.TextureLoader();
  const earthMat = new THREE.MeshPhongMaterial({
    color:     0x1a3a5c,
    emissive:  0x0a1520,
    specular:  0x4a9eff,
    shininess: 20,
  });
  earthMesh = new THREE.Mesh(earthGeo, earthMat);
  globeGroup.add(earthMesh);

  loader.load(
    'https://cdn.jsdelivr.net/npm/three-globe@2.31.0/example/img/earth-blue-marble.jpg',
    tex => {
      earthMesh.material = new THREE.MeshPhongMaterial({
        map:       tex,
        specular:  new THREE.Color(0x1a3a5c),
        shininess: 10,
      });
    },
    undefined,
    () => {} // silently keep procedural fallback
  );

  /* Atmosphere glow */
  const atmGeo = new THREE.SphereGeometry(GLOBE_R * 1.03, 64, 64);
  const atmMat = new THREE.MeshPhongMaterial({
    color:       0x4a9eff,
    transparent: true,
    opacity:     0.06,
    side:        THREE.FrontSide,
  });
  atmosphereMesh = new THREE.Mesh(atmGeo, atmMat);
  scene.add(atmosphereMesh);

  /* Grid lines */
  const gridMat = new THREE.LineBasicMaterial({ color: 0x1e2d45, transparent: true, opacity: 0.35 });
  for (let lat = -75; lat <= 75; lat += 30) {
    const pts = [];
    for (let lng = -180; lng <= 180; lng += 3) pts.push(latLngToVec3(lat, lng, GLOBE_R + 0.001));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
  }
  for (let lng = -165; lng <= 180; lng += 30) {
    const pts = [];
    for (let lat = -90; lat <= 90; lat += 3) pts.push(latLngToVec3(lat, lng, GLOBE_R + 0.001));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
  }

  /* Drag controls */
  canvas.addEventListener('mousedown',  e => { isDragging = true; autoRotate = false; prevMouse = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('touchstart', e => { isDragging = true; autoRotate = false; const t = e.touches[0]; prevMouse = { x: t.clientX, y: t.clientY }; }, { passive: true });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    globeGroup.rotation.y += dx * 0.005;
    globeGroup.rotation.x = Math.max(-1.2, Math.min(1.2, globeGroup.rotation.x + dy * 0.005));
    prevMouse = { x: e.clientX, y: e.clientY };
  });
  window.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const t = e.touches[0];
    const dx = t.clientX - prevMouse.x;
    const dy = t.clientY - prevMouse.y;
    globeGroup.rotation.y += dx * 0.005;
    globeGroup.rotation.x = Math.max(-1.2, Math.min(1.2, globeGroup.rotation.x + dy * 0.005));
    prevMouse = { x: t.clientX, y: t.clientY };
  }, { passive: true });
  window.addEventListener('mouseup',   () => isDragging = false);
  window.addEventListener('touchend',  () => isDragging = false);

  /* Scroll zoom */
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    camera.position.z = Math.max(3.5, Math.min(12, camera.position.z + e.deltaY * 0.01));
  }, { passive: false });

  /* Resize */
  window.addEventListener('resize', () => {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
}

function buildSatelliteDots() {
  /* Remove old */
  Object.values(state.globeMeshes).forEach(m => globeGroup.remove(m));
  state.globeMeshes = {};

  const geo = new THREE.SphereGeometry(0.018, 8, 8);
  for (const sat of CATALOG) {
    if (!sat.noradId || sat.status === 'dead' || sat.status === 'planned') continue;
    const color = catColor(sat);
    const mat = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.visible = false;
    globeGroup.add(mesh);
    state.globeMeshes[sat.noradId] = mesh;
  }
}

function updateGlobeDots() {
  for (const sat of CATALOG) {
    const mesh = state.globeMeshes[sat.noradId];
    if (!mesh) continue;
    const pos = state.positions[sat.noradId];
    if (!pos) { mesh.visible = false; continue; }
    const r   = altToRadius(pos.alt);
    const v   = latLngToVec3(pos.lat, pos.lng, r);
    mesh.position.copy(v);
    mesh.visible = true;

    /* Scale highlight for selected */
    const scale = sat.id === state.selectedId ? 2.5 : 1;
    mesh.scale.setScalar(scale);
  }
}

function animateGlobe() {
  requestAnimationFrame(animateGlobe);
  if (autoRotate) globeGroup.rotation.y += 0.0008;
  atmosphereMesh.position.copy(globeGroup.position);
  renderer.render(scene, camera);
}

/* ── STARFIELD ── */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    drawStars();
  }

  const stars = Array.from({ length: 280 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.2 + 0.2,
    a: Math.random() * 0.7 + 0.2,
    speed: Math.random() * 0.5 + 0.3,
    phase: Math.random() * Math.PI * 2,
  }));

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 2000;
    for (const s of stars) {
      const alpha = s.a * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,234,240,${alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resize);
  resize();
}

/* ── UI RENDERING ── */
function fmtStatus(status) {
  const map = {
    active:  '<span class="badge badge-status-active">Active</span>',
    dead:    '<span class="badge badge-status-dead">Decommissioned</span>',
    planned: '<span class="badge badge-status-planned">Planned</span>',
  };
  return map[status] || '';
}

function fmtCatBadge(sat) {
  const c = catColor(sat);
  const label = sat.status === 'dead' ? 'Dead' :
                sat.status === 'planned' ? 'Planned' :
                (CAT[sat.category]?.label || sat.category);
  return `<span class="badge badge-cat" style="--cat-color:${c}">${label}</span>`;
}

function fmtOrbitBadge(orbit) {
  return `<span class="badge badge-orbit">${orbit}</span>`;
}

function fmtLiveValue(val, unit) {
  if (val == null) return `<span class="live-value na">—</span>`;
  return `<span class="live-value">${typeof val === 'number' ? val.toFixed(1) : val}${unit}</span>`;
}

function renderCards() {
  const grid = document.getElementById('satGrid');
  const filtered = CATALOG.filter(sat => {
    if (state.filter !== 'all') {
      if (state.filter === 'dead' && sat.status !== 'dead') return false;
      if (state.filter === 'planned' && sat.status !== 'planned') return false;
      if (!['dead','planned'].includes(state.filter) && sat.category !== state.filter) return false;
    }
    if (state.search) {
      const q = state.search.toLowerCase();
      if (!sat.name.toLowerCase().includes(q) &&
          !sat.operator.toLowerCase().includes(q) &&
          !(sat.mission || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="no-results">No satellites match your filter.</p>';
    return;
  }

  grid.innerHTML = filtered.map(sat => {
    const color = catColor(sat);
    const pos   = sat.noradId ? state.positions[sat.noradId] : null;
    return `
    <div class="sat-card status-${sat.status}${sat.id === state.selectedId ? ' highlighted' : ''}"
         style="--cat-color:${color}"
         data-id="${sat.id}">
      <div class="card-top">
        <div class="card-name">${sat.name}</div>
        <div class="card-badges">
          ${fmtCatBadge(sat)}
          ${fmtOrbitBadge(sat.orbit)}
          ${fmtStatus(sat.status)}
        </div>
      </div>
      <div class="card-operator">${sat.operator}</div>
      <div class="card-desc">${sat.description}</div>
      ${sat.status === 'active' ? `
      <div class="card-live">
        <div class="live-item">
          <span class="live-label">Lat</span>
          ${pos ? `<span class="live-value">${pos.lat.toFixed(1)}°</span>` : '<span class="live-value na">—</span>'}
        </div>
        <div class="live-item">
          <span class="live-label">Lng</span>
          ${pos ? `<span class="live-value">${pos.lng.toFixed(1)}°</span>` : '<span class="live-value na">—</span>'}
        </div>
        <div class="live-item">
          <span class="live-label">Alt</span>
          ${pos ? `<span class="live-value">${Math.round(pos.alt)} km</span>` : '<span class="live-value na">—</span>'}
        </div>
      </div>` : ''}
    </div>`;
  }).join('');

  grid.querySelectorAll('.sat-card').forEach(el => {
    el.addEventListener('click', () => openPanel(el.dataset.id));
  });
}

function updateCounts() {
  const counts = { all: 0, government: 0, defence: 0, commercial: 0, academic: 0, student: 0, dead: 0, planned: 0 };
  for (const s of CATALOG) {
    counts.all++;
    if (s.status === 'dead') { counts.dead++; continue; }
    if (s.status === 'planned') { counts.planned++; continue; }
    counts[s.category] = (counts[s.category] || 0) + 1;
  }
  document.getElementById('c-all').textContent  = counts.all;
  document.getElementById('c-gov').textContent  = counts.government || 0;
  document.getElementById('c-def').textContent  = counts.defence    || 0;
  document.getElementById('c-com').textContent  = counts.commercial || 0;
  document.getElementById('c-aca').textContent  = counts.academic   || 0;
  document.getElementById('c-stu').textContent  = counts.student    || 0;
  document.getElementById('c-dead').textContent = counts.dead;
  document.getElementById('c-plan').textContent = counts.planned;
}

/* ── DETAIL PANEL ── */
function openPanel(id) {
  const sat   = CATALOG.find(s => s.id === id);
  if (!sat) return;
  state.selectedId = id;
  renderCards();

  const color = catColor(sat);
  const pos   = sat.noradId ? state.positions[sat.noradId] : null;

  const catLabel = sat.status === 'dead' ? 'Decommissioned' :
                   sat.status === 'planned' ? 'Planned' :
                   (CAT[sat.category]?.label || sat.category);

  document.getElementById('panelContent').innerHTML = `
    <div class="panel-cat-bar" style="background:${color}"></div>
    <h2 class="panel-name">${sat.name}</h2>
    <p class="panel-operator">${sat.operator}</p>
    <div class="panel-badges">
      ${fmtCatBadge(sat)}
      ${fmtOrbitBadge(sat.orbit)}
      ${fmtStatus(sat.status)}
      <span class="badge badge-cat" style="--cat-color:${color}">${sat.mission || '—'}</span>
    </div>
    <p class="panel-desc">${sat.description}</p>

    ${sat.status === 'active' ? `
    <p class="panel-section-title">Live Position</p>
    <div class="panel-live-grid">
      <div class="panel-live-item">
        <div class="panel-live-label">Latitude</div>
        <div class="panel-live-val${!pos ? ' na' : ''}">${pos ? pos.lat.toFixed(2) + '°' : '—'}</div>
      </div>
      <div class="panel-live-item">
        <div class="panel-live-label">Longitude</div>
        <div class="panel-live-val${!pos ? ' na' : ''}">${pos ? pos.lng.toFixed(2) + '°' : '—'}</div>
      </div>
      <div class="panel-live-item">
        <div class="panel-live-label">Altitude</div>
        <div class="panel-live-val${!pos ? ' na' : ''}">${pos ? Math.round(pos.alt) + ' km' : '—'}</div>
      </div>
      <div class="panel-live-item">
        <div class="panel-live-label">Velocity</div>
        <div class="panel-live-val${!pos?.vel ? ' na' : ''}">${pos?.vel ? pos.vel + ' km/s' : '—'}</div>
      </div>
    </div>` : ''}

    <p class="panel-section-title">Details</p>
    <ul class="panel-meta-list">
      <li><span>Category</span><span>${catLabel}</span></li>
      <li><span>Orbit</span><span>${sat.orbit}</span></li>
      <li><span>Launched</span><span>${sat.launched || 'TBD'}</span></li>
      <li><span>Status</span><span>${sat.status.charAt(0).toUpperCase() + sat.status.slice(1)}</span></li>
    </ul>

    ${sat.noradId ? `
    <div class="panel-norad">
      <span>NORAD Catalog ID</span>
      <span>${sat.noradId}</span>
    </div>` : ''}
  `;

  document.getElementById('panelOverlay').classList.add('open');

  // Spin globe to face satellite
  if (pos && globeGroup) {
    const targetY = -(pos.lng * Math.PI / 180);
    const targetX = -(pos.lat * Math.PI / 180) * 0.5;
    globeGroup.rotation.y = targetY;
    globeGroup.rotation.x = Math.max(-1.2, Math.min(1.2, targetX));
    autoRotate = false;
  }
}

function closePanel() {
  document.getElementById('panelOverlay').classList.remove('open');
  state.selectedId = null;
  renderCards();
}

/* ── FILTER & SEARCH ── */
function initFilters() {
  document.getElementById('filterRow').addEventListener('click', e => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    state.filter = btn.dataset.filter;
    renderCards();
  });

  document.getElementById('searchBox').addEventListener('input', e => {
    state.search = e.target.value.trim();
    renderCards();
  });

  document.getElementById('panelClose').addEventListener('click', closePanel);
  document.getElementById('panelOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('panelOverlay')) closePanel();
  });
}

/* ── LIVE UPDATE LOOP ── */
function startLiveLoop() {
  setInterval(() => {
    propagateAll();
    updateGlobeDots();
    if (state.selectedId) {
      const sat = CATALOG.find(s => s.id === state.selectedId);
      if (sat?.status === 'active' && sat.noradId) {
        // Refresh live position values in panel
        const pos = state.positions[sat.noradId];
        const els = {
          lat: document.querySelectorAll('.panel-live-val')[0],
          lng: document.querySelectorAll('.panel-live-val')[1],
          alt: document.querySelectorAll('.panel-live-val')[2],
          vel: document.querySelectorAll('.panel-live-val')[3],
        };
        if (els.lat && pos) {
          els.lat.textContent = pos.lat.toFixed(2) + '°';
          els.lng.textContent = pos.lng.toFixed(2) + '°';
          els.alt.textContent = Math.round(pos.alt) + ' km';
          if (els.vel) els.vel.textContent = pos.vel ? pos.vel + ' km/s' : '—';
        }
      }
    }
    // Refresh card live values
    document.querySelectorAll('.sat-card').forEach(card => {
      const id  = card.dataset.id;
      const sat = CATALOG.find(s => s.id === id);
      if (!sat?.noradId) return;
      const pos = state.positions[sat.noradId];
      if (!pos) return;
      const vals = card.querySelectorAll('.live-value');
      if (vals.length >= 3) {
        vals[0].textContent = pos.lat.toFixed(1) + '°';
        vals[1].textContent = pos.lng.toFixed(1) + '°';
        vals[2].textContent = Math.round(pos.alt) + ' km';
        vals[0].classList.remove('na');
        vals[1].classList.remove('na');
        vals[2].classList.remove('na');
      }
    });
  }, 2000);
}

/* ── STATUS INDICATOR ── */
function setStatus(state, text) {
  const dot  = document.getElementById('statusDot');
  const span = document.getElementById('statusText');
  dot.className  = 'status-dot' + (state === 'live' ? ' live' : state === 'error' ? ' error' : '');
  span.textContent = text;
}

/* ── INIT ── */
async function init() {
  initStarfield();
  initGlobe();
  initFilters();
  updateCounts();
  renderCards();
  animateGlobe();

  setStatus('loading', 'Fetching TLEs…');

  let fetchedCount = 0;
  try {
    const tles = await fetchTles();
    state.tles  = tles;

    // Build satrecs
    for (const sat of CATALOG) {
      if (!sat.noradId || !tles[sat.noradId]) continue;
      try {
        state.satrecs[sat.noradId] = satellite.twoline2satrec(
          tles[sat.noradId].tle1,
          tles[sat.noradId].tle2
        );
        fetchedCount++;
      } catch {}
    }

    if (fetchedCount === 0) throw new Error('No valid satrecs');

    propagateAll();
    buildSatelliteDots();
    updateGlobeDots();
    renderCards();

    document.getElementById('globeLoading').classList.add('hidden');
    setStatus('live', `${fetchedCount} satellites live`);
    startLiveLoop();

  } catch (e) {
    console.error('TLE init failed', e);
    document.getElementById('globeLoading').classList.add('hidden');
    setStatus('error', 'TLE fetch failed — positions unavailable');
    renderCards();
  }
}

document.addEventListener('DOMContentLoaded', init);
