document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    // Generalized scroll-reveal for any .reveal / .reveal-scale element
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .reveal-scale').forEach(el => revealObserver.observe(el));


    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const originalText = target.innerText;
                const value = parseInt(originalText.replace(/,/g, ''));
                const suffix = originalText.replace(/[0-9.,]/g, '');

                if (isNaN(value)) return;

                let start = 0;
                const duration = 2000;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);


                    const ease = 1 === progress ? 1 : 1 - Math.pow(2, -10 * progress);

                    const current = Math.floor(ease * value);
                    target.innerText = current + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        target.innerText = originalText;
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hero-stat strong').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Navbar scrolled state
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const updateNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
        updateNavbar();
        window.addEventListener('scroll', updateNavbar, { passive: true });
    }

    // ---- Hover illusion: theme wash + hero copy crossfade ----
    const washEl = document.getElementById('themeWash');
    function setWashMode(mode) {
        if (!washEl) return;
        washEl.classList.remove('mode-hire', 'mode-candidate');
        if (mode) washEl.classList.add('mode-' + mode);
    }

    const heroSection = document.querySelector('[data-hero-interactive]');
    const heroCopies = heroSection ? heroSection.querySelectorAll('.hero-copy') : [];
    const heroDefaultCopy = heroSection ? heroSection.querySelector('.hero-copy--default') : null;

    function activateHeroCopy(mode) {
        if (!heroCopies.length) return;
        heroCopies.forEach(c => c.classList.remove('is-active'));
        const target = mode && heroSection.querySelector('.hero-copy--' + mode);
        (target || heroDefaultCopy)?.classList.add('is-active');
    }

    document.querySelectorAll('[data-wash]').forEach(el => {
        const mode = el.dataset.wash;
        el.addEventListener('mouseenter', () => { setWashMode(mode); activateHeroCopy(mode); });
        el.addEventListener('mouseleave', () => { setWashMode(null); activateHeroCopy(null); });
        el.addEventListener('focus', () => { setWashMode(mode); activateHeroCopy(mode); });
        el.addEventListener('blur', () => { setWashMode(null); activateHeroCopy(null); });
    });
});


window.switchForm = function(type) {
    const candidateBtn = document.querySelector("button[onclick=\"switchForm('candidate')\"]");
    const employerBtn = document.querySelector("button[onclick=\"switchForm('employer')\"]");
    const indicator = document.querySelector(".toggle-indicator");


    const candidateForm = document.getElementById('candidate-form');
    const employerForm = document.getElementById('employer-form');

    if (!candidateForm || !employerForm) return;

    if (type === 'candidate') {
        if(candidateBtn) candidateBtn.classList.add('active');
        if(employerBtn) employerBtn.classList.remove('active');
        if(indicator) indicator.style.transform = 'translateX(0)';




        if(indicator) indicator.style.left = '4px';

        candidateForm.style.display = 'grid';
        employerForm.style.display = 'none';


        candidateForm.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 300, easing: 'ease-out' });

    } else {
        if(employerBtn) employerBtn.classList.add('active');
        if(candidateBtn) candidateBtn.classList.remove('active');
        if(indicator) indicator.style.left = 'calc(50% + 4px)';

        candidateForm.style.display = 'none';
        employerForm.style.display = 'grid';

        employerForm.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 300, easing: 'ease-out' });
    }
}
