(() => {
  function syncCurrentYear() {
    const currentYearNodes = document.querySelectorAll('[data-current-year]');
    const currentYear = new Date().getFullYear();

    currentYearNodes.forEach((node) => {
      node.textContent = String(currentYear);
    });
  }

  syncCurrentYear();
  document.addEventListener('DOMContentLoaded', syncCurrentYear);

  const cookieBanner = document.querySelector('.cookie-banner');
  const footer = document.querySelector('footer');
  const cookiePanel = document.getElementById('cookiePanel');
  const cookieReopen = document.getElementById('cookieReopen');
  const cookieAcknowledge = document.getElementById('cookieAcknowledge');
  const cookieMinimize = document.getElementById('cookieMinimize');
  const cookieStorageKey = 'safetransact_cookie_notice_state';

  if (!cookiePanel || !cookieReopen || !cookieAcknowledge || !cookieMinimize) {
    return;
  }

  let requestCookieBannerOffsetSync = () => {};

  function setCookieBannerMinimizedState(isMinimized) {
    if (!cookieBanner) {
      return;
    }

    cookieBanner.classList.toggle('is-minimized', isMinimized);
  }

  if (cookieBanner && footer) {
    let frameId = null;

    function syncCookieBannerOffset() {
      frameId = null;
      const footerRect = footer.getBoundingClientRect();
      const overlap = Math.max(0, window.innerHeight - footerRect.top);
      const baseOffset = 20;
      const extraOffset = overlap > 0 ? overlap + 12 : 0;
      cookieBanner.style.bottom = `${baseOffset + extraOffset}px`;
    }

    requestCookieBannerOffsetSync = function requestCookieBannerOffsetSyncImpl() {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(syncCookieBannerOffset);
    };

    requestCookieBannerOffsetSync();
    window.addEventListener('scroll', requestCookieBannerOffsetSync, { passive: true });
    window.addEventListener('resize', requestCookieBannerOffsetSync);
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
    setCookieBannerMinimizedState(false);
    cookiePanel.hidden = false;
    cookieReopen.hidden = true;
    requestCookieBannerOffsetSync();
  }

  function minimizeCookiePanel(persist) {
    setCookieBannerMinimizedState(true);
    cookiePanel.hidden = true;
    cookieReopen.hidden = false;
    requestCookieBannerOffsetSync();
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
