const fs = require('fs');
const path = require('path')
import { v4 as uuidv4 } from 'uuid';

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

function renderWrapper(residenceName) {
  const pathName = path.join('./src/data', residenceName);
  const images = fs.readdirSync(`${pathName}/images`);

  const imageDiv = document.getElementById('images')
  const residenceWrapper = document.createElement('div')

  residenceWrapper.className = 'residence-wrapper'

  renderImage(`data/${residenceName}/images/${images[0]}`, residenceWrapper)
  renderData(`./src/data/${residenceName}/${residenceName}.json`, residenceWrapper)

  imageDiv.appendChild(residenceWrapper)
}

function renderImage(imagePath, residenceWrapper) {
  const newImage = document.createElement('img')
  
  newImage.src = imagePath

  residenceWrapper.appendChild(newImage)
}

function renderData(dataPath, residenceWrapper) {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const residenceData = document.createElement('div')

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

function saveFiles(name) {
  for (var i = 0; i < files.length; i++) {
    const file = files[i]
    const fileName = file.name
    const filePath = `./src/data/${name}/images/${fileName}` 
  
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

function createDirectory(uuid) {
  const dir = `./src/data/${uuid}/images`;
  
  fs.mkdirSync(dir, { recursive: true });
}

function saveData(name) {
  const uuid = uuidv4()
  const nameEl = document.getElementById('name')
  const city = document.getElementById('city')
  const description = document.getElementById('description')
  const type = document.getElementById('type')
  const status = document.getElementById('status')
  const rooms = document.getElementById('rooms')
  const bathrooms = document.getElementById('bathrooms')
  const mt = document.getElementById('mt')
  const value = document.getElementById('value')

  createDirectory(uuid)

  const data = {
    uuid: uuid,
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

  fs.writeFileSync(`./src/data/${uuid}/${uuid}.json`, JSON.stringify(data));
}

function onAddResidence() {
  const name = document.getElementById('name')
  const alreadyExists = residenceExists(name.value)

  if (alreadyExists) {
    return
  }

  saveData(name.value)
  saveFiles(name.value)
}

addFile.onchange = onSelectFile
addResidenceButton.onclick = onAddResidence

render()