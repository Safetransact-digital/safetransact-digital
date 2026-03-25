(() => {
  const currentYearNodes = document.querySelectorAll('[data-current-year]');
  const currentYear = new Date().getFullYear();

  currentYearNodes.forEach((node) => {
    node.textContent = String(currentYear);
  });

  const cookiePanel = document.getElementById('cookiePanel');
  const cookieReopen = document.getElementById('cookieReopen');
  const cookieAcknowledge = document.getElementById('cookieAcknowledge');
  const cookieMinimize = document.getElementById('cookieMinimize');
  const cookieStorageKey = 'safetransact_cookie_notice_state';

  if (!cookiePanel || !cookieReopen || !cookieAcknowledge || !cookieMinimize) {
    return;
  }

  function readCookieNoticeState() {
    try {
      return window.localStorage.getItem(cookieStorageKey);
    } catch (error) {
      return null;
    }
  }

  function writeCookieNoticeState(value) {
    try {
      window.localStorage.setItem(cookieStorageKey, value);
    } catch (error) {
      // Ignore storage failures and keep the banner usable.
    }
  }

  function showCookiePanel() {
    cookiePanel.hidden = false;
    cookieReopen.hidden = true;
  }

  function minimizeCookiePanel(persist) {
    cookiePanel.hidden = true;
    cookieReopen.hidden = false;
    if (persist) writeCookieNoticeState('minimized');
  }

  if (readCookieNoticeState() === 'minimized') {
    minimizeCookiePanel(false);
  } else {
    showCookiePanel();
  }

  cookieAcknowledge.addEventListener('click', () => minimizeCookiePanel(true));
  cookieMinimize.addEventListener('click', () => minimizeCookiePanel(true));
  cookieReopen.addEventListener('click', () => {
    showCookiePanel();
    writeCookieNoticeState('open');
  });
})();
