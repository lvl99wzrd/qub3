import { useState, useEffect } from "react"
import { useFileUpload } from "use-file-upload"
import { every, filter, forEach, findIndex, concat, omit } from "lodash"
import axios from "axios"
import Image from "next/image"
import Meta from "../components/Meta"

const Home = () => {
  const defaultData = {
    type: 'edition',
    tokens: [],
    supply: '',
    free: false,
    price: '',
    launch: '',
    name: '',
    description: '',
    royalty: ''
  }
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [files, selectFiles] = useFileUpload()
  const [allowed, setAllowed] = useState(false)
  const [data, setData] = useState(defaultData)

  const handleChange = (e) => {
    const { id, value, type } = e.target
    setData(prevData => ({
      ...prevData,
      [id]: type === 'checkbox' ? e.target.checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    console.log(data)
    
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        setProgress(Math.round((event.loaded * 100) / event.total))
        console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total))
      },
    }

    const sendData = {...data, fileCount: data.tokens.length}

    axios.post('/api/create', sendData, config)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
        setData(defaultData)
      })
  }

  const onClickUpload = (e) => {
    e.preventDefault()
    const allowed = 'image/png,image/jpeg,image/gif,image/webp,.mp4,.mp3'
    selectFiles({ accept: allowed, multiple: true }, (files) => {
      let newFiles = []
      forEach(files, (file) => {
        const exists = findIndex(data.tokens, (o) => {
          return o.name === file.name
        })

        if (exists < 0) {
          newFiles = concat(newFiles, file)
        }
      })
      newFiles = concat(newFiles, data.tokens)
      console.log(newFiles)
      setData(prevData => ({
        ...prevData,
        tokens: newFiles
      }))
      files.map(({ source, name, size, file }) => {
        console.log({ source, name, size, file })
      })
    })
  }

  const removeFile = (file) => {
    const newFiles = filter(data.tokens, (o) => {
      return o.name !== file.name
    })
    setData(prevData => ({
      ...prevData,
      tokens: newFiles
    }))
  }

  const typeChoices = {
    edition: 'EDITION',
    single: 'SINGLE',
    pack: 'PACK',
  }

  useEffect(() => {
    const checks = data.free ? omit(data, ['price']) : omit(data, ['free'])
    setAllowed(!isLoading && every(checks, Boolean))
  }, [isLoading, data])

  return (
    <>
      <Meta title="" />

      <form className="max-w-md" onSubmit={handleSubmit}>
        {/* Type */}
        <div className="mb-2">
          <label
            htmlFor="type"
            className="block uppercase"
          >
            Type
          </label>
          <select
            id="type"
            className="w-full border-black text-neon"
            value={data.type}
            onChange={handleChange}
          >
            {
              Object.keys(typeChoices).map((key) => {
                return <option value={key} key={key}>{typeChoices[key]}</option>
              })
            }
          </select>
        </div>

        {/* Token */}
        <div className="mb-2">
          <label
            htmlFor="type"
            className="block uppercase"
          >
            Collection / Token
          </label>
          <div className="grid grid-cols-4 gap-4 items-center text-neon">
            {data.tokens && (
              data.tokens.map((file, index) => (
                <div key={index} className="relative aspect-square mb-2
                border border-black bg-white">
                  <Image
                    src={file.source}
                    className="object-contain object-center relative"
                    layout="fill"
                    alt='preview'
                  />
                  <button
                    type="button"
                    className="absolute flex items-center justify-center w-5 h-5
                    border border-neon leading-none top-1 right-1 bg-white
                    p-1 rounded-full"
                    onClick={() => { removeFile(file) }}
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
            <button
              className="aspect-square mb-2 border border-black bg-white
              flex items-center justify-center text-6xl font-bold"
              onClick={onClickUpload}
            >
              +
            </button>
          </div>

          <div className="p-4 bg-white border border-black text-neon uppercase text-center">
            <p className="mb-4">JPG, PNG, GIF, WEBP, MP4 or MP3. Max 100MB.</p>
            <button
              className="border border-black py-2 px-4 uppercase bg-white"
              onClick={onClickUpload}
            >
              Upload File
            </button>
          </div>
        </div>

        {/* Supply */}
        <div className="mb-2">
          <label
            htmlFor="supply"
            className="block uppercase"
          >
            Supply
          </label>
          <input
            type="number"
            id="supply"
            className="w-full border-black text-neon"
            value={data.supply}
            onChange={handleChange}
          />
        </div>

        {/* Launch Date */}
        <div className="mb-2">
          <label
            htmlFor="launch"
            className="block uppercase"
          >
            Launch Date
          </label>
          <input
            type="date"
            id="launch"
            className="w-full border-black text-neon"
            value={data.launch}
            onChange={handleChange}
          />
        </div>

        {/* Free Mint */}
        <div className="my-4">
          <label
            htmlFor="free"
            className="uppercase flex justify-between items-center cursor-pointer"
          >
            Free Mint
            <div className="relative">
              <input
                id="free"
                type="checkbox"
                className="sr-only"
                value={data.free}
                onChange={handleChange}
              />
              <div className="block w-20 h-8 border border-black" />
              <div className={`absolute top-0 w-10 h-8 transition-all duration-300 border border-black
              ${!data.free ? 'left-0 bg-neutral-300' : 'left-1/2 bg-white' }`} />
            </div>
          </label>
        </div>

        {/* Price */}
        {
          !data.free &&
          <div className="mb-2">
            <label
              htmlFor="price"
              className="block uppercase"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              className="w-full border-black text-neon"
              value={data.price}
              onChange={handleChange}
            />
          </div>
        }

        {/* Name */}
        <div className="mb-2">
          <label
            htmlFor="name"
            className="block uppercase"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full border-black text-neon"
            value={data.name}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="mb-2">
          <label
            htmlFor="description"
            className="block uppercase"
          >
            Description
          </label>
          <textarea
            id="description"
            className="w-full border-black text-neon"
            rows={6}
            value={data.description}
            onChange={handleChange}
          />
        </div>

        {/* Royalty */}
        <div className="mb-2">
          <label
            htmlFor="royalty"
            className="block uppercase"
          >
            Royalty
          </label>
          <input
            type="number"
            id="royalty"
            className="w-full border-black text-neon"
            value={data.royalty}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="inline-block uppercase my-4 py-2 px-4
          text-neon border border-black bg-neutral-300 hover:bg-white
          disabled:hover:bg-neutral-300 disabled:cursor-not-allowed"
          disabled={!allowed}
        >
          Create
        </button>
      </form>
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center
      uppercase transition-opacity duration-500 z-50
      ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none' }`}>
        Processing...
      </div>
    </>
  )
}

export default Home
