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

/************ 
 * Database *
 ************/
// add myLibrary if the data is yet populated
const LIBRARY_KEY = 'mylibrary';
function writeDatabase(data = myLibrary) {
  const flatenLibrary = JSON.stringify(data);
  localStorage.setItem(LIBRARY_KEY, flatenLibrary);
}

function readDatabase() {
  const myLibrary = JSON.parse(localStorage.getItem(LIBRARY_KEY));
  return myLibrary;
}

if (!localStorage.getItem('mylibrary')) {
  writeDatabase(myLibrary);
}

/************ 
 * Model    *
 ************/
function Comic({ title, websource }) {
  this.title = title;
  this.websource = websource;
};


function addComicToLibrary(comic) {

  // read database
  const myLibrary = readDatabase();

  // update
  comic.id = myLibrary[0].id + 1;
  myLibrary.unshift(comic);

  // write database
  writeDatabase(myLibrary);
}

function findComics() {
  const myLibrary = readDatabase();
  return myLibrary;
}

function findComicById(comicId) {
  const myLibrary = readDatabase();
  return myLibrary.find(comic => comic.id === Number(comicId));
}

function deleteComicFromLibrary(comicId) {
  comicId = Number(comicId);

  let myLibrary = readDatabase();

  myLibrary = myLibrary.filter(comic => comic.id !== comicId);

  writeDatabase(myLibrary);
}

function editComic(comicId, data) {
  const myLibrary = readDatabase();

  // find comic
  const currentComic = myLibrary.find(comic => comic.id === Number(comicId));

  if (!currentComic) {
    console.log('Comic not found');
    return;
  }

  // apply change
  if (data.title !== undefined) currentComic.title = data.title;
  if (data.websource !== undefined) currentComic.websource = data.websource;
  if (data.schedule !== undefined) currentComic.schedule = data.schedule;
  if (data.date !== undefined) currentComic.date = data.date;
  if (data.day !== undefined) currentComic.day = data.day;

  writeDatabase(myLibrary);
}

function updateComicLastVisited(comicId) {
  const myLibrary = readDatabase();

  // find comic
  const currentComic = myLibrary.find(comic => comic.id === Number(comicId));

  if (!currentComic) {
    console.log('Comic not found');
    return;
  }

  // apply change
  currentComic.lastVisited = new Date();

  writeDatabase(myLibrary);
}


/************ 
 * UI       *
 ************/


function getLastVisitedString(lastVisited) {
  const dateString = new Date(Date.now()).toDateString()

  if (!lastVisited) return 'Never';

  const lastVisitedTimestamps = new Date(lastVisited); // last visited
  const todayTimestamps = new Date(dateString).getTime(); // hari ini
  const deltaInMiliseconds = lastVisitedTimestamps - todayTimestamps;
  const deltaInHours = (((deltaInMiliseconds / 1000) / 60) / 60);

  let result = lastVisitedTimestamps.toDateString();
  if (todayTimestamps < lastVisitedTimestamps) {
    result = 'Today';
  } else if (todayTimestamps > lastVisitedTimestamps) {
    if (deltaInHours > -24) result = 'Yesterday';
  }
  return result;
}

function createProperty(propName, propValue, propSubvalue = null) {
  const property = document.createElement('div');
  property.classList.add('property');

  const propertyName = document.createElement('div');
  propertyName.classList.add('property-name');
  propertyName.textContent = propName;
  property.appendChild(propertyName);

  const propertyValue = document.createElement('div');
  propertyValue.classList.add('property-value');
  propertyValue.textContent = propValue;

  if (propSubvalue) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('style', 'display: flex; gap: .5rem;')

    const propertySubvalue = document.createElement('div');
    propertySubvalue.classList.add('property-value');
    propertySubvalue.textContent = ` | ${propSubvalue}`;
    wrapper.append(propertyValue, propertySubvalue);
    property.append(wrapper);
  } else {
    property.appendChild(propertyValue);
  }
  return property;
}

function createComicCard({ id, title, websource, lastVisited, schedule, day, date }) {
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

  const lastVisitedString = getLastVisitedString(lastVisited);
  const lastVisitedProperty = createProperty('Last Visited', lastVisitedString);
  cardBody.append(lastVisitedProperty);

  let scheduleSubvalue = null;
  if (schedule === 'weekly') scheduleSubvalue = dayOptions.find(optionDay => Number(day) === Number(optionDay.value)).name;
  if (schedule === 'monthly') scheduleSubvalue = date;

  const scheduleProperty = createProperty('Schedule', schedule ? schedule : ' Not specified', scheduleSubvalue);
  cardBody.append(scheduleProperty);


  const cardFooter = document.createElement('div');
  cardFooter.classList.add('card__footer', 'mt-4');

  const link = document.createElement('a');
  link.target = '_blank';
  link.href = websource;
  cardFooter.append(link);

  const readButton = document.createElement('button');
  readButton.classList.add('read-button');
  readButton.textContent = 'Read Comic';

  readButton.addEventListener('click', (e) => {
    updateComicLastVisited(id);
    renderComics();
  })

  link.append(readButton);

  const editAndDeleteWrapper = document.createElement('div');
  editAndDeleteWrapper.setAttribute('style', 'display: flex; gap: 8px;')
  cardFooter.append(editAndDeleteWrapper);


  const deleteButton = document.createElement('button');
  deleteButton.classList.add('js-delete-comic-button', 'delete-button');
  deleteButton.textContent = 'Delete';

  // handling delete event
  deleteButton.addEventListener('click', (e) => {
    console.log(e.target);
    const currentCard = e.target.closest('.card');
    const cardId = currentCard.getAttribute('data-id');

    deleteComicFromLibrary(cardId);
    renderComics();
  })

  const editButton = document.createElement('button');
  editButton.classList.add('js-edit-comic-button', 'edit-button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', (e) => {
    const currentCard = e.target.closest('.card');
    const cardId = currentCard.getAttribute('data-id');
    const comic = findComicById(cardId);
    renderModal({ type: 'edit', comic })
  })

  editAndDeleteWrapper.append(editButton, deleteButton);

  comicCard.append(cardBody, cardFooter);

  return comicCard;
}

function createFormControlSelect({ name, options }) {
  const formControl = document.createElement('div');
  formControl.classList.add('form-control');

  const label = document.createElement('label');
  label.classList.add('form-control');
  label.htmlFor = name;
  label.textContent = name[0].toUpperCase() + name.slice(1);

  const select = document.createElement('select');
  select.name = name;
  select.id = name;

  for (let i = 0; i < options.length; i++) {
    const option = document.createElement('option');
    option.value = options[i].value;
    option.textContent = options[i].name;
    select.append(option);
  }

  formControl.append(label, select);
  return formControl;
}

const dateOptions = (() => {
  const dates = [];
  for (let i = 1; i <= 31; i++) {
    dates.push({ name: i, value: i })
  }
  return dates;
})();

const dayOptions = [{ name: 'Sunday', value: 0 }, { name: 'Monday', value: 1 }, { name: 'Tuesday', value: 2 }, { name: 'Wednesday', value: 3 }, { name: 'Thursday', value: 4 }, { name: 'Friday', value: 5 }, { name: 'Saturday', value: 6 },];

const scheduleOptions = [{ name: 'not specified', value: '' }, { name: 'random', value: 'random' }, { name: 'weekly', value: 'weekly' }, { name: 'monthly', value: 'monthly' },];


function createModal({ type = 'add', comic }) {
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
  titleInput.value = type === 'edit' ? comic.title : '';

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
  websourceInput.value = type === 'edit' ? comic.websource : '';

  websourceFormControl.append(websourceLabel, websourceInput);

  // schedule
  const dayFormControl = createFormControlSelect({ name: 'day', options: dayOptions });

  const dateFormControl = createFormControlSelect({ name: 'date', options: dateOptions });

  const scheduleFormControl = createFormControlSelect({ name: 'schedule', options: scheduleOptions });
  scheduleFormControl.querySelector('select').addEventListener('change', scheduleChangeHandler)

  function scheduleChangeHandler(e) {
    if (e.target.value === 'weekly') {
      scheduleFormControl.after(dayFormControl);
    } else {
      if (dayFormControl.parentNode) {
        dayFormControl.parentNode.removeChild(dayFormControl);
      }
    }

    if (e.target.value === 'monthly') {
      scheduleFormControl.after(dateFormControl);
    } else {
      if (dateFormControl.parentNode) {
        dateFormControl.parentNode.removeChild(dateFormControl);
      }
    }
  };

  const saveButton = document.createElement('button');
  saveButton.type = 'submit';
  saveButton.classList.add('save-comic-form-button');
  saveButton.textContent = 'Save';

  // handling saving comic
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());

    if (type === 'add') {
      addComicToLibrary(formData);
    } else if (type === 'edit') {
      editComic(comic.id, formData);
    }

    removeModal();
    renderComics();
  })

  form.append(titleFormControl, websourceFormControl, scheduleFormControl, saveButton);

  const overlay = document.createElement('div');
  overlay.classList.add('js-add-comic-modal-overlay', 'overlay');

  modalWrapper.append(dialog, overlay);
  return modalWrapper;
}

function renderComics() {
  const comicsContainer = document.querySelector('#comicsContainer');

  // reset previus data
  comicsContainer.textContent = '';

  // get comics
  const myLibrary = findComics();

  for (let i = 0; i < myLibrary.length; i++) {
    comicsContainer.append(createComicCard(myLibrary[i]));
  }

}

const removeModal = () => {
  const modalWrapper = document.querySelector('.js-modal-wrapper');
  document.body.removeChild(modalWrapper);
}

const renderModal = (options) => {
  if (!options) options = {};
  const { type, comic } = options;

  document.querySelector('body').append(createModal({ type, comic }));
}

const addButton = document.querySelector('.js-add-button');
addButton.addEventListener('click', () => {
  renderModal();
})

// initial loaded
renderComics();