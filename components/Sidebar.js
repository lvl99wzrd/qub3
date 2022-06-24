import Link from "next/link"
import { useRouter } from "next/router"

const Sidebar = () => {
  const router = useRouter()

  return (
    <nav className="flex flex-col uppercase font-bold text-xl">
      <Link href="/">
        <a className={router.pathname === '/' ? 'bg-white text-neon px-1' : ' px-1'}>
          Mint
        </a>
      </Link>
      <Link href="/collections">
        <a className={router.pathname === '/collections' ? 'bg-white text-neon px-1' : ' px-1'}>
          Manage Collection
        </a>
      </Link>
    </nav>
  )
}

export default Sidebar
