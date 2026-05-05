import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { IMAGES } from "@/assets/images";

const Layout = ({ images }: { images: any }) => {
  return (
    <div className="flex">
      <Header />
      <section id="container">
        {}
        <Outlet context={IMAGES} />
      </section>
      <Footer />
    </div>
  );
};

export default Layout;