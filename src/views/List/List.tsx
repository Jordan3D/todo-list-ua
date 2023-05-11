import { ReactElement, useEffect, useState, useCallback, ChangeEvent } from 'react';
import update from 'immutability-helper';
import { List as ListComponent, OutlinedInput, Button, Typography } from '@mui/material';
import { useParams, useNavigate, useBeforeUnload } from 'react-router-dom';
import { IGetList, IList, IListItem } from '../../types';
import ListItem from '../../components/ListItem/ListItem';
import NewItem from '../../components/NewItem/NewItem';
import './List.css';

const List = (): ReactElement => {
	const { listId } = useParams();
	const [, setState] = useState<IGetList | null>(null);
	const [listData, setListData] = useState<{ title?: string; id?: number } | null>(null);
	const [listItems, setListItems] = useState<IListItem[]>([]);

	const navigate = useNavigate();

	const onAddNew = (text: string) => {
		setListItems((items) => [...items, { id: items.length, text }]);
	};

	const onTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setListData((data) => ({ ...data, title: e.target.value }));
	};

	useEffect(() => {
		if (listId) {
			if (listId !== 'new') {
				// TODO Make request to get 1 todo
				//
				setState(null);
				setListData(null);
				setListItems([]);
			}
		}
	}, [listId]);

	useBeforeUnload((e) => {
		// Cancel the event
		e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
		// Chrome requires returnValue to be set
	});

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
		// Check if everything is saved
		navigate('/menu');
	};

	const onEditItem = (item: IListItem, index: number) => {
		// TODO Make request to edit todo
		//
		console.log('Remove Item');
	};

	const onRemoveItem = (id: number) => {
		// TODO Make request to remove 1 todo by id
		//
		console.log('Remove Item');
	};

	const isSubmitDisabled = !(listData?.title && listItems.length);

	return (
		<div className="ListContainer">
			<div className="ListContainer__header">
				<Button onClick={BackHandler}>
					<Typography>Back</Typography>
				</Button>
				<Button variant="outlined" onClick={BackHandler} disabled={isSubmitDisabled}>
					<Typography>Submit</Typography>
				</Button>
			</div>
			<div className="ListContainer__content">
				<OutlinedInput
					className="ListTitle"
					value={listData?.title}
					onChange={onTitleChangeHandler}
					placeholder="Add a title"
				/>
				<ListComponent component="div" className="List">
					{listItems.map((item: IListItem, i: number) => (
						<ListItem
							className={'ListItem'}
							key={item.id}
							id={item.id}
							text={item.text}
							index={i}
							moveCard={moveCard}
							onRemove={onRemoveItem}
						/>
					))}
					<NewItem onAdd={onAddNew} />
				</ListComponent>
			</div>
		</div>
	);
};

export default List;
