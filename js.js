// --- Demo dataset ---
const SAMPLE = [
  {id:1, name:'Bella', species:'Suns', age:'2 gadi', gender:'Sieviete', desc:'Aktīva un draudzīga, mīl garas pastaigas.', img:'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=800&q=60'},
  {id:2, name:'Murka', species:'Kaķis', age:'3 gadi', gender:'Sieviete', desc:'Mīl siltas vietas un klusumu.', img:'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=60'},
  {id:3, name:'Rex', species:'Suns', age:'5 gadi', gender:'Vīrietis', desc:'Lojāls sargs, draudzīgs ģimenēm.', img:'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=60'},
  {id:4, name:'Pūks', species:'Kaķis', age:'1 gads', gender:'Vīrietis', desc:'Labi sader ar bērniem, rotaļīgs.', img:'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=60'},
  {id:5, name:'Rūdolfs', species:'kaķis', age:'6 mēneši', gender:'Vīrietis',
 desc:'Mierīgs un tīrs, piemērots dzīvoklim.',
 img:'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=60'}



];

const ANIMALS_KEY = 'adopt_animals_v5';
const APPS_KEY = 'adopt_apps_v1';

// --- Init data ---
function initData(){
  if(!localStorage.getItem(ANIMALS_KEY)){
    const animals = SAMPLE.map(a=> ({...a, status:'available'}));
    localStorage.setItem(ANIMALS_KEY, JSON.stringify(animals));
  }
  if(!localStorage.getItem(APPS_KEY)) localStorage.setItem(APPS_KEY, JSON.stringify([]));
}

// --- Utilities ---
function $(sel){return document.querySelector(sel)}

// --- Render list ---
function renderList(filterText='', species='all'){
  const container = $('#list');
  const animals = JSON.parse(localStorage.getItem(ANIMALS_KEY) || '[]');
  const filtered = animals.filter(a=>{
   const matchesText =
  (a.name + ' ' + a.desc + ' ' + a.species).toLowerCase()
  .includes(filterText.toLowerCase());

    const matchesSpecies = species === 'all' ? true : a.species === species;
    return matchesText && matchesSpecies;
  });
  container.innerHTML = '';
  if(filtered.length === 0){ 
    container.innerHTML = '<p style="color:var(--muted)">Nav atrasts neviens dzīvnieks.</p>'; 
    return 
  }
  for(const a of filtered){
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${a.img}" alt="${a.name} — ${a.species}">
      <div class="card-body">
        <div style="display:flex; justify-content:space-between; align-items:center">
          <div>
            <div style="font-weight:700">${a.name} <span class="meta">• ${a.species}</span></div>
            <div class="meta">${a.age} • ${a.gender}</div>
          </div>
          <div>
            ${a.status === 'available' ? '<span class="pill">Pieejams</span>' : '<span class="pill" style="background:#fff3f0; color:#9b2c2c">'+a.status+'</span>'}
          </div>
        </div>
        <p style="flex:1; margin-top:0.5rem">${a.desc}</p>
        <div style="display:flex; gap:0.5rem; margin-top:0.5rem; justify-content:flex-end">
          <button class="btn" data-id="${a.id}" ${a.status!=='available' ? 'disabled aria-disabled="true"' : ''}>Adoptēt</button>
          <button class="btn secondary" data-id="${a.id}" aria-label="Skatīt detaļas">Skatīt</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  }
}

// --- Populate species select ---
function populateSpecies(){
  const animals = JSON.parse(localStorage.getItem(ANIMALS_KEY) || '[]');
  const speciesSet = new Set(animals.map(a=>a.species));
  const sel = $('#species');
  speciesSet.forEach(s=>{
    const opt = document.createElement('option'); 
    opt.value = s; 
    opt.textContent = s; 
    sel.appendChild(opt);
  });
}

const modal = $('#modal');
function openModal(animal){
  $('#modalTitle').textContent = 'Adoptēt — ' + animal.name;
  $('#animalId').value = animal.id;
  $('#adopterName').value = '';
  $('#adopterEmail').value = '';
  $('#message').value = '';
  $('#animalImg').src = animal.img;
  $('#animalImg').style.display = 'block';
  modal.classList.add('show'); 
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){ 
  modal.classList.remove('show'); 
  modal.setAttribute('aria-hidden','true'); 
}

const adminPanel = $('#adminPanel');
function openAdminPanel(){
  const appsContainer = $('#applications');
  const apps = JSON.parse(localStorage.getItem(APPS_KEY)||'[]');
  appsContainer.innerHTML = '';
  if(apps.length === 0){
    appsContainer.innerHTML = '<p>Nav neviena pieteikuma.</p>';
    return;
  }
  apps.forEach(a=>{
    const animal = JSON.parse(localStorage.getItem(ANIMALS_KEY)||'[]').find(an=>an.id===a.animalId);
    const div = document.createElement('div');
    div.className = 'application';
    div.innerHTML = `<strong>${animal.name}</strong> — ${a.name} (${a.email}) <br> ${new Date(a.date).toLocaleString()}`;
    appsContainer.appendChild(div);
  });
  adminPanel.classList.add('show');
  adminPanel.setAttribute('aria-hidden','false');
}
function closeAdminPanel(){
  adminPanel.classList.remove('show');
  adminPanel.setAttribute('aria-hidden','true');
}

document.addEventListener('click', (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;

  if(btn.matches('#closeModal') || btn.matches('#cancelForm')){ closeModal(); }
  if(btn.matches('#closeAdmin')){ closeAdminPanel(); }

  if(btn.matches('.card .btn') && btn.closest('.card')){
    const id = parseInt(btn.dataset.id);
    const animals = JSON.parse(localStorage.getItem(ANIMALS_KEY)||'[]');
    const animal = animals.find(a=>a.id===id);
    if(btn.textContent.trim().toLowerCase() === 'adoptēt') openModal(animal);
    else alert(`${animal.name}:\n${animal.desc}\n${animal.age} • ${animal.gender}`);
  }

  if(btn.matches('#adminBtn')) openAdminPanel();
});

$('#adoptForm').addEventListener('submit', (ev)=>{
  ev.preventDefault();
  const id = parseInt($('#animalId').value);
  const name = $('#adopterName').value.trim();
  const email = $('#adopterEmail').value.trim();
  const message = $('#message').value.trim();
  if(!name || !email){ alert("Lūdzu aizpildiet vārdu un e-pastu."); return; }

  const animals = JSON.parse(localStorage.getItem(ANIMALS_KEY) || '[]');
  const animal = animals.find(a=>a.id===id);
  animal.status = `Adoptēts (${name})`;
  localStorage.setItem(ANIMALS_KEY, JSON.stringify(animals));

  const apps = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
  apps.push({animalId:id, name, email, message, date:new Date().toISOString()});
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));

  renderList();
  closeModal();
  alert(`Paldies! Jūsu pieteikums par ${animal.name} ir nosūtīts.`);
});


(function(){
  initData();
  renderList();
  populateSpecies();
})();
$('#filterBtn')?.addEventListener('click', () => {
  const text = $('#search')?.value || '';
  const species = $('#species')?.value || 'all';
  renderList(text, species);
});

$('#search')?.addEventListener('input', () => {
  const text = $('#search').value;
  const species = $('#species')?.value || 'all';
  renderList(text, species);
});

$('#species')?.addEventListener('change', () => {
  const text = $('#search')?.value || '';
  const species = $('#species').value;
  renderList(text, species);
});

const NEWS_HISTORY_KEY = "news_history";

function saveSearchHistory(term){
    let history = JSON.parse(localStorage.getItem(NEWS_HISTORY_KEY) || "[]");
    history.unshift(term);
    history = history.slice(0,5);
    localStorage.setItem(NEWS_HISTORY_KEY, JSON.stringify(history));
}

async function fetchNews(query){
    const box = document.getElementById("newsBox");
    const error = document.getElementById("newsError");

    box.innerHTML = "";
    error.textContent = "";

    try {
        const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=us&max=9&apikey=1c0f6ea018f2616f4339e7c40f9d99e0`;

        const response = await fetch(url);

        if (!response.ok) {
            error.textContent = "API kļūda! Dati nav pieejami.";
            return;
        }

        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            error.textContent = "Dati nav atrasti.";
            return;
        }

        saveSearchHistory(query);

        data.articles.forEach(article => {
            const card = document.createElement("article");
            card.classList.add("card", "fade-in");

            card.innerHTML = `
                <img src="${article.image || 'dog.png'}" alt="">
                <div class="card-body">
                    <h3>${article.title}</h3>
                    <p class="meta">${article.publishedAt.slice(0,10)}</p>
                    <p>${article.description || "Nav apraksta."}</p>
                    <a href="${article.url}" target="_blank" class="btn">Lasīt vairāk</a>
                </div>
            `;
            box.appendChild(card);
        });

    } catch {
        error.textContent = "Neizdevās savienoties ar API.";
    }
}

document.getElementById("newsBtn").addEventListener("click", () => {
    const q = document.getElementById("newsSearch").value.trim();
    if (q) fetchNews(q);
});
