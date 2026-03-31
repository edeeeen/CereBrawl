import "../../styleSheets/mainMenu.css"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AccountContent() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUserInfo(token);
        }
    }, []);

    useEffect(() => {
        //get login/registration button and add event listener to it
        const loginButton = document.querySelector(".login-button");
        if (loginButton) {
            const handleClick = () => {
                const username = document.querySelector(".login-input[type='text']").value;
                const password = document.querySelector(".login-input[type='password']").value;
                if (showRegister) {
                    handleRegister(username, password);
                } else {
                    handleLogin(username, password);
                }
            };
            
            // Remove old listener to prevent duplicates
            loginButton.removeEventListener("click", handleClick);
            loginButton.addEventListener("click", handleClick);
        }
    }, [showRegister]);


    // Function to fetch user info using the token
    const fetchUserInfo = async (token) => {
        try {
            const response = await fetch("https://api.cerebrawl.me/login/users/me/", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setIsLoggedIn(true);
                setError("");
            } else {
                setError("Session expired. Please login again.");
                localStorage.removeItem("token");
                setIsLoggedIn(false);
            }
        } catch (err) {
            console.error("Error fetching user info:", err);
            setError("Failed to fetch user information");
        }
    };

    //set up login using the api
    const handleLogin = async (username, password) => {
        setLoading(true);
        setError("");
        
        // Implementation for login API call
        try {
            const response = await fetch("https://api.cerebrawl.me/login/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username: username,
                    password: password
                }) 
            });
            const data = await response.json();

            // check local storage for token and if it exists
            if (data.access_token) {
                localStorage.setItem("token", data.access_token);
                await fetchUserInfo(data.access_token);
            } else {
                setError(data.detail || "Login failed. Please check your username and password.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred during login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // registration function using the api, also logs the user in after successful registration
    const handleRegister = async (username, password) => {
        setLoading(true);
        setError("");
        
        try {
            const response = await fetch("https://api.cerebrawl.me/login/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            const data = await response.json();
            
            if (response.ok) {
                setError("");
                setShowRegister(false);
                // Auto-login after registration
                await handleLogin(username, password);
            } else {
                setError(data.detail || "Registration failed. Please try again.");
                console.error("Registration error details:", data);
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError("An error occurred during registration. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false);
        setError("");
    };

    return (
        <div>
            {/* Page Header. Should be same on most pages except for probably the battle screen. */}
            <div className="pageHead">
                <h1 className="normalTB">Welcome to Cerebrawl!</h1>
            </div>
            <p className="normalTB">
                These are some links to test SPA:
                <a onClick={() => navigate("/")}>Home</a> |
                <a onClick={() => navigate("/prebattle")}> Play!</a> 
                <a onClick={() => navigate("/account")}> Account</a>
            </p>
            
            {isLoggedIn && user ? (
                <div className="account-info">
                    <h2>Account Information</h2>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Account Created:</strong> {user.create_date}</p>
                    <p><strong>Status:</strong> {user.disabled ? "Disabled" : "Active"}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <p>Welcome to the Account Screen!</p>
                    <div className="login-screen">
                        <h1>Welcome to Cerebrawl!</h1>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <input type="text" placeholder="Username" className="login-input" />
                        <input type="password" placeholder="Password" className="login-input" />
                        <button className="login-button" disabled={loading}>
                            {loading ? (showRegister ? "Creating account..." : "Logging in...") : (showRegister ? "Register" : "Login")}
                        </button>
                        <p style={{ marginTop: "10px" }}>
                            {showRegister ? (
                                <>
                                    Already have an account? <a onClick={() => setShowRegister(false)} style={{ cursor: "pointer", color: "blue" }}>Login here</a>
                                </>
                            ) : (
                                <>
                                    Don't have an account? <a onClick={() => setShowRegister(true)} style={{ cursor: "pointer", color: "blue" }}>Register here</a>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}