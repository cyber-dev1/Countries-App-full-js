const elList = document.querySelector('.js-list');
const elHeader = document.querySelector('.js-header');
const elChangeMode = document.querySelector('.js-change-mode');
const back = document.querySelector('.backLink') ;
const idList = document.querySelector('.idList');
const idTemp = document.querySelector('.IdTemplate').content ;


let ById = window.localStorage.getItem('id') ? window.localStorage.getItem('id')  : console.log("yo'q") ;
async function handleRenderS(data){
    let fragment = document.createDocumentFragment();
   if(data){
        data.forEach((item) => {
            let clone = idTemp.cloneNode(true);
            clone.querySelector('.idImg').src = item.flags.png;
            clone.querySelector('.idName').textContent = item.name.common;
            clone.querySelector('.idNative').textContent = item.name.official;
            clone.querySelector('.idPopulation').textContent = item.population ;
            clone.querySelector('.idRegion').textContent = item.region ;
            clone.querySelector('.idSub').textContent = item.subregion ? item.subregion : 'not found';
            clone.querySelector('.idCapital').textContent = item.capital;
            clone.querySelector('.idDomain').textContent = item.tld;
            clone.querySelector('.IdCurren').textContent = Object.values(item.currencies)[0].name;
            clone.querySelector('.idLang').textContent = Object.values(item.languages) ;
            clone.querySelector('.idBorder').textContent = item.borders ? item.borders : 'not found';

            fragment.append(clone);
        });
        idList.append(fragment) ;
   }else{
    console.log('xatolik mavjud');
    
   }
};
async function handleIdRender(){
    try {
        let request = await fetch(`https://restcountries.com/v3.1/name/${ById}`) ;
        let response = await request.json();
       handleRenderS(response);
       console.log(response);
       
        
    } catch (error) {
        console.log(error.message);
        
    }

    
}
handleIdRender()


function toggleDarkLightMode() {
    const currentMode = localStorage.getItem('mode') || 'light';
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    
    document.body.classList.toggle('light', newMode === 'light');
    document.body.classList.toggle('dark', newMode === 'dark');
    
    elHeader.classList.toggle('site_header_light', newMode === 'light');
    elHeader.classList.toggle('site_header_dark', newMode === 'dark');
    
    elChangeMode.textContent = newMode === 'light' ? 'Dark Mode' : 'Light Mode';
    const listItems = document.querySelectorAll('.js-elLi');
    for (const el of listItems) {
        el.classList.toggle('elItem-light', newMode === 'light');
        el.classList.toggle('elItem-dark', newMode === 'dark');
    }
    
    localStorage.setItem('mode', newMode);
}

;(function initializeMode() {
    const mode = localStorage.getItem('mode') || 'light';
    document.body.classList.add(mode);
    elHeader.classList.add(mode === 'dark' ? 'site_header_dark' : 'site_header_light');
    elChangeMode.textContent = mode === 'light' ? 'Dark Mode' : 'Light Mode';
    const listItems = document.querySelectorAll('.js-elLi');
    for (const el of listItems) {
        el.classList.add(mode === 'dark' ? 'elItem-dark' : 'elItem-light');
    }
})();

elChangeMode.addEventListener('click', toggleDarkLightMode);

back.addEventListener('click', () => {
    idList.innerHTML = '';
    window.localStorage.removeItem('id');
    window.location = '/index.html';

})