import "../../styleSheets/mainMenu.css";
import { useNavigate } from "react-router-dom";
import Image from "../Images/elgato.png";
import elgato1 from "../Images/elgato_full_1.png";
import elgato2 from "../Images/elgato_full_2.png";
import elgato3 from "../Images/elgato_full_3.png";
import elgato4 from "../Images/elgato_full_4.png";
import { useLocation } from "react-router-dom";

export default function SideBar() {
  const navigate = useNavigate();

  const location = useLocation();

  const isCurrentPage = (path) => location.pathname === path;


  return (
    <div>
    {/* Left panel */}
    <div className="SidePanel" id="picBorder">
        <div>
        <p
            className="normalTB"
            style={{
            fontSize: "30px",
            lineHeight: "1.2",
            marginBottom: "10px",
            }}
        >
            Site Directory
        </p>

        <div
            style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            }}
        >
            <div style={{ margin: "2px" }}>
            <button
                disabled={isCurrentPage('/')}
                className = "menu-button"
                onClick={() => navigate("/")}
                style={{ fontSize: "18px" }}
            >
                Home
            </button>
            </div>

            <div style={{ margin: "2px" }}>
                <button
                    disabled={isCurrentPage('/prebattle')}
                    className="menu-button"
                    onClick={() => navigate("/prebattle")}
                    style={{ fontSize: "18px" }}
                >
                    Play!
                </button>
            </div>
            <div style={{ margin: "2px" }}>
                <button
                    disabled={isCurrentPage('/catalog')}
                    className="menu-button"
                    //onClick={() => 
                    style={{ fontSize: "16px" }}
                >
                    Catalog
                </button>
            </div>
            <div style={{ margin: "2px" }}>
                <button
                    disabled={isCurrentPage('/tutorial')}
                    className="menu-button"
                    onClick={() => navigate("/tutorial")}
                    style={{ fontSize: "18px" }}
                >
                    Tutorial
                </button>
            </div>
            <div style={{ margin: "2px" }}>
                <button
                    disabled={isCurrentPage('/account')}
                    className="menu-button"
                    onClick={() => navigate("/account")}
                    style={{ fontSize: "18px" }}
                >
                    Account
                </button>
            </div>
         </div>
        </div>
    </div>
</div>);
}