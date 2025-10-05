// Particle effect for background animation

function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Mouse movement tracking
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Mouse leave
    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = Math.random() * 30 + 1;
            this.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#6c63ff';
            this.speed = Math.random() * 0.5 + 0.1;
            this.angle = Math.random() * Math.PI * 2;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        
        update() {
            // Move particles in a gentle wave pattern
            this.angle += this.speed * 0.01;
            this.baseX += Math.sin(this.angle) * 0.5;
            this.baseY += Math.cos(this.angle) * 0.5;
            
            // Mouse interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            
            // Maximum distance for interaction
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            
            // Limit force
            if (force < 0) force = 0;
            
            let directionX = forceDirectionX * force * this.density * 0.6;
            let directionY = forceDirectionY * force * this.density * 0.6;
            
            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Return to base position
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
            
            // Draw particle
            this.draw();
        }
    }
    
    // Create particles
    function init() {
        particlesArray = [];
        
        // Adjust particle count based on screen size for performance
        let particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        
        // Connect particles with lines
        connectParticles();
        
        requestAnimationFrame(animate);
    }
    
    // Connect particles with lines
    function connectParticles() {
        let opacityValue = 1;
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = Math.pow(particlesArray[a].x - particlesArray[b].x, 2) + 
                              Math.pow(particlesArray[a].y - particlesArray[b].y, 2);
                
                // Only connect particles that are close enough
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(108, 99, 255, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Initialize and start animation
    init();
    animate();
    
    // Reinitialize on resize for performance
    window.addEventListener('resize', function() {
        setCanvasSize();
        init();
    });
    
    // Reduce particle count on mobile for performance
    if (window.innerWidth <= 768) {
        // Already handled by our particleCount calculation
    }
}