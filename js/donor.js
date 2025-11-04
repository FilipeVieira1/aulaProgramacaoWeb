// donor.js - funcionalidades para doadores: ver projetos, doar, histórico e relatório
(function(){
  const KEY_PROJECTS = 'mq_projects';
  const KEY_DONATIONS = 'mq_donations';
  // use shared mq utils
  const read = k => window.mq && window.mq.read ? window.mq.read(k) : JSON.parse(localStorage.getItem(k) || '[]');
  const write = (k,v) => window.mq && window.mq.write ? window.mq.write(k,v) : localStorage.setItem(k, JSON.stringify(v));

  /* Modal utilitário local (usa modal se existir, senão fallback para alert/confirm/prompt) */
  function _mq_getModalElements(){
    return {
      root: document.getElementById('mq-modal'),
      title: document.getElementById('mq-modal-title'),
      body: document.getElementById('mq-modal-body'),
      ok: document.getElementById('mq-modal-ok'),
      cancel: document.getElementById('mq-modal-cancel'),
      overlay: document.querySelector('.mq-modal-overlay')
    };
  }

  function showAlert(message, title){
    const el = _mq_getModalElements();
    if(!el.root) { alert(message); return Promise.resolve(); }
    return new Promise(resolve => {
      el.title.textContent = title || 'Aviso'; el.body.textContent = message; el.cancel.style.display='none'; el.ok.textContent='OK'; el.root.setAttribute('aria-hidden','false');
      function close(){ el.root.setAttribute('aria-hidden','true'); el.ok.removeEventListener('click',ok); el.overlay.removeEventListener('click',close); resolve(); }
      function ok(){ close(); }
      el.ok.addEventListener('click',ok);
      el.overlay.addEventListener('click',close);
    });
  }

  function showConfirm(message, title){
    const el = _mq_getModalElements();
    if(!el.root) return Promise.resolve(confirm(message));
    return new Promise(resolve => {
      el.title.textContent = title || 'Confirmação'; el.body.textContent = message; el.cancel.style.display=''; el.ok.textContent='Confirmar'; el.root.setAttribute('aria-hidden','false');
      function cleanup(){ el.root.setAttribute('aria-hidden','true'); el.ok.removeEventListener('click',ok); el.cancel.removeEventListener('click',cancel); el.overlay.removeEventListener('click',cancel); }
      function ok(){ cleanup(); resolve(true); }
      function cancel(){ cleanup(); resolve(false); }
      el.ok.addEventListener('click',ok); el.cancel.addEventListener('click',cancel); el.overlay.addEventListener('click',cancel);
    });
  }

  function showPrompt(message, defaultValue){
    const el = _mq_getModalElements();
    if(!el.root) return Promise.resolve(prompt(message, defaultValue));
    // fallback to window.prompt if modal not implemented for input
    return Promise.resolve(prompt(message, defaultValue));
  }

  function init(){
    renderProjectsImpact();
    populateProjectSelect();
    renderDonorHistory();
  const form = document.getElementById('donation-form') || document.getElementById('donor-form');
  if(form) form.addEventListener('submit', handleDonate);
    const dl = $('download-report'); if(dl) dl.addEventListener('click', downloadReport);
  }

  function renderProjectsImpact(){
    const projects = read(KEY_PROJECTS); const donations = read(KEY_DONATIONS);
    const expenses = JSON.parse(localStorage.getItem('mq_expenses') || '[]');
    const container = $('projects-impact-list'); if(!container) return;
    container.innerHTML='';
    if(projects.length===0) { container.innerHTML='<p>Sem projetos cadastrados.</p>'; return; }
    projects.forEach(p=>{
      const total = donations.filter(d=>d.projectId===p.id).reduce((s,d)=>s + (Number(d.amount)||0),0);
      const spent = expenses.filter(x=>x.projectId===p.id).reduce((s,e)=>s + (Number(e.amount)||0),0);
      const percent = p.target ? Math.min(100, Math.round((total / p.target) * 100)) : 0;
      const saldo = total - spent;
  const div = document.createElement('div'); div.className='section-card';
  div.innerHTML = `<h3>${window.mq ? window.mq.escapeHtml(p.title) : (p.title||'')}</h3><p>${window.mq ? window.mq.escapeHtml(p.description || p.desc) : (p.description||p.desc||'')}</p><p>Meta: ${window.mq ? window.mq.formatCurrency(p.target) : Number(p.target||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} — Arrecadado: ${total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} — Despesas: ${spent.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} — Saldo: ${saldo.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</p><div style="height:10px;background:#eee;border-radius:6px;overflow:hidden"><div style="width:${percent}%;height:10px;background:#2b6cb0"></div></div><p>${percent}%</p>`;
      container.appendChild(div);
    });
  }

  function populateProjectSelect(){
    const sel = document.getElementById('project-select') || $('donor-project');
    if(!sel) return;
    sel.innerHTML = '<option value="">-- selecione --</option>';
    read(KEY_PROJECTS).forEach(p=>{ const o=document.createElement('option'); o.value=p.id; o.textContent=p.title; sel.appendChild(o); });
  }

  async function handleDonate(e) {
  e.preventDefault();
  const nameEl = document.getElementById('donor-name');
  const emailEl = document.getElementById('donor-email');
  const amountEl = document.getElementById('amount') || document.getElementById('donor-amount');
  const projectEl = document.getElementById('project-select') || document.getElementById('donor-project');
  if(!nameEl || !amountEl || !projectEl) { await showAlert('Formulário inválido'); return; }

  const name = nameEl.value.trim();
  const email = emailEl ? emailEl.value.trim() : '';
  const amount = parseFloat(amountEl.value) || 0;
  const projectId = projectEl.value || '';

  if (!name || amount <= 0) { await showAlert('Nome e valor são obrigatórios.'); return; }

  const donation = {
    id: Date.now().toString(),
    name,
    email,
    amount,
    projectId,
    createdAt: new Date().toISOString()
  };

  // Salvar no localStorage
  const donations = read(KEY_DONATIONS);
  donations.unshift(donation);
  write(KEY_DONATIONS, donations);

  // Feedback e atualização
  if(formResetable(e.target)) e.target.reset();
  await showAlert('Doação registrada com sucesso (simulação). Obrigado!', 'Pronto');
  renderDonorHistory();
}

  function formResetable(form){ try{ if(form && typeof form.reset === 'function') return true; }catch(e){} return false; }

  function renderDonorHistory(){
    const container = document.getElementById('donation-history') || $('donor-history-list');
    if(!container) return;
    const donations = read(KEY_DONATIONS);
    if(donations.length===0){ container.innerHTML='<p>Nenhuma doação registrada.</p>'; return; }
    container.innerHTML='';
    donations.forEach(d=>{
      const div=document.createElement('div'); div.className='section-card';
      div.innerHTML = `<strong>${window.mq ? window.mq.escapeHtml(d.name) : (d.name||'')}</strong> — ${window.mq ? window.mq.escapeHtml(d.email||'') : (d.email||'')} — ${Number(d.amount).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} <div style="font-size:0.9rem;color:#666">${new Date(d.createdAt || d.when).toLocaleString()}</div>`;
      container.appendChild(div);
    });
  }

  function downloadReport(){ const donations = read(KEY_DONATIONS); const projects = read(KEY_PROJECTS); const payload = { exportedAt: new Date().toISOString(), projects, donations };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `mq_report_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  // use window.mq.escapeHtml from mq-utils.js
  document.addEventListener('DOMContentLoaded', init);
})();
