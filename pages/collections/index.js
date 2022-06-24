import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import Meta from "../../components/Meta"

const Collection = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [collections, setCollections] = useState([])

  const fetchCollections = async () => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    axios({
      method: 'GET',
      url: `${serverUrl}/collections`
    })
      .then((response) => {
        setCollections(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  return (
    <>
      <Meta title="Collections" />
      {
        isLoading ?
          <p>Loading collections...</p> :
        !collections.length ?
          <p>No collection yet</p> :
          <div className="grid grid-cols-3 gap-8">
            {
              collections.map((collection) => (
                <Link key={collection.id} href={`/collections/${collection.id}`}>
                  <a className="border border-black mb-8">
                    <img src={collection.tokens[0]} />
                  </a>
                </Link>
              ))
            }
          </div>
      }
      <Link href="/">
        <a className="py-4 px-6 flex items-center justify-center text-5xl
        text-neon font-bold leading-none bg-white border border-black">
          + New Entry
        </a>
      </Link>
    </>
  )
}

export default Collection
