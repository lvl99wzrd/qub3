import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"

const SingleCollection = () => {
  const router = useRouter()
  const { id } = router.query

  const [isLoading, setIsLoading] = useState(true)
  const [collection, setCollection] = useState([])

  useEffect(() => {
    const fetchCollection = async () => {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
      axios({
        method: 'GET',
        url: `${serverUrl}/collections/${id}`
      })
        .then((response) => {
          console.log(response)
          setCollection(response.data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    fetchCollection()
  }, [id])

  return (
    <>
      {
        !isLoading &&
        <>
          <h1 className="text-5xl font-bold mb-6">
            { collection.name }
          </h1>
          <div className="grid grid-cols-5 gap-6">
            {
              collection.tokens.map((url, index) => (
                <img src={url} key={index} className="border border-black" />
              ))
            }
          </div>
        </>
      }
    </>
  )
}

export default SingleCollection
