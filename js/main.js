const tabButtons = document.querySelectorAll('.tab-btn');
const allScreens = document.querySelectorAll('.screen, .desktop-screen');

const DOC_DEFAULT_TYPE = 'travel';
const DOC_DEFAULT_NAME = '出張申請書';

function applyDocSelection(docType, docName) {
  document.body.dataset.docType = docType;
  document.querySelectorAll('[data-doc-name-target]').forEach((el) => {
    el.textContent = docName;
  });
  document.querySelectorAll('[data-doc-subject-target]').forEach((el) => {
    el.textContent = `${docName}の提出について`;
  });
}

function updateKessaiDynamic() {
  const stage = document.body.dataset.flowStage || 'chief';
  const result = document.body.dataset.flowResult || '';

  document.querySelectorAll('[data-kessai-dynamic]').forEach((ran) => {
    const chiefCell = ran.querySelector('[data-decision-role="chief"]');
    const headCell = ran.querySelector('[data-decision-role="head"]');
    if (!chiefCell || !headCell) return;

    [chiefCell, headCell].forEach((cell) => {
      cell.classList.remove('stamped', 'pending', 'state-reject', 'state-return');
      cell.querySelectorAll(':scope > *:not(.kessai-role-label)').forEach((el) => el.remove());
    });

    if (!result) return;

    const isHeadStage = stage === 'head';
    const decidedCell = isHeadStage ? headCell : chiefCell;
    const stateClass = result === 'reject' ? 'state-reject' : 'state-return';

    if (isHeadStage) {
      chiefCell.classList.add('stamped');
      const seal = document.createElement('div');
      seal.className = 'seal';
      seal.innerHTML = '<span class="seal-role">室長</span><span class="seal-word">承認</span><span class="seal-date">07/01</span>';
      chiefCell.appendChild(seal);
    } else {
      headCell.classList.add('pending');
      const mark = document.createElement('div');
      mark.className = 'kessai-pending-mark';
      mark.textContent = '未決';
      headCell.appendChild(mark);
    }

    decidedCell.classList.add(stateClass);
    const badge = document.createElement('div');
    badge.className = 'decision-badge';
    badge.textContent = result === 'reject' ? '却下' : '差戻';
    decidedCell.appendChild(badge);
  });
}

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

  updateKessaiDynamic();
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
    delete document.body.dataset.flowStage;
    applyDocSelection(DOC_DEFAULT_TYPE, DOC_DEFAULT_NAME);
    switchScreen(btn.dataset.screen);
  });
});

// 画面内のボタン・カード：実際の操作の流れに沿って遷移するストーリーモード。
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-next]');
  if (!trigger) return;

  if (trigger.dataset.docType) {
    applyDocSelection(trigger.dataset.docType, trigger.dataset.docName || '');
  }

  if (trigger.dataset.result) {
    document.body.dataset.flowResult = trigger.dataset.result;
  }

  if (trigger.dataset.stage) {
    document.body.dataset.flowStage = trigger.dataset.stage;
  }

  switchScreen(trigger.dataset.next);
});

applyDocSelection(DOC_DEFAULT_TYPE, DOC_DEFAULT_NAME);
updateFlowUI();
