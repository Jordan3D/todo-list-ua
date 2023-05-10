import { ReactElement, useEffect, useState, useCallback } from 'react';
import update from 'immutability-helper';
import { List as ListComponent, OutlinedInput, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { IList, IListItem } from '../../types';
import ListItem from '../../components/ListItem/ListItem';
import NewItem from '../../components/NewItem/NewItem';
import './List.css';

const List = (): ReactElement => {
	const { listId } = useParams();
	const [listData, setListData] = useState<IList | null>(null);
	const [listItems, setListItems] = useState<IListItem[]>([]);

	const navigate = useNavigate();

	const onAddNew = (text: string) => {
		setListItems((items) => [...items, { id: items.length, text }]);
	};

	useEffect(() => {
		if (listId) {
			setListItems([]);
			// getListItems
		}
	}, [listId]);

	useEffect(() => {
		if (listData) {
			setListData(null);
			// getListData
		}
	}, [listData]);

	const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
		setListItems((prevItems: IListItem[]) =>
			update(prevItems, {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, prevItems[dragIndex]],
				],
			})
		);
	}, []);

	const BackHandler = () => {
		navigate('/menu');
	};

	return (
		<div className="ListContainer">
			<Button onClick={BackHandler}>Back</Button>
			<div className="ListContainer__content">
				<OutlinedInput className="ListTitle" value={listData?.title} />
				<ListComponent component="div" className="List">
					{listItems.map((item: IListItem, i: number) => (
						<ListItem
							className={'ListItem'}
							key={item.id}
							id={item.id}
							text={item.text}
							index={i}
							moveCard={moveCard}
						/>
					))}
					<NewItem onAdd={onAddNew} />
				</ListComponent>
			</div>
		</div>
	);
};

export default List;
