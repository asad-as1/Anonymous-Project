import './App.css'
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar"
import Footer from "./Components/Footer/Footer"
import  ScrollToTop from "../ScrollToTop"


function App() {

  return (
   <div>
    <Navbar/>
    <main>
    <ScrollToTop />
      <Outlet/>
    </main>
    <Footer/>
   </div>
  )
}

export default App
