import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import { concat, set } from 'lodash'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // parse form with a Promise wrapper
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm()
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err)
        resolve({ fields, files })
      })
    })

    try {
      const {
        type,
        name,
        description,
        free,
        launch,
        royalty,
        supply,
        price
      } = data.fields
      const newData = {
        type,
        name,
        description,
        free,
        launch,
        royalty,
        supply,
        price,
        tokens: []
      }
      
      const fileCount = parseInt(data.fields.fileCount)
      for (let i = 0; i < fileCount; i++) {
        const _file = data.files[`tokens.${i}.file`]
        const filePath = _file.filepath
        const pathToWrite = `public/collections/${_file.originalFilename}`
        const file = await fs.readFile(filePath)
        await fs.writeFile(pathToWrite, file)
        newData.tokens = concat(newData.tokens, `/collections/${_file.originalFilename}`)
      }

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
      const _newData = await fetch(`${serverUrl}/collections`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(newData)
      })

      const newEntry = await _newData.json()

      res.status(200).json(newEntry);
    } catch (error) {
      res.status(500).json({ message: error.message });
      return;
    }
  }
}
