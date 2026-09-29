(function() {
  const user = getUser();
  const isLoginPage = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === './' || window.location.href.includes('github.io/titikkomacoffee/');

  if (!user && !isLoginPage) {
    window.location.href = './index.html';
    return;
  }
  if (user && isLoginPage) {
    window.location.href = './dashboard.html';
    return;
  }
})();
