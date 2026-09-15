const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function closeMenu({ restoreFocus = false } = {}) {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开导航菜单');
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  mobileNav.hidden = isOpen;
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '打开导航菜单' : '关闭导航菜单');
});
mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
    const heading = document.querySelector(`${link.getAttribute('href')} h2`);
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileNav.hidden) closeMenu({ restoreFocus: true });
});
window.matchMedia('(min-width: 721px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

const copyButton = document.querySelector('.copy-email');
const copyLabel = document.querySelector('.copy-label');
const copyStatus = document.querySelector('.copy-status');
let resetCopyTimer;
copyButton.addEventListener('click', async () => {
  clearTimeout(resetCopyTimer);
  try {
    await navigator.clipboard.writeText(copyButton.dataset.email);
    copyLabel.textContent = '已复制';
    copyStatus.textContent = '邮箱已复制，可以粘贴到你的邮件应用。';
  } catch {
    copyLabel.textContent = '复制邮箱';
    copyStatus.textContent = `请手动复制：${copyButton.dataset.email}`;
  }
  resetCopyTimer = setTimeout(() => {
    copyLabel.textContent = '复制邮箱';
    copyStatus.textContent = '';
  }, 6000);
});

document.querySelector('#year').textContent = String(new Date().getFullYear());

if ('IntersectionObserver' in window) {
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
}
