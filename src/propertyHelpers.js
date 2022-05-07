const currencyFormatter = require('currency-formatter')
const path = require('path')
const fs = require('fs')

const propertyId = getPropertyId()
const propertyData = getPropertyData()

function getPropertyData() {
  return JSON.parse(fs.readFileSync(`${__dirname}/data/${propertyId}/${propertyId}.json`, 'utf8'));
}

function returnToHome() {
  window.location.href = `${__dirname}/index.html`
}

function getPropertyId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderTitle() {
  const propertyTitle = document.getElementById('property-title')

  propertyTitle.innerText = propertyData.name
}

function renderData() {
  const propertyDescription = document.getElementById('property-description')
  const propertyHeader = document.getElementById('property-header')
  const propertyPrice = document.getElementById('property-price')
  const propertyInfo = document.getElementById('property-info')
  const topInfo = document.getElementById('top-info')

  const propertyId = document.createElement('span')
  const propertyType = document.createElement('span')
  const propertyStatus = document.createElement('span')
  const propertyPriceContent = document.createElement('span')
  const propertyMtrs = document.createElement('span')
  const propertyRooms = document.createElement('span')
  const propertyBathrooms = document.createElement('span')
  const propertyPhone = document.createElement('span')
  const lastUpdate = document.createElement('span')
  const dataWrapper = document.createElement('div')

  propertyId.textContent = 'ID: ' + propertyData.id
  propertyType.textContent = 'Tipo: ' + (propertyData.type || '-')
  propertyStatus.textContent = 'Status: ' + (propertyData.status || '-')
  propertyMtrs.textContent = 'Mt²: ' + (propertyData.mt || '-')
  propertyRooms.textContent = 'Quartos: ' + (propertyData.rooms || '-')
  propertyBathrooms.textContent = 'Banheiros: ' + (propertyData.bathrooms || '-')

  propertyPriceContent.textContent = currencyFormatter.format(propertyData.value, { code: 'BRL' });

  const lastUpdateDate = new Date(propertyData.updated_at)

  propertyPhone.textContent = ('Telefone: ' + (propertyData.phone || '(00) 0000-0000'))
  lastUpdate.textContent = lastUpdateDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  dataWrapper.className = 'data-wrapper'
  dataWrapper.appendChild(propertyPhone)
  dataWrapper.appendChild(lastUpdate)

  propertyPrice.appendChild(propertyPriceContent)
  topInfo.appendChild(propertyId)
  topInfo.appendChild(propertyType)
  topInfo.appendChild(propertyStatus)
  propertyInfo.appendChild(propertyMtrs)
  propertyInfo.appendChild(propertyRooms)
  propertyInfo.appendChild(propertyBathrooms)
  propertyHeader.appendChild(dataWrapper)

  propertyDescription.innerText = propertyData.description
}

function renderImages() {
  const pathName = path.join(__dirname + '/data', propertyId);
  let images = fs.readdirSync(`${pathName}/images`);

  let imagePath = `data/${propertyId}/images/`

  if (images < 1) {
    imagePath = 'assets/'
    images = ['no-image.png']
  }

  const imageContainer = document.getElementById('image-container')
  const imageIndicator = document.getElementById('image-indicator')

  for (let i = 0; i < images.length; i++) {
    const currentImage = images[i];
    const isFirst = (i === 0)

    const newImage = document.createElement('img') 
    const newIndicator = document.createElement('button')
    const newImageWrapper = document.createElement('div')

    newIndicator.type = 'button'
    newIndicator.className = (isFirst ? 'active' : '')
    newIndicator.ariaCurrent = (isFirst ? 'true' : '')
    newIndicator.ariaLabel = `Slide ${i + 1}`
    newIndicator.setAttribute('data-bs-target', '#carouselExampleIndicators')
    newIndicator.setAttribute('data-bs-slide-to', `${i}`)

    newImageWrapper.className = 'carousel-item' + (isFirst ? ' active' : '')

    newImage.className = 'd-block w-100'
    newImage.src = imagePath + currentImage

    newImageWrapper.appendChild(newImage)

    imageIndicator.appendChild(newIndicator)
    imageContainer.appendChild(newImageWrapper)
  }
}

function renderLocation() {
  const { lat, long } = propertyData

  console.log(lat, long)

  if (!lat || !long) {
    return
  }

  const propertyLocation = document.getElementById('location')
  const iFrame = document.createElement('iframe')

  iFrame.width = '100%'
  iFrame.height = '500px'
  iFrame.src = `https://maps.google.com/maps?q=${lat},${long}&t=&z=15&ie=UTF8&iwloc=&output=embed` 
  iFrame.marginHeight = '0'
  iFrame.marginWidth = '0'

  propertyLocation.appendChild(iFrame)
}

function renderList() {
  const list = document.getElementById('list')

  for (let i = 0; i < propertyData?.list?.length; i++) {
    const currentItem = propertyData.list[i];
   
    const listItem = document.createElement('li')
    listItem.className = 'list-group-item'

    listItem.innerText = currentItem
    list.appendChild(listItem)
  } 
}


renderTitle()
renderData()
renderList()
renderImages()
renderLocation()