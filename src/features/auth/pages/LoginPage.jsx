import Navbar from "../../../components/common/layout/Navbar"
import LoginForm from "../components/LoginForm"

const LoginPage = () => {
       return (
              <main className="min-h-svh min-w-svw">
                     <div className="xl:max-w-[1400px] md:max-w-4xl mx-auto flex flex-col h-svh">
                            <Navbar />
                            <LoginForm />
                     </div>
              </main>
       )
}

export default LoginPage
