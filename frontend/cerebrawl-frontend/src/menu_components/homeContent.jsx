import "../../styleSheets/mainMenu.css";
import { useNavigate } from "react-router-dom";
import SideBar from "./sideBar.jsx";
import Image from "../Images/elgato.png";
import elgato1 from "../Images/elgato_full_1.png";
import elgato2 from "../Images/elgato_full_2.png";
import elgato3 from "../Images/elgato_full_3.png";
import elgato4 from "../Images/elgato_full_4.png";

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
        <SideBar />

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
          <div className="MidInfo">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <h2
                className="normalTB"
                style={{ fontSize: "40px" }}
              >
                What to do on 
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
              <b>Home</b> - You're already there! Learn a quick introduction to our site and its features and get a rundown of how to use it. <br />
              <b>Play!</b> - Put your Cerebral Cortex to the test and start battling! Either generate your own quiz using Google Gemini's API or pick from our pre-made quizzes in the Catalog! <br />
              <b>Catalogue</b> - Browse through user's premade quizzes and choose one to battle with! <br />
              <b>Tutorial</b> - Learn the basics of the battle system in this interactive tutorial! <br />
              <b>Account</b> - Sign up or log into your account, so you can save your quizzes to the catalogue!
            </p>
          </div>
          <div className="MidInfo">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <h2
                className="normalTB"
                style={{ fontSize: "40px" }}
              >
                A quick note on 
              </h2>

              <h1
                style={{
                  margin: "0",
                  fontSize: "44px",
                }}
                id="rainbow"
              >
                Generative AI...
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
              CereBrawl's battle system is powered by Google Gemini's API. This means that the questions are completely generated by the LLM, and have no check for accuracy. 
              We STRONGLY reccomend that you check your generated questions for accuracy, if you are using this as a study tool.
            </p>
          </div>
          <div className="MidInfo">
            <div style={{ display: "flex", flexDirection: "row" }}>
            </div>

            <p
              style={{
                marginTop: "0",
                marginLeft: "1rem",
                marginRight: "1rem",
                fontSize: "22px",
              }}
            >
              CereBrawl created by Jackson McElhaugh, Logan Small, Kaiden Fees, and Liam Anderson as a part of the Projects in Computer Science
              Capstone Course at Temple University. 
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="SidePanel" id="picBorder">
          <h2
            className="normalTB"
            style={{ fontSize: "20px" }}
            >
              Elgato's Tips and <br /> Tricks on Items!
          </h2>
          <p
              style={{
                marginTop: "0",
                marginLeft: "1rem",
                marginRight: "1rem",
                fontSize: "22px",
              }}
            >
              * Elixer - Heals 10 hp <br />
              * Super Elixer - Heals 20 hp <br />
              * Mega Elixer - Heals 30 hp <br />
              * Damage Boost - If successful, your next <br />attack deals 2x damage <br /> 
              * Damage Mega Boost - If successful, your <br /> next attack deals 2x damage <br /> 
              * Small Hint - Reveals one wrong answer <br />
              * Big Hint - Reveals two wrong answers <br />
            </p>
            <img
              src={elgato1}
              style={{
                width: "250px",
                height: "250px",
              }}
            />
        </div>
      </div>
    </div>
  );
}