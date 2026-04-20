const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let dpr = window.devicePixelRatio || 1;

function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    // Obligamos a que el canvas ocupe el tamaño de su contenedor, NO el 100% de la ventana (para evitar el desborde en desktop)
    let parent = canvas.parentElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    // Ajustaremos la resolución base a la medida real del contenedor en la pantalla (max-width 480px de tu css)
    canvas.width = parent.clientWidth * dpr;
    canvas.height = parent.clientHeight * dpr;
}
resizeCanvas();

let particlesArray = [];
let mouse = {
    x: null,
    y: null,
    radius: 80 * dpr // Radio de interacción escalado
};

window.addEventListener('mousemove', function(event) {
    let rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) * dpr;
    mouse.y = (event.clientY - rect.top) * dpr;
});

window.addEventListener('touchmove', function(event) {
    let rect = canvas.getBoundingClientRect();
    mouse.x = (event.touches[0].clientX - rect.left) * dpr;
    mouse.y = (event.touches[0].clientY - rect.top) * dpr;
}, { passive: true });

window.addEventListener('mouseleave', function() {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('touchend', function() {
    mouse.x = null;
    mouse.y = null;
});

// Evento para avanzar a la pantalla 1 - ahora atado al botón explícito
let clicked = false;
function advanceScreen(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (clicked) return;
    clicked = true;
    
    // Encender la música acá obliga al navegador a permitir el autoplay ya que fue un "tap" del usuario
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.volume = 0.5; // Empezamos con volumen moderado
        audio.play().catch(err => console.log('El usuario o dispositivo bloqueó el audio automático', err));
    }
    
    const s0 = document.getElementById('screen-0');
    const s1 = document.getElementById('screen-1');
    if (s0 && s1 && typeof switchScreen === 'function') {
        switchScreen(s0, s1);
    }
}

const btnStart = document.getElementById('btn-start-intro');
if (btnStart) {
    btnStart.addEventListener('click', advanceScreen);
    btnStart.addEventListener('touchstart', advanceScreen, { passive: false });
}

class Particle {
    constructor(x, y, color) {
        this.x = x + (Math.random() * 20 - 10) * dpr;
        this.y = y + (Math.random() * 20 - 10) * dpr;
        this.baseX = x;
        this.baseY = y;
        // Tamaño ajustado para mejorar resolución visual en mobile
        this.size = (Math.random() * 1.5 + 0.8) * dpr; 
        this.color = color;
        this.density = (Math.random() * 25) + 5;
        this.friction = Math.random() * 0.1 + 0.05;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        let dx = (mouse.x !== null) ? mouse.x - this.x : 10000;
        let dy = (mouse.y !== null) ? mouse.y - this.y : 10000;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius && mouse.x !== null) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dxBase = this.baseX - this.x;
                this.x += dxBase * this.friction;
            }
            if (this.y !== this.baseY) {
                let dyBase = this.baseY - this.y;
                this.y += dyBase * this.friction;
            }
        }
    }
}

function initParticles() {
    particlesArray = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let fontSize = Math.min(canvas.width / 4, 120 * dpr); 
    ctx.font = `bold ${fontSize}px Helvetica, Arial, sans-serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centerY = canvas.height / 2 - (10 * dpr);
    ctx.fillText("LUCERO", canvas.width / 2, centerY - fontSize * 0.4);
    ctx.fillText("23", canvas.width / 2, centerY + fontSize * 0.7);

    const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ajustamos la densidad para un efecto rico pero que el celular lo banque bien
    // Si la pantalla física es muy grande (ej. celular high dpi), saltamos de a más pixeles para performance
    let densityStep = canvas.width > 1200 ? 5 : (canvas.width > 800 ? 4 : 3);
    
    for (let y = 0; y < canvas.height; y += densityStep) {
        for (let x = 0; x < canvas.width; x += densityStep) {
            let index = (y * canvas.width + x) * 4;
            let alpha = textCoordinates.data[index + 3];

            if (alpha > 128) {
                let colorBase = parseInt(Math.random() * 105 + 150);
                let color = `rgb(${colorBase}, ${colorBase}, ${colorBase})`;
                particlesArray.push(new Particle(x, y, color));
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

setTimeout(() => {
    resizeCanvas();
    initParticles();
    animate();
}, 200);

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        resizeCanvas();
        mouse.radius = 80 * dpr; // update en caso de drag
        initParticles();
    }, 300);
});
