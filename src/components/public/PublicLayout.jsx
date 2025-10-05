// src/layouts/PublicLayout.js
import { Outlet, } from "react-router-dom";
import Header from "../headers/Header";
import Footer from "../headers/Footer";
// import "../styles/PublicLayout.css";

const PublicLayout = () => {
  // const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout-container">
      <Header/>

      <main className="main">
        <Outlet />
      </main>

       <Footer/>
       
    </div>
  );
};

export default PublicLayout;
