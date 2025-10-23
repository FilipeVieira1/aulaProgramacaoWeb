// form-validate.js
// Validação client-side leve e acessível para formulários.
document.addEventListener('DOMContentLoaded', function(){
  // Função utilitária para mostrar mensagem de erro
  function showError(input, message){
    let id = input.id || input.name || Math.random().toString(36).slice(2,8);
    let errId = input.dataset.errId || (id + '-err');
    input.dataset.errId = errId;
    let el = document.getElementById(errId);
    if(!el){
      el = document.createElement('div');
      el.id = errId;
      el.className = 'form-error';
      el.setAttribute('aria-live','polite');
      input.insertAdjacentElement('afterend', el);
    }
    el.textContent = message;
    input.setAttribute('aria-describedby', errId);
    input.classList.add('invalid');
  }

  function clearError(input){
    let errId = input.dataset.errId;
    if(errId){
      let el = document.getElementById(errId);
      if(el) el.textContent = '';
    }
    input.removeAttribute('aria-describedby');
    input.classList.remove('invalid');
  }

  function validateField(field){
    clearError(field);
    if(field.disabled) return true;
    if(field.required && !field.value.trim()){
      showError(field, 'Este campo é obrigatório.');
      return false;
    }
    if(field.type === 'email' && field.value){
      // regra simples de email
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!re.test(field.value)){
        showError(field, 'Informe um email válido.');
        return false;
      }
    }
    if(field.type === 'number' && field.value){
      let v = Number(field.value);
      if(Number.isNaN(v)){
        showError(field, 'Informe um número válido.');
        return false;
      }
      if(field.min && v < Number(field.min)){
        showError(field, `Valor deve ser >= ${field.min}`);
        return false;
      }
      if(field.max && v > Number(field.max)){
        showError(field, `Valor deve ser <= ${field.max}`);
        return false;
      }
    }
    if(field.pattern && field.value){
      const re = new RegExp(field.pattern);
      if(!re.test(field.value)){
        showError(field, 'Formato inválido.');
        return false;
      }
    }
    return true;
  }

  // Aplica a validação em formulários com a classe needs-validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    // add real-time validation on inputs
    form.addEventListener('input', (e)=>{
      const target = e.target;
      if(['INPUT','TEXTAREA','SELECT'].includes(target.tagName)) validateField(target);
    });

    form.addEventListener('submit', (e)=>{
      const fields = Array.from(form.querySelectorAll('input,textarea,select'));
      let ok = true;
      fields.forEach(f => { if(!validateField(f)) ok = false; });
      if(!ok){ e.preventDefault(); e.stopPropagation();
        form.querySelectorAll('.invalid')[0]?.focus();
      }
    });
  });
});

/* pequenas classes de estilo para mensagens */
/* deixe o CSS em styles.css se preferir customizar */
