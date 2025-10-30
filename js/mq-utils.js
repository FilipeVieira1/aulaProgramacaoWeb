// mq-utils.js - funções utilitárias compartilhadas
(function(){
  // seletor rápido
  function $id(id){ return typeof id === 'string' ? document.getElementById(id) : id; }

  function read(k, fallback){
    try{ return JSON.parse(localStorage.getItem(k) || (typeof fallback !== 'undefined' ? JSON.stringify(fallback) : '[]')); }
    catch(e){ console.warn('mq-utils: erro ao ler',k,e); return typeof fallback !== 'undefined' ? fallback : []; }
  }

  function write(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){ console.warn('mq-utils: erro ao gravar',k,e);} }

  function escapeHtml(str){ if(!str && str!==0) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function formatCurrency(v){ return Number(v || 0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

  // expor globalmente (API simples)
  window.$ = $id;
  window.mq = window.mq || {};
  window.mq.read = read;
  window.mq.write = write;
  window.mq.escapeHtml = escapeHtml;
  window.mq.formatCurrency = formatCurrency;
  window.mq.utilsVersion = '1';
})();
