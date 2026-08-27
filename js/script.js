// ============================================
// 1. СЛАЙДЕР
// ============================================
(function() {
    const IMAGE_FOLDER = 'static/img/shoes/show/';
    const IMAGE_FILES = [
        'shoe1.jpg',
        'shoe2.jpg',
        'shoe3.jpg',
        'shoe4.jpg'
    ];
    const INTERVAL_MS = 5000;
    
    const sliderWrapper = document.getElementById('sliderWrapper');
    const dotsContainer = document.getElementById('dotsContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    let autoSlideInterval = null;
    const totalSlides = IMAGE_FILES.length;

    function buildSlides() {
        sliderWrapper.innerHTML = '';
        dotsContainer.innerHTML = '';

        if (totalSlides === 0) {
            sliderWrapper.innerHTML = '<div class="slide"><div class="error-text">❌ Нет картинок</div></div>';
            return;
        }

        IMAGE_FILES.forEach((filename, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide';
            
            const img = document.createElement('img');
            const fullPath = IMAGE_FOLDER + filename;
            img.src = fullPath;
            img.alt = `Фото ${index + 1}`;
            img.loading = 'lazy';
            
            img.onerror = function() {
                console.error(`❌ Не найдена: ${fullPath}`);
                this.style.display = 'none';
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-text';
                errorDiv.textContent = `❌ ${filename}`;
                slideDiv.appendChild(errorDiv);
            };
            
            img.onload = function() {
                console.log(`✅ Загружена: ${fullPath}`);
            };
            
            slideDiv.appendChild(img);
            sliderWrapper.appendChild(slideDiv);

            const dot = document.createElement('button');
            dot.className = 'dot' + (index === 0 ? ' active' : '');
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(index) {
        if (totalSlides === 0) return;
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;

        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function resetAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
        if (totalSlides > 1) {
            autoSlideInterval = setInterval(nextSlide, INTERVAL_MS);
        }
    }

    function initSlider() {
        console.log('📁 Папка с картинками:', IMAGE_FOLDER);
        console.log('📄 Файлы:', IMAGE_FILES);
        
        buildSlides();
        
        if (totalSlides > 0) {
            goToSlide(0);

            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                prevSlide();
                resetAutoSlide();
            });

            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                nextSlide();
                resetAutoSlide();
            });

            dotsContainer.addEventListener('click', function(e) {
                const dot = e.target.closest('.dot');
                if (!dot) return;
                const index = parseInt(dot.dataset.index, 10);
                if (!isNaN(index) && index !== currentIndex) {
                    goToSlide(index);
                    resetAutoSlide();
                }
            });

            const container = document.querySelector('.slider-container');
            if (container) {
                container.addEventListener('mouseenter', function() {
                    if (autoSlideInterval) {
                        clearInterval(autoSlideInterval);
                        autoSlideInterval = null;
                    }
                });

                container.addEventListener('mouseleave', function() {
                    if (!autoSlideInterval && totalSlides > 1) {
                        autoSlideInterval = setInterval(nextSlide, INTERVAL_MS);
                    }
                });
            }

            resetAutoSlide();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlider);
    } else {
        initSlider();
    }
})();


// ============================================
// 2. ВКЛАДКИ (TABS)
// ============================================
(function() {
    function initTabs(container) {
        const tabHeaders = container.querySelectorAll('.tab-header');
        
        tabHeaders.forEach(function(header) {
            const buttons = header.querySelectorAll('.tab-btn');
            const parentTabs = header.closest('.tabs');
            const panels = parentTabs.querySelectorAll('.tab-panel');
            
            buttons.forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    buttons.forEach(function(b) {
                        b.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    const tabId = this.dataset.tab;
                    panels.forEach(function(panel) {
                        if (panel.id === tabId) {
                            panel.classList.add('active');
                        } else {
                            panel.classList.remove('active');
                        }
                    });
                });
            });
        });
    }

    function initAllTabs() {
        const containers = document.querySelectorAll('.tabs');
        containers.forEach(function(container) {
            initTabs(container);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllTabs);
    } else {
        initAllTabs();
    }
})();

// ============================================
// 3. ДИНАМИЧНЫЙ ФОН С ЧАСТИЦАМИ (с поддержкой скролла)
// ============================================
(function() {
    const container = document.querySelector('.dynamic-bg');
    if (!container) return;

    // Создаём canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';  // fixed, а не absolute
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'none';  // клики проходят сквозь canvas
    canvas.style.zIndex = '-1';
    
    // Убеждаемся, что контейнер не мешает скроллу
    container.style.position = 'relative';
    container.style.zIndex = '0';
    
    // Вставляем canvas в начало контейнера
    container.insertBefore(canvas, container.firstChild);

    const children = container.children;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child !== canvas) {
            child.style.position = 'relative';
            child.style.zIndex = '2';
        }
    }
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 60; // чуть меньше для производительности

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: (Math.random() * 2.5 + 0.5)*2,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.7 + 0.2
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(function(p) {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > width) p.speedX *= -1;
            if (p.y < 0 || p.y > height) p.speedY *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(24, 3, 3, ' + p.opacity + ')';
            ctx.fill();

            // Линии между частицами
            particles.forEach(function(p2) {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150 && dist > 0) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    const alpha = 0.08 * (1 - dist / 150);
                    ctx.strokeStyle = 'rgba(24, 3, 3, ' + alpha + ')';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(draw);
    }

    function initParticles() {
        resize();
        createParticles();
        draw();
    }

    // Запускаем после загрузки
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticles);
    } else {
        initParticles();
    }

    // Обновляем при изменении размера окна
    window.addEventListener('resize', function() {
        resize();
        createParticles();
    });
})();