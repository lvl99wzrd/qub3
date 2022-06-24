import Header from "./Header"
import Sidebar from "./Sidebar"

const Layout = ({children}) => {
  return (
    <>
      <Header />
      <main className="container my-12">
        <div className="grid grid-cols-5 gap-8">
          <div>
            <Sidebar />
          </div>
          <div className="col-span-4">
            {children}
          </div>
        </div>
      </main>
    </>
  )
}

export default Layout
