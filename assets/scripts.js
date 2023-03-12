const projects = document.querySelectorAll('.project') 
const toggle = document.getElementById('theme-switcher')
const storedTheme =
  localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
if (storedTheme) document.documentElement.setAttribute('data-theme', storedTheme)

toggle.addEventListener('click', function() {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const targetTheme = currentTheme === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', targetTheme)
  localStorage.setItem('theme', targetTheme)
})


const clickProject = function(e) {
  window.location.href = e.currentTarget.getElementsByTagName('a')[0].getAttribute('href')
};

projects.forEach(function(project) {
  project.addEventListener('click', clickProject)
})

// Animate on reveal
// const revealSections = (function() {
//   const init = function() {
//     createObserver();
//   };

//   const createObserver = function() {
//     let options = {
//       root: null,
//       rootMargin: '100px',
//       threshold: 0.5
//     };

//     let observer = new IntersectionObserver(
//       function(entries, observer) {
//           handleIntersect(entries, observer); 
//         }, 
//       options);
    
//     let targetElements = document.querySelectorAll('.section');

//     targetElements.forEach((targetElement) => {
//       observer.observe(targetElement);
//     });
//   };

//   const handleIntersect = function(entries, observer) {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add('anim');
//         observer.unobserve(entry.target);
//       }
//     });
//   };

//   return {
//     init: init
//   };
// })();

// revealSections.init();