import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import MenuView from '../../views/Menu/Menu';
import ListView from '../../views/List/List';
import StartView from '../../views/Start/Start';

const options = {
	enableMouseEvents: true,
};

function App() {
	return (
		<DndProvider backend={TouchBackend} options={options}>
			<Routes>
				<Route index element={<StartView />} />
				<Route path="menu" element={<MenuView />} />
				<Route path="list/:listId" element={<ListView />} />
				<Route path="*" element={<StartView />} />
			</Routes>
		</DndProvider>
	);
}

export default App;
