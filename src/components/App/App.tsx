import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';
import './App.css';
import Menu from '../Menu/Menu';

const options = {
	enableMouseEvents: true,
};

function App() {
	return (
		<DndProvider backend={TouchBackend} options={options}>
			<Menu />
		</DndProvider>
	);
}

export default App;
