
/* ===== Chỉnh thông tin tại đây ===== */
const CONFIG = {
    youtube: 'https://www.youtube.com/@linafcmobile',   // link kênh YouTube của bạn
    zypage: 'https://zypage.com/linafcmobile',                     // link Zypage của bạn
    bank: { name: 'Techcomabank', number: '4343 1846 2268', owner: 'NGUYEN QUOC DAT' }
};

/* Gắn link */
const links = { youtube: CONFIG.youtube, zypage: CONFIG.zypage, subscribe: CONFIG.youtube + '?sub_confirmation=1' };
document.querySelectorAll('[data-link]').forEach(a => { a.href = links[a.dataset.link]; });
document.getElementById('bankName').textContent = CONFIG.bank.name;
document.getElementById('bankNo').textContent = CONFIG.bank.number;
document.getElementById('bankOwner').textContent = CONFIG.bank.owner;

/* Giờ live theo múi giờ Việt Nam (17:00 đến 19:00) */
function tick() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const m = +parts.find(p => p.type === 'hour').value * 60 + +parts.find(p => p.type === 'minute').value;
    const S = 17 * 60, E = 19 * 60;
    const box = document.getElementById('live'), txt = document.getElementById('liveText'), fill = document.getElementById('fill');
    let pct = 0;
    if (m >= S && m < E) {
        box.classList.add('is-live'); pct = (m - S) / (E - S) * 100;
        txt.textContent = 'Lina đang live. Vào xem ngay nhé!';
    } else if (m < S) {
        box.classList.remove('is-live'); const d = S - m;
        txt.textContent = ('Lina live lúc 17:00, còn ' + (d >= 60 ? Math.floor(d / 60) + ' giờ ' : '') + (d % 60 ? d % 60 + ' phút' : '')).trim();
    } else {
        box.classList.remove('is-live');
        txt.textContent = 'Buổi live hôm nay đã xong. Hẹn bạn 17:00 ngày mai!';
    }
    fill.style.width = pct + '%';
}
tick(); setInterval(tick, 30000);

/* Sao chép số tài khoản */
document.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const text = document.getElementById(btn.dataset.copy).textContent.replace(/\s/g, '');
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
        const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch (_) { }
        t.remove();
    }
    const r = btn.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top);
    const old = btn.textContent; btn.textContent = 'Đã sao chép';
    setTimeout(() => { btn.textContent = old; }, 1600);
}));
/* ===== Hiệu ứng ===== */
const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* Sao lấp lánh và dải chữ chạy */
const stars = document.getElementById('stars');
for (let i = 0; i < 28; i++) {
    const s = document.createElement('i'); s.className = 'star';
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 80}%;animation-delay:${-Math.random() * 3}s;transform:scale(${0.6 + Math.random() * 1.2})`;
    stars.appendChild(s);
}
const items = ['Live mỗi ngày 17:00 đến 19:00', 'Đăng ký kênh YouTube', 'Ủng hộ để Chị Google đọc lên live'].map(t => `<span>${t}</span><i>⚽</i>`).join('');
document.querySelector('.mq').innerHTML = items.repeat(6);

/* Nền xê dịch theo chuột và khi cuộn (mỗi lớp một độ sâu) */
if (!calm) {
    const hero = document.querySelector('.hero'), layers = [...hero.querySelectorAll('.layer')];
    let mx = 0, my = 0, sy = 0, raf = 0;
    const paint = () => { layers.forEach(l => { const d = +l.dataset.d / 100; l.style.transform = `translate3d(${mx * d * -40}px,${my * d * -40 + sy * d * 0.5}px,0)`; }); raf = 0; };
    const req = () => { if (!raf) raf = requestAnimationFrame(paint); };
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5; req(); });
    addEventListener('scroll', () => { sy = Math.min(scrollY, 900); req(); }, { passive: true });
}

/* Hiện dần khi cuộn tới */
if (!calm && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); setTimeout(() => e.target.classList.remove('rv', 'in'), 1300); }
    }), { threshold: 0.15 });
    document.querySelectorAll('.section h2, .section p.mt-3, .card, .thumb').forEach((el, i) => { el.classList.add('rv'); el.style.setProperty('--i', i % 3); io.observe(el); });
}

/* Thẻ nghiêng 3D theo con trỏ (chỉ trên thiết bị có chuột) */
if (!calm && matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.card').forEach(c => {
        c.addEventListener('pointermove', e => {
            const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
            c.style.setProperty('--gx', x * 100 + '%'); c.style.setProperty('--gy', y * 100 + '%');
            c.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 7}deg) translateY(-4px)`;
        });
        c.addEventListener('pointerleave', () => { c.style.transform = ''; });
    });
}

/* Pháo giấy khi sao chép số tài khoản */
function confetti(x, y) {
    if (calm) return;
    const cols = ['#CB792C', '#F4D9A0', '#5B4632', '#fff3cf'];
    for (let i = 0; i < 26; i++) {
        const s = document.createElement('i');
        Object.assign(s.style, { position: 'fixed', left: x + 'px', top: y + 'px', width: '8px', height: '12px', background: cols[i % 4], borderRadius: '2px', zIndex: 99, pointerEvents: 'none' });
        document.body.appendChild(s);
        const a = Math.random() * Math.PI * 2, v = 80 + Math.random() * 140;
        s.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * v}px,${Math.sin(a) * v + 120}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => s.remove();
    }
}
