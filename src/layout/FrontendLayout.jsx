import { Outlet } from "react-router"
import Header from "../components/Header"
const FrontendLayout = () => {
    return (
        <main>
            <Header/>
            <Outlet />
        </main>
    )
}
export default FrontendLayout


