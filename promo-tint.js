(function () {
    var slides = document.querySelectorAll('.promo:not(.promo--more)');
    if (!slides.length) return;

    // Cor principal: junta os pixels em baldes de 4 bits por canal e escolhe
    // o balde que mais pesa, favorecendo cores vivas sobre cinza e branco.
    function principal(img) {
        var c = document.createElement('canvas');
        c.width = c.height = 32;
        var x = c.getContext('2d');
        x.drawImage(img, 0, 0, 32, 32);
        var d = x.getImageData(0, 0, 32, 32).data;
        var baldes = {};
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i], g = d[i + 1], b = d[i + 2];
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var sat = max ? (max - min) / max : 0;
            var k = (r >> 4) + ',' + (g >> 4) + ',' + (b >> 4);
            var o = baldes[k] || (baldes[k] = { n: 0, r: 0, g: 0, b: 0, peso: 0 });
            o.n++; o.r += r; o.g += g; o.b += b;
            o.peso += 1 + sat * 3;
        }
        var melhor = null;
        for (var key in baldes) if (!melhor || baldes[key].peso > melhor.peso) melhor = baldes[key];
        return [Math.round(melhor.r / melhor.n), Math.round(melhor.g / melhor.n), Math.round(melhor.b / melhor.n)];
    }

    slides.forEach(function (slide) {
        var img = slide.querySelector('.promo__media img');
        if (!img || slide.hasAttribute('data-tint-fixed')) return;
        function aplicar() {
            try {
                var rgb = principal(img);
                var lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
                slide.style.setProperty('--promo-tint', 'rgb(' + rgb.join(',') + ')');
                slide.style.setProperty('--promo-ink', lum < 0.6 ? '#fff' : '#132A45');
            } catch (e) {}
        }
        if (img.complete && img.naturalWidth) aplicar(); else img.addEventListener('load', aplicar);
    });
})();
