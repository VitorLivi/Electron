const pdf = require('html-pdf');

const getSpecificPropertyData = (propertyId) => {
  return JSON.parse(fs.readFileSync(`${__dirname}/data/${propertyId}/${propertyId}.json`, 'utf8'));
}

const getSpecificPropertyImages = (propertyId) => {
  return fs.readdirSync(`${__dirname}/data/${propertyId}/images`)
}

function generatePdf () {
  const currentProperty = document.getElementById('current-property')

  const propertyId = currentProperty.value

  const propertyData = getSpecificPropertyData(propertyId)
  const porpertyImages = getSpecificPropertyImages(propertyId)

  const exportButton = document.getElementById('export-btn')
  const exportLoading = document.getElementById('export-loading')

  const content = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

      <style>
        .page-header {
          height: 50px;
          background-color: #0d6efd;
          display:flex;
        }

        .page-header h5 {
          color: #fff;
          margin-left: 10px;
        }
      </style>

    </head>
    <body>
      <div class="page-header d-flex">
        <h5>Data exportação: ${new Date().toLocaleDateString()}</h5>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <h1>${propertyData.name}</h1>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <ul class="list-group list-group-flush">
                ${propertyData.city ? `<li class="list-group-item">Cidade: ${propertyData.city}</li>` : ''}
                ${propertyData.type ? `<li class="list-group-item">Tipo: ${propertyData.type}</li>` : ''}
                ${propertyData.status ? `<li class="list-group-item">Status: ${propertyData.status}</li>` : ''}
                ${propertyData.rooms ? `<li class="list-group-item">Quartos: ${propertyData.rooms}</li>` : ''}
                ${propertyData.bathrooms ? `<li class="list-group-item">Banheiros: ${propertyData.bathrooms}</li>` : ''}
                ${propertyData.mt ? `<li class="list-group-item">M²: ${propertyData.mt}</li>` : ''}
                ${propertyData.value ? `<li class="list-group-item">Valor: ${propertyData.value}</li>` : ''}
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <p>${propertyData.description}</p>
          </div>
        </div>
        ${propertyData.list && propertyData.list.length > 0 ? `
          <div class="row">
            <div class="col-md-12">
              <h2>Características</h2>
              <ul class="list-group list-group-flush">
                ${propertyData.list.map(item => `<li class="list-group-item">${item}</li>`).join('')}
              </ul>
            </div>
          </div>
        ` : ''}
        <div class="row">
          <div class="col-md-12">
            ${
              porpertyImages.map(image => {
                const bitmap = fs.readFileSync(`${__dirname}/data/${propertyId}/images/${image}`);
                const base64 = new Buffer(bitmap).toString('base64');

                return `<img style="width:100%;" src="data:image/octet-stream;base64, ${base64}" alt="">`
              }).join(' ')
          }
          </div>
        </div>
      </div>
    </body>
  </html>
`

  exportButton.textContent = ''
  exportLoading.style.display = 'block'

  pdf.create(content, { format: 'A4' }).toFile(`${__dirname}/data/${propertyId}/${propertyId}.pdf`, (err, res) => {
    if (err) {
      console.log(err)
      alert('Erro ao gerar PDF')
    }

    exportButton.textContent = 'Exportar'
    exportLoading.style.display = 'none'
  })
}