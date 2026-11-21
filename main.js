/* ==========================================================================
   Lista Nacional — interacciones del sitio
   --------------------------------------------------------------------------
   1. WhatsApp: un único lugar para cambiar número y mensaje
   2. Header, menú móvil y año del footer
   3. Animaciones de aparición
   4. Vista previa de paletas y fuentes por URL
   5. Muestras de la guía de diseño
   6. Formulario de contacto (validación en el navegador)
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;

  /* 1. WhatsApp ------------------------------------------------------------ */
  var WHATSAPP_NUMBER = '56900000000';
  var WHATSAPP_DISPLAY = '+56 9 0000 0000';
  var WHATSAPP_MESSAGE =
    'Hola, escribo desde el sitio de Un colegio: Muchas voces, lista para el Colegio de Periodistas de Chile. Quisiera más información.';

  var waLinks = document.querySelectorAll('[data-wa]');
  if (waLinks.length) {
    var waHref = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE);
    waLinks.forEach(function (link) {
      link.setAttribute('href', waHref);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
    document.querySelectorAll('[data-wa-number]').forEach(function (el) {
      el.textContent = WHATSAPP_DISPLAY;
    });
  }

  /* 2. Header, menú móvil y año ------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  var header = document.querySelector('.site-header');
  if (header) {
    var updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');

  if (navToggle && nav) {
    var setNav = function (open) {
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    };

    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setNav(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        navToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) setNav(false);
    });
  }

  /* 3. Animaciones de aparición ------------------------------------------- */
  var revealItems = document.querySelectorAll('.reveal');

  if (revealItems.length) {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!('IntersectionObserver' in window) || reducedMotion) {
      revealItems.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
      );

      revealItems.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  }

  /* 4. Vista previa por URL ------------------------------------------------ */
  var params = new URLSearchParams(window.location.search);
  var paletteParam = params.get('paleta');
  var fontsParam = params.get('fuentes');
  var previewNote = document.getElementById('preview-note');
  var previewReset = document.getElementById('preview-reset');

  var paletteNames = {
    1: 'Paleta 1 · Tinta y papel',
    2: 'Paleta 2 · Verde cívico',
    3: 'Paleta 3 · Ciruela y ladrillo'
  };
  var fontNames = {
    a: 'Fuentes A · Editorial contemporánea',
    b: 'Fuentes B · Humanista cercana',
    c: 'Fuentes C · Prensa moderna'
  };

  var previewParts = [];
  if (paletteParam && paletteNames[paletteParam]) previewParts.push(paletteNames[paletteParam]);
  if (fontsParam && fontNames[fontsParam]) previewParts.push(fontNames[fontsParam]);

  if (previewParts.length && previewNote) {
    previewNote.textContent = 'Vista previa: ' + previewParts.join(' + ') + '.';
    previewNote.hidden = false;
    if (previewReset) previewReset.hidden = false;
  }

  /* 5. Muestras de color de la guía de diseño ------------------------------ */
  document.querySelectorAll('[data-swatch]').forEach(function (swatch) {
    var scope = swatch.closest('[data-palette]') || root;
    var token = swatch.getAttribute('data-swatch');
    if (!token) return;

    var value = window.getComputedStyle(scope).getPropertyValue('--' + token).trim();
    if (!value) return;

    var chip = swatch.querySelector('i');
    var code = swatch.querySelector('code');
    if (chip) chip.style.background = value;
    if (code) code.textContent = value.toUpperCase();
  });

  /* 6. Formulario de contacto --------------------------------------------- */
  var form = document.getElementById('contact-form');

  if (form) {
    var successPanel = document.getElementById('form-success');
    var formIntro = document.getElementById('form-intro');
    var statusLine = document.getElementById('form-status');
    var messageField = document.getElementById('mensaje');
    var counter = form.querySelector('[data-counter]');
    var maxLength = messageField ? Number(messageField.getAttribute('maxlength')) || 800 : 800;

    var updateCounter = function () {
      if (counter && messageField) counter.textContent = messageField.value.length + '/' + maxLength;
    };

    if (messageField) {
      updateCounter();
      messageField.addEventListener('input', updateCounter);
    }

    var rules = {
      nombre: {
        validate: function (value) {
          return value.trim().length >= 2;
        },
        message: 'Escribe tu nombre completo.'
      },
      email: {
        validate: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
        },
        message: 'Escribe un correo válido, por ejemplo nombre@dominio.cl.'
      },
      region: {
        validate: function (value) {
          return value !== '';
        },
        message: 'Selecciona tu región.'
      },
      motivo: {
        validate: function (value) {
          return value !== '';
        },
        message: 'Selecciona un motivo de contacto.'
      },
      mensaje: {
        validate: function (value) {
          return value.trim().length >= 20;
        },
        message: 'Cuéntanos un poco más: mínimo 20 caracteres.'
      },
      consent: {
        validate: function (value, input) {
          return input.checked;
        },
        message: 'Necesitamos tu autorización para responderte.'
      }
    };

    var getField = function (name) {
      return form.elements[name] || null;
    };

    var showError = function (name, show) {
      var input = getField(name);
      if (!input) return;

      var field = input.closest('.field');
      var errorEl = document.getElementById(name + '-error');

      if (field) field.classList.toggle('field--error', show);
      input.setAttribute('aria-invalid', show ? 'true' : 'false');
      if (errorEl) errorEl.textContent = show ? rules[name].message : '';
    };

    var validateField = function (name) {
      var input = getField(name);
      var rule = rules[name];
      if (!input || !rule) return true;

      var valid = rule.validate(input.value, input);
      showError(name, !valid);
      return valid;
    };

    Object.keys(rules).forEach(function (name) {
      var input = getField(name);
      if (!input) return;

      var eventName = input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'blur';
      input.addEventListener(eventName, function () {
        validateField(name);
      });

      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('field--error') && rules[name].validate(input.value, input)) {
          showError(name, false);
        }
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (statusLine) statusLine.textContent = '';

      var firstInvalid = null;

      Object.keys(rules).forEach(function (name) {
        var valid = validateField(name);
        if (!valid && !firstInvalid) firstInvalid = getField(name);
      });

      if (firstInvalid) {
        if (statusLine) statusLine.textContent = 'Revisa los campos marcados para poder enviar el mensaje.';
        firstInvalid.focus();
        return;
      }

      if (successPanel) {
        successPanel.hidden = false;
        form.hidden = true;
        if (formIntro) formIntro.hidden = true;
        successPanel.focus({ preventScroll: true });
        successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    var resetButton = document.getElementById('reset-form');
    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (successPanel) successPanel.hidden = true;
        form.hidden = false;
        if (formIntro) formIntro.hidden = false;
        form.reset();
        Object.keys(rules).forEach(function (name) {
          showError(name, false);
        });
        if (statusLine) statusLine.textContent = '';
        updateCounter();
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        var firstField = form.querySelector('input, select, textarea');
        if (firstField) firstField.focus({ preventScroll: true });
      });
    }
  }
})();
