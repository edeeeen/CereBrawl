import { useNavigate } from "react-router-dom"; 
import "../../styleSheets/mainMenu.css";
import SideBar from "./sideBar";
import Image from "../Images/elgato.png";
import elgato1 from "../Images/elgato_full_1.png";
import { useState, useEffect } from "react";
import elgatoAnimation from "../Images/elgatogif.gif";

export default function CatalogContent() {
    const navigate = useNavigate();

    const [listOfQuizzes, setListOfQuizzes] = useState([]);
    const [currentSearch, setCurrentSearch] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [loading, setLoading] = useState(false); 

    const fetchData = async () => {
        try {
            setLoading(true); 
            // Use URLSearchParams for cleaner URL construction
            const params = new URLSearchParams();
            if (currentSearch) params.append("filter_subject", currentSearch);
            if (sortBy) params.append("sort_by", sortBy);

            const queryString = params.toString() ? `?${params.toString()}` : "";
            const response = await fetch(`https://api.cerebrawl.me/quizzes/getQuizzes${queryString}`);
            const data = await response.json();
            setListOfQuizzes(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

const StartFight = async (quizId) => {
    try {
        const response = await fetch(`https://api.cerebrawl.me/quizzes/getQuiz/${quizId}`);
        const quizData = await response.json();

        // evil hackery to format it the way the AI would because this is easier than changing everything
        const rawStringForBackend = quizData.questions.map(q => {
            return `Question: ${q.question}\n` +
                   `A. ${q.option_a}\n` +
                   `B. ${q.option_b}\n` +
                   `C. ${q.option_c}\n` +
                   `D. ${q.option_d}\n` +
                   `Correct Answer: ${q.correct_answer.toUpperCase()}`;
        }).join('\n\n'); 

        console.log("FORMATTED CATALOG QUIZ:", rawStringForBackend);

        sessionStorage.setItem("battleQuiz", rawStringForBackend);
        sessionStorage.setItem("battleTopic", quizData.name);
        sessionStorage.setItem("battleDifficulty", quizData.difficulty || 1);

        navigate(`/battlescreen`, { 
            // this might not be needed
            state: { 
                quiz: rawStringForBackend, 
                topic: quizData.name, 
                difficulty: 1 
            } 
        });
    } catch (error) {
        console.error("Failed to format catalog quiz:", error);
    }
};

const bookmarkQuiz = async (quizId) => {
    try {
        const token = localStorage.getItem("token"); // get stored token

        if (!token) {
            alert("You must be logged in to bookmark quizzes.");
            return;
        }

        const response = await fetch(
            `https://api.cerebrawl.me/quizzes/likeQuiz/${quizId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        if (response.ok) {
            const data = await response.json();

            if (data.liked) {
                alert("Quiz bookmarked successfully!");
            } else {
                alert("Bookmark removed.");
            }
        } else if (response.status === 401) {
            alert("Session expired. Please log in again.");
        } else if (response.status === 404) {
            alert("Quiz not found.");
        } else {
            alert("Failed to bookmark quiz.");
        }
    } catch (error) {
        console.error("Error bookmarking quiz:", error);
        alert("An error occurred while bookmarking the quiz.");
    }
};

    useEffect(() => {
        fetchData();
    }, [sortBy]);

    const handleSearch = () => {
        fetchData();
    };

    return (
        <div>
            {/* Header */}
            <div className="pageHead" id="picBorder" style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                    <h1 className="normalTB" style={{ fontSize: "48px", marginBottom: "0px", padding: "0px" }}>
                        Quiz Catalog
                    </h1>
                    <h4 style={{ paddingLeft: "20px", fontSize: "22px", margin: "0px", color: "black" }}>
                        Select Your Study Battle
                    </h4>
                </div>
                <img src={Image} alt="Mascot" style={{ margin: "1rem", border: "5px inset #11576a", background: "grey" }} />
            </div>

            <div className="BodyBox">
                <SideBar />

                {/* Middle panel */}
                <div className="MiddlePanel" id="picBorder">
                    
                    <div className="MidInfo" style={{border: "1px solid cadetblue"}}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <h2 className="normalTB" style={{ fontSize: "40px" }}>Browse</h2>
                            <h1 style={{ margin: "0", fontSize: "44px" }} id="rainbow">Quizzes</h1>
                        </div>

                        <div className="prebattle-form" style={{ maxWidth: "100%", flexDirection: "row", marginTop: "1rem" }}>
                            <input
                                type="text"
                                placeholder="Search Subject..."
                                className="prebattle-input"
                                style={{ flex: 2 }}
                                value={currentSearch}
                                onChange={(e) => setCurrentSearch(e.target.value)}
                            />
                            <select
                                className="prebattle-input"
                                style={{ flex: 1 }}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="">Sort By</option>
                                <option value="name">Name</option>
                                <option value="bookmarks">Bookmarks</option>
                                <option value="views">Views</option>
                            </select>
                            <button 
                                className="battle-button" 
                                style={{ width: "auto", padding: "0 2rem" }}
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="MidInfo" style={{ marginTop: "0", border: "1px solid cadetblue", minHeight: "200px"}}>
                        {loading ? (
                            <p style={{ textAlign: "center", fontSize: "22px", color: "black", paddingTop: "2rem" }}>
                                Loading Quiz Data...
                            </p>
                        ) : listOfQuizzes.length > 0 ? (
                            listOfQuizzes.map((quiz, index) => (
                                <div
                                    className="template"
                                    key={quiz.id || index}
                                    style={{
                                        padding: "1.5rem",
                                        marginBottom: "0.5rem",
                                        cursor: "pointer",
                                        backgroundColor: "#448f91", 
                                        border: "5px outset #2f8f83", 
                                        transition: "transform 0.1s",
                                        borderRadius: "4px"
                                    }}
                                    //onClick={() => StartFight(quiz.short_id)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.01)";
                                        e.currentTarget.style.borderColor = "#46c4b4";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.borderColor = "#2f8f83";
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                                        <h3 className="normalTB" style={{ fontSize: "32px", margin: "0", color: "white" }}>
                                            {quiz.name}
                                        </h3>
                                        <span style={{ fontSize: "16px", fontWeight: "bold", color: "white", padding: "2px 8px" }}>
                                            Creator: {quiz.creator}
                                        </span>
                                    </div>
                                    
                                    <div style={{ marginBottom: "8px" }}>
                                        <span style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>Subject: </span>
                                        <span style={{ fontSize: "20px", color: "#2f8f83" }}>{quiz.subject || "General"}</span>
                                    </div>

                                    <div style={{ marginBottom: "15px" }}>
                                        <p style={{ fontSize: "18px", color: "#cccccc", margin: "0", lineHeight: "1.4" }}>
                                            {quiz.description}
                                        </p>
                                    </div>
                                    
                                    <div style={{ display: "flex", gap: "25px", fontSize: "16px", fontWeight: "bold", color: "white", borderTop: "1px solid #333", paddingTop: "10px" }}>
                                        <span>⭐ {quiz.bookmarks} Bookmarks</span>
                                        <span>👁️ {quiz.views} Views</span>
                                    </div>
                                    <button type="button" 
                                    style={{width: "100%", marginTop: "10px", padding: "0.5rem", backgroundColor: "#46c4b4", color: "black", fontWeight: "bold", border: "2px solid #000000", borderRadius: "4px", cursor: "pointer"}}
                                    onClick={() => StartFight(quiz.short_id)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.01)";
                                        e.currentTarget.style.borderColor = "#ffffff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.borderColor = "#000000";
                                    }}>
                                            ▶️ Play!
                                        </button>
                                    <button type="button" 
                                    style={{width: "100%", marginTop: "10px", padding: "0.5rem", backgroundColor: "#46c4b4", color: "black", fontWeight: "bold", border: "2px solid #000000", borderRadius: "4px", cursor: "pointer"}}
                                    onClick={() => bookmarkQuiz(quiz.short_id)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.01)";
                                        e.currentTarget.style.borderColor = "#ffffff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.borderColor = "#000000";
                                    }}>
                                            🔖 Bookmark!
                                        </button>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: "center", fontSize: "22px", color: "black", paddingTop: "2rem" }}>
                                No quizzes found. Try a different search!
                            </p>
                        )}
                    </div>
                </div>

                {/* Right panel */}
                <div className="SidePanel" id="picBorder">
                    <h2 className="normalTB" style={{ fontSize: "20px" }}>Purrwins's Catalog Tips</h2>
                    <p style={{ margin: "12px", color: "black", fontSize: "22px", lineHeight: "1.5" }}>
                        Search for a subject or topic you want to study, and click on a quiz to jump into battle mode! You can also sort quizzes by name, popularity, or bookmarks to find the perfect quiz for you.
                        As a reminder, in order to bookmark quizzes, you must be logged in to do so. So why aren't you logged in already?
                    </p>
                    <img
                        src={elgatoAnimation}
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