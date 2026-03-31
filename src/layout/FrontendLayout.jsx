import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ScrollToTop from "../components/ScrollToTop"
const FrontendLayout = () => {
  return (
    <main>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  )
}
export default FrontendLayout


