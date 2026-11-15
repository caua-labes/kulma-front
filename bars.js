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
