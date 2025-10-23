// admin.js - protótipo: usa localStorage para persistir dados no navegador
(function(){
  // helpers
  const $ = id => document.getElementById(id);
  const formatCurrency = v => Number(v || 0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

  // keys
  const KEY_INFO = 'mq_info';
  const KEY_PROJECTS = 'mq_projects';
  const KEY_VOLS = 'mq_vols';
  const KEY_DONATIONS = 'mq_donations';
  const KEY_EXPENSES = 'mq_expenses';

  // read/write
  const read = k => JSON.parse(localStorage.getItem(k) || '[]');
  const write = (k,v) => localStorage.setItem(k, JSON.stringify(v));

  // inicializar UI
  function init(){
    // carregar info
    const info = localStorage.getItem(KEY_INFO) || '';
    $('info-text').value = info;

    // projetos
    renderProjects();
    renderProjectOptions();

    // voluntarios
    renderVols();

    // doacoes
    renderDonations();

    // metricas
    refreshMetrics();

    // eventos
    $('save-info').addEventListener('click', ()=>{
      localStorage.setItem(KEY_INFO, $('info-text').value);
      alert('Informações salvas.');
    });

    $('project-form').addEventListener('submit', e=>{
      e.preventDefault();
      saveProject();
    });
    $('project-clear').addEventListener('click', clearProjectForm);

    $('vol-form').addEventListener('submit', e=>{
      e.preventDefault(); saveVol();
    });
    $('vol-clear').addEventListener('click', clearVolForm);

    $('donation-form').addEventListener('submit', e=>{
      e.preventDefault(); saveDonation();
    });

    // expenses
    const expenseForm = document.getElementById('expense-form');
    if(expenseForm) expenseForm.addEventListener('submit', e=>{ e.preventDefault(); saveExpense(); });

    // backup/export/import
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');
    const backupMsg = document.getElementById('backup-msg');
    if(exportBtn){ exportBtn.addEventListener('click', exportData); }
    if(importBtn){ importBtn.addEventListener('click', ()=> importFile.click()); }
    if(importFile){ importFile.addEventListener('change', handleImportFile); }
  }

  // exportar todos os dados como JSON
  function exportData(){
    const payload = {
      info: localStorage.getItem(KEY_INFO) || '',
      projects: read(KEY_PROJECTS),
      volunteers: read(KEY_VOLS),
      donations: read(KEY_DONATIONS),
      expenses: read(KEY_EXPENSES),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `mq_backup_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  function handleImportFile(e){
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      try{
        const data = JSON.parse(ev.target.result);
        importData(data);
        document.getElementById('backup-msg').textContent = 'Importação concluída com sucesso.';
        document.getElementById('backup-msg').style.display = 'block';
        // limpar input
        e.target.value = '';
      }catch(err){
        alert('Arquivo JSON inválido.');
      }
    };
    reader.readAsText(f);
  }

  // importa e substitui os dados locais (com confirmação)
  function importData(payload){
    if(!confirm('A importação substituirá os dados atuais. Deseja continuar?')) return;
    if(typeof payload !== 'object') { alert('Formato inválido'); return; }
    if(payload.info !== undefined) localStorage.setItem(KEY_INFO, String(payload.info));
    if(Array.isArray(payload.projects)) write(KEY_PROJECTS, payload.projects);
    if(Array.isArray(payload.volunteers)) write(KEY_VOLS, payload.volunteers);
    if(Array.isArray(payload.donations)) write(KEY_DONATIONS, payload.donations);
    if(Array.isArray(payload.expenses)) write(KEY_EXPENSES, payload.expenses);
  renderProjects(); renderProjectOptions(); renderVols(); renderDonations(); renderExpenses(); refreshMetrics();
  }

  // projetos CRUD
  function saveProject(){
    const id = $('project-id').value || Date.now().toString();
    const title = $('project-title').value.trim();
    const desc = $('project-desc').value.trim();
    const target = parseFloat($('project-target').value) || 0;
    if(!title){ alert('Título é obrigatório'); return; }
    const projects = read(KEY_PROJECTS);
    const existingIndex = projects.findIndex(p=>p.id===id);
    const item = {id,title,desc,target,created: Date.now()};
    if(existingIndex>=0) projects[existingIndex]=item; else projects.unshift(item);
    write(KEY_PROJECTS,projects);
    clearProjectForm();
    renderProjects(); renderProjectOptions(); refreshMetrics();
  }
  function clearProjectForm(){
    $('project-id').value='';$('project-title').value='';$('project-desc').value='';$('project-target').value='';
  }
  function renderProjects(){
    const projects = read(KEY_PROJECTS);
    const container = $('projects-list');
    container.innerHTML='';
    if(projects.length===0){ container.innerHTML='<p>Nenhum projeto cadastrado.</p>'; return; }
    projects.forEach(p=>{
      const div = document.createElement('div'); div.className='section-card';
      div.innerHTML = `<strong>${escapeHtml(p.title)}</strong> <div>${escapeHtml(p.desc)}</div><div>Meta: ${formatCurrency(p.target)}</div>`;
      const edit = document.createElement('button'); edit.textContent='Editar'; edit.addEventListener('click', ()=>{fillProjectForm(p)});
      const del = document.createElement('button'); del.textContent='Excluir'; del.addEventListener('click', ()=>{ if(confirm('Excluir projeto?')){ deleteProject(p.id); }});
      div.appendChild(edit); div.appendChild(del);
      container.appendChild(div);
    });
  }
  function fillProjectForm(p){
    $('project-id').value=p.id; $('project-title').value=p.title; $('project-desc').value=p.desc; $('project-target').value=p.target;
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function deleteProject(id){
    const projects = read(KEY_PROJECTS).filter(p=>p.id!==id); write(KEY_PROJECTS,projects); renderProjects(); renderProjectOptions(); refreshMetrics();
  }

  // voluntarios CRUD
  function saveVol(){
    const id = $('vol-id').value || Date.now().toString();
    const name = $('vol-name').value.trim();
    const contact = $('vol-contact').value.trim();
    if(!name){ alert('Nome é obrigatório'); return; }
    const vols = read(KEY_VOLS);
    const idx = vols.findIndex(v=>v.id===id);
    const item = {id,name,contact,joined:Date.now()};
    if(idx>=0) vols[idx]=item; else vols.unshift(item);
    write(KEY_VOLS,vols); clearVolForm(); renderVols(); refreshMetrics();
  }
  function clearVolForm(){ $('vol-id').value='';$('vol-name').value='';$('vol-contact').value=''; }
  function renderVols(){
    const vols = read(KEY_VOLS); const container = $('vol-list'); container.innerHTML='';
    if(vols.length===0){ container.innerHTML='<p>Nenhum voluntário cadastrado.</p>'; return; }
    vols.forEach(v=>{
      const div=document.createElement('div'); div.className='section-card';
      div.innerHTML=`<strong>${escapeHtml(v.name)}</strong><div>${escapeHtml(v.contact)}</div>`;
      const edit=document.createElement('button'); edit.textContent='Editar'; edit.addEventListener('click', ()=>{ fillVolForm(v); });
      const del=document.createElement('button'); del.textContent='Excluir'; del.addEventListener('click', ()=>{ if(confirm('Excluir voluntário?')){ deleteVol(v.id); }});
      div.appendChild(edit); div.appendChild(del); container.appendChild(div);
    });
  }
  function fillVolForm(v){ $('vol-id').value=v.id; $('vol-name').value=v.name; $('vol-contact').value=v.contact; window.scrollTo({top:0,behavior:'smooth'}); }
  function deleteVol(id){ const vols=read(KEY_VOLS).filter(v=>v.id!==id); write(KEY_VOLS,vols); renderVols(); refreshMetrics(); }

  // doacoes
  function saveDonation(){
    const name=$('donor-name').value.trim();
    const amount=parseFloat($('donation-amount').value)||0; const projectId=$('donation-project').value||'';
    if(amount<=0){ alert('Valor deve ser maior que 0'); return; }
    const donations=read(KEY_DONATIONS);
    donations.unshift({id:Date.now().toString(),name,amount,projectId,when:Date.now()});
    write(KEY_DONATIONS,donations);
    $('donation-form').reset(); renderDonations(); refreshMetrics();
  }
  function renderDonations(){ const donations=read(KEY_DONATIONS); const container=$('donations-list'); container.innerHTML='';
    if(donations.length===0){ container.innerHTML='<p>Nenhuma doação registrada.</p>'; return; }
    donations.forEach(d=>{
      const div=document.createElement('div'); div.className='section-card';
      const proj = getProjectTitle(d.projectId);
      div.innerHTML=`<strong>${escapeHtml(d.name||'Anônimo')}</strong> <div>Valor: ${formatCurrency(d.amount)}</div><div>Projeto: ${escapeHtml(proj||'—')}</div><div>${new Date(d.when).toLocaleString()}</div>`;
      container.appendChild(div);
    });
  }
  function getProjectTitle(id){ if(!id) return ''; const p = read(KEY_PROJECTS).find(x=>x.id===id); return p? p.title : '' }

  function renderProjectOptions(){
    const projects=read(KEY_PROJECTS);
    const selDonate = $('donation-project');
    const selExpense = $('expense-project');
    if(selDonate){ selDonate.innerHTML = '<option value="">-- nenhum --</option>'; projects.forEach(p=>{ const o=document.createElement('option'); o.value=p.id; o.textContent=p.title; selDonate.appendChild(o); }); }
    if(selExpense){ selExpense.innerHTML = '<option value="">-- nenhum --</option>'; projects.forEach(p=>{ const o=document.createElement('option'); o.value=p.id; o.textContent=p.title; selExpense.appendChild(o); }); }
  }

  // metricas
  function refreshMetrics(){
    const projects=read(KEY_PROJECTS); const vols=read(KEY_VOLS); const donations=read(KEY_DONATIONS);
    $('metric-projects').textContent = `Projetos: ${projects.length}`;
    $('metric-vols').textContent = `Voluntários: ${vols.length}`;
    const total = donations.reduce((s,d)=>s + (Number(d.amount)||0),0);
    $('metric-donations').textContent = `Total de doações: ${formatCurrency(total)}`;
    // despesas totais
    const expenses = read(KEY_EXPENSES);
    const totalExpenses = expenses.reduce((s,e)=>s + (Number(e.amount)||0),0);
    // inserir métrica de despesas se existir elemento
    const el = document.getElementById('metric-expenses');
    if(el) el.textContent = `Total de despesas: ${formatCurrency(totalExpenses)}`;
  }

  // expenses functions
  function saveExpense(){
    const projectId = document.getElementById('expense-project').value || '';
    const desc = document.getElementById('expense-desc').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value) || 0;
    if(!desc || amount<=0){ alert('Descrição e valor são obrigatórios.'); return; }
    const exps = read(KEY_EXPENSES);
    exps.unshift({id: Date.now().toString(), projectId, desc, amount, when: Date.now()});
    write(KEY_EXPENSES, exps);
    document.getElementById('expense-form').reset(); renderExpenses(); refreshMetrics();
  }

  function renderExpenses(){
    const exps = read(KEY_EXPENSES); const container = document.getElementById('expenses-list'); if(!container) return;
    if(exps.length===0){ container.innerHTML = '<p>Nenhuma despesa registrada.</p>'; return; }
    container.innerHTML=''; const projects = read(KEY_PROJECTS);
    exps.forEach(x=>{ const p = projects.find(t=>t.id===x.projectId); const d=document.createElement('div'); d.className='section-card'; d.innerHTML = `<strong>${escapeHtml(p? p.title : 'Sem projeto')}</strong><div>${escapeHtml(x.desc)}</div><div>Valor: ${formatCurrency(x.amount)}</div><div style="font-size:0.9rem;color:#666">${new Date(x.when).toLocaleString()}</div>`; container.appendChild(d); });
  }

  // util
  function escapeHtml(str){ if(!str) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // start
  document.addEventListener('DOMContentLoaded', function(){
    // se a função requireAuth estiver disponível (auth.js), usá-la
    if(typeof requireAuth === 'function'){
      requireAuth();
    }
    init();
  });
})();