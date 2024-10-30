const elList = document.querySelector('.js-list');
const elTemplate = document.querySelector('.js-template').content;
const prevBtn = document.querySelector('.js-prev-btn');
const nextBtn = document.querySelector('.js-next-btn');
const elHeader = document.querySelector('.js-header');
const elPagination = document.querySelector('.js-pagination');
const elChangeMode = document.querySelector('.js-change-mode');
const counts = document.querySelector('.js-page');
const elForm = document.querySelector('.js-form');

const elSearchInput = document.querySelector('.js-search-input');
let elSelect = document.querySelector('.js-filter-region-select');
const elSortSelect = document.querySelector('.js-sort-select');

let counter = 1;
let countries = [];
let filteredCountries = [];

function handleRender(data) {
    elList.innerHTML = '';
    let docFragment = document.createDocumentFragment();

    if (data.length) {
        data.forEach((item) => {
            let clone = elTemplate.cloneNode(true);
            clone.querySelector('.js-image').src = item.flags.png;
            clone.querySelector('.js-name').textContent = item.name.common ;
            clone.querySelector('.js-population-number').textContent = item.population;
            clone.querySelector('.js-region-name').textContent = item.region;
            clone.querySelector('.js-capital-name').textContent = item.capital;
            clone.querySelector('.js-image').dataset.id = item.name.common;
            console.log(item);
            

            if (elSearchInput.value && item.name.common.includes(elSearchInput.value)) {
                clone.querySelector('.js-name').classList.add('highlight');
            }

            docFragment.append(clone);
        });
        elList.append(docFragment);
    } else {
        let elP = document.createElement('p');
        elP.textContent = 'Data not found !!';
        elP.classList.add('errText');
        elList.append(elP);
    }
}

function handleRenderPage(counter) {
    const start = (counter - 1) * 12;
    const end = counter * 12;
    let newData = filteredCountries.slice(start, end);
    counts.textContent = counter;

    handleRender(newData);
    
    prevBtn.disabled = counter === 1;
    nextBtn.disabled = end >= filteredCountries.length;
}

elPagination.addEventListener('click', (evt) => {
    if (evt.target.matches('.js-next-btn') && counter < Math.ceil(filteredCountries.length / 12)) {
        counter++;
    }
    if (evt.target.matches('.js-prev-btn') && counter > 1) {
        counter--;
    }
    handleRenderPage(counter);
});

function toggleDarkLightMode() {
    const currentMode = localStorage.getItem('mode') || 'light';
    const newMode = currentMode === 'light' ? 'dark' : 'light';

    document.body.classList.toggle('light', newMode === 'light');
    document.body.classList.toggle('dark', newMode === 'dark');

    elHeader.classList.toggle('site_header_light', newMode === 'light');
    elHeader.classList.toggle('site_header_dark', newMode === 'dark');

    elChangeMode.textContent = newMode === 'light' ? 'Dark Mode' : 'Light Mode';

    const newElements = [elSearchInput, elSelect, elSortSelect];
    for (const el of newElements) {
        el.classList.toggle('input-light', newMode === 'light');
        el.classList.toggle('input-dark', newMode === 'dark');
    }
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
    const newElements = [elSearchInput, elSelect, elSortSelect];
    for (const el of newElements) {
        el.classList.add(mode === 'dark' ? 'input-dark' : 'input-light');
    }
    const listItems = document.querySelectorAll('.js-elLi');
    for (const el of listItems) {
        el.classList.add(mode === 'dark' ? 'elItem-dark' : 'elItem-light');
    }
})();

elChangeMode.addEventListener('click', toggleDarkLightMode);

async function fetchCountries() {
    let request = await fetch('https://restcountries.com/v3.1/all');
    let response = await request.json();
    countries = response;
    filteredCountries = countries;
    handleRenderPage(counter);
}

elForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const searchValue = elSearchInput.value.trim();
    const sortValue = elSortSelect.value;
    const select =  elSelect.value ;

    const regex = new RegExp(searchValue, 'gi');

    if (searchValue) {
        const request = await fetch(`https://restcountries.com/v3.1/name/${searchValue}`);
        if (!request.ok) {
            
            console.error('Error fetching countries:', request.statusText);
            return;
        }

        const response = await request.json();
        
        filteredCountries = response.filter((country) => country.name.common.match(regex));
      
        
    } else {
        filteredCountries = countries; 
    }

    filteredCountries.sort((a, b) => {
        switch (sortValue) {
            case 'a-z':
                return a.name.common.localeCompare(b.name.common);
            case 'z-a':
                return b.name.common.localeCompare(a.name.common);
            case 'min-population':
                return a.population - b.population;
            case 'max-population':
                return b.population - a.population;
            default:
                return 0;
        }
    });

    counter = 1;
    handleRenderPage(counter);
});


elList.addEventListener('click', (evt) => {
    if(evt.target.matches('.js-image')){
        let id = evt.target.dataset.id ;

        window.localStorage.setItem('id', id) ;
        window.location = '/PageId/page.html';
        return;
    }
})

fetchCountries();




