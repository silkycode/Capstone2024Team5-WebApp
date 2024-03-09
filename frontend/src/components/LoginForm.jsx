import React, { useState } from "react";

const LoginForm = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loginError, setLoginError] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    // API integration here for authorization and login handling
    const HandleLogin = async (e) => {
        e.preventDefault();
        //todo, need HTTPS, need a better and more detailed message (we should make a convention for API call message format)
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
            const result = await response.json();
            if (response.ok) {
                console.log(result);
                setIsLoggedIn(true);
            } else {
                console.log(result);
                setLoginError(true);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setLoginError(true);
        }
    };

    const HandleForgotPassword = async (e) => {
        e.preventDefault();
        //todo, add API call + flask endpoint. just sends back user email right now
        const data = {
            email: email,
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/forgot_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            const result = await response.json(); 
            console.log(result);
        } catch (error) {
            console.error('Some server error occurred:', error);
        }
    };

    const OpenNewPatientPage = () => {
        //todo
    }

    const OpenForgotPasswordPage = () => {
        setShowForgotPassword(true);
    }

    return (
        <>
            <div className="container">
                <h2>Welcome!</h2>
                <form id="loginForm" onSubmit={HandleLogin}>
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        className="input-field" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
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
                {showForgotPassword && (
                    <form onSubmit={HandleForgotPassword}>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                        <button type="submit" className="button">Reset Password</button>
                    </form>
                )}
            </div>
        </>
    );
};

export default LoginForm;