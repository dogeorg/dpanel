// For multi page apps.
document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const path = this.getAttribute('href');
      window.parent.postMessage({ path: path }, '*');
      
      // Now navigate to the link's href
      window.location.href = path;
    });
  });
});