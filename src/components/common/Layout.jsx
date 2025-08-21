import Navbar from "./layout/Navbar"


const Layout = ({ children }) => {
       return (
              <main className="min-h-svh min-w-svw">
                     <div className="2xl:max-w-screen xl:max-w-[1440px] mx-auto flex flex-col h-svh">
                            <Navbar />
                            <div className="flex-1">{children}</div>
                     </div>
              </main>
       )
}

export default Layout
