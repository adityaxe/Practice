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

    // Parallax effect for hero cards
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        const cards = document.querySelectorAll('.module-card');
        
        cards.forEach((card, index) => {
            const depth = (index + 1) * 10;
            const moveX = (mouseX - 0.5) * depth;
            const moveY = (mouseY - 0.5) * depth;
            
            // Preserve existing transforms if any
            // We use a CSS variable or basic transform append if simple
            // For simplicity in this vanilla JS, we'll just adjust CSS translate
            // But we need to be careful not to override initial animations.
            // A safer bet for "sophisticated" feel without fighting css animations is tilting.
            
            // Let's use simple subtle parallax after animation is done (approx)
            setTimeout(() => {
                // Check if element has class 'card-team' which has rotation
                if(card.classList.contains('card-team')) {
                     card.style.transform = `translate(${moveX}px, ${moveY}px) rotate(-2deg)`;
                } else {
                     card.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            }, 1000);
        });
    });
});
