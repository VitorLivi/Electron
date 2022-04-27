const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

const addFile = document.getElementById("add-file")
const addResidenceButton = document.getElementById("add-residence")

let files = []

function getPropertyData(propertyId) {
  return JSON.parse(fs.readFileSync(`./src/data/${propertyId}/${propertyId}.json`, 'utf8'));
}

function onSelectFile(e) {
  const fileList = e.target.files;

  for (var i = 0; i < fileList.length; i++) {
    files.push(fileList[i])
  
    const imagePreview = document.getElementById("image-preview")
    const newImage = document.createElement("img")

    newImage.className = "image-preview"
    newImage.src = URL.createObjectURL(fileList[0])
    newImage.id = `preview-${i}`

    imagePreview.appendChild(newImage)
  }
}

function render() {
  const files = fs.readdirSync('./src/data');

  for(let i=0;i<files.length;i++){
    const currentFile = files[i]
    
    renderWrapper(currentFile)
  }
}

function onClickResidence(e) {
  const residenceId = e.currentTarget.id

  if (e.srcElement.tagName === 'IMG') {
    const params = new URLSearchParams();
    params.append("id", residenceId);
    window.location.href = `./property.html?${params.toString()}`  
  }
}

function onEditProperty(e) {
  const modalElement = document.getElementById('exampleModal')
  const addResidenceButton = document.getElementById('add-residence')

  const propertyId = e.currentTarget.parentNode.id
  
  addResidenceButton.textContent = 'Salvar'
  loadData(propertyId)

  let myModal = new bootstrap.Modal(modalElement, {});
  myModal.show();
}

function updateProperty () {

}

function renderWrapper(residenceId) {
  const pathName = path.join('./src/data', residenceId);
  const images = fs.readdirSync(`${pathName}/images`);

  const imageDiv = document.getElementById('images')
  const residenceWrapper = document.createElement('div')

  const dataPath = `./src/data/${residenceId}/${residenceId}.json` 
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  residenceWrapper.className = 'residence-wrapper'
  residenceWrapper.id = data.id
  residenceWrapper.onclick = onClickResidence

  const removeButton = document.createElement('div')
  const removeButtonIcon = document.createElement('span')
  const editButton = document.createElement('div')
  const editButtonIcon = document.createElement('span')

  removeButton.className = 'remove-button'
  removeButtonIcon.textContent = 'x'

  editButton.onclick = onEditProperty
  editButton.className = 'edit-button'
  editButtonIcon.textContent = '✎'

  removeButton.appendChild(removeButtonIcon)
  editButton.appendChild(editButtonIcon)

  residenceWrapper.appendChild(removeButton)
  residenceWrapper.appendChild(editButton)

  renderImage(`data/${residenceId}/images/${images[0]}`, residenceWrapper)
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

  const span1 = document.createElement('span')
  const span2 = document.createElement('span')
  const span3 = document.createElement('span')

  const residenceNameEl = document.createElement('h4')

  span1.textContent = `MT²: ${data.mt}`
  span2.textContent = `QUARTOS: ${data.rooms}`
  span3.textContent = `BANHEIROS: ${data.bathrooms}`

  residenceNameEl.style.textAlign = 'center'
  residenceNameEl.style.maxWidth = '330px'
  residenceNameEl.textContent = data.name

  residenceData.appendChild(span1)
  residenceData.appendChild(span2)
  residenceData.appendChild(span3)

  residenceWrapper.appendChild(residenceData)
  residenceWrapper.appendChild(residenceNameEl)
}

function saveFiles(id) {
  for (var i = 0; i < files.length; i++) {
    const file = files[i]
    const fileName = file.name
    const filePath = `./src/data/${id}/images/${fileName}` 
  
    const reader = new FileReader()
  
    reader.readAsArrayBuffer(file)
  
    reader.onload = function(event) {
      const data = event.target.result
      const buffer = Buffer.from(data)
  
      fs.writeFile(filePath, buffer, function(err) {
        if (err) {
          console.log(err)
        }
      })
    }
  }
}

function residenceExists(name) {
  if (fs.existsSync(`./src/data/${name}`)) {
    return true
  }

  return false
}

function createDirectory(id) {
  const dir = `./src/data/${id}/images`;
  
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

function loadImages(propertyId) {
  const pathName = path.join('./src/data', propertyId);
  const images = fs.readdirSync(`${pathName}/images`);

  const imagePreview = document.getElementById("image-preview")

  imagePreview.innerHTML = ''

  for (let i = 0; i < images.length; i++) {
    const currentImage = images[i];

    const newImage = document.createElement("img")

    newImage.className = "image-preview"
    newImage.src = `./data/${propertyId}/images/${currentImage}`
    newImage.id = `preview-${i}`
  
    imagePreview.appendChild(newImage)
  }
}

function loadList(list = []) {
  
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

function saveData(id, exist = false) {
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

  if (!exist) {
    createDirectory(id)
    fs.writeFileSync(`./src/data/${id}/${id}.json`, JSON.stringify(data));
  } else {

  }
}

function addItemList() {
  const inputList = document.getElementById('input-list')
  const list = document.getElementById('list')

  const listItem = document.createElement('li')

  if (inputList.value !== '') {
    listItem.className = 'list-group-item'
    listItem.textContent = inputList.value
    list.appendChild(listItem)
  }
}

function onOpenModal() {
  const addResidenceButton = document.getElementById('add-residence')

  addResidenceButton.textContent = 'Adicionar'
}

function onAddResidence() {
  const id = uuid.v4()
  const name = document.getElementById('name')
  const alreadyExists = residenceExists(name.value)

  if (alreadyExists) {
    return
  }

  saveData(id)
  saveFiles(id)
}

addFile.onchange = onSelectFile
addResidenceButton.onclick = onAddResidence

render()