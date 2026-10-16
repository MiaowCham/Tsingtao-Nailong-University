// 可调整的加载时长与无操作等待时间。
const LOADING_MS = 2800;
const IDLE_SECONDS = 5;
const OFFICIAL_URL = 'https://hx.cn';
const ring = document.querySelector('.ring-value');
let selecting = false;
let paused = false;
let deadline = 0;
let timer;
let frame;
let progressRatio = 0;
let finishing = false;

for (let i = 0; i < 42; i++) {
  const star = document.createElement('i');
  star.className = 'star';
  star.style.cssText = `left:${(i * 37.7) % 100}%;top:${(i * 23.9) % 100}%;animation-delay:-${i % 7}s`;
  document.querySelector('.stars').append(star);
}

function renderCountdown() {
  if (paused) return;
  const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  document.querySelector('#seconds').textContent = remaining;
  if (remaining === 0) {
    clearInterval(timer);
    window.location.assign(OFFICIAL_URL);
  }
}

function resetIdle() {
  if (!selecting || paused) return;
  deadline = Date.now() + IDLE_SECONDS * 1000;
  renderCountdown();
}

function showSelection(keepRingProgress = false) {
  if (selecting) return;
  selecting = true;
  cancelAnimationFrame(frame);
  if (!keepRingProgress) ring.style.strokeDashoffset = '0';
  const welcome = document.querySelector('.welcome');
  const previousTop = welcome.getBoundingClientRect().top;
  document.querySelector('#loading-view').hidden = true;
  document.querySelector('#selection-view').hidden = false;
  fitCrest();
  // 抵消内容展开造成的瞬间位移，再平滑滑入新位置。
  const offset = previousTop - welcome.getBoundingClientRect().top;
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    welcome.animate(
      [{ transform: 'translateY(' + offset + 'px)' }, { transform: 'translateY(0)' }],
      { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' }
    );
  }
  document.querySelector('#announcement').textContent = '访问入口已准备就绪，请选择平台。无操作 5 秒后进入学院官网。';
  resetIdle();
  timer = setInterval(renderCountdown, 250);
}

const start = performance.now();
function progress(now) {
  const ratio = Math.min((now - start) / LOADING_MS, 1);
  progressRatio = ratio;
  ring.style.strokeDashoffset = String(716.284 * (1 - ratio));
  if (ratio < 1) frame = requestAnimationFrame(progress);
  else showSelection();
}
frame = requestAnimationFrame(progress);
document.querySelector('#skip').addEventListener('click', () => {
  if (selecting || finishing) return;
  finishing = true;
  cancelAnimationFrame(frame);
  const from = progressRatio;
  showSelection(true);
  const finishStart = performance.now();
  const duration = 350;
  function finishProgress(now) {
    const elapsed = Math.min((now - finishStart) / duration, 1);
    // 圆环加速补完，与选项展开和整体上移同时进行。
    const eased = elapsed * elapsed * (3 - 2 * elapsed);
    progressRatio = from + (1 - from) * eased;
    ring.style.strokeDashoffset = String(716.284 * (1 - progressRatio));
    if (elapsed < 1) frame = requestAnimationFrame(finishProgress);
    else finishing = false;
  }
  frame = requestAnimationFrame(finishProgress);
});
['pointerdown', 'pointermove', 'keydown', 'scroll'].forEach(event => {
  window.addEventListener(event, resetIdle, { passive: true });
});
document.querySelector('#pause').addEventListener('click', () => {
  paused = true;
  clearInterval(timer);
  document.querySelector('#pause').style.visibility = 'hidden';
  document.querySelector('#countdown-copy').style.visibility = 'hidden';
  document.querySelector('#announcement').textContent = '自动跳转已暂停。';
});
// 从其他标签页或浏览器后台返回时，重新给予完整选择时间。
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) resetIdle();
});
window.addEventListener('pageshow', resetIdle);



// 测量非校徽内容后，将剩余高度分配给校徽；尺寸变化由 CSS 平滑过渡。
function fitCrest() {
  const main = document.querySelector('main');
  const welcome = document.querySelector('.welcome');
  const crest = document.querySelector('.crest-wrap');
  const mainStyle = getComputedStyle(main);
  const availableHeight = main.clientHeight - parseFloat(mainStyle.paddingTop) - parseFloat(mainStyle.paddingBottom);
  const availableWidth = main.clientWidth - parseFloat(mainStyle.paddingLeft) - parseFloat(mainStyle.paddingRight);
  const otherHeight = welcome.getBoundingClientRect().height - crest.getBoundingClientRect().height;
  const preferred = window.innerWidth <= 600 ? 320 : 380;
  const size = Math.max(0, Math.floor(Math.min(preferred, availableWidth, availableHeight - otherHeight - 2)));
  crest.style.setProperty('--crest-size', `${size}px`);
}
fitCrest();
window.addEventListener('resize', fitCrest);
window.visualViewport?.addEventListener('resize', fitCrest);
new ResizeObserver(fitCrest).observe(document.querySelector('footer'));
document.fonts.ready.then(fitCrest);





