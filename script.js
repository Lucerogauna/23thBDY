// ====== CONFIGURACIÓN DE FIREBASE ======
const firebaseConfig = {
    apiKey: "AIzaSyDdi_Idky-Uj_ZOHxNjacwrLsYRvHIAbpI",
    authDomain: "invitacion-0001.firebaseapp.com",
    projectId: "invitacion-0001",
    storageBucket: "invitacion-0001.firebasestorage.app",
    messagingSenderId: "112961929872",
    appId: "1:112961929872:web:9e39758555ed6c07504e15",
    measurementId: "G-ZWYCQ95R1W"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Estado de la app
let userName = "";
let isGoing = null;
let isAlreadyRegistered = false;
let globalTimer = null;

// Selectores
const screen1 = document.getElementById('screen-1');
const screen2 = document.getElementById('screen-2');
const screen3 = document.getElementById('screen-3');
const screenPlaylist = document.getElementById('screen-playlist');
const screen4 = document.getElementById('screen-4');
const screen5 = document.getElementById('screen-5');
const screen6 = document.getElementById('screen-6');

const userNameInput = document.getElementById('user-name');
const errorMsg1 = document.getElementById('error-msg-1');
const welcomeText = document.getElementById('welcome-text');

const btnInfo = document.getElementById('btn-info');
const btnClose = document.getElementById('btn-close');
const btnToRsvp = document.getElementById('btn-to-rsvp');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const btnVolver = document.getElementById('btn-volver');
const btnConfirmYes = document.getElementById('btn-confirm-yes');
const rsvpSuccess = document.getElementById('rsvp-success');
const btnVolverPlaylist = document.getElementById('btn-volver-playlist');

const finalMessage = document.getElementById('final-message');
const finalSub = document.getElementById('final-sub');

const titleScreen1 = document.getElementById('title-screen-1');
const labelScreen1 = document.getElementById('label-screen-1');
const btnAlreadyRegistered = document.getElementById('btn-already-registered');
const alreadyRegisteredContainer = document.getElementById('already-registered-container');

// Utils
function switchScreen(from, to) {
    from.classList.remove('active');
    from.classList.add('hidden');
    to.classList.remove('hidden');
    // Para que se aplique la transición
    setTimeout(() => { to.classList.add('active'); }, 50);
}

// --- LÓGICA DE USUARIO YA REGISTRADO ---
const btnVolverRegistro = document.getElementById('btn-volver-registro');

btnAlreadyRegistered.addEventListener('click', (e) => {
    e.preventDefault();
    isAlreadyRegistered = true;
    titleScreen1.textContent = "ACCEDER";
    labelScreen1.textContent = "INGRESÁ TU NOMBRE Y APELLIDO";
    btnAlreadyRegistered.classList.add('hidden');
    if (btnVolverRegistro) btnVolverRegistro.classList.remove('hidden');
    userNameInput.focus();
});

if (btnVolverRegistro) {
    btnVolverRegistro.addEventListener('click', (e) => {
        e.preventDefault();
        isAlreadyRegistered = false;
        titleScreen1.textContent = "¿QUIÉN SOS?";
        labelScreen1.textContent = "INGRESA TU NOMBRE Y APELLIDO";
        btnVolverRegistro.classList.add('hidden');
        btnAlreadyRegistered.classList.remove('hidden');
    });
}

// ------ PANTALLA 1 ------
function procesarIngreso() {
    const val = userNameInput.value.trim().toUpperCase();
    if (val === "") {
        errorMsg1.classList.remove('hidden');
        return;
    }
    errorMsg1.classList.add('hidden');
    userName = val;

    const dotsHTML = '<span style="display:block; margin-top:0.5rem; color:var(--white);"><span class="dot-anim">.</span><span class="dot-anim" style="animation-delay: 0.2s;">.</span><span class="dot-anim" style="animation-delay: 0.4s;">.</span></span>';

    // Ajustes para usuarios registrados vs nuevos
    const greetingText = isAlreadyRegistered ? "HOLA NUEVAMENTE" : "HOLA";

    welcomeText.innerHTML = `<span id="type-1" style="font-size: 0.8em; line-height: 1;"></span><br><span id="type-2" class="type-gradient" style="font-size: 1.2em; line-height: 1;"></span><span class="blinking-cursor" style="font-size: 1.2em;">|</span>`;
    if (isAlreadyRegistered) {
        btnInfo.textContent = "VER BONUS TRACK";
    } else {
        btnInfo.textContent = "SIGUIENTE";
    }

    switchScreen(screen1, screen2);

    // Función recursiva de tipeo
    let t1 = document.getElementById('type-1');
    let t2 = document.getElementById('type-2');
    let i = 0, j = 0;
    const finalNameStr = userName + " :)";

    function typeTitle() {
        if (i < greetingText.length) {
            t1.textContent += greetingText.charAt(i);
            i++;
            setTimeout(typeTitle, 80);
        } else {
            setTimeout(typeName, 300);
        }
    }

    function typeName() {
        if (j < finalNameStr.length) {
            t2.textContent += finalNameStr.charAt(j);
            j++;
            setTimeout(typeName, 100);
        } else {
            // Avanzar a la pantalla 3 un tiempito después de terminar de escribir
            setTimeout(() => {
                switchScreen(screen2, screen3);
                if (isAlreadyRegistered) {
                    btnClose.classList.remove('hidden');
                }
            }, 1500);
        }
    }

    // Iniciamos la animación
    setTimeout(typeTitle, 300);
}

userNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        procesarIngreso();
    }
});

const btnNext1 = document.getElementById('btn-next-1');
if (btnNext1) {
    btnNext1.addEventListener('click', (e) => {
        e.preventDefault();
        procesarIngreso();
    });
}

// ------ PANTALLA 3 ------
btnInfo.addEventListener('click', () => {
    if (isAlreadyRegistered) {
        switchScreen(screen3, screenPlaylist);
    } else {
        switchScreen(screen3, screen4);
    }
});

// ------ PANTALLA 4 (RSVP) ------

// Botón SÍ
btnYes.addEventListener('click', () => {
    isGoing = true;

    // Cambiar estilos de los botones (reset de No y activar Sí)
    btnYes.classList.remove('text-gray');
    btnYes.classList.add('text-white');
    btnYes.innerHTML = '<img src="foto-feliz.png" class="face-icon" alt="Feliz" onerror="this.style.display=\\\'none\\\'"> SÍ, VOY';

    btnNo.classList.remove('text-white');
    btnNo.classList.add('text-gray');
    btnNo.innerHTML = 'NO PUEDO';

    // Restaurar footer general si había sido ocultado
    document.getElementById('footer-normal').classList.remove('hidden');
    document.getElementById('footer-normal').style.display = 'flex';
    document.getElementById('footer-no-opciones').classList.add('hidden');
    document.getElementById('footer-no-opciones').style.display = 'none';
});

// Botón NO
btnNo.addEventListener('click', () => {
    isGoing = false;

    btnNo.classList.remove('text-gray');
    btnNo.classList.add('text-white');
    btnNo.innerHTML = '<img src="foto-triste.png" class="face-icon" alt="Triste" onerror="this.style.display=\'none\'"> NO PUEDO';

    btnYes.classList.remove('text-white');
    btnYes.classList.add('text-gray');
    btnYes.innerHTML = 'SÍ, VOY';

    // Mantener el footer normal visible
});

// Botón Me Arreptí (del screen-5)
document.getElementById('btn-arrepenti').addEventListener('click', () => {
    isGoing = null;

    btnYes.classList.remove('text-white');
    btnYes.classList.add('text-gray');
    btnYes.innerHTML = 'SÍ, VOY';

    btnNo.classList.remove('text-white');
    btnNo.classList.add('text-gray');
    btnNo.innerHTML = 'NO PUEDO';

    document.getElementById('footer-normal').classList.remove('hidden');
    document.getElementById('footer-normal').style.display = 'flex';
    
    btnConfirmYes.textContent = "ENVIAR";
    btnConfirmYes.disabled = false;

    switchScreen(screen5, screen4);
});

// Botón Close (del screen-5)
document.getElementById('btn-close-sad').addEventListener('click', async () => {
    const emoji = document.getElementById('cierre-emoji');
    if (isGoing) {
        emoji.textContent = ':)';
    } else {
        emoji.textContent = ':(';
    }
    switchScreen(screen5, screen6);
});

// Botón Volver
btnVolver.addEventListener('click', (e) => {
    e.preventDefault();
    switchScreen(screen4, screen3);
});

// Botón Volver desde Playlist
if (btnVolverPlaylist) {
    btnVolverPlaylist.addEventListener('click', (e) => {
        e.preventDefault();
        btnInfo.classList.add('hidden');
        btnClose.classList.remove('hidden');
        switchScreen(screenPlaylist, screen3);
    });
}

// Botón Close desde Playlist
document.getElementById('btn-close-playlist').addEventListener('click', (e) => {
    e.preventDefault();
    const emoji = document.getElementById('cierre-emoji');
    if (isGoing === false) {
        emoji.textContent = ':(';
    } else {
        emoji.textContent = ':)';
    }
    switchScreen(screenPlaylist, screen6);
});

// Botón Close desde Info
if (btnClose) {
    btnClose.addEventListener('click', (e) => {
        e.preventDefault();
        const emoji = document.getElementById('cierre-emoji');
        if (isGoing === false) {
            emoji.textContent = ':(';
        } else {
            emoji.textContent = ':)';
        }
        switchScreen(screen3, screen6);
    });
}

// Guardar en Firestore
async function guardarInvitado(nombre, confirmado) {
    try {
        await db.collection("invitados").add({
            nombre: nombre,
            confirmado: confirmado,
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error guardando:", error);
        return false;
    }
}

// Botón Enviar
btnConfirmYes.addEventListener('click', async () => {
    if (isGoing === null) {
        alert("Elegí SÍ o NO primero.");
        return;
    }

    // Cambiar estado del botón inmediatamente
    btnConfirmYes.textContent = "ENVIANDO...";
    btnConfirmYes.disabled = true;
    rsvpSuccess.classList.remove('hidden');

    // Guardar en Firebase Firestore
    const guardado = await guardarInvitado(userName, isGoing);

    // Transición a la pantalla 5 (Final)
    switchScreen(screen4, screen5);

    if (isGoing) {
        finalMessage.innerHTML = '¡GENIAL!<br><span class="text-red">GRACIAS POR TU CONFIRMACIÓN</span>';

        let timeLeft = 4;
        finalSub.innerHTML = `TE ESPERO PARA LOKEAR<br><span style="color:var(--gray); font-size:0.7rem; display:block; margin-top:20px;">BONUS TRACK EN <span id="countdown">${timeLeft}</span>...</span>`;

        document.getElementById('btn-arrepenti').style.display = 'none';
        document.getElementById('btn-close-sad').style.display = 'none';
        
        const sadSticker = document.getElementById('draggable-sad-sticker');
        if(sadSticker) sadSticker.classList.add('hidden');

        if (globalTimer) clearInterval(globalTimer);
        globalTimer = setInterval(() => {
            timeLeft--;
            const counter = document.getElementById('countdown');
            if (counter) counter.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(globalTimer);
                switchScreen(screen5, screenPlaylist);
            }
        }, 1000);

    } else {
        finalMessage.innerHTML = 'NTP<br><span class="text-red">LA PRÓXIMA!</span>';
        finalSub.innerHTML = '(NO VA A HABER PRÓXIMA, DEJAMOS DE SER AMIGOS)';

        document.getElementById('btn-arrepenti').style.display = 'inline-block';
        document.getElementById('btn-close-sad').style.display = 'inline-block';

        const sadSticker = document.getElementById('draggable-sad-sticker');
        if(sadSticker) sadSticker.classList.remove('hidden');
    }
});

// Botón de Pausa Global (solo música)
const globalBtnPause = document.getElementById('global-btn-pause');
let isPaused = false;

if (globalBtnPause) {
    globalBtnPause.addEventListener('click', (e) => {
        e.preventDefault();
        isPaused = !isPaused;
        const music = document.getElementById('bg-music');
        
        if (music) {
            if (isPaused) {
                music.pause();
            } else {
                music.play();
            }
            
            const img = globalBtnPause.querySelector('img');
            if (img) img.src = isPaused ? 'play.png' : 'pause.png';
        }
    });
}

// Lógica para arrastrar stickers
function makeDraggable(id) {
    const el = document.getElementById(id);
    if (!el) return;
    let isDragging = false;
    let startX, startY;
    let initialX = 0, initialY = 0;

    el.addEventListener('pointerdown', (e) => {
        isDragging = true;
        el.style.cursor = 'grabbing';
        
        startX = e.clientX;
        startY = e.clientY;
        
        // Ocultar el texto de pista (si existe) permanentemente
        const hint = el.querySelector('.drag-hint');
        if (hint) {
            hint.style.opacity = '0';
        }

        e.preventDefault();
        el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        el.style.left = `${initialX + dx}px`;
        el.style.top = `${initialY + dy}px`;
    });

    const endDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;
        el.style.cursor = 'grab';
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        initialX += dx;
        initialY += dy;
        
        el.releasePointerCapture(e.pointerId);
    };

    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);
}

makeDraggable('draggable-sticker');
makeDraggable('draggable-sad-sticker');
