// admin.js - CRUD simples para projetos, doações e despesas
(function(){
  const KEY_PROJECTS = 'mq_projects';
  const KEY_DONATIONS = 'mq_donations';
  const KEY_EXPENSES = 'mq_expenses';

  const read = k => window.mq && window.mq.read ? window.mq.read(k) : JSON.parse(localStorage.getItem(k) || '[]');
  const write = (k,v) => window.mq && window.mq.write ? window.mq.write(k,v) : localStorage.setItem(k, JSON.stringify(v));

  function init(){ renderProjects(); renderDonations(); renderExpenses(); const expForm = $('expense-form'); if(expForm) expForm.addEventListener('submit', e=>{ e.preventDefault(); saveExpense(); }); const exportBtn = $('export-btn'); if(exportBtn) exportBtn.addEventListener('click', exportData); const imp = $('import-file'); if(imp) imp.addEventListener('change', importData);
  }

  function renderProjects(){ const container = $('projects-list'); if(!container) return; const projects = read(KEY_PROJECTS); container.innerHTML=''; if(projects.length===0){ container.innerHTML='<p>Nenhum projeto cadastrado.</p>'; return; } projects.forEach(p=>{ const div=document.createElement('div'); div.className='section-card'; div.innerHTML=`<strong>${window.mq ? window.mq.escapeHtml(p.title) : p.title}</strong><p>${window.mq ? window.mq.escapeHtml(p.desc) : p.desc}</p><div>Meta: ${window.mq ? window.mq.formatCurrency(p.target) : p.target}</div>`; container.appendChild(div); }); }

  function renderDonations(){ const container = $('donations-list'); if(!container) return; const donations = read(KEY_DONATIONS); container.innerHTML=''; if(donations.length===0){ container.innerHTML='<p>Sem doações registradas.</p>'; return; } donations.forEach(d=>{ const div=document.createElement('div'); div.className='section-card'; div.innerHTML=`<strong>${window.mq ? window.mq.escapeHtml(d.name) : d.name}</strong> — ${window.mq ? window.mq.formatCurrency(d.amount) : d.amount}`; container.appendChild(div); }); }

  function renderExpenses(){ const container = $('expenses-list'); if(!container) return; const expenses = read(KEY_EXPENSES); container.innerHTML=''; if(expenses.length===0){ container.innerHTML='<p>Sem despesas lançadas.</p>'; return; } expenses.forEach(x=>{ const div=document.createElement('div'); div.className='section-card'; div.innerHTML=`<strong>${window.mq ? window.mq.escapeHtml(x.title) : x.title}</strong> — ${window.mq ? window.mq.formatCurrency(x.amount) : x.amount}`; container.appendChild(div); }); }

  function saveExpense(){ const title = $('expense-title').value.trim(); const amount = parseFloat($('expense-amount').value) || 0; const projectId = $('expense-project').value || ''; if(!title || amount<=0){ alert('Título e valor são obrigatórios'); return; } const expenses = read(KEY_EXPENSES); expenses.unshift({id:Date.now().toString(), title, amount, projectId, when: Date.now()}); write(KEY_EXPENSES, expenses); renderExpenses(); }

  function exportData(){ const payload = { projects: read(KEY_PROJECTS), donations: read(KEY_DONATIONS), expenses: read(KEY_EXPENSES), exportedAt: new Date().toISOString() }; const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='mq_export_'+new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')+'.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

  function importData(e){ const f = e.target.files && e.target.files[0]; if(!f) return; const reader = new FileReader(); reader.onload = function(){ try{ const data = JSON.parse(reader.result); if(data.projects) write(KEY_PROJECTS, data.projects); if(data.donations) write(KEY_DONATIONS, data.donations); if(data.expenses) write(KEY_EXPENSES, data.expenses); alert('Importação concluída'); renderProjects(); renderDonations(); renderExpenses(); }catch(err){ alert('Arquivo inválido'); } }; reader.readAsText(f); }

  document.addEventListener('DOMContentLoaded', init);
})();
