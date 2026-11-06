/*
 * Mẫu "Sao Rơi" — màn đen, sao trắng ngưng tụ thành một dải trần phía trên và một thảm sáng phía dưới,
 * các cột sáng soi từ trên xuống. Mỗi lần đổi cảnh có một ngôi sao rơi xuống sàn tạo gợn sáng.
 *
 * WebGL1 thuần, không thư viện. Cảnh là một "căn phòng" 3D nhìn thẳng: máy quay ở gốc toạ độ, trục z
 * hướng vào trong màn hình, trần ở y = ROOM.ceil, sàn ở y = ROOM.floor. Phối cảnh tự tạo ra dải sao dày
 * đặc ở mép xa của trần/sàn giống ảnh mẫu. Mọi chuyển động tính trong vertex shader.
 *
 * API: SlideTemplates['sao-roi'].createEffect(canvas, { density }) -> { drop(), pause(), resume(), destroy() }
 *   drop() — thả một ngôi sao, trả về số ms tới lúc chạm sàn.
 * Chế độ xuất video: createEffect(canvas, { manual: true, width, height }) không tự chạy; gọi render(t) cho từng
 * khung hình (t = giây) và drop(t) đúng mốc — khung hình chỉ phụ thuộc t nên video mượt dù máy nhanh hay chậm.
 */
(function () {
  'use strict';

  var ROOM = { ceil: 1.0, floor: -1.25, zNear: 0.9, zCeilFar: 4.8, zFloorFar: 7.8 };
  var POOL = { x: 0, z: 4.2, r: 1.2 };
  // Màn dọc: tăng tiêu cự để mép dải trần / sàn dạt xa nhau, chừa khoảng tối ở giữa cho chữ
  function focalY(aspect) {
    return 1.75 * Math.min(1.45, Math.max(1, Math.pow(1.778 / aspect, 0.3)));
  }
  var DROP_DURATION = 1.45; // giây
  var MAX_PIXELS = 2400000; // trần độ phân giải canvas (màn 4K sẽ vẽ ~2K rồi phóng lên)

  // Vị trí cột sáng theo toạ độ màn hình: [x trên màn (-1..1), độ sâu z, bề rộng, độ sáng]
  var BEAMS = [
    [-0.93, 2.5, 0.60, 0.40],
    [-0.74, 3.6, 0.34, 0.70],
    [-0.51, 4.9, 0.24, 0.62],
    [-0.38, 3.1, 0.40, 0.38],
    [-0.21, 5.8, 0.16, 0.50],
    [0.03, 6.2, 0.16, 0.40],
    [0.15, 4.6, 0.22, 0.34],
    [0.37, 3.7, 0.26, 1.00],
    [0.49, 5.4, 0.15, 0.55],
    [0.61, 4.4, 0.24, 0.80],
    [0.76, 2.9, 0.44, 0.42],
    [0.94, 2.3, 0.60, 0.36]
  ];

  // ── Shader ────────────────────────────────────────────────────────────────
  // Chiếu phối cảnh: w = độ sâu để GPU nội suy đúng phối cảnh; z = w - 0.3 cắt mặt phẳng gần ở 0.15.
  var PROJECT =
    'uniform vec2 uFocal;\n' +
    'uniform vec3 uCam;\n' +
    'vec4 project(vec3 p) { vec3 q = p - uCam; return vec4(q.x * uFocal.x, q.y * uFocal.y, q.z - 0.3, q.z); }\n';

  var BG_VS =
    'attribute vec2 aPos;\n' +
    'varying vec2 vP;\n' +
    'void main() { vP = aPos; gl_Position = vec4(aPos, 0.0, 1.0); }\n';

  var BG_FS =
    'precision mediump float;\n' +
    'uniform vec2 uRes;\n' +
    'uniform float uTime;\n' +
    'uniform float uFade;\n' +
    'varying vec2 vP;\n' +
    'float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }\n' +
    'void main() {\n' +
    '  float asp = uRes.x / uRes.y;\n' +
    '  vec2 c = vec2(vP.x * min(asp, 1.8), vP.y);\n' +
    '  float r = length(c * vec2(0.6, 1.0));\n' +
    '  vec3 col = mix(vec3(0.040, 0.046, 0.080), vec3(0.002, 0.002, 0.006), smoothstep(0.05, 1.3, r));\n' +
    // Quầng sáng hắt từ trên xuống: rộng dần về phía dưới
    '  float down = 1.0 - (vP.y * 0.5 + 0.5);\n' +
    '  float w = 0.35 + 0.9 * down;\n' +
    '  float cone = exp(-pow(c.x / w, 2.0)) * (0.55 + 0.45 * sin(uTime * 0.21));\n' +
    '  col += vec3(0.035, 0.040, 0.065) * cone * (0.35 + 0.65 * down);\n' +
    '  col *= smoothstep(1.75, 0.35, length(vP * vec2(0.95, 1.05)));\n' +
    '  col *= uFade;\n' +
    '  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;\n' +
    '  gl_FragColor = vec4(col, 1.0);\n' +
    '}\n';

  var PLANE_VS =
    'precision highp float;\n' + PROJECT +
    'attribute vec2 aPos;\n' +
    'uniform vec3 uCenter;\n' +
    'uniform vec2 uHalf;\n' +
    'varying vec2 vXZ;\n' +
    'void main() {\n' +
    '  vec3 p = vec3(uCenter.x + aPos.x * uHalf.x, uCenter.y, uCenter.z + aPos.y * uHalf.y);\n' +
    '  vXZ = p.xz;\n' +
    '  gl_Position = project(p);\n' +
    '}\n';

  // uMode 0 = thảm sáng trên sàn (có gợn sóng khi sao rơi), 1 = làn sương sáng dọc mép xa của trần
  var PLANE_FS =
    'precision highp float;\n' +
    'uniform float uMode;\n' +
    'uniform vec3 uPool;\n' +
    'uniform float uRipple;\n' +
    'uniform float uGlow;\n' +
    'uniform float uFade;\n' +
    'varying vec2 vXZ;\n' +
    'void main() {\n' +
    '  float a;\n' +
    '  vec3 col;\n' +
    '  if (uMode < 0.5) {\n' +
    '    float d = length((vXZ - uPool.xy) * vec2(1.0, 1.35));\n' +
    '    float r2 = uPool.z * uPool.z;\n' +
    '    a = exp(-d * d / (r2 * 0.9)) * 0.55 * uGlow + exp(-d * d / (r2 * 7.0)) * 0.16;\n' +
    '    if (uRipple >= 0.0) {\n' +
    '      float ring = exp(-pow((d - uRipple * 1.9) / 0.32, 2.0)) * exp(-uRipple * 0.8);\n' +
    '      a += ring * 0.35;\n' +
    '    }\n' +
    '    col = vec3(0.62, 0.70, 0.95);\n' +
    '  } else {\n' +
    '    float dz = (vXZ.y - 4.3) / 1.1;\n' +
    '    a = exp(-dz * dz) * exp(-vXZ.x * vXZ.x / 40.0) * 0.16;\n' +
    '    col = vec3(0.55, 0.62, 0.90);\n' +
    '  }\n' +
    '  gl_FragColor = vec4(col * a * uFade, 1.0);\n' +
    '}\n';

  var BEAM_VS =
    'precision highp float;\n' + PROJECT +
    'attribute vec2 aCorner;\n' +
    'attribute vec4 aBeam;\n' + // x, z, bề rộng, độ sáng
    'uniform float uTime;\n' +
    'uniform float uCeil;\n' +
    'uniform float uFloor;\n' +
    'varying vec2 vUV;\n' +
    'varying float vSeed;\n' +
    'varying float vStrength;\n' +
    'varying float vDrift;\n' +
    'varying float vFade;\n' +
    'void main() {\n' +
    '  vSeed = fract(aBeam.x * 0.731 + aBeam.y * 0.417);\n' +
    // Phần phụ thuộc thời gian tính ở đây (highp) — uniform dùng chung phải cùng precision ở cả hai shader
    '  float breathe = 0.55 + 0.45 * sin(uTime * (0.16 + 0.22 * fract(vSeed * 3.1)) + vSeed * 40.0);\n' +
    '  vStrength = aBeam.w * breathe;\n' +
    '  vDrift = mod(uTime * (0.7 + fract(vSeed * 5.7)), 6.2831853);\n' +
    '  float sway = sin(uTime * 0.045 + vSeed * 20.0) * 0.06;\n' +
    '  vec3 p = vec3(aBeam.x + sway + aCorner.x * aBeam.z, mix(uFloor, uCeil + 0.3, aCorner.y), aBeam.y);\n' +
    '  vUV = aCorner;\n' +
    '  vFade = smoothstep(11.0, 2.8, p.z - uCam.z);\n' +
    '  gl_Position = project(p);\n' +
    '}\n';

  var BEAM_FS =
    'precision mediump float;\n' +
    'uniform float uBeam;\n' +
    'varying vec2 vUV;\n' +
    'varying float vSeed;\n' +
    'varying float vStrength;\n' +
    'varying float vDrift;\n' +
    'varying float vFade;\n' +
    'void main() {\n' +
    '  float u = vUV.x;\n' +
    '  float v = vUV.y;\n' +
    '  float g = exp(-u * u * 3.5);\n' +
    '  float core = exp(-u * u * 40.0);\n' +
    // Sáng nhất ở phía trên (nguồn sáng trong dải sao trần), nhạt dần xuống, loé nhẹ khi chạm sàn
    '  float prof = 0.30 + 0.70 * smoothstep(0.2, 0.95, v) + 0.35 * exp(-v * v * 40.0);\n' +
    '  prof *= smoothstep(0.0, 0.06, v) * (1.0 - smoothstep(0.84, 1.0, v));\n' +
    '  float streak = 0.72 + 0.28 * sin(u * 17.0 + vSeed * 31.0) * sin(u * 5.3 + vSeed * 7.0);\n' +
    '  float drift = 0.86 + 0.14 * sin(v * 24.0 - vDrift + vSeed * 9.0);\n' +
    '  float a = (g * 0.75 + core * 0.6) * prof * streak * drift * vFade * uBeam * vStrength;\n' +
    '  gl_FragColor = vec4(vec3(0.60, 0.66, 0.92) * a, 1.0);\n' +
    '}\n';

  // aData: x = kích thước (đơn vị thế giới), y = độ sáng, z = seed 0..1, w = loại (0 trần, 1 sàn, 2 rơi)
  var STAR_VS =
    'precision highp float;\n' + PROJECT +
    'attribute vec3 aPos;\n' +
    'attribute vec4 aData;\n' +
    'uniform float uTime;\n' +
    'uniform float uHalfH;\n' +
    'uniform float uCeil;\n' +
    'uniform float uFloor;\n' +
    'uniform vec3 uPool;\n' +
    'uniform float uRipple;\n' +
    'uniform float uGlow;\n' +
    'uniform float uForm;\n' +
    'uniform float uFade;\n' +
    'varying float vBright;\n' +
    'varying vec3 vColor;\n' +
    'void main() {\n' +
    '  vec3 p = aPos;\n' +
    '  float bri = aData.y;\n' +
    '  float s = aData.z;\n' +
    '  float kind = aData.w;\n' +
    '  float t = uTime;\n' +
    '  if (kind < 1.5) {\n' +
    '    if (kind < 0.5) {\n' +
    '      p.x += sin(t * 0.06 + s * 40.0) * 0.06;\n' +
    '      p.y += sin(t * 0.21 + s * 90.0) * 0.025;\n' +
    '      p.z += cos(t * 0.05 + s * 70.0) * 0.05;\n' +
    '    } else {\n' +
    '      p.x += sin(t * 0.05 + s * 50.0) * 0.04;\n' +
    '      p.y += sin(t * 0.33 + s * 80.0) * 0.012;\n' +
    '      float d = length((p.xz - uPool.xy) * vec2(1.0, 1.35));\n' +
    '      bri *= 0.55 + 1.5 * exp(-d * d / (uPool.z * uPool.z)) * uGlow;\n' +
    '      if (uRipple >= 0.0) {\n' +
    '        float ring = exp(-pow((d - uRipple * 1.9) / 0.28, 2.0)) * exp(-uRipple * 0.75);\n' +
    '        bri *= 1.0 + 3.2 * ring;\n' +
    '        p.y += ring * 0.07;\n' +
    '      }\n' +
    '    }\n' +
    // Ngưng tụ lúc mở màn: sao bắt đầu lơ lửng khắp phòng rồi dạt về trần / sàn
    '    float k = clamp(uForm * 1.7 - fract(s * 2.93) * 0.7, 0.0, 1.0);\n' +
    '    k = k * k * (3.0 - 2.0 * k);\n' +
    '    vec3 start = vec3(p.x * 0.7 + sin(s * 211.0) * 0.8, mix(uFloor, uCeil, fract(s * 17.17)), p.z);\n' +
    '    p = mix(start, p, k);\n' +
    '    bri *= 0.25 + 0.75 * k;\n' +
    '  } else {\n' +
    '    float span = uCeil - uFloor;\n' +
    '    float speed = 0.035 + 0.11 * fract(s * 7.31);\n' +
    '    float y = uCeil - mod(t * speed + s * 97.0, span);\n' +
    '    p.y = y;\n' +
    '    p.x += sin(t * 0.37 + s * 60.0) * 0.07;\n' +
    '    p.z += cos(t * 0.29 + s * 30.0) * 0.05;\n' +
    '    bri *= smoothstep(uCeil + 0.02, uCeil - 0.3, y) * smoothstep(uFloor - 0.02, uFloor + 0.4, y);\n' +
    '  }\n' +
    // Lấp lánh: đa số nhấp nháy nhẹ, ~12% loé mạnh
    '  float tw = 0.5 + 0.5 * sin(t * (0.6 + 2.8 * fract(s * 13.7)) + s * 311.0);\n' +
    '  bri *= mix(0.45 + 0.55 * tw, 0.12 + 2.6 * pow(tw, 8.0), step(0.88, fract(s * 5.23)));\n' +
    '  vec4 clip = project(p);\n' +
    '  float z = max(clip.w, 0.15);\n' +
    '  float px = aData.x * uFocal.y * uHalfH / z;\n' +
    '  float minPx = 1.5;\n' +
    '  bri *= px < minPx ? px / minPx : clamp(10.0 / px, 0.4, 1.0);\n' +
    '  bri *= smoothstep(9.5, 3.8, z) * smoothstep(0.3, 1.1, z) * uFade;\n' +
    '  gl_PointSize = max(px, minPx);\n' +
    '  gl_Position = clip;\n' +
    '  vBright = bri;\n' +
    '  vColor = mix(vec3(0.78, 0.85, 1.0), vec3(1.0, 0.98, 0.94), fract(s * 3.91));\n' +
    '}\n';

  var STAR_FS =
    'precision mediump float;\n' +
    'varying float vBright;\n' +
    'varying vec3 vColor;\n' +
    'void main() {\n' +
    '  vec2 c = gl_PointCoord * 2.0 - 1.0;\n' +
    '  float r2 = dot(c, c);\n' +
    '  if (r2 >= 1.0) discard;\n' +
    '  float a = exp(-r2 * 5.0) + (1.0 - r2) * 0.12;\n' +
    '  gl_FragColor = vec4(vColor * a * vBright, 1.0);\n' +
    '}\n';

  // Ngôi sao rơi + vệt đuôi. aIdx 0 = đầu, 1..N = đuôi. uRest = 1 khi vẽ ngôi sao đang nằm yên trên sàn.
  var ORB_VS =
    'precision highp float;\n' + PROJECT +
    'attribute float aIdx;\n' +
    'uniform float uDropT;\n' +
    'uniform float uDur;\n' +
    'uniform vec3 uFrom;\n' +
    'uniform vec3 uTo;\n' +
    'uniform float uRest;\n' +
    'uniform float uAlpha;\n' +
    'uniform float uHalfH;\n' +
    'uniform float uTrail;\n' +
    'varying float vBright;\n' +
    'void main() {\n' +
    '  float tt = uDropT - aIdx * 0.006;\n' +
    '  float x = clamp(tt / uDur, 0.0, 1.0);\n' +
    '  vec3 p = mix(uFrom, uTo, x * x);\n' +
    '  float k = aIdx / uTrail;\n' +
    '  float bri = (1.0 - k) * (1.0 - k);\n' +
    '  if (uRest < 0.5) {\n' +
    '    bri *= step(0.0, tt) * (1.0 - smoothstep(uDur, uDur + 0.2, uDropT));\n' +
    '  }\n' +
    '  vec4 clip = project(p);\n' +
    '  float size = aIdx < 0.5 ? 0.22 : 0.07 * (1.0 - k) + 0.02;\n' +
    '  gl_PointSize = max(size * uFocal.y * uHalfH / max(clip.w, 0.15), 1.5);\n' +
    '  gl_Position = clip;\n' +
    '  vBright = bri * uAlpha;\n' +
    '}\n';

  var ORB_FS =
    'precision mediump float;\n' +
    'varying float vBright;\n' +
    'void main() {\n' +
    '  vec2 c = gl_PointCoord * 2.0 - 1.0;\n' +
    '  float r2 = dot(c, c);\n' +
    '  if (r2 >= 1.0) discard;\n' +
    '  float a = exp(-r2 * 28.0) * 1.6 + exp(-r2 * 6.0) * 0.35 + (1.0 - r2) * 0.06;\n' +
    '  gl_FragColor = vec4(vec3(0.92, 0.95, 1.0) * a * vBright, 1.0);\n' +
    '}\n';

  // ── Tiện ích ──────────────────────────────────────────────────────────────
  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Nhiễu giá trị 2D — tạo các cụm sao dày/thưa tự nhiên thay vì rải đều
  function makeNoise(rand) {
    var SIZE = 64;
    var grid = new Float32Array(SIZE * SIZE);
    for (var i = 0; i < grid.length; i++) grid[i] = rand();
    function at(x, y) { return grid[((y % SIZE + SIZE) % SIZE) * SIZE + ((x % SIZE + SIZE) % SIZE)]; }
    return function (x, y) {
      var xi = Math.floor(x), yi = Math.floor(y);
      var fx = x - xi, fy = y - yi;
      fx = fx * fx * (3 - 2 * fx);
      fy = fy * fy * (3 - 2 * fy);
      var a = at(xi, yi) + (at(xi + 1, yi) - at(xi, yi)) * fx;
      var b = at(xi, yi + 1) + (at(xi + 1, yi + 1) - at(xi, yi + 1)) * fx;
      return a + (b - a) * fy;
    };
  }

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(sh) || 'shader compile failed');
    }
    return sh;
  }

  function program(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(p) || 'program link failed');
    }
    var info = { program: p, attr: {}, uni: {} };
    var n = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES);
    for (var i = 0; i < n; i++) {
      var a = gl.getActiveAttrib(p, i);
      info.attr[a.name] = gl.getAttribLocation(p, a.name);
    }
    n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (i = 0; i < n; i++) {
      var u = gl.getActiveUniform(p, i);
      info.uni[u.name] = gl.getUniformLocation(p, u.name);
    }
    return info;
  }

  // ── Sinh sao ──────────────────────────────────────────────────────────────
  function buildStars(aspect, density) {
    var rand = mulberry32(2712);
    var noise = makeNoise(rand);
    var fx = focalY(aspect) / aspect;
    var areaScale = Math.min(Math.max(aspect / 1.778, 0.55), 2.4);
    var nCeil = Math.round(42000 * density * areaScale);
    var nFloor = Math.round(62000 * density * areaScale);
    var nFall = Math.round(3200 * density * areaScale);
    var data = new Float32Array((nCeil + nFloor + nFall) * 7);
    var o = 0;

    function push(x, y, z, size, bri, kind) {
      data[o++] = x; data[o++] = y; data[o++] = z;
      data[o++] = size; data[o++] = bri; data[o++] = rand(); data[o++] = kind;
    }
    function starSize() {
      var r = rand();
      return 0.005 + 0.012 * r * r * r + (rand() < 0.04 ? 0.014 : 0);
    }
    function starBright() {
      var r = rand();
      return 0.45 + 0.9 * r * r + (rand() < 0.05 ? 1.0 : 0);
    }
    // Bề ngang vừa đủ phủ màn hình ở độ sâu z (có dư cho máy quay trôi nhẹ)
    function halfWidth(z) { return z / fx * 1.12 + 0.35; }
    function expo(mean) { return -Math.log(1 - rand() * 0.999) * mean; }

    var i = 0;
    var guard = 0;
    while (i < nCeil && guard++ < nCeil * 6) {
      var z = ROOM.zNear + (ROOM.zCeilFar + 0.6 - ROOM.zNear) * Math.pow(rand(), 0.42);
      var x = (rand() * 2 - 1) * halfWidth(z);
      if (rand() > 0.3 + 0.7 * noise(x * 0.9 + 11, z * 1.7)) continue;
      var y = ROOM.ceil + expo(0.09) * (rand() < 0.85 ? 1 : 3.5);
      if (rand() < 0.12) y = ROOM.ceil - expo(0.06); // giọt sao rủ xuống dưới mép trần
      push(x, y, z, starSize(), starBright() * (z > ROOM.zCeilFar ? 0.6 : 1), 0);
      i++;
    }
    nCeil = i;

    i = 0;
    guard = 0;
    while (i < nFloor && guard++ < nFloor * 6) {
      var fz, fxw;
      if (rand() < 0.28) {
        // cụm sáng quanh thảm giữa sàn
        fz = POOL.z + (rand() + rand() + rand() - 1.5) * 2.1;
        fxw = POOL.x + (rand() + rand() + rand() - 1.5) * 3.4;
      } else {
        fz = ROOM.zNear + (ROOM.zFloorFar - ROOM.zNear) * Math.pow(rand(), 0.8);
        fxw = (rand() * 2 - 1) * halfWidth(fz);
      }
      if (fz < 0.6) continue;
      if (rand() > 0.35 + 0.65 * noise(fxw * 1.1 + 40, fz * 1.4 + 7)) continue;
      var fy = ROOM.floor + expo(0.045) * (rand() < 0.9 ? 1 : 4);
      // gần máy quay thì hạt to hơn (như bokeh ở mép dưới ảnh mẫu)
      push(fxw, fy, fz, starSize() * (fz < 2.4 ? 1.5 : 1.1), starBright(), 1);
      i++;
    }
    nFloor = i;

    // Sao đang rơi: một nửa bám theo các cột sáng (như bụi trong luồng sáng)
    for (i = 0; i < nFall; i++) {
      var sz, sx;
      if (rand() < 0.5) {
        var b = BEAMS[Math.floor(rand() * BEAMS.length)];
        sz = b[1] + (rand() - 0.5) * 0.4;
        sx = b[0] * b[1] / fx + (rand() + rand() - 1) * b[2] * 0.8;
      } else {
        sz = 1.4 + 5.2 * rand();
        sx = (rand() * 2 - 1) * halfWidth(sz);
      }
      push(sx, 0, sz, 0.004 + 0.006 * rand() * rand(), 0.35 + 0.65 * rand(), 2);
    }

    // Ba nhóm liền nhau trong buffer; mỗi nhóm sinh ngẫu nhiên nên vẽ phần đầu của nhóm = tập con đều
    return { data: data.subarray(0, o), groups: [[0, nCeil], [nCeil, nFloor], [nCeil + nFloor, nFall]] };
  }

  function buildBeams(aspect) {
    var fx = focalY(aspect) / aspect;
    var corners = [[-1, 0], [1, 0], [1, 1], [-1, 0], [1, 1], [-1, 1]];
    var data = new Float32Array(BEAMS.length * 6 * 6);
    var o = 0;
    for (var i = 0; i < BEAMS.length; i++) {
      var b = BEAMS[i];
      var worldX = b[0] * b[1] / fx;
      for (var c = 0; c < 6; c++) {
        data[o++] = corners[c][0];
        data[o++] = corners[c][1];
        data[o++] = worldX;
        data[o++] = b[1];
        data[o++] = b[2];
        data[o++] = b[3];
      }
    }
    return data;
  }

  // ── Hiệu ứng ──────────────────────────────────────────────────────────────
  function createEffect(canvas, options) {
    options = options || {};
    var density = options.density || 1;
    var manual = !!options.manual;
    var gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' }) ||
      canvas.getContext('experimental-webgl', { alpha: false, antialias: false, depth: false });
    if (!gl) return null;

    var reduceMotion = !manual && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var progBg, progPlane, progBeam, progStar, progOrb;
    try {
      progBg = program(gl, BG_VS, BG_FS);
      progPlane = program(gl, PLANE_VS, PLANE_FS);
      progBeam = program(gl, BEAM_VS, BEAM_FS);
      progStar = program(gl, STAR_VS, STAR_FS);
      progOrb = program(gl, ORB_VS, ORB_FS);
    } catch (err) {
      if (window.console) console.warn('[sao-roi]', err);
      return null;
    }

    var bufTri = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufTri);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    var bufQuad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufQuad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);

    var ORB_TRAIL = 70;
    var bufOrb = gl.createBuffer();
    var orbIdx = new Float32Array(ORB_TRAIL + 1);
    for (var oi = 0; oi <= ORB_TRAIL; oi++) orbIdx[oi] = oi;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufOrb);
    gl.bufferData(gl.ARRAY_BUFFER, orbIdx, gl.STATIC_DRAW);

    var bufStars = gl.createBuffer();
    var bufBeams = gl.createBuffer();
    var starGroups = [];
    var builtAspect = 0;

    var width = 0, height = 0, scale = Math.min(window.devicePixelRatio || 1, 1.5);
    var detail = 1; // tỉ lệ số sao được vẽ — giảm dần trên máy yếu
    var frameTimes = [];
    var start = performance.now();
    var lastFrame = start;
    var raf = 0;
    var dropAt = null;   // giây (theo đồng hồ hiệu ứng) lúc bắt đầu thả sao gần nhất
    var restFrom = null; // lúc ngôi sao lần trước đang nằm trên sàn bắt đầu tắt

    function rebuild(aspect) {
      var stars = buildStars(aspect, density);
      starGroups = stars.groups;
      gl.bindBuffer(gl.ARRAY_BUFFER, bufStars);
      gl.bufferData(gl.ARRAY_BUFFER, stars.data, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufBeams);
      gl.bufferData(gl.ARRAY_BUFFER, buildBeams(aspect), gl.STATIC_DRAW);
      builtAspect = aspect;
    }

    function resize() {
      var cssW = manual ? options.width : (canvas.clientWidth || window.innerWidth);
      var cssH = manual ? options.height : (canvas.clientHeight || window.innerHeight);
      var s = manual ? 1 : scale;
      if (!manual && cssW * cssH * s * s > MAX_PIXELS) s = Math.sqrt(MAX_PIXELS / (cssW * cssH));
      var w = Math.max(1, Math.round(cssW * s));
      var h = Math.max(1, Math.round(cssH * s));
      if (w !== width || h !== height) {
        width = canvas.width = w;
        height = canvas.height = h;
      }
      var aspect = cssW / cssH;
      if (!builtAspect || Math.abs(aspect / builtAspect - 1) > 0.08) rebuild(aspect);
    }

    function useProgram(info, t, aspect) {
      gl.useProgram(info.program);
      var u = info.uni;
      if (u.uFocal) gl.uniform2f(u.uFocal, focalY(builtAspect) / aspect, focalY(builtAspect));
      if (u.uCam) {
        gl.uniform3f(u.uCam, Math.sin(t * 0.031) * 0.14 * Math.min(1, aspect * aspect), Math.sin(t * 0.023) * 0.035, Math.sin(t * 0.017) * 0.18);
      }
      if (u.uTime) gl.uniform1f(u.uTime, t);
      if (u.uHalfH) gl.uniform1f(u.uHalfH, height / 2);
      if (u.uCeil) gl.uniform1f(u.uCeil, ROOM.ceil);
      if (u.uFloor) gl.uniform1f(u.uFloor, ROOM.floor);
      if (u.uPool) gl.uniform3f(u.uPool, POOL.x, POOL.z, POOL.r);
      return u;
    }

    function attrib(info, name, size, stride, offset) {
      var loc = info.attr[name];
      if (loc === undefined || loc < 0) return;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset);
    }

    function disableAttribs(info) {
      for (var k in info.attr) gl.disableVertexAttribArray(info.attr[k]);
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      var dtMs = now - lastFrame;
      lastFrame = now;
      adaptQuality(dtMs);
      draw((now - start) / 1000);
    }

    // Vẽ khung hình tại thời điểm t (giây kể từ lúc bắt đầu)
    function draw(t) {
      resize();

      var speed = reduceMotion ? 0.4 : 1;
      var at = t * speed + 40; // bắt đầu lệch pha để sao không đồng loạt ở cùng một nhịp
      var aspect = manual ? width / height : (canvas.clientWidth || width) / (canvas.clientHeight || height);
      var fade = Math.min(1, t / 2.2);
      var form = reduceMotion ? 1 : Math.min(1, t / 4.2);

      var sinceDrop = dropAt === null ? -1 : t - dropAt;
      var ripple = sinceDrop >= DROP_DURATION ? sinceDrop - DROP_DURATION : -1;
      if (ripple > 6) ripple = -1;
      var glow = (0.85 + 0.15 * Math.sin(at * 0.4)) * (1 + (ripple >= 0 ? 0.9 * Math.exp(-ripple * 1.4) : 0));

      gl.viewport(0, 0, width, height);
      gl.disable(gl.BLEND);

      // Nền
      var u = useProgram(progBg, at, aspect);
      gl.uniform2f(u.uRes, width, height);
      gl.uniform1f(u.uFade, fade);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufTri);
      attrib(progBg, 'aPos', 2, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      disableAttribs(progBg);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);

      // Thảm sáng trên sàn + sương sáng dưới trần
      u = useProgram(progPlane, at, aspect);
      gl.uniform1f(u.uFade, fade);
      gl.uniform1f(u.uRipple, ripple);
      gl.uniform1f(u.uGlow, glow * form);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufQuad);
      attrib(progPlane, 'aPos', 2, 0, 0);
      gl.uniform1f(u.uMode, 0);
      gl.uniform3f(u.uCenter, POOL.x, ROOM.floor, POOL.z);
      gl.uniform2f(u.uHalf, 9, 4.5);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.uniform1f(u.uMode, 1);
      gl.uniform3f(u.uCenter, 0, ROOM.ceil + 0.02, 4.3);
      gl.uniform2f(u.uHalf, 10, 3.2);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      disableAttribs(progPlane);

      // Cột sáng
      u = useProgram(progBeam, at, aspect);
      gl.uniform1f(u.uBeam, 0.42 * fade);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufBeams);
      attrib(progBeam, 'aCorner', 2, 24, 0);
      attrib(progBeam, 'aBeam', 4, 24, 8);
      gl.drawArrays(gl.TRIANGLES, 0, BEAMS.length * 6);
      disableAttribs(progBeam);

      // Sao
      u = useProgram(progStar, at, aspect);
      gl.uniform1f(u.uRipple, ripple);
      gl.uniform1f(u.uGlow, glow);
      gl.uniform1f(u.uForm, form);
      gl.uniform1f(u.uFade, fade);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufStars);
      attrib(progStar, 'aPos', 3, 28, 0);
      attrib(progStar, 'aData', 4, 28, 12);
      for (var g = 0; g < starGroups.length; g++) {
        gl.drawArrays(gl.POINTS, starGroups[g][0], Math.round(starGroups[g][1] * detail));
      }
      disableAttribs(progStar);

      // Ngôi sao rơi
      drawOrb(t, at, aspect, sinceDrop);

      gl.disable(gl.BLEND);
    }

    function drawOrb(t, at, aspect, sinceDrop) {
      var falling = sinceDrop >= 0 && sinceDrop < DROP_DURATION + 0.3;
      var restA = 0;
      if (sinceDrop >= DROP_DURATION) restA = Math.min(1, (sinceDrop - DROP_DURATION) / 0.25);
      if (restFrom !== null) {
        var sinceRest = t - restFrom;
        restA = Math.max(restA, sinceRest >= 0 ? 1 - Math.min(1, sinceRest / 0.5) : 0);
      }
      if (!falling && restA <= 0) return;

      var u = useProgram(progOrb, at, aspect);
      gl.uniform1f(u.uDur, DROP_DURATION);
      gl.uniform3f(u.uFrom, POOL.x, ROOM.ceil + 0.1, POOL.z);
      gl.uniform3f(u.uTo, POOL.x, ROOM.floor + 0.06, POOL.z);
      gl.uniform1f(u.uTrail, ORB_TRAIL);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufOrb);
      attrib(progOrb, 'aIdx', 1, 0, 0);
      if (falling) {
        gl.uniform1f(u.uDropT, sinceDrop);
        gl.uniform1f(u.uRest, 0);
        gl.uniform1f(u.uAlpha, 1);
        gl.drawArrays(gl.POINTS, 0, ORB_TRAIL + 1);
      }
      if (restA > 0) {
        gl.uniform1f(u.uDropT, 1000);
        gl.uniform1f(u.uRest, 1);
        gl.uniform1f(u.uAlpha, restA * (0.55 + 0.12 * Math.sin(at * 2.1)));
        gl.drawArrays(gl.POINTS, 0, 1);
      }
      disableAttribs(progOrb);
    }

    // Máy yếu (dưới ~40 khung hình/giây): bớt số sao trước, rồi mới hạ độ phân giải canvas
    function adaptQuality(dtMs) {
      if (document.hidden || dtMs > 250) return;
      frameTimes.push(dtMs);
      if (frameTimes.length < 90) return;
      var sum = 0;
      for (var i = 0; i < frameTimes.length; i++) sum += frameTimes[i];
      frameTimes.length = 0;
      if (sum / 90 <= 24) return;
      if (detail > 0.5) detail *= 0.7;
      else if (scale > 0.5) scale = Math.max(0.5, scale * 0.8);
    }

    function drop(atTime) {
      var t = typeof atTime === 'number' ? atTime : (performance.now() - start) / 1000;
      if (dropAt !== null && t - dropAt >= DROP_DURATION) restFrom = t; // ngôi sao lần trước tắt dần
      dropAt = t;
      return DROP_DURATION * 1000;
    }

    function onContextLost(e) {
      e.preventDefault();
      cancelAnimationFrame(raf);
    }
    canvas.addEventListener('webglcontextlost', onContextLost);

    resize();
    if (!manual) raf = requestAnimationFrame(frame);

    return {
      drop: drop,
      dropDuration: DROP_DURATION * 1000,
      render: draw,
      pause: function () {
        cancelAnimationFrame(raf);
        raf = 0;
      },
      resume: function () {
        if (manual || raf) return;
        lastFrame = performance.now();
        raf = requestAnimationFrame(frame);
      },
      destroy: function () {
        cancelAnimationFrame(raf);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        // Bản dựng video tạo context riêng — trả lại GPU ngay khi xong
        var lose = manual && gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      }
    };
  }

  window.SlideTemplates = window.SlideTemplates || {};
  window.SlideTemplates['sao-roi'] = { createEffect: createEffect };
})();
