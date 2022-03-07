import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import NotFound from './pages/NotFound';

function App() {
	return (
		<div className='App'>
			<Outlet />
		</div>
	);
}

export default App;
