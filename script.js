document.addEventListener('DOMContentLoaded', () => {

    // --- ZARF SİSTEMİ ---
    const letters = {
        miss: { title: "Beni Özlediğinde...", text: "Unutma ki aramızdaki mesafeler sadece rakamlardan ibaret. Gözlerimi kapattığımda her zaman yanındayım. Seni çok seviyorum ve yakında yine sımsıkı sarılacağız." },
        sad: { title: "Mutsuz Hissettiğinde...", text: "Lütfen o güzel yüzünü asma. Senin bir gülüşün benim bütün dünyamı aydınlatıyor. Her ne olursa olsun ben senin yanındayım ve birlikte her şeyin üstesinden gelebiliriz." },
        happy: { title: "Çok Mutlu Olduğunda...", text: "Senin mutluluğun benim de mutluluğum! O harika kahkahalarını duyar gibiyim. Bu anın tadını çıkar ve bil ki seninle birlikte gülen bir kalbin var burada." }
    };
    const letterModal = document.getElementById('letter-modal');
    const letterTitle = document.getElementById('letter-title');
    const letterText = document.getElementById('letter-text');
    const closeLetterBtn = document.querySelector('.close-letter-button');
    document.querySelectorAll('.envelope-button').forEach(button => {
        button.addEventListener('click', () => {
            const letterKey = button.dataset.letter;
            const letter = letters[letterKey];
            letterTitle.innerText = letter.title;
            letterText.innerText = letter.text;
            letterModal.style.display = 'flex';
        });
    });
    function closeLetterModal() { letterModal.style.display = 'none'; }
    closeLetterBtn.addEventListener('click', closeLetterModal);
    letterModal.addEventListener('click', (e) => { if (e.target === letterModal) closeLetterModal(); });


    // --- MİNİ OYUN: KALPLERİ YAKALA (GÜNCELLENDİ) ---
    const gameCanvas = document.getElementById('game-canvas');
    const gameCtx = gameCanvas.getContext('2d');
    const scoreDisplay = document.getElementById('score-display');
    const startGameBtn = document.getElementById('start-game-button');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');

    let score;
    let hearts;
    let gameInterval;
    let heartCreationInterval;

    const basket = { x: gameCanvas.width / 2 - 25, y: gameCanvas.height - 30, width: 50, height: 20, dx: 8 };
    let rightPressed = false;
    let leftPressed = false;

    // GÜNCELLENDİ: GERÇEK KALP ÇİZME FONKSİYONU
    function drawGameHeart(x, y, width, height) {
        gameCtx.fillStyle = `hsl(330, 100%, ${65 + Math.random() * 15}%)`;
        gameCtx.beginPath();
        let topCurveHeight = height * 0.3;
        gameCtx.moveTo(x + width / 2, y + topCurveHeight);
        gameCtx.bezierCurveTo(x, y, x, y - topCurveHeight, x + width / 2, y + topCurveHeight);
        gameCtx.bezierCurveTo(x + width, y - topCurveHeight, x + width, y, x + width / 2, y + topCurveHeight);
        gameCtx.lineTo(x + width / 2, y + height);
        gameCtx.lineTo(x + width / 2, y + topCurveHeight);
        gameCtx.closePath();
        gameCtx.fill();
    }

    function drawBasket() {
        gameCtx.beginPath();
        gameCtx.rect(basket.x, basket.y, basket.width, basket.height);
        gameCtx.fillStyle = '#ff1493';
        gameCtx.fill();
        gameCtx.closePath();
    }
    
    function updateGame() {
        if (rightPressed && basket.x < gameCanvas.width - basket.width) { basket.x += basket.dx; } 
        else if (leftPressed && basket.x > 0) { basket.x -= basket.dx; }

        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawBasket();

        for (let i = 0; i < hearts.length; i++) {
            hearts[i].y += hearts[i].speed;
            drawGameHeart(hearts[i].x, hearts[i].y, 20, 20); // Düzeltildi: Artık kare değil, kalp çiziyor.

            if (hearts[i].y + 20 > basket.y && hearts[i].x + 10 > basket.x && hearts[i].x < basket.x + basket.width) {
                score++;
                scoreDisplay.innerText = `Skor: ${score}`;
                hearts.splice(i, 1);
                i--;
            } else if (hearts[i].y > gameCanvas.height) {
                hearts.splice(i, 1);
                i--;
            }
        }
    }

    function startGame() {
        if (gameInterval) clearInterval(gameInterval);
        if (heartCreationInterval) clearInterval(heartCreationInterval);
        
        score = 0;
        hearts = [];
        scoreDisplay.innerText = `Skor: 0`;
        basket.x = gameCanvas.width / 2 - basket.width / 2;
        
        heartCreationInterval = setInterval(() => {
            if (hearts.length < 15) {
                hearts.push({
                    x: Math.random() * (gameCanvas.width - 20),
                    y: -20,
                    speed: 2 + Math.random() * 2
                });
            }
        }, 700);

        gameInterval = setInterval(updateGame, 1000 / 60);
    }

    // KLAVYE KONTROLLERİ
    document.addEventListener("keydown", (e) => {
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
        else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    });
    document.addEventListener("keyup", (e) => {
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
        else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    });

    // YENİ: MOBİL DOKUNMATİK KONTROLLER
    leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); leftPressed = true; });
    leftBtn.addEventListener('touchend', (e) => { e.preventDefault(); leftPressed = false; });
    rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); rightPressed = true; });
    rightBtn.addEventListener('touchend', (e) => { e.preventDefault(); rightPressed = false; });
    
    startGameBtn.addEventListener('click', startGame);

    // --- ÖNCEKİ MODÜLLER (DEĞİŞMEDİ) ---
    const countdownDate = new Date("2025-08-22T00:00:00").getTime(); const countdownFunction = setInterval(() => { const now = new Date().getTime(); const distance = countdownDate - now; const days = Math.floor(distance / (1000 * 60 * 60 * 24)); const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); const seconds = Math.floor((distance % (1000 * 60)) / 1000); document.getElementById("days").innerText = days; document.getElementById("hours").innerText = hours; document.getElementById("minutes").innerText = minutes; document.getElementById("seconds").innerText = seconds; if (distance < 0) { clearInterval(countdownFunction); document.getElementById("countdown").innerHTML = "<h2>O özel gün geldi! ❤️</h2>"; } }, 1000);
    const complimentBtn = document.getElementById("compliment-button"); const complimentModal = document.getElementById("compliment-modal"); const cardText = document.getElementById("card-text"); const closeCardBtn = document.querySelector(".close-card-button"); const compliments = ["Gülüşün, en karanlık günümü aydınlatıyor.", "Seninle her şey daha anlamlı ve daha güzel.", "Nezaketin ve kalbinin güzelliği eşsiz."]; function createBalloons() { const container = document.querySelector(".balloon-container"); container.innerHTML = ''; for (let i = 0; i < 10; i++) { const balloon = document.createElement('div'); balloon.className = 'heart-balloon'; balloon.style.left = `${Math.random() * 90}%`; balloon.style.animationDelay = `${Math.random() * 2}s`; balloon.style.backgroundColor = `hsl(330, 100%, ${60 + Math.random() * 20}%)`; container.appendChild(balloon); } } complimentBtn.addEventListener('click', () => { const randomIndex = Math.floor(Math.random() * compliments.length); cardText.innerText = compliments[randomIndex]; complimentModal.style.display = "flex"; createBalloons(); }); function closeCard() { complimentModal.style.display = "none"; } closeCardBtn.addEventListener('click', closeCard); complimentModal.addEventListener('click', (event) => { if (event.target === complimentModal) closeCard(); });
    const loveCalcBtn = document.getElementById("calculate-love"); const loveRes = document.getElementById("love-result"); loveCalcBtn.addEventListener('click', () => { const n1 = document.getElementById("name1").value; const n2 = document.getElementById("name2").value; if (n1.trim() === '' || n2.trim() === '') { loveRes.innerText = "Lütfen iki ismi de yazın!"; return; } loveRes.innerText = "Hesaplanıyor..."; setTimeout(() => { loveRes.innerHTML = `Aşk Uyumu: %100<br>Siz mükemmel bir çiftsiniz! ✨`; }, 2000); });
    const heartContainer = document.querySelector('body'); for (let i = 0; i < 50; i++) { const heart = document.createElement('div'); heart.classList.add('heart'); heart.style.left = `${Math.random() * 100}%`; heart.style.animationDelay = `${Math.random() * 10}s`; heart.style.animationDuration = `${7 + Math.random() * 8}s`; heart.style.transform = `scale(${0.5 + Math.random()})`; const randomColor = `hsl(${330 + Math.random() * 20}, 100%, ${70 + Math.random() * 15}%)`; const styleSheet = document.createElement("style"); styleSheet.innerText = `.heart:nth-child(${i+1})::before, .heart:nth-child(${i+1})::after { background-color: ${randomColor}; }`; document.head.appendChild(styleSheet); heartContainer.appendChild(heart); } document.addEventListener('mousemove', function(e) { let body = document.querySelector('body'); let heart = document.createElement('span'); heart.className = 'mouse-heart'; heart.style.left = e.pageX + 'px'; heart.style.top = e.pageY + 'px'; heart.innerHTML = '💖'; body.appendChild(heart); setTimeout(() => heart.remove(), 1000); });

});