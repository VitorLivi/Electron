const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

const addFile = document.getElementById("add-file")
const addResidenceButton = document.getElementById("add-residence")

let files = []

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
  const params = new URLSearchParams();

  params.append("id", residenceId);

  window.location.href = `./property.html?${params.toString()}`
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

function saveData(id) {
  const nameEl = document.getElementById('name')
  const city = document.getElementById('city')
  const description = document.getElementById('description')
  const type = document.getElementById('type')
  const status = document.getElementById('status')
  const rooms = document.getElementById('rooms')
  const bathrooms = document.getElementById('bathrooms')
  const mt = document.getElementById('mt')
  const value = document.getElementById('value')

  createDirectory(id)

  const data = {
    id: id,
    name: nameEl.value,
    city: city.value,
    description: description.value,
    type: type.value,
    status: status.value,
    rooms: rooms.value,
    bathrooms: bathrooms.value,
    mt: mt.value,
    value: value.value
  }

  fs.writeFileSync(`./src/data/${id}/${id}.json`, JSON.stringify(data));
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