        (function () {
            var laSoan = !!document.querySelector('[data-wb-edit-ui]') || /[?&]mode=edit\b/.test(location.search) || typeof window.IS_EDIT_MODE !== 'undefined';
            var cua = document.getElementById('srCua');
            var nutMo = document.getElementById('srNutMo');
            var giam = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (laSoan) document.documentElement.classList.add('sr-soan');
            function UD() { try { return USER_DATA; } catch (e) { return window.USER_DATA; } }

            // ---- nền WebGL: chạy ngay từ màn mở; ẩn tab thì dừng cho đỡ tốn pin ----
            var nen = null;
            function batNen() {
                if (nen) return;
                var cv = document.getElementById('srNen');
                var mau = window.SlideTemplates && window.SlideTemplates['sao-roi'];
                try { nen = mau && cv ? mau.createEffect(cv, { density: window.innerWidth < 600 ? 0.6 : 0.85 }) : null; } catch (e) { nen = null; }
                if (!nen) document.documentElement.classList.add('sr-khong-gl');
            }
            document.addEventListener('visibilitychange', function () {
                if (!nen) return;
                if (document.hidden) nen.pause(); else if (hieuUngBat) nen.resume();
            });

            // ---- hiệu ứng riêng (lõi bật/tắt theo bảng Hiệu ứng, core.py mục 7): sao rơi khi cuộn tới phần mới ----
            var hieuUngBat = true, lanRoi = 0;
            function thaSao() {
                if (!nen || !hieuUngBat) return;
                var bay = Date.now();
                if (bay - lanRoi < 2600) return; // 1 ngôi sao / 2,6 giây là đủ — rơi dồn dập mất chất
                lanRoi = bay;
                nen.drop();
            }
            function batHieuUng() { hieuUngBat = true; if (nen) nen.resume(); }
            function tatHieuUng() { hieuUngBat = false; if (nen) nen.pause(); }

            function batHienDan() {
                var ds = document.querySelectorAll('.sr-hien');
                if (laSoan || !('IntersectionObserver' in window)) { ds.forEach(function (el) { el.classList.add('da-hien'); }); return; }
                var io = new IntersectionObserver(function (es) {
                    es.forEach(function (e) {
                        if (!e.isIntersecting) return;
                        var el = e.target;
                        el.style.transitionDelay = ((Array.prototype.indexOf.call(el.parentNode.children, el) % 4) * 0.12) + 's';
                        el.classList.add('da-hien');
                        io.unobserve(el);
                    });
                }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
                ds.forEach(function (el) { io.observe(el); });
                // mỗi phần mới hiện ra → một ngôi sao rơi (như slide đổi cảnh)
                var ioPhan = new IntersectionObserver(function (es) {
                    es.forEach(function (e) { if (e.isIntersecting && !document.body.classList.contains('sr-khoa')) thaSao(); });
                }, { threshold: 0.35 });
                document.querySelectorAll('#srThiep > section').forEach(function (s) { ioPhan.observe(s); });
            }

            // ---- (2) chữ + nút trên màn mở tan thành hạt sáng: vẽ lại đúng chữ lên canvas, lấy điểm ảnh làm hạt ----
            function tanHat() {
                var man = document.querySelector('.sr-man');
                var cv = document.getElementById('srHat');
                if (!man || !cv || giam || laSoan) return;
                var W = window.innerWidth, H = window.innerHeight, ctx;
                cv.width = W; cv.height = H;
                try { ctx = cv.getContext('2d', { willReadFrequently: true }); } catch (e) { ctx = null; }
                if (!ctx) return;
                ctx.clearRect(0, 0, W, H);
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                var ds = man.querySelectorAll('.ladi-headline, .sr-va-cua, .sr-nut-mo, .sr-orn');
                Array.prototype.forEach.call(ds, function (el) {
                    var r = el.getBoundingClientRect();
                    if (!r.width || r.bottom < 0 || r.top > H) return;
                    var cs = getComputedStyle(el);
                    if (el.classList.contains('sr-orn')) { ctx.fillStyle = '#fff'; ctx.fillRect(r.left, r.top + r.height / 2 - .5, r.width, 1.2); return; }
                    var chuoi = (el.innerText || el.textContent || '').trim();
                    if (cs.textTransform === 'uppercase') chuoi = chuoi.toUpperCase();
                    ctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
                    try { ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing; } catch (e) { }
                    ctx.fillStyle = '#fff';
                    if (el.classList.contains('sr-nut-mo')) {
                        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.2;
                        var rr = r.height / 2; ctx.beginPath();
                        ctx.moveTo(r.left + rr, r.top); ctx.arcTo(r.right, r.top, r.right, r.bottom, rr); ctx.arcTo(r.right, r.bottom, r.left, r.bottom, rr);
                        ctx.arcTo(r.left, r.bottom, r.left, r.top, rr); ctx.arcTo(r.left, r.top, r.right, r.top, rr); ctx.stroke();
                    }
                    ctx.fillText(chuoi, r.left + r.width / 2, r.top + r.height / 2);
                });
                var d = ctx.getImageData(0, 0, W, H).data, hat = [], buoc = 3;
                for (var y = 0; y < H; y += buoc) for (var x = 0; x < W; x += buoc) {
                    if (d[(y * W + x) * 4 + 3] > 120) hat.push({ x: x, y: y, vx: (Math.random() - .3) * .9, vy: -Math.random() * 1.6 - .2, tre: (x / W) * 520 + Math.random() * 260, co: Math.random() * 1.4 + .7 });
                }
                if (hat.length > 9000) hat = hat.filter(function (_, i) { return i % Math.ceil(hat.length / 9000) === 0; });
                man.classList.add('tan');
                cv.style.display = 'block';
                var t0 = performance.now(), DAI = 1500;
                (function ve(bay) {
                    var t = bay - t0;
                    ctx.clearRect(0, 0, W, H);
                    ctx.globalCompositeOperation = 'lighter';
                    var con = 0;
                    for (var i = 0; i < hat.length; i++) {
                        var h = hat[i], s = t - h.tre;
                        var a = s < 0 ? 1 : 1 - s / DAI;
                        if (a <= 0) continue;
                        con++;
                        var k = Math.max(0, s) / 16;
                        var px = h.x + h.vx * k + Math.sin((h.y + k * 3) * .05) * Math.min(k, 30) * .25;
                        var py = h.y + h.vy * k - .004 * k * k;
                        ctx.fillStyle = s < 0 ? 'rgba(244,246,253,.95)' : 'rgba(' + (200 + 55 * a | 0) + ',' + (210 + 45 * a | 0) + ',255,' + a.toFixed(3) + ')';
                        ctx.fillRect(px, py, h.co, h.co);
                    }
                    ctx.globalCompositeOperation = 'source-over';
                    if (con && t < 4000) requestAnimationFrame(ve);
                    else { ctx.clearRect(0, 0, W, H); cv.style.display = 'none'; }
                })(t0);
            }

            function moCua() {
                if (!cua || cua.classList.contains('dang-mo')) return;
                if (window.tmxDongBoChu) window.tmxDongBoChu();
                tanHat();                           // chữ + nút tan thành hạt sáng
                lanRoi = 0; thaSao();               // ngôi sao rơi xuống sàn → gợn sáng
                cua.classList.add('dang-mo');
                window.scrollTo(0, 0);
                // thiệp hiện ra đúng lúc sao chạm sàn (~1,45 giây)
                setTimeout(function () {
                    document.body.classList.remove('sr-khoa');
                    document.documentElement.classList.add('sr-da-mo');
                    if (typeof window.enableScroll === 'function') { try { window.enableScroll(); } catch (e) { } }
                }, giam ? 0 : 1300);
                setTimeout(function () { cua.classList.add('da-mo'); }, giam ? 50 : (+cua.getAttribute('data-thoi-gian') || 2200));
                setTimeout(function () { if (window.tmxThiepDaMo) window.tmxThiepDaMo(); }, 1500);
            }
            function dongCua() {
                if (!cua) return;
                cua.classList.remove('da-mo', 'dang-mo');
                var man = document.querySelector('.sr-man'); if (man) man.classList.remove('tan');
                document.body.classList.add('sr-khoa');
                document.documentElement.classList.remove('sr-da-mo');
            }

            // ---- (10) bản đồ: hai cánh cửa sao mở ra ----
            function cuaBanDo() {
                var c = document.getElementById('srCuaBd');
                if (!c || laSoan) return;
                c.querySelector('.nut-mo-bd').addEventListener('click', function () {
                    if (c.classList.contains('mo')) return;
                    c.classList.add('mo'); thaSao();
                    var k = document.getElementById('srKhungBd'); if (k) k.classList.add('bd-da-mo');
                    setTimeout(function () { c.classList.add('xong'); }, 2400);
                });
            }

            // ---- (12) hộp mừng cưới: mở hộp → mã QR bay lên · chọn 1 hay 2 mã QR (lưu USER_DATA.tmxQrSo) ----
            function soQr() { var u = UD(); return u && +u.tmxQrSo === 1 ? 1 : 2; }
            // ---- tiêu đề phần + tên cô dâu/chú rể: giữ 1 dòng, co cỡ chữ cho vừa (tối thiểu 60%) ----
            function vuaMotDong() {
                document.querySelectorAll('#srThiep .sr-tieu-de, #srThiep .sr-doi .ten-ben').forEach(function (o) {
                    var h = o.querySelector('.ladi-headline'); if (!h) return;
                    h.style.fontSize = '';
                    var goc = parseFloat(getComputedStyle(h).fontSize) || 40;
                    var rong = o.clientWidth; if (!rong) return;
                    var can = h.scrollWidth;
                    if (can > rong) h.style.fontSize = Math.max(goc * .6, goc * rong / can * .98).toFixed(1) + 'px';
                });
            }
            window.addEventListener('resize', function () { clearTimeout(vuaMotDong.t); vuaMotDong.t = setTimeout(vuaMotDong, 150); });
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { vuaMotDong(); });

            function apSoQr() {
                var q = document.getElementById('srQr'); if (!q) return;
                var n = soQr();
                q.classList.toggle('mot', n === 1);
                document.querySelectorAll('.sr-chon-qr [data-so]').forEach(function (b) { b.classList.toggle('chon', +b.getAttribute('data-so') === n); });
            }
            function hopQua() {
                var hop = document.getElementById('srHopQua'), q = document.getElementById('srQr'), lop = document.getElementById('srHopLop');
                if (!hop || !q) return;
                hop.querySelectorAll('.hq-tia i').forEach(function (i, k) {
                    var g = k / 22 * Math.PI * 2 + Math.random() * .3, r = 90 + Math.random() * 90;
                    i.style.setProperty('--x', (Math.cos(g) * r).toFixed(0) + 'px'); i.style.setProperty('--y', (Math.sin(g) * r * .8 - 50).toFixed(0) + 'px');
                });
                if (laSoan) {
                    // chọn 1 / 2 mã QR — bắt ở pha capture trên cả tài liệu: trang soạn có nhiều lớp bắt click trên phần
                    document.addEventListener('click', function (e) {
                        var b = e.target.closest && e.target.closest('#srChonQr [data-so]');
                        if (!b) return;
                        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                        var u = UD(); if (!u) return;
                        u.tmxQrSo = +b.getAttribute('data-so');
                        try { saveLocal(); } catch (er) { } try { saveGalleryToServer(); } catch (er) { }
                        apSoQr();
                    }, true);
                    return;
                }
                function mo() {
                    if (hop.classList.contains('rung') || hop.classList.contains('mo')) return;
                    hop.classList.add('rung');                                  // rung nhẹ — chuẩn bị bật nắp
                    setTimeout(function () {
                        hop.classList.add('mo'); thaSao();                      // nắp bay · cột sáng · sao bung
                        // mã QR bay ra TỪ hộp: tính độ lệch từ tâm hộp tới tâm từng thẻ
                        var hr = hop.getBoundingClientRect(), hx = hr.left + hr.width / 2, hy = hr.top + hr.height * .55;
                        q.querySelectorAll('.sr-the-qr').forEach(function (t) {
                            var r = t.getBoundingClientRect();
                            t.style.setProperty('--tu-x', (hx - (r.left + r.width / 2)).toFixed(0) + 'px');
                            t.style.setProperty('--tu-y', (hy - (r.top + r.height / 2)).toFixed(0) + 'px');
                        });
                        setTimeout(function () { q.classList.add('mo'); lop.classList.add('tat'); }, 420);
                        setTimeout(function () { lop.classList.add('xong'); }, 1700);
                    }, giam ? 0 : 480);
                }
                hop.addEventListener('click', mo);
                hop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mo(); } });
            }

            // ---- hai bên gia đình: bên nào hết chữ (bỏ qua nhãn "Nhà Trai/Nhà Gái") → ẩn; còn 1 bên → ra giữa; hết cả 2 → ẩn thẻ ----
            function giaDinh() {
                var k = document.getElementById('srGiaDinh'); if (!k) return;
                var trong = 0;
                k.querySelectorAll(':scope > .ben').forEach(function (b) {
                    var chu = Array.prototype.map.call(b.querySelectorAll('.ClientEditText:not(:first-child)'), function (x) { return (x.innerText || x.textContent || ''); }).join('').split(String.fromCharCode(160)).join('').trim().split(' ').join('');
                    var t = !chu; b.classList.toggle('trong', t); if (t) trong++;
                });
                k.classList.toggle('mot-ben', trong === 1);
                k.classList.toggle('het', trong === 2);
            }

            // ---- hiệu ứng xuất hiện: phần tử trong thẻ hiện lần lượt; ảnh mở từ tâm; chữ/ảnh lẻ chưa có hiệu ứng thì gắn thêm ----
            function ganHieuUng() {
                if (laSoan || giam) return;
                document.querySelectorAll('#srThiep .sr-the.sr-hien').forEach(function (the) {
                    var i = 0;
                    the.querySelectorAll('.ClientEditText, .sr-ngay-moi, .bieu-tuong, .edit_RPSV, .edit_sendMessage, #MessageBox').forEach(function (el) {
                        if (el.closest('.sr-con') || el.closest('.sr-ngay-moi') !== null && !el.classList.contains('sr-ngay-moi')) return;
                        if (el.closest('.sr-the') !== the) return;
                        el.classList.add('sr-con'); el.style.setProperty('--i', i++);
                    });
                });
                document.querySelectorAll('#srThiep .ClientEditText').forEach(function (el) {
                    if (el.closest('.sr-hien') || el.closest('.sr-con') || el.classList.contains('sr-con')) return;
                    el.classList.add('sr-hien'); el.setAttribute('data-hieu-ung', 'len');
                });
                var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
                    es.forEach(function (e) {
                        if (!e.isIntersecting) return;
                        var a = e.target; io.unobserve(a);
                        setTimeout(function () { a.classList.remove('sr-anh-cho'); a.classList.add('sr-anh-mo'); }, 250);
                    });
                }, { threshold: .25 }) : null;
                if (io) document.querySelectorAll('#srThiep .ClientEditImage:not(.anh-qr)').forEach(function (a) {
                    if (a.closest('.edit_galleryV2, .edit_gallery')) return;
                    a.classList.add('sr-anh-cho'); io.observe(a);
                });
            }

            // ---- (13) nút nhạc: dùng màu của mẫu khi chủ thiệp chưa tự chọn màu ----
            function nutNhac() { var u = UD(); if (!(u && u.musicBtnColor)) document.documentElement.classList.add('sr-nhac-mau'); }
            // chữ "thở" trên tên ở màn mở dùng attr(data-text) → chép chữ hiện tại vào thuộc tính
            function chepChuTho() {
                document.querySelectorAll('.sr-tho').forEach(function (el) {
                    var h = el.querySelector('.ladi-headline');
                    if (h) h.setAttribute('data-text', h.textContent.trim());
                });
            }
            window.TMX_HIEU_UNG_MAU = { bat: batHieuUng, tat: tatHieuUng };
            if (nutMo) nutMo.addEventListener('click', moCua);
            function __srKhoiDong() {
                batNen();
                ganHieuUng();
                batHienDan();
                giaDinh();
                vuaMotDong();
                if (laSoan) setInterval(function () { giaDinh(); vuaMotDong(); }, 1500);
                chepChuTho();
                cuaBanDo();
                apSoQr();
                hopQua();
                nutNhac();
                // Thanh "Mở lại thiệp" của trang soạn gọi window.initDoor (code.js dựng rèm riêng) → dùng màn của mẫu
                window.initDoor = dongCua;
                window.StartOpenDoor = function () { moCua(); };
            }
            window.addEventListener('load', function () { setTimeout(chepChuTho, 400); setTimeout(apSoQr, 400); setTimeout(giaDinh, 450); setTimeout(vuaMotDong, 500); setTimeout(vuaMotDong, 1800); });
            if (!window.__srUiDaGan) {
                window.__srUiDaGan = true;
                if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __srKhoiDong);
                else __srKhoiDong();
                if (document.readyState === 'complete') {
                    setTimeout(chepChuTho, 400);
                    setTimeout(apSoQr, 400);
                    setTimeout(giaDinh, 450);
                    setTimeout(vuaMotDong, 500);
                    setTimeout(vuaMotDong, 1800);
                }
            }
        })();
