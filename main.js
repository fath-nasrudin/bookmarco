let myLibrary = [
  {
    id: 2,
    title: 'Solo Leveling',
    websource: 'https://komikindo.tv/komik/823197-solo-leveling/',
  },
  {
    id: 1,
    title: 'Tower of God',
    websource: 'https://www.webtoons.com/en/fantasy/tower-of-god/list?title_no=95',
  },
];

function Comic({ title, websource }) {
  this.title = title;
  this.websource = websource;
};

function addComicToLibrary(comic) {
  comic.id = myLibrary[0].id + 1;
  myLibrary.unshift(comic);
}

function deleteComicFromLibrary(comicId) {
  comicId = Number(comicId);

  myLibrary = myLibrary.filter(comic => comic.id !== comicId);
}

/************ 
 * UI       *
 ************/

function createProperty(propName, propValue) {
  const property = document.createElement('div');
  property.classList.add('property');

  const propertyName = document.createElement('div');
  propertyName.classList.add('property-name');
  propertyName.textContent = propName;
  property.appendChild(propertyName);

  const propertyValue = document.createElement('div');
  propertyValue.classList.add('property-value');
  propertyValue.textContent = propValue;
  property.appendChild(propertyValue);

  return property;

}

function createComicCard({ id, title, websource }) {
  const comicCard = document.createElement('div');
  comicCard.classList.add('card');
  comicCard.setAttribute('data-id', id);

  const cardBody = document.createElement('div');
  cardBody.classList.add('card__body');

  const idProperty = createProperty('id', id);
  idProperty.classList.add('hidden');
  cardBody.append(idProperty);

  const titleProperty = createProperty('Title', title);
  cardBody.append(titleProperty);


  const cardFooter = document.createElement('div');
  cardFooter.classList.add('card__footer', 'mt-4');

  const link = document.createElement('a');
  link.target = '_blank';
  link.href = websource;
  cardFooter.append(link);

  const readButton = document.createElement('button');
  readButton.classList.add('read-button');
  readButton.textContent = 'Read Comic';
  link.append(readButton);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('js-delete-comic-button', 'delete-button');
  deleteButton.textContent = 'Delete';
  cardFooter.append(deleteButton);

  // handling delete event
  deleteButton.addEventListener('click', (e) => {
    console.log(e.target);
    const currentCard = e.target.closest('.card');
    const cardId = currentCard.getAttribute('data-id');

    deleteComicFromLibrary(cardId);
    renderComics();
  })

  comicCard.append(cardBody, cardFooter);

  return comicCard;
}

function renderComics() {
  const comicsContainer = document.querySelector('#comicsContainer');

  // reset previus data
  comicsContainer.textContent = '';

  for (let i = 0; i < myLibrary.length; i++) {
    comicsContainer.append(createComicCard(myLibrary[i]));
  }

}

const toggleAddComicModal = () => {
  const addComicModal = document.querySelector('.js-add-comic-modal');
  const addComicOverlay = document.querySelector('.js-add-comic-modal-overlay');

  addComicModal.classList.toggle('hidden');
  addComicOverlay.classList.toggle('hidden');
}

const addButton = document.querySelector('.js-add-button');
addButton.addEventListener('click', () => {
  toggleAddComicModal();
})

// handling add comic form
document.querySelector('.js-add-comic-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target).entries());

  addComicToLibrary(formData);
  toggleAddComicModal();
  renderComics();

})

// initial loaded
renderComics();