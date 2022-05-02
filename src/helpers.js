const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

const addFile = document.getElementById("add-file")
const addResidenceButton = document.getElementById("add-residence")

let files = []

function getPropertyData(propertyId) {
  return JSON.parse(fs.readFileSync(`${__dirname}/src/data/${propertyId}/${propertyId}.json`, 'utf8'));
}

function onSelectFile(e) {
  const fileList = e.target.files;

  for (var i = 0; i < fileList.length; i++) {
    files.push(fileList[i])

    const imagePreview = document.getElementById("image-preview")
    const newImage = document.createElement("img")

    newImage.className = "image-preview"
    newImage.src = URL.createObjectURL(fileList[i])
    newImage.id = `preview-${i}`

    imagePreview.appendChild(newImage)
  }
}

function render(files = null) {

  if (files === null) {
    files = fs.readdirSync(__dirname + '/data');
  }

  for(let i=0;i<files.length;i++){
    const currentFile = files[i]

    renderWrapper(currentFile)
  }
}

function filterByType() {
  const type = document.getElementById('type').value
  const images = document.getElementById('images')

  images.innerHTML = ''
}

function onClickResidence(e) {
  const residenceId = e.currentTarget.id

  if (e.srcElement.tagName === 'IMG') {
    const params = new URLSearchParams();
    params.append("id", residenceId);
    window.location.href = `${__dirname}/property.html?${params.toString()}`  
  }
}

function onEditProperty(e) {
  const modalElement = document.getElementById('exampleModal')
  const addResidenceButton = document.getElementById('add-residence')

  const propertyId = e.currentTarget.parentNode.id
  setCurrentPropertyId(propertyId)

  addResidenceButton.onclick = function() {
    saveData(propertyId)
  }
  addResidenceButton.textContent = 'Salvar'

  loadData(propertyId)

  let myModal = new bootstrap.Modal(modalElement, {});
  myModal.show();
}

function onRemoveProperty(e) {
  const currentPropertyId = getCurrentPropertyId()

  if (currentPropertyId && currentPropertyId !== null && currentPropertyId !== undefined && currentPropertyId !== '') {
    try {
      fs.rmSync(`${__dirname}/src/data/${currentPropertyId}`, { recursive: true, force: true }, function(err) {
        if (err) {
          throw new Error(err)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  location.reload()
}

function renderWrapper(propertyId) {
  const pathName = path.join( __dirname + '/data', propertyId);
  const images = fs.readdirSync(`${pathName}/images`);

  const imageDiv = document.getElementById('images')
  const residenceWrapper = document.createElement('div')

  const dataPath = `${__dirname}/data/${propertyId}/${propertyId}.json` 
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  residenceWrapper.className = 'residence-wrapper'
  residenceWrapper.id = data.id
  residenceWrapper.onclick = onClickResidence

  const removeButton = document.createElement('div')
  const removeButtonIcon = document.createElement('span')
  const editButton = document.createElement('div')
  const editButtonIcon = document.createElement('span')

  removeButton.setAttribute('data-bs-toggle', 'modal');
  removeButton.setAttribute('data-bs-target', '#remove-modal');

  const editIcon = document.createElement('span')
  const removeIcon = document.createElement('span')

  editIcon.className = 'material-icons'
  editIcon.textContent = 'edit'

  removeIcon.className = 'material-icons'
  removeIcon.textContent = 'clear'

  removeButton.onclick = function () {
    setCurrentPropertyId(propertyId)
  }

  removeButton.className = 'remove-button'

  removeButton.appendChild(removeIcon)
  editButton.appendChild(editIcon)

  editButton.onclick = onEditProperty
  editButton.className = 'edit-button'

  removeButton.appendChild(removeButtonIcon)
  editButton.appendChild(editButtonIcon)

  residenceWrapper.appendChild(removeButton)
  residenceWrapper.appendChild(editButton)

  if (images.length > 0) {
    renderImage(`data/${propertyId}/images/${images[0]}`, residenceWrapper)
  } else {
    renderImage(__dirname +'/assets/no-image.png', residenceWrapper)
  }

  renderData(data, residenceWrapper)

  imageDiv.appendChild(residenceWrapper)
}

function renderImage(imagePath, residenceWrapper) {
  const newImage = document.createElement('img')

  newImage.src = imagePath

  residenceWrapper.appendChild(newImage)
}

function renderData(data, residenceWrapper) {
  const residenceData = document.createElement('div')

  residenceData.id = 'residence-specs'

  const wrappper1 = document.createElement('div')
  const wrappper2 = document.createElement('div')
  const wrappper3 = document.createElement('div')

  const icon1 = document.createElement('span')
  const icon2 = document.createElement('span')
  const icon3 = document.createElement('span')

  const span1 = document.createElement('span')
  const span2 = document.createElement('span')
  const span3 = document.createElement('span')

  wrappper1.className = 'info-wrapper'
  wrappper2.className = 'info-wrapper'
  wrappper3.className = 'info-wrapper'

  icon1.className = 'material-icons'
  icon1.textContent = 'open_in_full'

  icon2.className = 'material-icons'
  icon2.textContent = 'hotel'

  icon3.className = 'material-icons'
  icon3.textContent = 'bathtub'

  wrappper1.appendChild(icon1)
  wrappper1.appendChild(span1)
  wrappper2.appendChild(icon2)
  wrappper2.appendChild(span2)
  wrappper3.appendChild(icon3)
  wrappper3.appendChild(span3)

  const residenceNameEl = document.createElement('h4')

  span1.textContent = `MT²: ${data.mt ? data.mt : '-'}`
  span2.textContent = `QUARTOS: ${data.rooms ? data.rooms : '-'}`
  span3.textContent = `BANHEIROS: ${data.bathrooms ? data.bathrooms : '-'}`

  residenceNameEl.style.textAlign = 'center'
  residenceNameEl.style.maxWidth = '330px'
  residenceNameEl.style.marginTop = '10px'
  residenceNameEl.style.color = '#777'
  residenceNameEl.textContent = data.name || '-'

  residenceData.appendChild(wrappper1)
  residenceData.appendChild(wrappper2)
  residenceData.appendChild(wrappper3)

  residenceWrapper.appendChild(residenceData)
  residenceWrapper.appendChild(residenceNameEl)
}

function saveFiles(id) {
  for (var i = 0; i < files.length; i++) {
    const file = files[i]
    const fileName = file.name
    const filePath = __dirname + `/src/data/${id}/images/${fileName}`

    try {
      const reader = new FileReader()

      reader.readAsArrayBuffer(file)

      reader.onload = function(event) {
        const data = event.target.result
        const buffer = Buffer.from(data)

        fs.writeFileSync(filePath, buffer, function(err) {
          if (err) {
            throw new Error(err)
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}

function createDirectory(id) {
  const dir = __dirname + `/src/data/${id}/images`;

  fs.mkdirSync(dir, { recursive: true });
}

function getListItems() {
  const list = document.getElementById('list')
  const listItems = list.children

  const arrayList = []

  for (let i = 0; i < listItems.length; i++) {
    const currentItem = listItems[i];

    arrayList.push(currentItem.textContent)
  }

  return arrayList
}

function onClickImagePreview(e) {
  const propertyId = getCurrentPropertyId()
  const pathName = path.join(__dirname + '/src/data', propertyId)

  const imageName = e.target.id

  const imagePreview = document.getElementById('image-preview')
  imagePreview.removeChild(e.target)

  fs.unlinkSync(`${pathName}/images/${imageName}`)
}

function loadImages(propertyId) {
  const pathName = path.join(__dirname + '/src/data', propertyId)
  const images = fs.readdirSync(`${pathName}/images`)

  const imagePreview = document.getElementById("image-preview")

  imagePreview.innerHTML = ''

  for (let i = 0; i < images.length; i++) {
    const currentImage = images[i];

    const newImage = document.createElement("img")

    newImage.className = "image-preview"
    newImage.src = `${__dirname}/data/${propertyId}/images/${currentImage}`
    newImage.id = images[i]
    newImage.onclick = onClickImagePreview

    imagePreview.appendChild(newImage)
  }
}

function loadList(list = []) {
  const listElement = document.getElementById('list')

  listElement.innerHTML = ''

  for (let i = 0; i < list.length; i++) {
    const currentItem = list[i];

    const listItem = document.createElement('li')
    listItem.className = 'list-group-item'
    listItem.textContent = currentItem
    listItem.onclick = onClickListItem
    listElement.appendChild(listItem)
  }
}

function loadData(propertyId) {
  const propertyData = getPropertyData(propertyId)

  const nameEl = document.getElementById('name')
  const city = document.getElementById('city')
  const description = document.getElementById('description')
  const type = document.getElementById('type')
  const status = document.getElementById('status')
  const rooms = document.getElementById('rooms')
  const lat = document.getElementById('lat')
  const long = document.getElementById('long')
  const bathrooms = document.getElementById('bathrooms')
  const mt = document.getElementById('mt')
  const value = document.getElementById('value')

  loadList(propertyData.list)
  loadImages(propertyId)

  nameEl.value = propertyData.name
  city.value = propertyData.city
  description.value = propertyData.description
  type.value = propertyData.type
  status.value = propertyData.status
  rooms.value = propertyData.rooms
  lat.value = propertyData.lat
  long.value = propertyData.long
  bathrooms.value = propertyData.bathrooms
  mt.value = propertyData.mt
  value.value = propertyData.value
}

function clearModalFields() {
  const nameEl = document.getElementById('name')
  const city = document.getElementById('city')
  const description = document.getElementById('description')
  const type = document.getElementById('type')
  const status = document.getElementById('status')
  const rooms = document.getElementById('rooms')
  const lat = document.getElementById('lat')
  const long = document.getElementById('long')
  const bathrooms = document.getElementById('bathrooms')
  const mt = document.getElementById('mt')
  const value = document.getElementById('value')
  const list = document.getElementById('list')
  const imagePreview = document.getElementById('image-preview')
  const addFileInput = document.getElementById('add-file')

  nameEl.value = ''
  city.value = ''
  description.value = ''
  type.value = ''
  status.value = ''
  rooms.value = ''
  lat.value = ''
  long.value = ''
  bathrooms.value = ''
  mt.value = ''
  value.value = ''
  addFileInput.value = ''
  list.innerHTML = ''
  imagePreview.innerHTML = ''
}

function saveData(id) {
  const nameEl = document.getElementById('name')
  const city = document.getElementById('city')
  const description = document.getElementById('description')
  const type = document.getElementById('type')
  const status = document.getElementById('status')
  const rooms = document.getElementById('rooms')
  const lat = document.getElementById('lat')
  const long = document.getElementById('long')
  const bathrooms = document.getElementById('bathrooms')
  const mt = document.getElementById('mt')
  const value = document.getElementById('value')
  const listItems = getListItems()

  const data = {
    id: id,
    name: nameEl.value,
    city: city.value,
    description: description.value,
    type: type.value,
    status: status.value,
    rooms: rooms.value,
    lat: lat.value,
    long: long.value,
    bathrooms: bathrooms.value,
    mt: mt.value,
    value: value.value,
    list: listItems
  }

  createDirectory(id)
  fs.writeFileSync(`${__dirname}/src/data/${id}/${id}.json`, JSON.stringify(data));

  saveFiles(id)

  location.reload()
}

function onClickListItem(e) {
  const list = document.getElementById('list')

  list.removeChild(e.target)
}

function addItemList() {
  const inputList = document.getElementById('input-list')
  const list = document.getElementById('list')

  const listItem = document.createElement('li')

  if (inputList.value !== '') {
    listItem.className = 'list-group-item'
    listItem.textContent = inputList.value
    listItem.onclick = onClickListItem
    list.appendChild(listItem)
  }
}

function getCurrentPropertyId() {
  const currentProperty = document.getElementById('current-property')

  return currentProperty.value
}

function setCurrentPropertyId(id) {
  const currentProperty = document.getElementById('current-property')

  currentProperty.value = id
}

function onOpenModal() {
  const addResidenceButton = document.getElementById('add-residence')
  clearModalFields()

  addResidenceButton.textContent = 'Adicionar'
  addResidenceButton.onclick = onAddResidence
}

function onAddResidence() {
  const id = uuid.v4()

  saveData(id)
}

function onSearch(e) {
  const searchInput = document.getElementById('search')
  const filter = searchInput.value.toLowerCase();
  const nodes = document.getElementsByClassName('residence-wrapper');

  for (i = 0; i < nodes.length; i++) {
    const titleElement = nodes[i].getElementsByTagName('h4')[0]

    if (titleElement.innerText.toLowerCase().includes(filter)) {
      nodes[i].style.display = "block";
    } else {
      nodes[i].style.display = "none";
    }
  }
}

addFile.onchange = onSelectFile
addResidenceButton.onclick = onAddResidence

render()