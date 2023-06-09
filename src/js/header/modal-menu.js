
(() => {
  const mobileMenu = document.querySelector('.js-menu-container');
  const openMenuBtn = document.querySelector('.js-open-menu');
  const closeMenuBtn = document.querySelector('.js-close-menu');
  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    openMenuBtn.setAttribute('aria-expanded', isMenuOpen);
    mobileMenu.classList.toggle('is-open');

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
  };
  openMenuBtn.addEventListener('click', toggleMenu);
  closeMenuBtn.addEventListener('click', toggleMenu);

  // Закрыть мобильное меню при изменении ориентации устройства на широких экранах
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  const handleOrientationChange = () => {
    if (mediaQuery.matches) {
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
      } else {
        document.body.style.overflow = '';
        document.body.style.height = '';
      }
    }
  };

  mediaQuery.addEventListener('change', handleOrientationChange);
})();


