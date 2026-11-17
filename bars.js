(function () {
    var bar = document.querySelector('.topbar');
    if (!bar) return;
    var root = document.documentElement;
    var lastY = window.pageYOffset;
    var ticking = false;

    function setHidden(hide) {
        bar.classList.toggle('is-hidden', hide);
        root.classList.toggle('bar-off', hide);
    }

    function update() {
        ticking = false;
        var y = Math.max(0, window.pageYOffset);
        var delta = y - lastY;
        if (Math.abs(delta) < 6) return;
        var typing = bar.contains(document.activeElement) && document.activeElement.tagName === 'INPUT';
        if (delta > 0 && y > bar.offsetHeight && !typing) setHidden(true);
        else if (delta < 0 || y <= 0) setHidden(false);
        lastY = y;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });

    bar.addEventListener('focusin', function () { setHidden(false); });
})();

(function () {
    var ua = navigator.userAgent;
    if (!/Chrome\//.test(ua) || /Edg\//.test(ua) && false) return;

    var NS = 'http://www.w3.org/2000/svg';
    var holder = document.createElementNS(NS, 'svg');
    holder.setAttribute('width', '0');
    holder.setAttribute('height', '0');
    holder.setAttribute('aria-hidden', 'true');
    holder.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
    document.body.appendChild(holder);

    // Mapa de deslocamento: perto da borda, aponta para dentro, como a borda
    // curva de uma lente de vidro; no miolo não desloca nada.
    function mapa(w, h, r, bezel) {
        var cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        var ctx = cv.getContext('2d');
        var img = ctx.createImageData(w, h);
        var hx = w / 2, hy = h / 2;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var px = x + .5 - hx, py = y + .5 - hy;
                var qx = Math.abs(px) - (hx - r), qy = Math.abs(py) - (hy - r);
                var ox = Math.max(qx, 0), oy = Math.max(qy, 0);
                var len = Math.sqrt(ox * ox + oy * oy);
                var sd = len + Math.min(Math.max(qx, qy), 0) - r;
                var nx, ny;
                if (qx > 0 && qy > 0) { nx = Math.sign(px) * ox / len; ny = Math.sign(py) * oy / len; }
                else if (qx > qy) { nx = Math.sign(px); ny = 0; }
                else { nx = 0; ny = Math.sign(py); }
                var d = -sd;
                var s = d < bezel ? Math.pow(1 - Math.max(d, 0) / bezel, 1.6) : 0;
                var i = (y * w + x) * 4;
                img.data[i]     = Math.round(128 - 127 * s * nx);
                img.data[i + 1] = Math.round(128 - 127 * s * ny);
                img.data[i + 2] = 128;
                img.data[i + 3] = 255;
            }
        }
        ctx.putImageData(img, 0, 0);
        return cv.toDataURL();
    }

    function lente(el, id, bezel, scale) {
        var b = el.getBoundingClientRect();
        var w = Math.round(b.width), h = Math.round(b.height);
        if (!w || !h) return;
        var r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || h / 2;
        var f = holder.querySelector('#' + id);
        if (f) f.remove();
        f = document.createElementNS(NS, 'filter');
        f.setAttribute('id', id);
        f.setAttribute('x', '0'); f.setAttribute('y', '0');
        f.setAttribute('width', w); f.setAttribute('height', h);
        f.setAttribute('filterUnits', 'userSpaceOnUse');
        f.setAttribute('color-interpolation-filters', 'sRGB');
        f.innerHTML =
            '<feImage href="' + mapa(w, h, Math.min(r, h / 2), bezel) + '" x="0" y="0" width="' + w + '" height="' + h + '" result="mapa"/>' +
            '<feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="suave"/>' +
            '<feDisplacementMap in="suave" in2="mapa" scale="' + scale + '" xChannelSelector="R" yChannelSelector="G"/>';
        holder.appendChild(f);
        el.style.webkitBackdropFilter = el.style.backdropFilter = 'url(#' + id + ') saturate(1.7) brightness(1.06)';
        el.style.background = 'rgba(255, 255, 255, .16)';
    }

    function tudo() {
        var t = document.querySelector('.tabbar');
        if (t) lente(t, 'lente-tabbar', 16, 44);
        var hm = document.querySelector('.sede-home');
        if (hm) lente(hm, 'lente-home', 16, 40);
    }

    tudo();
    var tm;
    window.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(tudo, 150); });
})();
