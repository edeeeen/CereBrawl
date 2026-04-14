import "../../styleSheets/mainMenu.css";
import { useNavigate } from "react-router-dom";
import Image from "../Images/elgato.png";

export default function HomeContent() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div
        className="pageHead"
        id="picBorder"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div
          style={{
            width: "fit-content",
            height: "fit-content",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h1
            className="normalTB"
            style={{
              fontSize: "48px",
              marginBottom: "0px",
              padding: "0px",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            Welcome to CereBrawl!
          </h1>

          <h4
            style={{
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingBottom: "20px",
              paddingTop: "0px",
              margin: "0px",
              fontSize: "22px",
            }}
          >
            The Battle Style Study Guide
          </h4>
        </div>

        <img
          src={Image}
          style={{
            margin: "1rem",
            border: "5px inset #11576a",
            background: "grey",
          }}
        />
      </div>

      <div className="BodyBox">
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
                -{" "}
                <button
                  onClick={() => navigate("/")}
                  style={{ width: "fit-content", fontSize: "18px" }}
                >
                  Home
                </button>
              </div>

              <div style={{ margin: "2px" }}>
                -{" "}
                <button
                  onClick={() => navigate("/prebattle")}
                  style={{ width: "fit-content", fontSize: "18px" }}
                >
                  Play!
                </button>
              </div>

              <div style={{ margin: "2px" }}>
                -{" "}
                <button
                  onClick={() => navigate("/account")}
                  style={{ width: "fit-content", fontSize: "18px" }}
                >
                  Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle panel */}
        <div className="MiddlePanel" id="picBorder">
          <div className="MidInfo">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <h2
                className="normalTB"
                style={{ fontSize: "40px" }}
              >
                What is
              </h2>

              <h1
                style={{
                  margin: "0",
                  fontSize: "44px",
                }}
                id="rainbow"
              >
                CereBrawl?
              </h1>
            </div>

            <p
              style={{
                marginTop: "0",
                marginLeft: "1rem",
                marginRight: "1rem",
                fontSize: "22px",
              }}
            >
              CereBrawl is your brand-new fun and interactive study tool!
              Based on the popular turn-based battle video-games you're used
              to, this tool is meant to elevate your learning experience by
              combining a specific amount of learning, challenge, and
              (most importantly) fun into a game that YOU can curate almost
              entirely yourself using just some of our guidelines!
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="SidePanel" id="picBorder">
          <p
            style={{
              margin: "12px",
              color: "black",
              fontSize: "24px",
              lineHeight: "1.5",
            }}
          >
            Welcome to the battle academy
          </p>
        </div>
      </div>
    </div>
  );
}