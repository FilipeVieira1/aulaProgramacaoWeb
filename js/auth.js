// auth.js - mecanismo de autenticação simples no front-end (protótipo)
(function(){
  const KEY_ADMIN = 'mq_admin_auth';

  function login(user, pass){ const ok = (user==='admin' && pass==='senha'); if(ok) localStorage.setItem(KEY_ADMIN, JSON.stringify({user, when:Date.now()})); return ok; }
  function logout(){ localStorage.removeItem(KEY_ADMIN); }
  function isLogged(){ return !!localStorage.getItem(KEY_ADMIN); }

  document.addEventListener('DOMContentLoaded', ()=>{
    const form = $('admin-login-form'); if(form) form.addEventListener('submit', e=>{ e.preventDefault(); const user = $('admin-user').value.trim(); const pass = $('admin-pass').value; if(login(user,pass)){ window.location.href = 'admin.html'; } else alert('Credenciais inválidas'); });
  });

  window.mq = window.mq || {};
  window.mq.auth = { login, logout, isLogged };
})();
