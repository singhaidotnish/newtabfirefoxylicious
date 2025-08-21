// docs/settings.js
(function () {
  const LS_KEYS = {
    mode: 'ntf_bg_mode',
    color: 'ntf_bg_color',
    image: 'ntf_bg_image',
    fit: 'ntf_bg_fit',
  };

  // Helpers
  const $ = (id) => document.getElementById(id);

  function qsAllExist(ids) {
    return ids.every((id) => $(id));
  }

  // Apply background to <body>
  function applyBackground({ mode, color, image, fit }) {
    const b = document.body;
    b.style.backgroundRepeat = 'no-repeat';
    b.style.backgroundAttachment = 'fixed';
    b.style.backgroundPosition = 'center center';

    if (mode === 'image' && image) {
      b.style.backgroundImage = `url("${image}")`;
      b.style.backgroundSize = fit || 'cover';
      b.style.backgroundColor = '';
    } else {
      b.style.backgroundImage = 'none';
      b.style.backgroundSize = 'auto';
      b.style.backgroundColor = color || '#0d0d0f';
    }
  }

  // Load from localStorage and update UI
  function loadPrefs() {
    const mode = localStorage.getItem(LS_KEYS.mode) || 'color';
    const color = localStorage.getItem(LS_KEYS.color) || '#0d0d0f';
    const image = localStorage.getItem(LS_KEYS.image) || '';
    const fit = localStorage.getItem(LS_KEYS.fit) || 'cover';

    const bgMode = $('bg-mode');
    const bgColor = $('bg-color');
    const bgColorHex = $('bg-color-hex');
    const bgFit = $('bg-fit');
    const colorRow = $('color-row');
    const imageRow = $('image-row');

    if (bgMode) bgMode.value = mode;
    if (bgColor) bgColor.value = color;
    if (bgColorHex) bgColorHex.value = color;
    if (bgFit) bgFit.value = fit;
    if (colorRow) colorRow.style.display = mode === 'color' ? 'flex' : 'none';
    if (imageRow) imageRow.style.display = mode === 'image' ? 'flex' : 'none';

    applyBackground({ mode, color, image, fit });
  }

  function savePrefs(opts) {
    if ('mode' in opts) localStorage.setItem(LS_KEYS.mode, opts.mode);
    if ('color' in opts) localStorage.setItem(LS_KEYS.color, opts.color);
    if ('image' in opts) localStorage.setItem(LS_KEYS.image, opts.image || '');
    if ('fit' in opts) localStorage.setItem(LS_KEYS.fit, opts.fit);
  }

  async function fileToDataURL(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
  }

  function addEvents() {
    // If the HTML for the panel isn’t present, bail out quietly
    const required = [
      'settings-btn', 'settings-panel', 'settings-close', 'settings-save',
      'settings-reset', 'bg-mode', 'bg-color', 'bg-color-hex',
      'bg-image-file', 'bg-fit', 'color-row', 'image-row'
    ];
    if (!qsAllExist(required)) {
      // Still apply whatever background is stored
      loadPrefs();
      return;
    }

    const btn = $('settings-btn');
    const panel = $('settings-panel');
    const closeBtn = $('settings-close');
    const saveBtn = $('settings-save');
    const resetBtn = $('settings-reset');
    const bgMode = $('bg-mode');
    const bgColor = $('bg-color');
    const bgColorHex = $('bg-color-hex');
    const bgImageFile = $('bg-image-file');
    const bgFit = $('bg-fit');
    const colorRow = $('color-row');
    const imageRow = $('image-row');

    btn.addEventListener('click', () => (panel.hidden = false));
    closeBtn.addEventListener('click', () => (panel.hidden = true));
    panel.addEventListener('click', (e) => {
      if (e.target === panel) panel.hidden = true; // click outside
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') panel.hidden = true;
    });

    bgMode.addEventListener('change', () => {
      colorRow.style.display = bgMode.value === 'color' ? 'flex' : 'none';
      imageRow.style.display = bgMode.value === 'image' ? 'flex' : 'none';
    });

    bgColor.addEventListener('input', () => {
      bgColorHex.value = bgColor.value;
    });

    bgColorHex.addEventListener('input', () => {
      const v = bgColorHex.value.trim();
      if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) bgColor.value = v;
    });

    saveBtn.addEventListener('click', async () => {
      const mode = bgMode.value;
      const fit = bgFit.value;
      let color = bgColor.value;
      let image = localStorage.getItem(LS_KEYS.image) || '';

      if (mode === 'image' && bgImageFile.files && bgImageFile.files[0]) {
        try {
          image = await fileToDataURL(bgImageFile.files[0]);
        } catch (_) {}
      }

      savePrefs({ mode, color, image, fit });
      applyBackground({ mode, color, image, fit });
      panel.hidden = true;
    });

    resetBtn.addEventListener('click', () => {
      localStorage.removeItem(LS_KEYS.mode);
      localStorage.removeItem(LS_KEYS.color);
      localStorage.removeItem(LS_KEYS.image);
      localStorage.removeItem(LS_KEYS.fit);
      loadPrefs();
    });

    // Initial load
    loadPrefs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addEvents);
  } else {
    addEvents();
  }
})();
