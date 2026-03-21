// =====================
// МОБИЛЬНЫЙ ПОИСК
// =====================
function initMobileSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchClose = document.getElementById('searchClose');
    const mobileSearchBar = document.getElementById('mobileSearchBar');

    if (!searchToggle || !searchClose || !mobileSearchBar) return;

    searchToggle.addEventListener('click', () => {
        mobileSearchBar.classList.add('active');
        mobileSearchBar.querySelector('input').focus();
    });

    searchClose.addEventListener('click', () => {
        mobileSearchBar.classList.remove('active');
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mobileSearchBar.classList.remove('active');
        }
    });
}

// =====================
// МОБИЛЬНОЕ МЕНЮ (БУРГЕР)
// =====================
function initMobileMenu() {
    const burger = document.querySelector('.mobile-burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const header = document.querySelector('header');

    if (!burger || !mobileMenu || !header) return;

    function setMenuPosition() {
        const headerHeight = header.getBoundingClientRect().height;
        mobileMenu.style.top = headerHeight + 'px';
        mobileMenu.style.height = `calc(100vh - ${headerHeight}px)`;
    }

    function openMenu() {
        setMenuPosition();
        mobileMenu.classList.add('is-open');
        burger.classList.add('is-active');
    }

    function closeMenu() {
        mobileMenu.classList.remove('is-open');
        burger.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    setMenuPosition();
    window.addEventListener('resize', setMenuPosition);

    burger.addEventListener('click', () => {
        mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    const observer = new MutationObserver(() => {
        if (mobileMenu.classList.contains('is-open')) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            header.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            header.style.touchAction = '';
        }
    });

    observer.observe(mobileMenu, { attributes: true, attributeFilter: ['class'] });

    const observer1 = new MutationObserver(() => {
        if (window.innerWidth <= 768) {
            if (mobileMenu.classList.contains('is-open')) {
                header.style.setProperty('position', 'fixed', 'important');
                header.style.setProperty('width', '100%', 'important');
                header.style.setProperty('z-index', '1000');
            } else {
                header.style.removeProperty('position');
                header.style.removeProperty('width');
            }
        }
    });

    observer1.observe(mobileMenu, { attributes: true, attributeFilter: ['class'] });
}

// =====================
// ДРОПДАУН КАТЕГОРИЙ В МОБИЛЬНОМ МЕНЮ
// =====================
function initMobileDropdown() {
    const dropdowns = document.querySelectorAll('.mobile-menu__nav-item--dropdown');
    if (!dropdowns.length) return;

    dropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('ul');
        if (!dropdownMenu) return;

        dropdownMenu.style.display = 'none';

        dropdown.querySelector(':scope > a').addEventListener('click', (e) => {
            e.preventDefault();

            dropdowns.forEach(other => {
                if (other === dropdown) return;
                const otherMenu = other.querySelector('ul');
                const otherLink = other.querySelector(':scope > a');
                if (otherMenu) otherMenu.style.display = 'none';
                if (otherLink) otherLink.style.color = '';
                other.classList.remove('is-open');
            });

            const isOpen = dropdownMenu.style.display === 'block';
            dropdownMenu.style.display = isOpen ? 'none' : 'block';
            dropdown.classList.toggle('is-open', !isOpen);
            e.currentTarget.style.color = isOpen ? '' : '#5272FB';
        });
    });
}

// =====================
// TOUCH ACTIVE
// =====================
function initTouchActive() {
    const links = document.querySelectorAll('.nav-slider__link');
    if (!links.length) return;

    links.forEach(link => {
        link.addEventListener('touchend', function () {
            const navItem = this.closest('.nav-item--dropdown');
            if (!navItem) return;

            if (navItem.classList.contains('is-open')) {
                this.classList.add('is-touch-active');
            } else {
                this.classList.remove('is-touch-active');
            }
        }, { passive: true });
    });
}

// =====================
// СТРЕЛКА КАТЕГОРИЙ В МОБИЛЬНОМ МЕНЮ
// =====================
function initArrowToggle() {
    const arrows = document.querySelectorAll('.arrow-after__toggle');
    if (!arrows.length) return;

    arrows.forEach(arrow => {
        arrow.addEventListener('click', function (e) {
            e.preventDefault();
            this.closest('.mobile-menu__nav-item--dropdown').classList.toggle('active');
        });
    });
}

// =====================
// ЯЗЫК В МОБИЛЬНОМ МЕНЮ
// =====================
function initMobileLang() {
    const langMenu = document.querySelector('.mobile-menu__lang');
    const langDropdown = document.querySelector('.lang__dropdown');
    const langArrow = document.querySelector('.mobile-menu__lang .categories__arrow-after__toggle');

    if (!langMenu || !langDropdown || !langArrow) return;

    langMenu.addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('active');
        langArrow.style.transform = this.classList.contains('active') ? 'rotate(0deg)' : 'rotate(180deg)';
    });

    langDropdown.addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('click', () => {
        langMenu.classList.remove('active');
        langArrow.style.transform = 'rotate(180deg)';
    });

    document.querySelectorAll('.lang__dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const flag = item.querySelector('img').src;
            const code = item.querySelector('span').textContent;

            langMenu.querySelector('img').src = flag;
            langMenu.querySelector('span').textContent = code;

            document.querySelectorAll('.lang__dropdown-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            langMenu.classList.remove('active');
            langArrow.style.transform = 'rotate(180deg)';
        });
    });
}

// =====================
// ЯЗЫК В ДЕСКТОПНОМ МЕНЮ
// =====================
function initDesktopLang() {
    const langMenu = document.querySelector('.lang-menu');
    const langDropdown = document.querySelector('.lang-menu__dropdown');
    const langCurrent = document.querySelector('.lang-menu__current');

    if (!langMenu || !langDropdown || !langCurrent) return;

    langCurrent.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = langDropdown.style.display === 'block';
        langDropdown.style.setProperty('display', isVisible ? 'none' : 'block', 'important');
    });

    document.querySelectorAll('.lang-menu__item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const link = item.querySelector('.lang-menu__link');
            const flag = link.querySelector('.lang-menu__flag').src;
            const code = link.querySelector('.lang-menu__code').textContent;

            langCurrent.querySelector('.lang-menu__flag').src = flag;
            langCurrent.querySelector('.lang-menu__code').textContent = code;

            document.querySelectorAll('.lang-menu__item').forEach(el => el.classList.remove('lang-menu__item--active'));
            item.classList.add('lang-menu__item--active');

            langDropdown.style.setProperty('display', 'none', 'important');
        });
    });

    document.addEventListener('click', (e) => {
        if (!langMenu.contains(e.target)) {
            langDropdown.style.setProperty('display', 'none', 'important');
        }
    });
}

// =====================
// СЛАЙДЕР НАВИГАЦИИ
// =====================
function initNavSlider() {
    const sliders = document.querySelectorAll('.nav-slider');
    if (!sliders.length) return;

    const scrollAmount = 400;

    sliders.forEach((slider) => {
        const track = slider.querySelector('.nav-slider__list');
        const prevBtn = slider.querySelector('.nav-slider__arrow--prev');
        const nextBtn = slider.querySelector('.nav-slider__arrow--next');

        if (!track || !prevBtn || !nextBtn) return;

        nextBtn.addEventListener('click', () => { track.scrollLeft += scrollAmount; });
        prevBtn.addEventListener('click', () => { track.scrollLeft -= scrollAmount; });
    });
}

// =====================
// ДРОПДАУН КАТЕГОРИЙ В ХЕДЕРЕ (ДЕСКТОП)
// =====================
function initCategoriesDropdown() {
    const navItems = document.querySelectorAll('.nav-item--dropdown');
    if (!navItems.length) return;

    function updateDropdownPositions() {
        navItems.forEach(item => {
            const dropdown = item.querySelector('.categories-dropdown');
            if (!dropdown) return;

            const navBar = item.closest('.main-menu-top-wrap');
            if (!navBar) return;

            dropdown.style.top = item.offsetHeight + 'px';
        });
    }

    updateDropdownPositions();
    window.addEventListener('resize', updateDropdownPositions);
    window.addEventListener('scroll', updateDropdownPositions, { passive: true });
}

// =====================
// ДРОПДАУН NAV-ITEM (HOVER ДЕСКТОП + ТАП МОБИЛЬНЫЙ)
// =====================
function initNavItemDropdown() {
    const dropdowns = document.querySelectorAll('.nav-item--dropdown');
    if (!dropdowns.length) return;

    const isTouch = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    function closeAll() {
        dropdowns.forEach(el => {
            el.classList.remove('is-open');
            const link = el.querySelector('.nav-slider__link');
            if (link) link.classList.remove('is-active');
        });
    }

    dropdowns.forEach(item => {
        item.addEventListener('mouseenter', function () {
            if (isTouch()) return;
            closeAll();
            this.classList.add('is-open');
            const link = this.querySelector('.nav-slider__link');
            if (link) link.classList.add('is-active');
        });

        item.addEventListener('mouseleave', function () {
            if (isTouch()) return;
            this.classList.remove('is-open');
            const link = this.querySelector('.nav-slider__link');
            if (link) link.classList.remove('is-active');
        });

        item.addEventListener('click', function () {
            if (!isTouch()) return;

            const isOpen = this.classList.contains('is-open');
            closeAll();

            if (!isOpen) {
                this.classList.add('is-open');
                const link = this.querySelector('.nav-slider__link');
                if (link) link.classList.add('is-active');
            }
        });
    });

    document.addEventListener('click', (e) => {
        const clickedInside = [...dropdowns].some(el => el.contains(e.target));
        if (!clickedInside) closeAll();
    });
}

// =====================
// TOP VIDEOS ДРОПДАУН
// =====================
function initTopVideos() {
    const topVideos = document.querySelector('.top-videos');
    const topVideosBtn = document.querySelector('.top-videos__btn');
    const topVideosDropdown = document.querySelector('.top-videos__dropdown');

    if (!topVideos || !topVideosBtn || !topVideosDropdown) return;

    topVideosBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = topVideosDropdown.style.display === 'block';
        topVideosDropdown.style.setProperty('display', isVisible ? 'none' : 'block', 'important');
    });

    document.addEventListener('click', (e) => {
        if (!topVideos.contains(e.target)) {
            topVideosDropdown.style.setProperty('display', 'none', 'important');
        }
    });
}

// =====================
// STICKY HEADER
// =====================
function initStickyHeader() {
    const headerMain = document.getElementById('header_main');
    const stickyToggle = document.getElementById('sticky_toggle');

    if (!headerMain || !stickyToggle) return;

    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;

        if (!stickyToggle.checked || scrollY < 200) {
            headerMain.style.position = '';
            headerMain.style.top = '';
            headerMain.style.left = '';
            headerMain.style.width = '';
            headerMain.style.zIndex = '';
            document.body.style.paddingTop = '';
            return;
        }

        headerMain.style.position = 'fixed';
        headerMain.style.top = '0';
        headerMain.style.left = '0';
        headerMain.style.width = '100%';
        headerMain.style.zIndex = '1000';
        document.body.style.paddingTop = headerMain.offsetHeight + 'px';
    }

    stickyToggle.addEventListener('change', handleScroll);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

// =====================
// THUMBS LAYOUT
// =====================
function initThumbsLayout() {
    const thumbsToggle = document.getElementById('thumbs_toggle');
    const videosWrapper = document.querySelector('.thumbs_regulator');

    if (!thumbsToggle || !videosWrapper) return;

    function applyThumbsLayout() {
        if (thumbsToggle.checked && window.innerWidth <= 768) {
            videosWrapper.style.setProperty('grid-template-columns', '1fr', 'important');
            [...videosWrapper.children].forEach((el, i) => {
                if (i >= 4) el.style.setProperty('display', 'none', 'important');
            });
        } else {
            videosWrapper.style.removeProperty('grid-template-columns');
            [...videosWrapper.children].forEach(el => el.style.removeProperty('display'));
        }
    }

    thumbsToggle.addEventListener('change', applyThumbsLayout);
    window.addEventListener('resize', applyThumbsLayout);
}

// =====================
// КНОПКА "ЕЩЁ" В КАТЕГОРИЯХ
// =====================
function initCategoriesMore() {
    const btns = document.querySelectorAll('.more-btn');
    if (!btns.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', function () {
            const isOpen = btn.classList.toggle('is-open-btn');
            const isShowAll = btn.classList.contains('show-all');

            btn.querySelector('.more-btn__text').textContent = isShowAll
                ? (isOpen ? 'Show less' : 'Show more')
                : (isOpen ? 'Less' : 'More');
        });
    });
}

// =====================
// LAZY LOAD КАРТИНОК
// =====================
function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img.lazy-load');
    if (!lazyImages.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.original;
                img.classList.remove('lazy-load');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
}

// =====================
// ЗАГРУЗКА HLS.JS ПРИ СКРОЛЛЕ
// =====================
function loadHLSOnScroll() {
    let loaded = false;
    window.addEventListener('scroll', function handler() {
        if (!loaded) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
            document.head.appendChild(script);
            loaded = true;
            window.removeEventListener('scroll', handler);
        }
    });
}

// =====================
// ЧАТ
// =====================
function initChat() {
    if (!document.querySelector('.chat-item')) return;

    const onlineDot = document.querySelector('.chat-avatar-block .online-dot');

    function updateOnlineDot() {
        const statusEl = document.querySelector('.chat-avatar-status');
        if (!onlineDot || !statusEl) return;
        onlineDot.style.display = statusEl.textContent.trim() === 'Online' ? 'block' : 'none';
    }

    function updateChatItemDots() {
        document.querySelectorAll('.chat-item').forEach(item => {
            const dot = item.querySelector('.online-dot');
            if (dot) {
                dot.style.display = item.dataset.status === 'Online' ? 'block' : 'none';
            }
        });
    }

    function updateRightSide() {
        const hasActive = document.querySelector('.chat-item.active');
        const rightSide = document.querySelector('.chat-right-side-contant');
        if (!rightSide) return;
        rightSide.style.display = hasActive ? 'flex' : 'none';
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function resetChat() {
        document.querySelectorAll('.chat-item').forEach(el => {
            el.classList.remove('active');
            const badge = el.querySelector('.badge');
            const name = el.querySelector('.chat-name');
            const preview = el.querySelector('.chat-preview');
            if (badge) { badge.style.background = ''; badge.style.color = ''; }
            if (name) name.style.color = '';
            if (preview) preview.style.color = '';
        });
        document.querySelectorAll('.chat-body').forEach(body => body.classList.remove('active'));
    }

    function updateBackBtn() {
        const backBtn = document.querySelector('.chat-back-btn');
        if (!backBtn) return;
        const leftSide = document.querySelector('.chat-left-side-contant');
        if (!leftSide) return;
        backBtn.style.display = leftSide.style.display === 'none' ? 'flex' : 'none';
    }

    function updateHeight() {
        const header = document.getElementById('header_main');
        const content = document.querySelector('.chat-right-side-contant');
        const leftSide = document.querySelector('.chat-left-side-contant');
        if (!header || !content) return;
        const headerHeight = header.offsetHeight;
        content.style.height = `calc(100vh - ${headerHeight}px)`;
        if (leftSide) leftSide.style.height = `calc(100vh - ${headerHeight}px)`;
    }

    updateRightSide();
    updateChatItemDots();
    updateBackBtn();
    updateHeight();

    document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.chatId;

            document.querySelectorAll('.chat-item').forEach(el => {
                el.classList.remove('active');
                const badge = el.querySelector('.badge');
                const name = el.querySelector('.chat-name');
                const preview = el.querySelector('.chat-preview');
                if (badge) { badge.style.background = ''; badge.style.color = ''; }
                if (name) name.style.color = '';
                if (preview) preview.style.color = '';
            });

            document.querySelectorAll('.chat-body').forEach(body => {
                body.classList.remove('active');
            });

            item.classList.add('active');
            const badge = item.querySelector('.badge');
            const name = item.querySelector('.chat-name');
            const preview = item.querySelector('.chat-preview');
            if (badge) { badge.style.background = '#fff'; badge.style.color = '#000'; }
            if (name) name.style.color = '#fff';
            if (preview) preview.style.color = '#fff';

            const avatarName = document.querySelector('.chat-avatar-name');
            const avatarStatus = document.querySelector('.chat-avatar-status');
            const avatarIcon = document.querySelector('.chat-avatar-block .avatar');
            if (avatarName) avatarName.textContent = item.dataset.name;
            if (avatarStatus) avatarStatus.textContent = item.dataset.status;
            if (avatarIcon) avatarIcon.textContent = item.dataset.avatar;
            updateOnlineDot();

            const activeBody = document.querySelector(`.chat-body[data-chat-id="${id}"]`);
            if (activeBody) activeBody.classList.add('active');

            const leftSide = document.querySelector('.chat-left-side-contant');
            const rightSide = document.querySelector('.chat-right-side-contant');

            if (isMobile()) {
                if (leftSide) leftSide.style.display = 'none';
                if (rightSide) rightSide.style.display = 'flex';
            } else {
                updateRightSide();
            }

            updateBackBtn();
        });
    });

    document.querySelectorAll('.chat-item').forEach(item => {
        const dateEl = item.querySelector('.chat-item-date');
        const timeEl = item.querySelector('.chat-top .chat-time');

        if (dateEl && dateEl.children.length > 0) {
            if (timeEl) timeEl.style.display = 'none';
        } else {
            if (timeEl) timeEl.style.display = 'block';
            if (dateEl) dateEl.style.display = 'none';
        }
    });

    const chatBackBtn = document.querySelector('.chat-back-btn');
    if (chatBackBtn) {
        chatBackBtn.addEventListener('click', () => {
            const leftSide = document.querySelector('.chat-left-side-contant');
            const rightSide = document.querySelector('.chat-right-side-contant');
            if (leftSide) leftSide.style.display = 'flex';
            if (rightSide) rightSide.style.display = 'none';
            resetChat();
            updateBackBtn();
        });
    }

    window.addEventListener('resize', () => {
        updateHeight();
        if (!isMobile()) {
            const leftSide = document.querySelector('.chat-left-side-contant');
            if (leftSide) leftSide.style.display = '';
            updateRightSide();
        }
        updateBackBtn();
    });
}

// =====================
// МОДАЛЬНОЕ ОКНО РЕГИСТРАЦИИ
// =====================
function initModalReg() {
    const modalReg = document.getElementById('modal-reg');
    if (!modalReg) return;

    const observer = new MutationObserver(() => {
        if (modalReg.classList.contains('is-open')) {
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    });

    observer.observe(modalReg, { attributes: true, attributeFilter: ['class'] });

    if (modalReg.classList.contains('is-open')) {
        document.documentElement.style.overflow = 'hidden';
    }
}

// =====================
// СТРЕЛКИ SELECT
// =====================
function initSelectArrows() {
    document.querySelectorAll('.profile-select').forEach(select => {
        select.addEventListener('mousedown', function () {
            this.closest('.select-wrapper').classList.toggle('is-open');
        });
        select.addEventListener('blur', function () {
            this.closest('.select-wrapper').classList.remove('is-open');
        });
        select.addEventListener('change', function () {
            this.closest('.select-wrapper').classList.remove('is-open');
        });
    });
}

// =====================
// ПЕРЕКЛЮЧАТЕЛЬ ПОЛА
// =====================
function initGenderToggle() {
    const btns = document.querySelectorAll('.profile-gender-toggle__btn');
    if (!btns.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', function () {
            btns.forEach(el => el.classList.remove('profile-gender-toggle__btn--active'));
            this.classList.add('profile-gender-toggle__btn--active');
        });
    });
}

// =====================
// ПОКАЗ/СКРЫТИЕ ПАРОЛЯ
// =====================
function initPasswordToggle() {
    const groups = document.querySelectorAll('.form__group');
    if (!groups.length) return;

    groups.forEach(group => {
        const input = group.querySelector('input[type="password"], input[type="text"]');
        const icon = group.querySelector('.form__icon img');

        if (!input || !icon) return;

        input.type = 'password';
        icon.src = './assets/img/Show.png';

        group.querySelector('.form__icon').addEventListener('click', function () {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            icon.src = isPassword ? './assets/img/Hide.png' : './assets/img/Show.png';
        });
    });
}

// =====================
// КАСТОМНЫЙ СКРОЛЛБАР
// =====================
function initCustomScrollbar(areaId, thumbId) {
    const area = document.getElementById(areaId);
    const thumb = document.getElementById(thumbId);
    if (!area || !thumb) return;

    function updateThumb() {
        const { scrollTop, scrollHeight, clientHeight } = area;
        const trackHeight = clientHeight - 12;
        const thumbHeight = Math.max(30, (clientHeight / scrollHeight) * trackHeight);
        const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (trackHeight - thumbHeight);
        thumb.style.height = thumbHeight + 'px';
        thumb.style.top = thumbTop + 'px';
    }

    area.addEventListener('scroll', updateThumb);
    window.addEventListener('resize', updateThumb);
    updateThumb();
}

// =====================
// ДАТАПИКЕР
// =====================
function initDatePicker() {
    const inputs = document.querySelectorAll('.profile-input--datepicker');
    if (!inputs.length) return;

    inputs.forEach(input => {
        input.setAttribute('placeholder', 'DD.MM.YYYY');
        input.setAttribute('maxlength', '10');

        input.addEventListener('input', function () {
            let val = this.value.replace(/\D/g, '');
            if (val.length > 8) val = val.slice(0, 8);

            if (val.length >= 1) {
                let d = val.slice(0, 2);
                if (parseInt(d[0]) > 3) d = '0' + d[0];
                if (d.length === 2 && parseInt(d) > 31) d = '31';
                if (d.length === 2 && parseInt(d) < 1) d = '01';
                val = d + val.slice(2);
            }

            if (val.length >= 3) {
                let m = val.slice(2, 4);
                if (parseInt(m[0]) > 1) m = '0' + m[0];
                if (m.length === 2 && parseInt(m) > 12) m = '12';
                if (m.length === 2 && parseInt(m) < 1) m = '01';
                val = val.slice(0, 2) + m + val.slice(4);
            }

            if (val.length >= 5) {
                let y = val.slice(4, 8);
                const currentYear = new Date().getFullYear();
                if (y.length === 4) {
                    if (parseInt(y) < 1900) y = '1900';
                    if (parseInt(y) > currentYear) y = String(currentYear);
                }
                val = val.slice(0, 4) + y;
            }

            let result = '';
            if (val.length >= 1) result += val.slice(0, 2);
            if (val.length >= 3) result += '.' + val.slice(2, 4);
            if (val.length >= 5) result += '.' + val.slice(4, 8);
            this.value = result;
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && this.value.endsWith('.')) {
                this.value = this.value.slice(0, -1);
                e.preventDefault();
            }
        });

        const wrap = input.closest('.profile-input-icon-wrap');
        if (!wrap) return;

        let picker = null;
        let selectedDate = null;
        let viewDate = null;

        function parseInputDate(str) {
            if (!str) return null;
            const parts = str.split('.');
            if (parts.length !== 3) return null;
            const d = parseInt(parts[0]), m = parseInt(parts[1]) - 1, y = parseInt(parts[2]);
            if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
            return new Date(y, m, d);
        }

        function formatDate(date) {
            return String(date.getDate()).padStart(2, '0') + '.' +
                String(date.getMonth() + 1).padStart(2, '0') + '.' +
                date.getFullYear();
        }

        input.addEventListener('input', function () {
            const parsed = parseInputDate(this.value);
            if (parsed) {
                const year = parsed.getFullYear();
                const currentYear = new Date().getFullYear();
                if (year < 1900 || year > currentYear) return;
                selectedDate = parsed;
                viewDate = new Date(year, parsed.getMonth(), 1);
                if (picker) renderCalendar();
            }
        });

        function renderCalendar() {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            const year = viewDate.getFullYear();
            const month = viewDate.getMonth();

            let firstDay = new Date(year, month, 1).getDay();
            firstDay = firstDay === 0 ? 6 : firstDay - 1;

            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const daysInPrev = new Date(year, month, 0).getDate();

            const popup = picker.querySelector('.dp-popup');
            popup.querySelector('.dp-month-year').textContent = monthNames[month] + ' ' + year;

            const grid = popup.querySelector('.dp-grid');
            grid.querySelectorAll('.dp-day').forEach(el => el.remove());

            for (let i = firstDay - 1; i >= 0; i--) {
                const el = document.createElement('div');
                el.className = 'dp-day dp-day--other';
                el.textContent = daysInPrev - i;
                grid.appendChild(el);
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const el = document.createElement('div');
                const isSelected = selectedDate &&
                    selectedDate.getDate() === d &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getFullYear() === year;
                el.className = 'dp-day' + (isSelected ? ' dp-day--selected' : '');
                el.dataset.day = d;
                el.textContent = d;
                el.addEventListener('click', function (e) {
                    e.stopPropagation();
                    selectedDate = new Date(year, month, parseInt(this.dataset.day));
                    renderCalendar();
                });
                grid.appendChild(el);
            }

            const total = firstDay + daysInMonth;
            const remaining = total % 7 === 0 ? 0 : 7 - (total % 7);
            for (let d = 1; d <= remaining; d++) {
                const el = document.createElement('div');
                el.className = 'dp-day dp-day--other';
                el.textContent = d;
                grid.appendChild(el);
            }
        }

        function positionPicker() {
            const rect = wrap.getBoundingClientRect();
            picker.style.top = (rect.bottom + window.scrollY + 8) + 'px';
            picker.style.left = rect.left + window.scrollX + 'px';
        }

        function openPicker() {
            if (picker) return;
            selectedDate = parseInputDate(input.value) || new Date();
            viewDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

            picker = document.createElement('div');
            picker.className = 'dp-wrapper';
            picker.style.position = 'absolute';
            picker.style.zIndex = '9999';
            picker.innerHTML = `
                <div class="dp-popup">
                    <div class="dp-title-bar">
                        <span class="dp-title">Date of Birth</span>
                        <div class="dp-close-btn" type="button">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.28261 7.0001L13.7339 1.54851C14.0887 1.1939 14.0887 0.620557 13.7339 0.265953C13.3793 -0.088651 12.806 -0.088651 12.4514 0.265953L6.99992 5.71755L1.5486 0.265953C1.19384 -0.088651 0.620668 -0.088651 0.266072 0.265953C-0.0886906 0.620557 -0.0886906 1.1939 0.266072 1.54851L5.71739 7.0001L0.266072 12.4517C-0.0886906 12.8063 -0.0886906 13.3797 0.266072 13.7343C0.442789 13.9111 0.675145 14 0.907335 14C1.13953 14 1.37172 13.9111 1.5486 13.7343L6.99992 8.28266L12.4514 13.7343C12.6283 13.9111 12.8605 14 13.0927 14C13.3249 14 13.557 13.9111 13.7339 13.7343C14.0887 13.3797 14.0887 12.8063 13.7339 12.4517L8.28261 7.0001Z" fill="#A3A3A3"/>
                            </svg>
                        </div>
                    </div>
                    <div class="dp-header">
                        <button class="dp-arrow dp-prev" type="button">
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 1L1 5L5 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <span class="dp-month-year"></span>
                        <button class="dp-arrow dp-next" type="button">
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 0.999999L5 5L1 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="dp-grid">
                        <div class="dp-day-name">Mon</div>
                        <div class="dp-day-name">Tue</div>
                        <div class="dp-day-name">Wed</div>
                        <div class="dp-day-name">Thu</div>
                        <div class="dp-day-name">Fri</div>
                        <div class="dp-day-name">Sat</div>
                        <div class="dp-day-name">Sun</div>
                    </div>
                    <button class="dp-set-btn" type="button">Set</button>
                </div>
            `;

            picker.querySelector('.dp-prev').addEventListener('click', function (e) {
                e.stopPropagation();
                const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
                if (prev.getFullYear() >= 1900) {
                    viewDate.setMonth(viewDate.getMonth() - 1);
                    renderCalendar();
                }
            });

            picker.querySelector('.dp-next').addEventListener('click', function (e) {
                e.stopPropagation();
                const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
                const now = new Date();
                if (next.getFullYear() < now.getFullYear() ||
                    (next.getFullYear() === now.getFullYear() && next.getMonth() <= now.getMonth())) {
                    viewDate.setMonth(viewDate.getMonth() + 1);
                    renderCalendar();
                }
            });

            picker.querySelector('.dp-set-btn').addEventListener('click', function (e) {
                e.stopPropagation();
                if (selectedDate) input.value = formatDate(selectedDate);
                closePicker();
            });

            picker.querySelector('.dp-close-btn').addEventListener('click', function (e) {
                e.stopPropagation();
                closePicker();
            });

            picker.addEventListener('click', e => e.stopPropagation());

            document.body.appendChild(picker);
            positionPicker();
            renderCalendar();
        }

        function closePicker() {
            if (picker) { picker.remove(); picker = null; }
        }

        wrap.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!picker) openPicker();
        });

        document.addEventListener('click', function () {
            closePicker();
        });
    });
}

// =====================
// RANGE SLIDER
// =====================
function initRangeSlider() {
    const container = document.querySelector('.range-slider');
    if (!container) return;

    const minInput = container.querySelector('.range-slider__input--min');
    const maxInput = container.querySelector('.range-slider__input--max');
    const valueDisplay = document.querySelector('.range-value');

    if (!minInput || !maxInput || !valueDisplay) return;

    function update() {
        let min = parseInt(minInput.value);
        let max = parseInt(maxInput.value);

        if (min > max) [min, max] = [max, min];

        valueDisplay.textContent = `${min}-${max}`;

        const percent1 = ((min - 18) / (100 - 18)) * 100;
        const percent2 = ((max - 18) / (100 - 18)) * 100;

        container.style.background = `linear-gradient(to right, 
            rgba(255,255,255,0.15) ${percent1}%, 
            var(--color-blue, #5B6EF5) ${percent1}%, 
            var(--color-blue, #5B6EF5) ${percent2}%, 
            rgba(255,255,255,0.15) ${percent2}%)`;
    }

    minInput.addEventListener('input', update);
    maxInput.addEventListener('input', update);
    update();
}

// =====================
// ИНИЦИАЛИЗАЦИЯ
// =====================
document.addEventListener('DOMContentLoaded', () => {
    initMobileSearch();
    initMobileMenu();
    initMobileDropdown();
    initTouchActive();
    initArrowToggle();
    initMobileLang();
    initDesktopLang();
    initNavSlider();
    initCategoriesDropdown();
    initNavItemDropdown();
    initTopVideos();
    initStickyHeader();
    initThumbsLayout();
    initCategoriesMore();
    initLazyLoad();
    loadHLSOnScroll();
    initChat();
    initModalReg();
    initPasswordToggle();
    initGenderToggle();
    initSelectArrows();
    initDatePicker();
    initRangeSlider();
    initCustomScrollbar('chatScrollArea', 'scrollThumb');
});