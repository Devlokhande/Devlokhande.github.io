(() => {
  'use strict';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const art = (i, image, title) => image
    ? '<div class="project-art project-photo-art"><img src="'+esc(image)+'" alt="'+esc(title||'Project photo')+'" loading="lazy"></div>'
    : '<div class="project-art '+(i%3===0?'art-wind':i%3===1?'art-circuit':'art-power')+'">'+(i%3===0?'<div class="wind-lines"></div>':i%3===1?'<div class="circuit-board"><span>ENGINEERING</span><i></i><i></i><i></i><b></b></div>':'<div class="power-symbol">±</div>')+'<span>PROJECT / '+String(i+1).padStart(3,'0')+'</span></div>';
  document.querySelectorAll('.add-nav').forEach(b=>b.addEventListener('click',()=>{const m=b.closest('.add-menu'),open=m.classList.toggle('open');b.setAttribute('aria-expanded',String(open))}));
  document.addEventListener('click',e=>{if(!e.target.closest('.add-menu'))document.querySelectorAll('.add-menu.open').forEach(m=>{m.classList.remove('open');m.querySelector('button')?.setAttribute('aria-expanded','false')})});
  async function load(){
    const home=document.getElementById('featured-projects'),archive=document.getElementById('all-projects'),cv=document.getElementById('cv-link');
    try{
      const [pr,sr]=await Promise.all([fetch('data/projects.json?v='+Date.now()),fetch('data/site.json?v='+Date.now())]);
      if(!pr.ok)throw Error('Project list is not available yet.');
      const projects=await pr.json(),settings=sr.ok?await sr.json():{};
      if(cv&&settings.cv)cv.href=settings.cv;
      if(home){const featured=projects.filter(p=>p.featured).slice(0,3);home.innerHTML=featured.length?featured.map((p,i)=>'<article class="project-row reveal is-visible"><div class="project-number">'+String(i+1).padStart(2,'0')+'</div><div class="project-main"><p class="project-type">'+esc(p.category)+'</p><h3>'+esc(p.title)+'</h3><p>'+esc(p.summary)+'</p><a href="projects.html#'+encodeURIComponent(p.id)+'" class="text-link">Explore project <span>↗</span></a></div>'+art(i,p.images?.[0],p.title)+'</article>').join(''):'<p class="projects-loading">No featured projects yet.</p>'}
      if(archive){archive.innerHTML=projects.length?projects.map((p,i)=>'<article id="'+esc(p.id)+'" class="archive-project"><div class="archive-project-copy"><p class="project-type">'+esc(p.category)+'</p><h2>'+esc(p.title)+'</h2><p><strong>Objective:</strong> '+esc(p.objective||p.summary)+'</p><p><strong>My contribution:</strong> '+esc(p.contribution||'Details to be added.')+'</p>'+(p.details?'<p><strong>Engineering notes:</strong> '+esc(p.details)+'</p>':'')+'</div>'+(p.images?.length?'<div class="project-gallery">'+p.images.map(src=>'<img src="'+esc(src)+'" alt="'+esc(p.title)+' project photo" loading="lazy">').join('')+'</div>':art(i,null,p.title))+'</article>').join(''):'<p class="projects-loading">No projects have been published yet.</p>'}
    }catch(e){const msg='<p class="projects-loading">'+esc(e.message)+' Check data/projects.json in the repository.</p>';if(home)home.innerHTML=msg;if(archive)archive.innerHTML=msg}
  }
  load();
})();