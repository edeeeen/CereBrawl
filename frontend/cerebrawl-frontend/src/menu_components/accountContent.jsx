import "../../styleSheets/mainMenu.css"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

export default function AccountContent() {
    const navigate = useNavigate();

    return (
        <div>
            {/* Page Header. Should be same on most pages except for probably the battle screen. */}
            <div className="pageHead">
                <h1 className="normalTB">Welcome to Cerebrawl!</h1>
            </div>
            <p className="normalTB">
                These are some links to test SPA:
                <a onClick={() => navigate("/")}>Home</a> |
                <a onClick={() => navigate("/prebattle")}> Play!</a> |
                <a onClick={() => navigate("/account")}> Account</a>
            </p>
            <p>
                Welcome to the Account Screen!
            </p>

        </div>
    );
}