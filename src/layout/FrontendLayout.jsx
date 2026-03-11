import { Outlet } from "react-router"
import Navbar from "../components/NavBar"
import Footer from "../components/Footer"
const FrontendLayout = () => {
    return (
        <main>
            <Navbar/>
            <Outlet />
            <Footer />
        </main>
    )
}
export default FrontendLayout


