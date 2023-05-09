import { ReactElement, useState } from 'react';
// import update from 'immutability-helper';
import { List } from '@mui/material';
import ListItem from '../ListItem/ListItem';
import './Menu.css';

interface IListItem {
	id: number;
	text: string;
}

const Menu = (): ReactElement => {
	const [list] = useState([
		{
			id: 1,
			text: 'Create new',
		},
		{
			id: 2,
			text: 'Search',
		},
	]);

	// const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
	// 	setList((prevCards: IListItem[]) =>
	// 		update(prevCards, {
	// 			$splice: [
	// 				[dragIndex, 1],
	// 				[hoverIndex, 0, prevCards[dragIndex]],
	// 			],
	// 		})
	// 	);
	// }, []);

	return (
		<div className="MenuContainer">
			<List component="div" className="Menu">
				{list.map((item: IListItem, i: number) => (
					<ListItem className={'MenuItem'} key={item.id} id={item.id} text={item.text} index={i} />
				))}
			</List>
		</div>
	);
};

export default Menu;
