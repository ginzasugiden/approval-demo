const tabButtons = document.querySelectorAll('.tab-btn');
const allScreens = document.querySelectorAll('.screen, .desktop-screen');

function updateFlowUI() {
  const result = document.body.dataset.flowResult || '';

  document.querySelectorAll('.result-card[data-variant]').forEach((card) => {
    const isMatch = card.dataset.variant === result;
    card.classList.toggle('is-active', Boolean(result) && isMatch);
    card.classList.toggle('is-dimmed', Boolean(result) && !isMatch);
  });

  const bannerText = {
    back: '今回は「差戻し」が選択されました。申請者に修正依頼が通知されます。',
    reject: '今回は「却下」が選択されました。申請者に却下結果が通知されます。',
  };

  document.querySelectorAll('[data-result-banner]').forEach((banner) => {
    if (bannerText[result]) {
      banner.hidden = false;
      banner.textContent = bannerText[result];
      banner.className = `result-banner show ${result}`;
    } else {
      banner.hidden = true;
      banner.textContent = '';
      banner.className = 'result-banner';
    }
  });
}

function switchScreen(name) {
  tabButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.screen === name);
  });

  allScreens.forEach((screen) => {
    screen.classList.toggle('active', screen.dataset.screen === name);
  });

  updateFlowUI();
}

// タブバー：自由に画面を選んで見るモード。選択結果の文脈はリセットする。
tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    delete document.body.dataset.flowResult;
    switchScreen(btn.dataset.screen);
  });
});

// 画面内のボタン・カード：実際の操作の流れに沿って遷移するストーリーモード。
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-next]');
  if (!trigger) return;

  if (trigger.dataset.result) {
    document.body.dataset.flowResult = trigger.dataset.result;
  }

  switchScreen(trigger.dataset.next);
});

updateFlowUI();
