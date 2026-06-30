function renderAppQr() {
  var containers = document.querySelectorAll('[data-app-qr]');
  if (!containers.length) return;

  var appUrl = new URL('app.html', window.location.href).href;

  containers.forEach(function (el) {
    var linkEl = el.querySelector('[data-app-qr-link]');
    if (linkEl) {
      linkEl.textContent = appUrl;
      linkEl.href = appUrl;
    }

    var canvasWrap = el.querySelector('[data-app-qr-canvas]');
    var fallback = el.querySelector('[data-app-qr-fallback]');

    if (!window.__qrcodeLoadFailed && typeof qrcode === 'function' && canvasWrap) {
      try {
        var qr = qrcode(0, 'M');
        qr.addData(appUrl);
        qr.make();
        canvasWrap.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2 });
        canvasWrap.hidden = false;
        if (fallback) fallback.hidden = true;
        return;
      } catch (e) {
        // 生成に失敗した場合はフォールバック表示へ
      }
    }

    if (canvasWrap) canvasWrap.hidden = true;
    if (fallback) fallback.hidden = false;
  });
}

window.__qrcodeLoadDone = renderAppQr;

// CDNの読み込みが遅延・失敗した場合の保険（onerrorが発火しないケースに対応）
setTimeout(function () {
  if (typeof qrcode !== 'function') {
    window.__qrcodeLoadFailed = true;
  }
  renderAppQr();
}, 3000);

document.addEventListener('DOMContentLoaded', function () {
  if (typeof qrcode === 'function') {
    renderAppQr();
  }
});

document.addEventListener('click', function (event) {
  var btn = event.target.closest('[data-copy-link]');
  if (!btn) return;

  var appUrl = new URL('app.html', window.location.href).href;
  if (!navigator.clipboard || !navigator.clipboard.writeText) return;

  navigator.clipboard.writeText(appUrl).then(function () {
    var original = btn.textContent;
    btn.textContent = 'コピーしました';
    setTimeout(function () {
      btn.textContent = original;
    }, 1800);
  }).catch(function () {});
});
