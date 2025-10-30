// admin.js - CRUD simples para projetos, doações e despesas
(function(){
  const KEY_PROJECTS = 'mq_projects';
  const KEY_DONATIONS = 'mq_donations';
  const KEY_EXPENSES = 'mq_expenses';

  const read = k => window.mq && window.mq.read ? window.mq.read(k) : JSON.parse(localStorage.getItem(k) || '[]');
  const write = (k,v) => window.mq && window.mq.write ? window.mq.write(k,v) : localStorage.setItem(k, JSON.stringify(v));

  function init(){ renderProjects(); renderDonations(); renderExpenses(); const expForm = $('expense-form'); if(expForm) expForm.addEventListener('submit', e=>{ e.preventDefault(); saveExpense(); }); const exportBtn = $('export-btn'); if(exportBtn) exportBtn.addEventListener('click', exportData); const imp = $('import-file'); if(imp) imp.addEventListener('change', importData);
  }

  function renderProjects() {
    const container = $('projects-list');
    if (!container) return;
    
    const projects = read(KEY_PROJECTS);
    if (projects.length === 0) {
        container.innerHTML = '<p>Nenhum projeto cadastrado.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Data</th>
                <th>Título</th>
                <th>Descrição</th>
                <th>Meta</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    projects.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(p.when || Date.now()).toLocaleDateString()}</td>
            <td>${window.mq.escapeHtml(p.title)}</td>
            <td>${window.mq.escapeHtml(p.desc)}</td>
            <td>${window.mq.formatCurrency(p.target)}</td>
            <td>${p.status || 'Ativo'}</td>
        `;
        tbody.appendChild(row);
    });

    container.innerHTML = '';
    container.appendChild(table);
}

  function renderDonations() {
    const container = $('donations-list');
    if (!container) return;
    
    const donations = read(KEY_DONATIONS);
    if (donations.length === 0) {
        container.innerHTML = '<p>Sem doações registradas.</p>';
        return;
    }

    // Atualiza os totais
    updateDonationTotals(donations);

    const table = document.createElement('table');
    table.className = 'table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Data</th>
                <th>Projeto</th>
                <th>Doador</th>
                <th>Email</th>
                <th>Valor</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    const projects = read(KEY_PROJECTS);

    donations.forEach(d => {
        const project = projects.find(p => p.id === d.projectId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(d.when).toLocaleDateString()}</td>
            <td>${project ? window.mq.escapeHtml(project.title) : 'Projeto não encontrado'}</td>
            <td>${window.mq.escapeHtml(d.name)}</td>
            <td>${window.mq.escapeHtml(d.email || '-')}</td>
            <td>${window.mq.formatCurrency(d.amount)}</td>
        `;
        tbody.appendChild(row);
    });

    container.innerHTML = '';
    container.appendChild(table);
}

function updateDonationTotals(donations) {
    const totalEl = $('total-donations');
    const monthEl = $('month-donations');
    if (!totalEl || !monthEl) return;

    // Total geral
    const total = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    totalEl.textContent = window.mq.formatCurrency(total);

    // Total do mês atual
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthTotal = donations
        .filter(d => new Date(d.when) >= firstDayOfMonth)
        .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    monthEl.textContent = window.mq.formatCurrency(monthTotal);
}

  function renderExpenses(){ const container = $('expenses-list'); if(!container) return; const expenses = read(KEY_EXPENSES); container.innerHTML=''; if(expenses.length===0){ container.innerHTML='<p>Sem despesas lançadas.</p>'; return; } expenses.forEach(x=>{ const div=document.createElement('div'); div.className='section-card'; div.innerHTML=`<strong>${window.mq ? window.mq.escapeHtml(x.title) : x.title}</strong> — ${window.mq ? window.mq.formatCurrency(x.amount) : x.amount}`; container.appendChild(div); }); }

  function saveExpense(){ const title = $('expense-title').value.trim(); const amount = parseFloat($('expense-amount').value) || 0; const projectId = $('expense-project').value || ''; if(!title || amount<=0){ alert('Título e valor são obrigatórios'); return; } const expenses = read(KEY_EXPENSES); expenses.unshift({id:Date.now().toString(), title, amount, projectId, when: Date.now()}); write(KEY_EXPENSES, expenses); renderExpenses(); }

  function exportData(){ const payload = { projects: read(KEY_PROJECTS), donations: read(KEY_DONATIONS), expenses: read(KEY_EXPENSES), exportedAt: new Date().toISOString() }; const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='mq_export_'+new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')+'.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

  function importData(e){ const f = e.target.files && e.target.files[0]; if(!f) return; const reader = new FileReader(); reader.onload = function(){ try{ const data = JSON.parse(reader.result); if(data.projects) write(KEY_PROJECTS, data.projects); if(data.donations) write(KEY_DONATIONS, data.donations); if(data.expenses) write(KEY_EXPENSES, data.expenses); alert('Importação concluída'); renderProjects(); renderDonations(); renderExpenses(); }catch(err){ alert('Arquivo inválido'); } }; reader.readAsText(f); }

  document.addEventListener('DOMContentLoaded', init);
})();
