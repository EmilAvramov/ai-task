import React from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const Layout = () => (
	<>
		<Header />
		<Outlet />
		<Footer />
	</>
);

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <Home />,
			},
		],
	},
]);
