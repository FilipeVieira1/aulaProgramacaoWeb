// menu.js - controle simples do menu hamburger
document.addEventListener('DOMContentLoaded', function(){
  const btns = document.querySelectorAll('.hamburger');
  btns.forEach(btn => {
    btn.addEventListener('click', function(){
      const target = this.getAttribute('data-target');
      const el = document.querySelector(target);
      if(!el) return;
      if(el.classList.contains('nav-expanded')){ el.classList.remove('nav-expanded'); el.classList.add('nav-collapsed'); this.setAttribute('aria-expanded','false'); }
      else { el.classList.remove('nav-collapsed'); el.classList.add('nav-expanded'); this.setAttribute('aria-expanded','true'); }
    });
  });
});
