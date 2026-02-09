document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll for Anchor Links
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

    // Intersection Observer for scroll animations
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

    // Select elements to animate in the bento grid
    const bentoItems = document.querySelectorAll('.bento-item');
    bentoItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Stats Counter Animation
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const originalText = target.innerText;
                const value = parseInt(originalText.replace(/,/g, '')); // Remove commas if any
                const suffix = originalText.replace(/[0-9.,]/g, ''); // Keep suffixes like K+ or %

                if (isNaN(value)) return;

                let start = 0;
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out expo
                    const ease = 1 === progress ? 1 : 1 - Math.pow(2, -10 * progress);
                    
                    const current = Math.floor(ease * value);
                    target.innerText = current + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        target.innerText = originalText; // Restore original to ensure accuracy
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
});

// Form Switching Logic (exposed globally for onclick handlers)
window.switchForm = function(type) {
    const candidateBtn = document.querySelector("button[onclick=\"switchForm('candidate')\"]");
    const employerBtn = document.querySelector("button[onclick=\"switchForm('employer')\"]");
    const indicator = document.querySelector(".toggle-indicator");
    
    // Forms
    const candidateForm = document.getElementById('candidate-form');
    const employerForm = document.getElementById('employer-form');

    if (!candidateForm || !employerForm) return;

    if (type === 'candidate') {
        if(candidateBtn) candidateBtn.classList.add('active');
        if(employerBtn) employerBtn.classList.remove('active');
        if(indicator) indicator.style.transform = 'translateX(0)'; 
        // Note: CSS might handle the position if we rely on classes 
        // or we can manipulate left/transform directly.
        // Assuming the CSS handles indicator position via .active or we need to set it.
        // Looking at common toggle patterns, usually 'active' class on btn drives it 
        // OR we move the indicator. style.css analysis suggests purely manual move might be needed if not CSS driven.
        if(indicator) indicator.style.left = '4px';

        candidateForm.style.display = 'grid';
        employerForm.style.display = 'none';

        // Add small animation
        candidateForm.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 300, easing: 'ease-out' });

    } else {
        if(employerBtn) employerBtn.classList.add('active');
        if(candidateBtn) candidateBtn.classList.remove('active');
        if(indicator) indicator.style.left = 'calc(50% + 4px)'; // Move to right side

        candidateForm.style.display = 'none';
        employerForm.style.display = 'grid';

        employerForm.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 300, easing: 'ease-out' });
    }
}