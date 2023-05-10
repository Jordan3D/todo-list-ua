import { ReactElement } from 'react';
import { List, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu = (): ReactElement => {
	return (
		<div className="MenuContainer">
			<List component="div" className="Menu">
				<ListItemButton className="MenuItem">
					<Link to={'/list/new'}>Create new</Link>
				</ListItemButton>
				<ListItemButton className="MenuItem">
					<Link to={'/search'}>Search</Link>
				</ListItemButton>
			</List>
		</div>
	);
};

export default Menu;
