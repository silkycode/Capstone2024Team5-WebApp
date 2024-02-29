import React, { useState } from "react";

const LoginForm = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    // API integration here for authorization and login handling
    const HandleLogin = async (e) => {
        e.preventDefault();
        const data = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const validation = await response.json();
            if (validation.ok) {
                console.log("authorized");
                setIsLoggedIn(true);
            } else {
                console.log("credentials failed");
                setLoginError(true);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setLoginError(true);
        }
    };

    const OpenNewPatientPage = () => {
        //todo
    }

    const OpenForgotPasswordPage = () => {
        //todo
    }

    return (
        <>
            <div className="container">
                <h2>Welcome!</h2>
                <form id="loginForm" onSubmit={HandleLogin}>
                    <input type="text" className="input-field" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" className="input-field" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" className="button">
                        Login
                    </button>
                    {loginError && <p style={{ color: 'red' }}>Invalid username or password</p>}
                </form>
                <button type="button" className="button signup" onClick={OpenNewPatientPage}>
                    Create Account
                </button>
                <form>
                    <a href="#" onClick={OpenForgotPasswordPage}>
                        Forgot Password?
                    </a>
                </form>
            </div>
        </>
    );
};

export default LoginForm;