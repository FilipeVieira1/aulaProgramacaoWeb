// volunteer.js - portal de voluntários (usa localStorage)
(function(){
  const KEY_PROJECTS = 'mq_projects';
  const KEY_APPLICATIONS = 'mq_applications';
  const KEY_EXPERIENCES = 'mq_experiences';

  const $ = id => document.getElementById(id);
  const read = k => JSON.parse(localStorage.getItem(k) || '[]');
  const write = (k,v) => localStorage.setItem(k, JSON.stringify(v));

  function init(){
    renderOpportunities();
    renderApplications();
    renderExperiences();

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
      div.innerHTML = `<h4>${escapeHtml(p.title)}</h4><p>${escapeHtml(p.desc)}</p><p>Meta: R$ ${Number(p.target||0).toFixed(2)}</p>`;
      const btn = document.createElement('button'); btn.textContent='Candidatar-se'; btn.addEventListener('click', ()=> applyToProject(p.id));
      div.appendChild(btn);
      container.appendChild(div);
    });
  }

  function applyToProject(projectId){
    const name = prompt('Seu nome completo:');
    if(!name) return alert('Nome obrigatório para candidatura.');
    const contact = prompt('Seu email ou telefone (opcional):') || '';
    const apps = read(KEY_APPLICATIONS);
    apps.unshift({id:Date.now().toString(), projectId, name, contact, when: Date.now()});
    write(KEY_APPLICATIONS, apps);
    alert('Candidatura registrada. Boa sorte!');
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
      div.innerHTML = `<strong>${escapeHtml(a.name)}</strong> — <em>${escapeHtml(p? p.title : 'Projeto removido')}</em> <div>${new Date(a.when).toLocaleString()}</div>`;
      container.appendChild(div);
    });
  }

  function saveExperience(){
    const name = $('exp-name').value.trim(); const text = $('exp-text').value.trim();
    if(!name || !text) return alert('Nome e relato são obrigatórios.');
    const exps = read(KEY_EXPERIENCES); exps.unshift({id:Date.now().toString(),name,text,when:Date.now()}); write(KEY_EXPERIENCES,exps);
    $('experience-form').reset(); renderExperiences();
  }

  function renderExperiences(){
    const exps = read(KEY_EXPERIENCES); const container = $('experiences-list'); if(!container) return; container.innerHTML='';
    if(exps.length===0){ container.innerHTML='<p>Nenhum relato publicado.</p>'; return; }
    exps.forEach(e=>{ const div=document.createElement('div'); div.className='section-card'; div.innerHTML=`<strong>${escapeHtml(e.name)}</strong><div>${escapeHtml(e.text)}</div><div style="font-size:0.9rem;color:#666">${new Date(e.when).toLocaleString()}</div>`; container.appendChild(div); });
  }

  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  document.addEventListener('DOMContentLoaded', init);
})();