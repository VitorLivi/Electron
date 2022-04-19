const path = require('path')
const fs = require('fs')

const propertyId = getPropertyId()
const propertyData = getPropertyData()

function getPropertyData() {
  return JSON.parse(fs.readFileSync(`./src/data/${propertyId}/${propertyId}.json`, 'utf8'));
}

function returnToHome() {
  window.location.href = './index.html'
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

  propertyDescription.innerText = propertyData.description
}

function renderImages() {
  const pathName = path.join('./src/data', propertyId);
  const images = fs.readdirSync(`${pathName}/images`);

  if (!images) {
    return
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
    newImage.src = `data/${propertyId}/images/${currentImage}`

    newImageWrapper.appendChild(newImage)

    imageIndicator.appendChild(newIndicator)
    imageContainer.appendChild(newImageWrapper)
  }
}

renderTitle()
renderData()
renderImages()