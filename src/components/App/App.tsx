import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';
import { Routes, Route } from 'react-router-dom';
import SearchView from '../../views/Search/SearchView';
import './App.css';

const options = {
	enableMouseEvents: true,
};

function App() {
	return (
		<DndProvider backend={TouchBackend} options={options}>
			<Routes>
				<Route index element={<SearchView />} />
				<Route path="*" element={<SearchView />} />
			</Routes>
		</DndProvider>
	);
}

export default App;
