import "../../styleSheets/mainMenu.css"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Image from "../Images/elgato.png"


export default function HomeContent() {

    const navigate = useNavigate();


    return (
        <div>
            {/* Page Header. Should be same on most pages except for probably the battle screen. */}
            <div className="pageHead" id="picBorder" style={{display:"flex", justifyContent:"space-between"}}>
                <div style={{width:"fit_content", height:"fit_content", display:"flex", justifyContent:"center", flexDirection:"column"}}>
                    <h1 className="normalTB" style={{margin_bottom:"0px", padding:"0px", width:"fit_content", height:"fit_content"}}>Welcome to CereBrawl!</h1>
                    <h4 style={{paddingLeft:"20px", paddingRight:"20px", paddingBottom:"20px", paddingTop:"0px", margin:"0px"}}>The Battle Style Study Guide</h4>
                    
                </div>
                <img
                    src={Image}
                    style={{margin:"1rem", border:"5px inset #11576a", background:"grey"}}
                />
            </div>
            <div className="BodyBox">
                <div className="SidePanel" id="picBorder">
                    <div>
                        <p className="normalTB">Site Directory</p>

                        <div style={{display:"flex", flexDirection:"column", justifyContent:"space-evenly"}}>
                            <div style={{margin:"2px"}}>
                                - <button onClick={() => navigate("/")} style={{width:"fit-content"}}>Home</button>
                            </div>
                            <div style={{margin:"2px"}}>
                                - <button onClick={() => navigate("/prebattle")}  style={{width:"fit-content"}}>Play!</button>
                            </div>
                            <div style={{margin:"2px"}}>
                                - <button onClick={() => navigate("/account")}  style={{width:"fit-content"}}>Account</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="MiddlePanel" id="picBorder" >
                    <div className="MidInfo">
                        <div style={{display:"flex",flexDirection:"row"}}>
                            <h2 className="normalTB">What is</h2><h1 style={{margin:"0"}} id="rainbow">CereBrawl?</h1>
                        </div>
                        <p style={{marginTop:"0",marginLeft:"1rem",marginRight:"1rem"}}>
                            CereBrawl is your brand-new fun and interactive study tool! Based on the popular  
                            turn-based battle video-games you're used to, this tool is meant to elevate
                            your learning experience by combining a specific amount of learning, challenge, and
                            (most importantly) fun into a game that YOU can curate almost entirely yourself using 
                            just some of our guidelines!
                        </p>
                        

                    </div>
                </div>
                <div className="SidePanel" id="picBorder">
                    poop
                </div>
            </div>
        </div>
    );
}