const phoneNumber = '79407716886';
const baseWhatsAppUrl = `https://wa.me/${phoneNumber}`;
const pixelId = document.documentElement.getAttribute('data-pixel-id') || 'YOUR_PIXEL_ID';
let pixelInitialized = false;

function initPixel() {
  if (pixelInitialized || pixelId === 'YOUR_PIXEL_ID' || typeof window === 'undefined' || !window.fbq) {
    return;
  }

  window.fbq('init', pixelId);
  pixelInitialized = true;
}

function trackFacebookEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || !window.fbq) {
    return;
  }

  if (pixelId !== 'YOUR_PIXEL_ID') {
    initPixel();
    window.fbq('track', eventName, params);
  }
}

window.addEventListener('load', () => {
  trackFacebookEvent('PageView', { content_name: 'Цветочная мастерская Гал' });
});

const whatsappButton = document.querySelector('.btn-primary');
if (whatsappButton) {
  whatsappButton.addEventListener('click', () => {
    trackFacebookEvent('Contact', { content_name: 'WhatsApp' });
  });
}

const facebookButton = document.querySelector('.btn-secondary');
if (facebookButton) {
  facebookButton.addEventListener('click', () => {
    trackFacebookEvent('ViewContent', { content_name: 'Facebook' });
  });
}

const orderButtons = document.querySelectorAll('.order-btn');

orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productName = button.dataset.name || 'букет';
    const price = button.dataset.price || 'уточнить';
    const priceValue = Number(String(price).replace(/\D/g, '')) || 0;
    const message = `Здравствуйте! Хочу заказать ${productName}. Цена: ${price}.`;
    const encodedMessage = encodeURIComponent(message);

    trackFacebookEvent('Lead', { content_name: productName });
    trackFacebookEvent('InitiateCheckout', {
      content_name: productName,
      value: priceValue,
      currency: 'RUB'
    });

    window.open(`${baseWhatsAppUrl}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  });
});

const orderForm = document.querySelector('.order-form');
if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('client-name');
    const phoneInput = document.getElementById('client-phone');
    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const message = `Здравствуйте! Хочу оформить заявку. Имя: ${name || 'не указано'}. Телефон: ${phone || 'не указан'}.`;
    const encodedMessage = encodeURIComponent(message);

    trackFacebookEvent('Lead', { content_name: 'Заявка с сайта' });
    window.open(`${baseWhatsAppUrl}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  });
}

const slides = Array.from(document.querySelectorAll('.slide'));
const dotsContainer = document.querySelector('.slider-controls');

if (slides.length && dotsContainer) {
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Показать слайд ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.slider-dot'));

  function showSlide(index) {
    const safeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === safeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === safeIndex);
    });
  }

  let currentIndex = 0;
  setInterval(() => {
    currentIndex += 1;
    showSlide(currentIndex);
  }, 5000);

  showSlide(0);
}
