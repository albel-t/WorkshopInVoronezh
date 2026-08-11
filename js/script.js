(function() {
    // ---------- НАСТРОЙКИ ----------
    const IMAGE_FOLDER = 'static/img/shoes/show/';
    const IMAGE_FILES = [
        'shoe1.jpg',
        'shoe2.jpg',
        'shoe3.jpg',
        'boots4.jpg',
        'sneakers5.jpg'
    ];
    const INTERVAL_MS = 1000;

    // ---------- ЭЛЕМЕНТЫ DOM ----------
    const sliderWrapper = document.getElementById('sliderWrapper');
    const dotsContainer = document.getElementById('dotsContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    let autoSlideInterval = null;
    const totalSlides = IMAGE_FILES.length;

    // ---------- СОЗДАНИЕ СЛАЙДОВ ----------
    function buildSlides() {
        sliderWrapper.innerHTML = '';
        dotsContainer.innerHTML = '';

        if (totalSlides === 0) {
            sliderWrapper.innerHTML = '<div class="slide"><div class="placeholder">Нет картинок</div></div>';
            return;
        }

        IMAGE_FILES.forEach((filename, index) => {
            // Создаём слайд
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide';
            
            const img = document.createElement('img');
            const fullPath = IMAGE_FOLDER + filename;
            img.src = fullPath;
            img.alt = `Обувь ${index + 1}`;
            img.loading = 'lazy';
            
            // Обработчик ошибки загрузки
            img.onerror = function() {
                console.error(`❌ Не удалось загрузить: ${fullPath}`);
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder';
                placeholder.textContent = `❌ ${filename}`;
                slideDiv.appendChild(placeholder);
            };
            
            img.onload = function() {
                console.log(`✅ Загружено: ${fullPath}`);
            };
            
            slideDiv.appendChild(img);
            sliderWrapper.appendChild(slideDiv);

            // Создаём точку
            const dot = document.createElement('button');
            dot.className = 'dot' + (index === 0 ? ' active' : '');
            dot.dataset.index = index;
            dot.setAttribute('aria-label', `Слайд ${index + 1}`);
            dotsContainer.appendChild(dot);
        });
    }

    // ---------- ПЕРЕКЛЮЧЕНИЕ ----------
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

    // ---------- ИНИЦИАЛИЗАЦИЯ ----------
    function init() {
        console.log('🚀 Слайдер инициализирован');
        console.log(`📁 Папка: ${IMAGE_FOLDER}`);
        console.log(`📄 Файлы:`, IMAGE_FILES);
        
        buildSlides();
        
        if (totalSlides > 0) {
            goToSlide(0);

            // События
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevSlide();
                resetAutoSlide();
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextSlide();
                resetAutoSlide();
            });

            dotsContainer.addEventListener('click', (e) => {
                const dot = e.target.closest('.dot');
                if (!dot) return;
                const index = parseInt(dot.dataset.index, 10);
                if (!isNaN(index) && index !== currentIndex) {
                    goToSlide(index);
                    resetAutoSlide();
                }
            });

            const container = document.querySelector('.slider-container');
            container.addEventListener('mouseenter', () => {
                if (autoSlideInterval) {
                    clearInterval(autoSlideInterval);
                    autoSlideInterval = null;
                }
            });

            container.addEventListener('mouseleave', () => {
                if (!autoSlideInterval && totalSlides > 1) {
                    autoSlideInterval = setInterval(nextSlide, INTERVAL_MS);
                }
            });

            container.addEventListener('touchstart', () => {
                if (autoSlideInterval) {
                    clearInterval(autoSlideInterval);
                    autoSlideInterval = null;
                }
            });

            container.addEventListener('touchend', () => {
                if (!autoSlideInterval && totalSlides > 1) {
                    autoSlideInterval = setInterval(nextSlide, INTERVAL_MS);
                }
            });

            resetAutoSlide();
        }

        window.addEventListener('beforeunload', () => {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();