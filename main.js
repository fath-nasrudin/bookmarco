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

function createModal() {
  const modalWrapper = document.createElement('div');
  modalWrapper.classList.add('js-modal-wrapper');
  modalWrapper.setAttribute('style', 'display: flex; justify-content: center;');

  const dialog = document.createElement('section');
  dialog.classList.add('js-add-comic-modal', 'modal');

  const form = document.createElement('form');
  form.classList.add('js-add-comic-form');
  dialog.append(form);

  // title
  const titleFormControl = document.createElement('div');
  titleFormControl.classList.add('form-control');

  const titleLabel = document.createElement('label');
  titleLabel.classList.add('form-control');
  titleLabel.htmlFor = 'title';
  titleLabel.textContent = 'Title';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.name = 'title';
  titleInput.id = 'title';
  titleInput.placeholder = 'Comic Title';

  titleFormControl.append(titleLabel, titleInput);

  // websource
  const websourceFormControl = document.createElement('div');
  websourceFormControl.classList.add('form-control');

  const websourceLabel = document.createElement('label');
  websourceLabel.classList.add('form-control');
  websourceLabel.htmlFor = 'websource';
  websourceLabel.textContent = 'Websource';

  const websourceInput = document.createElement('input');
  websourceInput.type = 'text';
  websourceInput.name = 'websource';
  websourceInput.id = 'websource';
  websourceInput.placeholder = 'Comic Websource';

  websourceFormControl.append(websourceLabel, websourceInput);

  const saveButton = document.createElement('button');
  saveButton.type = 'submit';
  saveButton.classList.add('save-comic-form-button');
  saveButton.textContent = 'Save';

  // handling add comic form
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());

    addComicToLibrary(formData);
    removeModal();
    renderComics();

  })

  form.append(titleFormControl, websourceFormControl, saveButton);

  const overlay = document.createElement('div');
  overlay.classList.add('js-add-comic-modal-overlay', 'overlay');

  modalWrapper.append(dialog, overlay);
  return modalWrapper;
}

function renderComics() {
  const comicsContainer = document.querySelector('#comicsContainer');

  // reset previus data
  comicsContainer.textContent = '';

  for (let i = 0; i < myLibrary.length; i++) {
    comicsContainer.append(createComicCard(myLibrary[i]));
  }

}

const removeModal = () => {
  const modalWrapper = document.querySelector('.js-modal-wrapper');
  document.body.removeChild(modalWrapper);
}

const renderModal = () => {
  document.querySelector('body').append(createModal());
}

const addButton = document.querySelector('.js-add-button');
addButton.addEventListener('click', () => {
  renderModal();
})

// initial loaded
renderComics();