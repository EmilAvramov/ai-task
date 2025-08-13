import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router';

function App(): React.JSX.Element {
	return <RouterProvider router={router} />;
}

export default App;
