(function() {
    // ===== ВАШИ КАРТИНКИ =====
    const IMAGE_FOLDER = 'static/img/shoes/show/';
    const IMAGE_FILES = [
        'shoe1.jpg',
        'shoe2.jpg',
        'shoe3.jpg',
        'shoe4.jpg'
    ];
    // =========================

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

    function init() {
        console.log('📁 Папка с картинками:', IMAGE_FOLDER);
        console.log('📄 Файлы:', IMAGE_FILES);
        
        buildSlides();
        
        if (totalSlides > 0) {
            goToSlide(0);

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

            resetAutoSlide();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
(function() {
    // Функция для работы вкладок
    function initTabs(container) {
        const tabHeaders = container.querySelectorAll('.tab-header');
        
        tabHeaders.forEach(header => {
            const buttons = header.querySelectorAll('.tab-btn');
            const parentTabs = header.closest('.tabs');
            const panels = parentTabs.querySelectorAll('.tab-panel');
            
            buttons.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Убираем активный класс у всех кнопок в этом заголовке
                    buttons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Показываем нужную панель
                    const tabId = this.dataset.tab;
                    panels.forEach(panel => {
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

    // Инициализация после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            const containers = document.querySelectorAll('.tabs');
            containers.forEach(container => initTabs(container));
        });
    } else {
        const containers = document.querySelectorAll('.tabs');
        containers.forEach(container => initTabs(container));
    }
})();