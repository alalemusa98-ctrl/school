// Navigation helper between pages
function goTo(page) {
  console.log('الذهاب إلى صفحة:', page);
  if (page === 'homework') {
    window.location.href = 'homework.html';
  } else if (page === 'home' || page === 'index') {
    window.location.href = 'index.html';
  } else {
    alert('سيتم فتح صفحة: ' + page);
  }
}

// Bottom Nav active state handling
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item').forEach(item => {
    const pageAttr = item.getAttribute('data-page');
    if (currentPath.includes('homework.html') && pageAttr === 'homework') {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    } else if ((currentPath.includes('index.html') || currentPath.endsWith('/')) && pageAttr === 'home') {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    }
  });
});