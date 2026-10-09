/* =====================================================================
   SPBC Group — site behaviour
   ===================================================================== */
(function () {
    'use strict';

    var MODE_KEY = 'spbc-mode';
    var body = document.body;
    var sweep = document.getElementById('modeSweep');

    /* ---------------------------------------------------------------
       Mode: 'hire' | 'candidate' | null
       Hover previews it, clicking locks it, and it follows you
       between pages.
       --------------------------------------------------------------- */
    var lockedMode = null;
    var paintedMode = null;

    function store(mode) {
        try {
            if (mode) { localStorage.setItem(MODE_KEY, mode); }
            else { localStorage.removeItem(MODE_KEY); }
        } catch (e) { /* private browsing — mode just won't persist */ }
    }

    function readStored() {
        try { return localStorage.getItem(MODE_KEY); } catch (e) { return null; }
    }

    function fireSweep() {
        if (!sweep) return;
        sweep.classList.remove('is-firing');
        void sweep.offsetWidth; // restart the animation
        sweep.classList.add('is-firing');
    }

    function paint(mode, animate) {
        if (mode === paintedMode) return;
        paintedMode = mode;
        if (mode) { body.setAttribute('data-mode', mode); }
        else { body.removeAttribute('data-mode'); }
        if (animate) fireSweep();
    }

    function lock(mode) {
        lockedMode = (lockedMode === mode) ? null : mode;
        store(lockedMode);
        paint(lockedMode, true);
    }

    // Restore: URL parameter wins over the stored preference
    var urlType = new URLSearchParams(window.location.search).get('type');
    if (urlType === 'employer' || urlType === 'hire') { lockedMode = 'hire'; }
    else if (urlType === 'candidate') { lockedMode = 'candidate'; }
    else { lockedMode = readStored(); }
    if (lockedMode !== 'hire' && lockedMode !== 'candidate') { lockedMode = null; }
    paint(lockedMode, false);

    // Hover / focus preview — the hero buttons, the duo panels and the nav switch
    var previewers = document.querySelectorAll('[data-mode-hover], .mode-switch__btn');
    Array.prototype.forEach.call(previewers, function (el) {
        var mode = el.getAttribute('data-mode-hover') || el.getAttribute('data-mode-set');
        if (!mode) return;
        el.addEventListener('mouseenter', function () { paint(mode, true); });
        el.addEventListener('focus', function () { paint(mode, true); });
        el.addEventListener('mouseleave', function () { paint(lockedMode, true); });
        el.addEventListener('blur', function () { paint(lockedMode, true); });
    });

    // Click to lock
    Array.prototype.forEach.call(document.querySelectorAll('[data-mode-set]'), function (el) {
        var mode = el.getAttribute('data-mode-set');
        el.addEventListener('click', function (e) {
            if (el.tagName === 'A') return;              // let real links navigate
            var inner = e.target.closest && e.target.closest('a, button');
            if (inner && inner !== el) return;           // ...including ones nested in a panel
            e.preventDefault();
            lock(mode);
        });
        el.addEventListener('keydown', function (e) {
            if (el.tagName === 'A') return;
            if (e.target !== el) return;
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lock(mode); }
        });
    });

    /* ---------------------------------------------------------------
       Navigation
       --------------------------------------------------------------- */
    var nav = document.getElementById('nav');
    if (nav) {
        var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 12); };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    var burger = document.getElementById('burger');
    var navLinks = document.getElementById('navLinks');
    if (burger && navLinks) {
        burger.addEventListener('click', function () {
            var open = navLinks.classList.toggle('is-open');
            burger.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', String(open));
        });
        Array.prototype.forEach.call(navLinks.querySelectorAll('a'), function (a) {
            a.addEventListener('click', function () {
                navLinks.classList.remove('is-open');
                burger.classList.remove('is-open');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------------------------------------------------------------
       Reveal on scroll
       --------------------------------------------------------------- */
    var revealables = document.querySelectorAll('.reveal, .step');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
    } else {
        Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-visible'); });
    }

    /* ---------------------------------------------------------------
       Counting stats
       --------------------------------------------------------------- */
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        var co = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                co.unobserve(el);

                var target = parseInt(el.getAttribute('data-count'), 10);
                if (isNaN(target)) return;
                var suffix = el.querySelector('span');
                var suffixText = suffix ? suffix.outerHTML : '';
                var duration = 1400;
                var started = null;

                function tick(now) {
                    if (started === null) started = now;
                    var p = Math.min((now - started) / duration, 1);
                    var eased = 1 - Math.pow(1 - p, 3);
                    el.innerHTML = Math.floor(eased * target) + suffixText;
                    if (p < 1) requestAnimationFrame(tick);
                    else el.innerHTML = target + suffixText;
                }
                requestAnimationFrame(tick);
            });
        }, { threshold: 0.5 });
        Array.prototype.forEach.call(counters, function (el) { co.observe(el); });
    }

    /* ---------------------------------------------------------------
       Contact form tabs
       --------------------------------------------------------------- */
    var tabs = document.querySelectorAll('[data-form-tab]');
    if (tabs.length) {
        var showForm = function (which) {
            Array.prototype.forEach.call(tabs, function (t) {
                t.classList.toggle('is-active', t.getAttribute('data-form-tab') === which);
            });
            Array.prototype.forEach.call(document.querySelectorAll('[data-form]'), function (f) {
                f.classList.toggle('is-active', f.getAttribute('data-form') === which);
            });
        };

        Array.prototype.forEach.call(tabs, function (t) {
            t.addEventListener('click', function () {
                var which = t.getAttribute('data-form-tab');
                showForm(which);
                lock(which === 'employer' ? 'hire' : 'candidate');
            });
        });

        showForm(urlType === 'employer' ? 'employer' : 'candidate');
    }

    /* ---------------------------------------------------------------
       Deep-link scrolling (legal page anchors)
       --------------------------------------------------------------- */
    if (window.location.hash) {
        window.addEventListener('load', function () {
            var el = document.querySelector(window.location.hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    }
})();
