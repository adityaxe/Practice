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


    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);


    const bentoItems = document.querySelectorAll('.bento-item');
    bentoItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });


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

