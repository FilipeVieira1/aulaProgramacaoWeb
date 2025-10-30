// form-validate.js - validação acessível e verificações de consistência
(function(){
  function showMessage(el, msg, type='error'){
    if(!el) return;
    let id = el.id ? el.id + '-msg' : 'msg-' + Math.random().toString(36).slice(2,8);
    let existing = document.getElementById(id);
    if(existing) existing.remove();
    const div = document.createElement('div'); div.id=id; div.className = type==='error' ? 'form-error' : 'form-warning'; div.setAttribute('aria-live','polite'); div.textContent = msg;
    el.classList.add(type==='error' ? 'invalid' : 'warning');
    el.parentNode && el.parentNode.insertBefore(div, el.nextSibling);
  }

  function clearMessages(form){ if(!form) return; form.querySelectorAll('.form-error,.form-warning').forEach(n=>n.remove()); form.querySelectorAll('.invalid,.warning').forEach(n=>n.classList.remove('invalid','warning')); }

  function validateRequired(form){ let ok=true; form.querySelectorAll('[required]').forEach(inp=>{ if(!inp.value || inp.value.trim()===''){ showMessage(inp,'Campo obrigatório', 'error'); ok=false; } }); return ok; }

  document.addEventListener('submit', function(e){ const form = e.target; if(!(form instanceof HTMLFormElement)) return; clearMessages(form); if(!validateRequired(form)){ e.preventDefault(); return; } });
})();
