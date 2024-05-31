import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { userRoutes, adminRoutes } from './routes';

import Header from './components/Header';
import Login from './components/Login';
import HelpInfo from './components/HelpInfo';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import Registration from './components/Registration';
import ForgotPassword from './components/ForgotPassword';

export default function AimPlusMedicalSupplies() {

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [role, setRole] = useState('');

	useEffect(() => {
		const token = localStorage.getItem('jwtToken');
		if (token) {
			const decodedToken = jwtDecode(token).sub;
			setIsLoggedIn(true);
			setUsername(decodedToken.username);
			setRole(decodedToken.is_admin == 1 ? 'admin' : 'user');
		}
	});


	return (
		<Router>
			<div>
				<Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
				<Routes>
					<Route path="/" element={isLoggedIn ? <Navigate to='/dashboard'/> : <Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setRole={setRole} />} />
					<Route path="/dashboard" element={isLoggedIn ? <Dashboard username={username} role={role} /> : <Navigate to="/" />} >
                        {role === 'admin' ? adminRoutes.map((route, index) => (
                            <Route key={index} path={route.path} element={route.element} />
                        )) : userRoutes.map((route, index) => (
                            <Route key={index} path={route.path} element={route.element} />
                        ))}
                    </Route>
					<Route path="/help" element={<HelpInfo />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/registration" element={<Registration />} />
					<Route path="/contact" element={<Contact />} />
				</Routes>
			</div>
		</Router>
	)
}