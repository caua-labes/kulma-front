(function () {
    // Fundo do banner: a mesma foto, maior e levemente borrada, atrás da
    // foto principal. Só aparece nas bordas do container.
    document.querySelectorAll('.promo:not(.promo--more)').forEach(function (slide) {
        var img = slide.querySelector('.promo__media img');
        if (!img) return;
        var bg = document.createElement('img');
        bg.className = 'promo__bg';
        bg.alt = '';
        bg.setAttribute('aria-hidden', 'true');
        bg.src = img.getAttribute('src');
        slide.insertBefore(bg, slide.firstChild);
    });
})();
