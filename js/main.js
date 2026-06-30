const tabButtons = document.querySelectorAll('.tab-btn');
const allScreens = document.querySelectorAll('.screen, .desktop-screen');

function switchScreen(name) {
  tabButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.screen === name);
  });

  allScreens.forEach((screen) => {
    screen.classList.toggle('active', screen.dataset.screen === name);
  });
}

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    switchScreen(btn.dataset.screen);
  });
});
