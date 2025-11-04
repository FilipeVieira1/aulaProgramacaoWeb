// volunteer.js - portal de voluntários (usa localStorage)
(function(){
  const KEY_PROJECTS = 'mq_projects';
  const KEY_APPLICATIONS = 'mq_applications';
  const KEY_EXPERIENCES = 'mq_experiences';

  // use shared mq utils
  const read = k => window.mq && window.mq.read ? window.mq.read(k) : JSON.parse(localStorage.getItem(k) || '[]');
  const write = (k,v) => window.mq && window.mq.write ? window.mq.write(k,v) : localStorage.setItem(k, JSON.stringify(v));

  /* Modal utilitário local (usa modal se existir, senão fallback) */
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
    if(!el.root){ alert(message); return Promise.resolve(); }
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
    return Promise.resolve(prompt(message, defaultValue));
  }

  function init(){
    renderOpportunities();
    renderApplications();
    renderExperiences();

    // project form on cadastro page
    const projectForm = $('project-form');
    if(projectForm) projectForm.addEventListener('submit', e=>{ e.preventDefault(); saveProjectFromPublic(); });

    const expForm = $('experience-form');
    if(expForm) expForm.addEventListener('submit', e=>{ e.preventDefault(); saveExperience(); });
  }

  function renderOpportunities(){
    const projects = read(KEY_PROJECTS);
    const container = $('opportunities-list');
    if(!container) return;
    container.innerHTML='';
    if(projects.length===0){ container.innerHTML='<p>Sem oportunidades no momento. Volte mais tarde.</p>'; return; }
    projects.forEach(p=>{
  const div = document.createElement('div'); div.className='section-card';
  div.innerHTML = `<h4>${window.mq ? window.mq.escapeHtml(p.title) : (p.title||'')}</h4><p>${window.mq ? window.mq.escapeHtml(p.description || p.desc) : (p.description||p.desc||'')}</p><p>Meta: ${window.mq ? window.mq.formatCurrency(p.target) : `R$ ${Number(p.target||0).toFixed(2)}`}</p>`;
      const btn = document.createElement('button'); btn.textContent='Candidatar-se'; btn.addEventListener('click', ()=> applyToProject(p.id));
      div.appendChild(btn);
      container.appendChild(div);
    });
  }

  // salva projeto a partir do formulário público em cadastro.html
  async function saveProjectFromPublic(){
    const title = $('project-title') ? $('project-title').value.trim() : '';
    const description = $('project-desc') ? $('project-desc').value.trim() : '';
    const target = parseFloat($('project-target') ? $('project-target').value : 0) || 0;
    if(!title){ await showAlert('Título do projeto é obrigatório', 'Erro'); return; }
    const projects = read(KEY_PROJECTS);
    const proj = { id: Date.now().toString(), title, description, target, status: 'active', createdAt: new Date().toISOString() };
    projects.unshift(proj);
    write(KEY_PROJECTS, projects);
    await showAlert('Projeto cadastrado com sucesso', 'Pronto');
    if($('project-form')) $('project-form').reset();
    renderOpportunities();
  }

  async function applyToProject(projectId){
    const name = await showPrompt('Seu nome completo:');
    if(!name) { await showAlert('Nome obrigatório para candidatura.'); return; }
    const contact = await showPrompt('Seu email ou telefone (opcional):') || '';
    const apps = read(KEY_APPLICATIONS);
    apps.unshift({id:Date.now().toString(), projectId, name, contact, createdAt: new Date().toISOString()});
    write(KEY_APPLICATIONS, apps);
    await showAlert('Candidatura registrada. Boa sorte!', 'Pronto');
    renderApplications();
  }

  function renderApplications(){
    const apps = read(KEY_APPLICATIONS); const container = $('applications-list'); if(!container) return;
    if(apps.length===0){ container.textContent='Nenhuma candidatura ainda.'; return; }
    container.innerHTML='';
    const projects = read(KEY_PROJECTS);
    apps.forEach(a=>{
    const p = projects.find(x=>x.id===a.projectId);
    const div=document.createElement('div'); div.className='section-card';
    div.innerHTML = `<strong>${window.mq ? window.mq.escapeHtml(a.name) : (a.name||'')}</strong> — <em>${window.mq ? window.mq.escapeHtml(p? p.title : 'Projeto removido') : (p? p.title : 'Projeto removido')}</em> <div>${new Date(a.createdAt || a.when).toLocaleString()}</div>`;
      container.appendChild(div);
    });
  }

  async function saveExperience(){
    const name = $('exp-name').value.trim(); const text = $('exp-text').value.trim();
    if(!name || !text){ await showAlert('Nome e relato são obrigatórios.', 'Erro'); return; }
    const exps = read(KEY_EXPERIENCES); exps.unshift({id:Date.now().toString(),name,text,when:Date.now()}); write(KEY_EXPERIENCES,exps);
    if($('experience-form')) $('experience-form').reset(); renderExperiences();
  }

  function renderExperiences(){
    const exps = read(KEY_EXPERIENCES); const container = $('experiences-list'); if(!container) return; container.innerHTML='';
    if(exps.length===0){ container.innerHTML='<p>Nenhum relato publicado.</p>'; return; }
    exps.forEach(e=>{ const div=document.createElement('div'); div.className='section-card'; div.innerHTML=`<strong>${escapeHtml(e.name)}</strong><div>${escapeHtml(e.text)}</div><div style="font-size:0.9rem;color:#666">${new Date(e.when).toLocaleString()}</div>`; container.appendChild(div); });
  }

  // use window.mq.escapeHtml from mq-utils.js

  document.addEventListener('DOMContentLoaded', init);
})();
