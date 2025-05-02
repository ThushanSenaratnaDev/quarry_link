import styles from './pageCss/Login.module.css';
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
                console.log("Token:", data.token);
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

    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} className={styles.loginForm}>
                <input
                    type="email"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.loginInput}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.loginInput}
                />
                <button type="submit" className={styles.loginButton}>Login</button>
            </form>
            {message && <p className={styles.loginMessage}>{message}</p>}
        </div>
    );
};

export default Login;