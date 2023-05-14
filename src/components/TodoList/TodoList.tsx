import { ReactElement, useEffect, useState, useCallback, ChangeEvent, memo } from 'react';
import update from 'immutability-helper';
import { List, OutlinedInput, Button, Typography } from '@mui/material';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { IListEntity, IListItem } from '../../types';
import ListItem from '../ListItem/ListItem';
import NewItem from '../NewItem/NewItem';
import FetchData from '../../utils/storage';
import './TodoList.css';

const TodoList = ({
	id: listId,
	onClose,
}: {
	id: string | 'new';
	onClose: () => void;
}): ReactElement => {
	const [state, setState] = useState<Omit<IListEntity, 'id' | 'createDate'> | null>(null);
	const [listData, setListData] = useState<{ title?: string; id?: number } | null>(null);
	const [listItems, setListItems] = useState<IListItem[]>([]);

	const onAddNew = (text: string) => {
		setListItems((items) => [...items, { id: items.length, text }]);
	};

	const onTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setListData((data) => ({ ...data, title: e.target.value }));
	};

	useEffect(() => {
		if (listId !== undefined) {
			if (listId !== 'new') {
				FetchData.getTodo(listId)
					.then((res) => {
						setState(res ? { title: res.title, todos: res.todos } : null);
						setListData({ title: res?.title, id: res?.id });
						setListItems(res ? res.todos.slice() : []);
					})
					.catch((e) => console.error(e));
			}
		}
	}, [listId]);

	useBeforeUnload((e) => {
		// Cancel the event
		e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
		// Chrome requires returnValue to be set
		if (
			state &&
			JSON.stringify(state) !== JSON.stringify({ title: listData?.title, todos: listItems })
		) {
			return (e.returnValue = '');
		}
	});

	const move = useCallback((dragIndex: number, hoverIndex: number) => {
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
		if (JSON.stringify(state) !== JSON.stringify({ title: listData?.title, todos: listItems })) {
			const confirmed = confirm('All changes will be discarded');
			if (!confirmed) {
				return undefined;
			}
		}
		onClose();
	};

	const onEditItem = (item: IListItem, index: number) => {
		setListItems((data) => {
			const list = data.slice();
			if (list.length && list[index]) {
				list[index] = item;
				return list;
			}
			return data;
		});
		console.log('Edit Item');
	};

	const onRemoveItem = (id: number) => {
		setListItems((data) => {
			const index = data.findIndex((item) => item.id === id);
			if (index >= 0) {
				return [...data.slice(0, index), ...data.slice(index + 1)];
			}
			return data;
		});
		console.log('Remove Item');
	};

	const SubmitHandler = () => {
		if (listData) {
			if (listData.id !== undefined) {
				FetchData.editTodo(String(listData.id), { title: listData.title, todos: listItems })
					.then((res) => {
						setState(res ? { title: res.title, todos: res.todos } : null);
						setListData((data) => ({ ...data, id: res?.id }));
						alert('todo edited');
					})
					.catch((e) => console.error(e));
			} else {
				FetchData.createTodo(listData.title as string, listItems)
					.then((res) => {
						setState(res ? { title: res.title, todos: res.todos } : null);
						setListData((data) => ({ ...data, id: res?.id }));
						alert('todo created');
					})
					.catch((e) => console.error(e));
			}
		} else {
			console.error('Something went wrong while submitting');
		}
	};

	const isSubmitDisabled = !(listData?.title && listItems.length);

	return (
		<div className="TodoListContainer">
			<div className="TodoListContainer__header">
				<Button onClick={BackHandler}>
					<Typography>Close</Typography>
				</Button>
				<Button variant="outlined" onClick={SubmitHandler} disabled={isSubmitDisabled}>
					<Typography>Submit</Typography>
				</Button>
			</div>
			<div className="TodoListContainer__content">
				<OutlinedInput
					className="TodoListTitle"
					value={listData?.title}
					onChange={onTitleChangeHandler}
					placeholder="Add a title"
				/>
				<List component="div" className="TodoList">
					{listItems.map((item: IListItem, i: number) => (
						<ListItem
							className={'TodoListItem'}
							key={item.id}
							id={item.id}
							text={item.text}
							index={i}
							move={move}
							onEdit={onEditItem}
							onRemove={onRemoveItem}
						/>
					))}
					<NewItem onAdd={onAddNew} />
				</List>
			</div>
		</div>
	);
};

export default memo(TodoList);
