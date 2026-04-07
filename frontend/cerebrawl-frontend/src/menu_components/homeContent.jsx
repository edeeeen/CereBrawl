import "../../styleSheets/mainMenu.css"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Image from "../Images/elgato.png"


export default function HomeContent() {

    const navigate = useNavigate();


    return (
        <div>
            {/* Page Header. Should be same on most pages except for probably the battle screen. */}
            <div className="pageHead" style={{display:"flex", justifyContent:"space-between"}}>
                <div style={{width:"fit_content", height:"fit_content", display:"flex", justifyContent:"center", flexDirection:"column"}}>
                    <h1 className="normalTB" style={{margin_bottom:"0px", padding:"0px", width:"fit_content", height:"fit_content"}}>Welcome to Cerebrawl!</h1>
                    <h4 style={{paddingLeft:"20px", paddingRight:"20px", paddingBottom:"20px", paddingTop:"0px", margin:"0px"}}>The Battle Style Study Guide</h4>
                    
                </div>
                <img
                    src={Image}
                    style={{margin:"1rem", border:"5px inset #11576a", background:"grey"}}
                />
            </div>
            <div className="BodyBox">
                <div className="SidePanel">
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
                <div className="MiddlePanel" >
                    poop
                </div>
                <div className="SidePanel">
                    poop
                </div>
            </div>
        </div>
    );
}