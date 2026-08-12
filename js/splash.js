/* =========================================================
   Umaima Khan Academy — intro splash controller
   Each page sets <div id="site-splash" data-duration="MS">.
   This script scales every animation phase to fit that
   total duration, then removes the splash from the DOM.
   ========================================================= */
(function () {
    'use strict';

    function clamp(v, min, max) {
        return Math.min(max, Math.max(min, v));
    }

    function setAnim(el, durationMs, delayMs) {
        if (!el) return;
        el.style.animationDuration = durationMs + 'ms';
        el.style.animationDelay = Math.max(0, delayMs) + 'ms';
    }

    function initSplash(splash) {
        var totalMs = parseInt(splash.getAttribute('data-duration'), 10) || 2500;
        var name = splash.getAttribute('data-name') || 'Rajab Khan';

        var nameEl = splash.querySelector('.spl-name');
        var pctEl  = splash.querySelector('.spl-pct');

        // ---- overall budget ----
        var fadeMs   = clamp(totalMs * 0.16, 280, 500);
        var activeMs = totalMs - fadeMs;

        // ---- phase timings, scaled to activeMs ----
        var plaqueDur = clamp(activeMs * 0.22, 260, 600);

        var cornerDelay = plaqueDur * 0.4;
        var cornerDur   = clamp(activeMs * 0.15, 180, 500);

        var flourishDelay = plaqueDur * 0.55;
        var flourishDur   = clamp(activeMs * 0.15, 180, 500);

        var ornamentDelay = flourishDelay + flourishDur * 0.5;
        var ornamentDur   = clamp(activeMs * 0.12, 140, 400);

        var eyebrowDelay = ornamentDelay + ornamentDur * 0.6;
        var eyebrowDur   = clamp(activeMs * 0.12, 140, 400);

        var lettersStart  = eyebrowDelay + eyebrowDur * 0.6;
        var lettersWindow = activeMs * 0.35;
        var letters       = Array.prototype.slice.call(name);
        var letterGap     = letters.length > 1
            ? clamp(lettersWindow / (letters.length - 1), 14, 55)
            : 0;
        var letterDur = clamp(activeMs * 0.18, 140, 500);
        var lettersEnd = lettersStart + (letters.length - 1) * letterGap + letterDur;

        var shineDelay = lettersEnd + 30;
        var shineDur   = clamp(activeMs * 0.15, 180, 700);

        var underlineDelay = lettersEnd + 30;
        var underlineDur   = clamp(activeMs * 0.12, 140, 500);

        var subDelay = lettersEnd + 90;
        var subDur   = clamp(activeMs * 0.15, 180, 500);

        var loadDelay = 150;
        var loadDur   = Math.max(280, activeMs - loadDelay);

        // ---- apply ----
        setAnim(splash.querySelector('.spl-plaque'), plaqueDur, 0);

        var corners = splash.querySelectorAll('.spl-corner');
        for (var i = 0; i < corners.length; i++) {
            setAnim(corners[i], cornerDur, cornerDelay + (i % 2 === 1 ? 70 : 0));
        }

        setAnim(splash.querySelector('.spl-flourish'), flourishDur, flourishDelay);
        setAnim(splash.querySelector('.spl-ornament'), ornamentDur, ornamentDelay);
        setAnim(splash.querySelector('.spl-eyebrow'), eyebrowDur, eyebrowDelay);

        if (nameEl) {
            var underline = nameEl.querySelector('.spl-underline');
            letters.forEach(function (ch, idx) {
                var span = document.createElement('span');
                span.className = 'spl-letter';
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                setAnim(span, letterDur, lettersStart + idx * letterGap);
                nameEl.insertBefore(span, underline);
            });
        }

        setAnim(splash.querySelector('.spl-shine'), shineDur, shineDelay);
        setAnim(splash.querySelector('.spl-underline'), underlineDur, underlineDelay);
        setAnim(splash.querySelector('.spl-sub'), subDur, subDelay);
        setAnim(splash.querySelector('.spl-load-wrap'), 350, 200);

        var loadFill = splash.querySelector('.spl-load-fill');
        setAnim(loadFill, loadDur, loadDelay);

        // live percentage counter synced with the loading bar
        var startTime = performance.now();
        function updatePct() {
            var elapsed = performance.now() - startTime - loadDelay;
            var pct = clamp(Math.round((elapsed / loadDur) * 100), 0, 100);
            if (pctEl) pctEl.textContent = pct + '%';
            if (pct < 100) requestAnimationFrame(updatePct);
        }
        requestAnimationFrame(updatePct);

        // fade out, then remove from the DOM
        splash.style.transitionDuration = fadeMs + 'ms';
        setTimeout(function () {
            splash.classList.add('spl-fade-out');
            setTimeout(function () {
                if (splash.parentNode) splash.parentNode.removeChild(splash);
            }, fadeMs);
        }, activeMs);
    }

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var splash = document.getElementById('site-splash');
        if (splash) initSplash(splash);
    });
})();
