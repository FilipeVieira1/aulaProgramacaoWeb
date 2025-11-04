// admin.js - CRUD simples para projetos, doações e despesas
(function(){
  const KEY_PROJECTS = 'mq_projects';
  const KEY_DONATIONS = 'mq_donations';
  const KEY_EXPENSES = 'mq_expenses';

  const read = k => window.mq && window.mq.read ? window.mq.read(k) : JSON.parse(localStorage.getItem(k) || '[]');
  const write = (k,v) => window.mq && window.mq.write ? window.mq.write(k,v) : localStorage.setItem(k, JSON.stringify(v));

    function init(){
        renderProjects();
        renderDonations();
        renderExpenses();

        // project form (admin)
        const projForm = $('admin-project-form');
        if(projForm) projForm.addEventListener('submit', e=>{ e.preventDefault(); saveProject(); });

        const expForm = $('expense-form');
        if(expForm) expForm.addEventListener('submit', e=>{ e.preventDefault(); saveExpense(); });

        const exportBtn = $('export-btn'); if(exportBtn) exportBtn.addEventListener('click', exportData);
        const imp = $('import-file'); if(imp) imp.addEventListener('change', importData);
        const clearBtn = $('clear-test-btn'); if(clearBtn) clearBtn.addEventListener('click', clearTestData);
        const genBtn = $('generate-sample-btn'); if(genBtn) genBtn.addEventListener('click', generateSampleData);
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
            <td>${new Date(p.createdAt || p.when || Date.now()).toLocaleDateString()}</td>
            <td>${window.mq.escapeHtml(p.title)}</td>
            <td>${window.mq.escapeHtml(p.description || p.desc || '')}</td>
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
            <td>${new Date(d.createdAt || d.when).toLocaleDateString()}</td>
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
        .filter(d => new Date(d.createdAt || d.when) >= firstDayOfMonth)
        .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    monthEl.textContent = window.mq.formatCurrency(monthTotal);
}

  function renderExpenses(){ const container = $('expenses-list'); if(!container) return; const expenses = read(KEY_EXPENSES); container.innerHTML=''; if(expenses.length===0){ container.innerHTML='<p>Sem despesas lançadas.</p>'; return; } expenses.forEach(x=>{ const div=document.createElement('div'); div.className='section-card'; div.innerHTML=`<strong>${window.mq ? window.mq.escapeHtml(x.title) : x.title}</strong> — ${window.mq ? window.mq.formatCurrency(x.amount) : x.amount}`; container.appendChild(div); }); }

    function saveExpense(){
        const title = $('expense-title').value.trim();
        const amount = parseFloat($('expense-amount').value) || 0;
        const projectId = $('expense-project').value || '';
        if(!title || amount<=0){ showAlert('Título e valor são obrigatórios', 'Erro'); return; }
        const expenses = read(KEY_EXPENSES);
        expenses.unshift({id:Date.now().toString(), title, amount, projectId, createdAt: new Date().toISOString()});
        write(KEY_EXPENSES, expenses);
        renderExpenses();
    }

    // salva projeto vindo do formulário admin
    function saveProject(){
        const title = $('project-title') ? $('project-title').value.trim() : '';
        const description = $('project-desc') ? $('project-desc').value.trim() : '';
        const target = parseFloat($('project-target') ? $('project-target').value : 0) || 0;
        const status = $('project-status') ? $('project-status').value : 'active';
    if(!title){ showAlert('Título do projeto é obrigatório', 'Erro'); return; }
        const projects = read(KEY_PROJECTS);
        const proj = { id: Date.now().toString(), title, description, target, status, createdAt: new Date().toISOString() };
        projects.unshift(proj);
        write(KEY_PROJECTS, projects);
        // feedback e atualização
        showAlert('Projeto cadastrado com sucesso', 'Pronto');
        if($('admin-project-form')) $('admin-project-form').reset();
        renderProjects();
    }

  function exportData(){ const payload = { projects: read(KEY_PROJECTS), donations: read(KEY_DONATIONS), expenses: read(KEY_EXPENSES), exportedAt: new Date().toISOString() }; const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='mq_export_'+new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')+'.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

    function importData(e){ const f = e.target.files && e.target.files[0]; if(!f) return; const reader = new FileReader(); reader.onload = function(){ try{ const data = JSON.parse(reader.result); if(data.projects) write(KEY_PROJECTS, data.projects); if(data.donations) write(KEY_DONATIONS, data.donations); if(data.expenses) write(KEY_EXPENSES, data.expenses); showAlert('Importação concluída', 'Importação'); renderProjects(); renderDonations(); renderExpenses(); }catch(err){ showAlert('Arquivo inválido. Verifique o conteúdo.', 'Erro'); } }; reader.readAsText(f); }

    // Limpa dados de teste (projects, donations, expenses) após confirmação
        async function clearTestData(){
                const ok = await showConfirm('Tem certeza que deseja remover TODOS os dados de teste (projetos, doações e despesas)? Esta ação não pode ser desfeita.', 'Confirmar exclusão');
                if(!ok) return;
                write(KEY_PROJECTS, []);
                write(KEY_DONATIONS, []);
                write(KEY_EXPENSES, []);
                renderProjects();
                renderDonations();
                renderExpenses();
                // atualiza banner diagnóstico se presente
                try{ const diag = document.getElementById('admin-diagnostics'); if(diag) diag.textContent = 'Diagnóstico — admin.js ✅ · projetos: 0 · doações: 0 · despesas: 0'; }catch(e){}
                await showAlert('Dados de teste removidos.', 'Concluído');
        }

    /* ---------------- Modal utilitário (Promise-based) ---------------- */
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
        return new Promise((resolve) => {
            const el = _mq_getModalElements();
            if(!el.root){ alert(message); resolve(); return; }
            el.title.textContent = title || 'Aviso';
            el.body.textContent = message;
            el.cancel.style.display = 'none';
            el.ok.textContent = 'OK';
            el.root.setAttribute('aria-hidden','false');
            function close(){
                el.root.setAttribute('aria-hidden','true');
                el.ok.removeEventListener('click', okHandler);
                el.overlay.removeEventListener('click', close);
                resolve();
            }
            function okHandler(){ close(); }
            el.ok.addEventListener('click', okHandler);
            el.overlay.addEventListener('click', close);
        });
    }

    function showConfirm(message, title){
        return new Promise((resolve) => {
            const el = _mq_getModalElements();
            if(!el.root){ resolve(confirm(message)); return; }
            el.title.textContent = title || 'Confirmação';
            el.body.textContent = message;
            el.cancel.style.display = '';
            el.ok.textContent = 'Confirmar';
            el.root.setAttribute('aria-hidden','false');
            function cleanup(){
                el.root.setAttribute('aria-hidden','true');
                el.ok.removeEventListener('click', okHandler);
                el.cancel.removeEventListener('click', cancelHandler);
                el.overlay.removeEventListener('click', cancelHandler);
            }
            function okHandler(){ cleanup(); resolve(true); }
            function cancelHandler(){ cleanup(); resolve(false); }
            el.ok.addEventListener('click', okHandler);
            el.cancel.addEventListener('click', cancelHandler);
            el.overlay.addEventListener('click', cancelHandler);
        });
    }

    /* ---------------- Gerar dados de exemplo ---------------- */
    function generateSampleData(){
        const projects = read(KEY_PROJECTS) || [];
        const donations = read(KEY_DONATIONS) || [];
        const now = Date.now();

        const sampleProjects = [
            { id: (now+1).toString(), title: 'Banco de Alimentos', description: 'Arrecadação e distribuição de alimentos', target: 3000, status: 'active', createdAt: new Date().toISOString() },
            { id: (now+2).toString(), title: 'Roupas e Cobertores', description: 'Campanha de roupas para inverno', target: 1500, status: 'active', createdAt: new Date().toISOString() },
            { id: (now+3).toString(), title: 'Apoio Educacional', description: 'Material escolar e reforço', target: 2000, status: 'pending', createdAt: new Date().toISOString() }
        ];

        sampleProjects.forEach(sp => { if(!projects.find(p => p.title === sp.title)) projects.unshift(sp); });

        const sampleDonations = [
            { id: (now+11).toString(), name: 'Ana Silva', email: 'ana@example.com', amount: 120, projectId: projects[0] ? projects[0].id : sampleProjects[0].id, createdAt: new Date().toISOString() },
            { id: (now+12).toString(), name: 'Carlos Souza', email: 'carlos@example.com', amount: 50, projectId: projects[1] ? projects[1].id : sampleProjects[1].id, createdAt: new Date().toISOString() },
            { id: (now+13).toString(), name: 'Mariana Lima', email: 'mariana@example.com', amount: 200, projectId: projects[0] ? projects[0].id : sampleProjects[0].id, createdAt: new Date().toISOString() }
        ];

        sampleDonations.forEach(sd => { if(!donations.find(d => d.id === sd.id)) donations.unshift(sd); });

        write(KEY_PROJECTS, projects);
        write(KEY_DONATIONS, donations);

        renderProjects();
        renderDonations();
        renderExpenses();

        showAlert('Dados de exemplo gerados com sucesso.', 'Pronto');
    }

  document.addEventListener('DOMContentLoaded', init);
})();
