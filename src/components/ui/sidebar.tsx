import { useState } from "react";
import { Nav } from "./nav";
import { Menu, X, LogOut, Shield, Car, Home } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

type Props = {};

export default function Sidebar({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Burger menu button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md shadow-md md:hidden"
        onClick={toggleMenu}
      >
        {isOpen ? <X size={24} color="white" /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-full md:w-64 bg-black shadow-md transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="h-50px] flex justify-center items-center px-8">
            <div className="img_container h-[120px]">
              <img src={logo} alt="" className="w-full h-full bg-cover" />
            </div>
          </div>
          <div className="flex-grow">
            <Nav
              links={[
                {
                  title: "Cars ",
                  href: "/",
                  icon: Car,
                  variant: "default",
                },
                {
                  title: "Admins",
                  href: "/admins",
                  icon: Shield,
                  variant: "ghost",
                },
                {
                  title: "Brands",
                  href: "/brand",
                  icon: Home,
                  variant: "ghost",
                },
              ]}
              onLinkClick={() => setIsOpen(false)} // Close the sidebar on link click
            />
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full flex items-center"
          >
            <span className="mr-2">
              <LogOut size={16} />
            </span>
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
