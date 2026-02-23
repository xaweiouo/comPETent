import { Outlet } from "react-router"
import Header from "../components/Header"
import Footer from "../components/Footer"
const FrontendLayout = () => {
    return (
        <main>
            <Header/>
            <Outlet />
            <Footer />
        </main>
    )
}
export default FrontendLayout


