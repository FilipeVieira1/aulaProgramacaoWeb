// donor.js - funcionalidades para doadores: ver projetos, doar, histórico e relatório
(function(){
  const KEY_PROJECTS = 'mq_projects';
  const KEY_DONATIONS = 'mq_donations';
  // use shared mq utils
  const read = k => window.mq && window.mq.read ? window.mq.read(k) : JSON.parse(localStorage.getItem(k) || '[]');
  const write = (k,v) => window.mq && window.mq.write ? window.mq.write(k,v) : localStorage.setItem(k, JSON.stringify(v));

  function init(){
    renderProjectsImpact();
    populateProjectSelect();
    renderDonorHistory();
    const form = $('donor-form'); if(form) form.addEventListener('submit', handleDonate);
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
  div.innerHTML = `<h3>${window.mq ? window.mq.escapeHtml(p.title) : (p.title||'')}</h3><p>${window.mq ? window.mq.escapeHtml(p.desc) : (p.desc||'')}</p><p>Meta: ${window.mq ? window.mq.formatCurrency(p.target) : Number(p.target||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} — Arrecadado: ${total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} — Despesas: ${spent.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} — Saldo: ${saldo.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</p><div style="height:10px;background:#eee;border-radius:6px;overflow:hidden"><div style="width:${percent}%;height:10px;background:#2b6cb0"></div></div><p>${percent}%</p>`;
      container.appendChild(div);
    });
  }

  function populateProjectSelect(){ const sel = $('donor-project'); if(!sel) return; sel.innerHTML = '<option value="">-- nenhum --</option>'; read(KEY_PROJECTS).forEach(p=>{ const o=document.createElement('option'); o.value=p.id; o.textContent=p.title; sel.appendChild(o); }); }

  function handleDonate(e){
    e.preventDefault();
  const name = $('donor-name').value.trim();
  const email = $('donor-email').value.trim();
  const amount = parseFloat($('donor-amount').value) || 0;
  const projectId = $('donor-project').value || '';
    if(!name || amount<=0){ alert('Nome e valor são obrigatórios.'); return; }
    // criar doação pendente em sessionStorage e redirecionar para simulação de pagamento
    const pending = { id: Date.now().toString(), name, email, amount, projectId, when: Date.now() };
    sessionStorage.setItem('mq_pending_donation', JSON.stringify(pending));
    // redirecionar para página de pagamento simulado
    window.location.href = 'payment-sim.html';
  }

  function renderDonorHistory(){ const container = $('donor-history-list'); if(!container) return; const donations = read(KEY_DONATIONS); if(donations.length===0){ container.innerHTML='<p>Nenhuma doação registrada.</p>'; return; } container.innerHTML=''; donations.forEach(d=>{ const div=document.createElement('div'); div.className='section-card'; div.innerHTML=`<strong>${escapeHtml(d.name)}</strong> — ${escapeHtml(d.email||'')} — ${Number(d.amount).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} <div style="font-size:0.9rem;color:#666">${new Date(d.when).toLocaleString()}</div>`; container.appendChild(div); }); }

  function downloadReport(){ const donations = read(KEY_DONATIONS); const projects = read(KEY_PROJECTS); const payload = { exportedAt: new Date().toISOString(), projects, donations };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `mq_report_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  // use window.mq.escapeHtml from mq-utils.js
  document.addEventListener('DOMContentLoaded', init);
})();
