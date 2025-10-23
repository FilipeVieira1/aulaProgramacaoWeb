// auth.js - autenticação simples no front-end (apenas para protótipo)
(function(){
  const AUTH_KEY = 'mq_admin_auth';
  // ALTERE esta senha para algo que você prefira (este método NÃO é seguro para produção)
  const ADMIN_PASS = 'maos2025';

  window.isAuthenticated = function(){
    return sessionStorage.getItem(AUTH_KEY) === '1';
  };

  window.requireAuth = function(){
    if(!window.isAuthenticated()){
      window.location.href = 'admin-login.html';
    }
  };

  window.login = function(password){
    if(password === ADMIN_PASS){
      sessionStorage.setItem(AUTH_KEY, '1');
      return true;
    }
    return false;
  };

  window.logout = function(){
    sessionStorage.removeItem(AUTH_KEY);
    // redireciona para a tela de login
    window.location.href = 'admin-login.html';
  };
})();