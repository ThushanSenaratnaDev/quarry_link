import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                setMessage("Login successful! Redirecting...");
                setTimeout(() => {
                    navigate("/home");
                }, 1000);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Server error");
            console.error(error);
        }
    };

    const pageStyle = {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8", // soft background
    };

    const headerStyle = {
        backgroundColor: "#052962", // dark blue
        color: "white",
        padding: "50px 20px",
        textAlign: "center",
        fontSize: "36px",
        fontWeight: "bold",
        letterSpacing: "2px",
        
    };

    const contentStyle = {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/images/QuarryLink5.svg')",
    };

    const loginContainerStyle = {
        width: "400px",
        background: "#ffffff",
        padding: "40px 30px",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    };

    const titleStyle = {
        fontSize: "26px",
        color: "#333",
        marginBottom: "10px",
        textAlign: "center",
    };

    const inputStyle = {
        padding: "12px 15px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "16px",
        transition: "border-color 0.3s, box-shadow 0.3s",
    };

    const inputFocusStyle = {
        borderColor: "#C5630C", // orange on focus
        boxShadow: "0 0 8px rgba(197, 99, 12, 0.3)",
        outline: "none",
    };

    const buttonStyle = {
        backgroundColor: "#C5630C", // orange
        color: "white",
        padding: "12px",
        border: "none",
        borderRadius: "6px",
        fontSize: "18px",
        cursor: "pointer",
        transition: "background 0.3s ease",
    };

    const buttonHoverStyle = {
        backgroundColor: "#a14d09",
    };

    const messageStyle = {
        color: "#d9534f",
        textAlign: "center",
        fontSize: "14px",
    };

    const footerStyle = {
        backgroundColor: "#052962",
        color: "white",
        padding: "30px 20px",
        textAlign: "center",
        fontSize: "14px",
    };

    const [focusedInput, setFocusedInput] = useState(null);
    const [hoverButton, setHoverButton] = useState(false);

    return (
        <div style={pageStyle}>
            <header style={headerStyle}>Quarry Link</header>

            <div style={contentStyle}>
                <div style={loginContainerStyle}>
                    <h2 style={titleStyle}>Welcome Back</h2>
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                ...inputStyle,
                                ...(focusedInput === "email" ? inputFocusStyle : {})
                            }}
                            onFocus={() => setFocusedInput("email")}
                            onBlur={() => setFocusedInput(null)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                ...inputStyle,
                                ...(focusedInput === "password" ? inputFocusStyle : {})
                            }}
                            onFocus={() => setFocusedInput("password")}
                            onBlur={() => setFocusedInput(null)}
                        />
                        <button
                            type="submit"
                            style={{
                                ...buttonStyle,
                                ...(hoverButton ? buttonHoverStyle : {})
                            }}
                            onMouseEnter={() => setHoverButton(true)}
                            onMouseLeave={() => setHoverButton(false)}
                        >
                            Login
                        </button>
                    </form>
                    
                    {message && <p style={{ color: "green",textAlign:"center", fontWeight: "bold" }}>{message}</p>}
                </div>
            </div>

            <footer style={footerStyle}>
                <p>© 2025 Amano Aggregated Pvt Ltd</p>
            </footer>
        </div>
    );
};

export default Login;