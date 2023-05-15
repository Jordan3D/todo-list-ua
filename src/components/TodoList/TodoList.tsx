import { ReactElement, useEffect, useState, useCallback, ChangeEvent, memo } from 'react';
import update from 'immutability-helper';
import {
	List,
	OutlinedInput,
	Button,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { useBeforeUnload } from 'react-router-dom';
import { IListEntity, IListItem } from '../../types';
import ListItem from '../ListItem/ListItem';
import NewItem from '../NewItem/NewItem';
import FetchData from '../../utils/storage';
import './TodoList.css';

const TodoList = ({
	id: listId,
	onAction,
}: {
	id: string | 'new';
	onAction: (action: 'add' | 'ed' | 'close', value?: string) => void;
}): ReactElement => {
	const [state, setState] = useState<Omit<IListEntity, 'id' | 'createDate'> | null>(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [listData, setListData] = useState<{ title?: string; id?: string } | null>(null);
	const [listItems, setListItems] = useState<IListItem[]>([]);

	const onAddNew = (text: string) => {
		setListItems((items) => [...items, { id: String(items.length), text }]);
	};

	const onTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setListData((data) => ({ ...data, title: e.target.value }));
	};

	useEffect(() => {
		if (listId !== undefined) {
			if (listId !== 'new') {
				FetchData.getTodo(listId)
					.then((res) => {
						if (res === null) {
							onAction('close');
						}
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
		if (
			state &&
			JSON.stringify(state) !== JSON.stringify({ title: listData?.title, todos: listItems })
		) {
			const confirmed = confirm('All changes will be discarded');
			if (!confirmed) {
				return undefined;
			}
		}
		onAction('close');
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

	const onRemoveItem = (id: string) => {
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
					})
					.catch((e) => console.error(e));
			} else {
				FetchData.createTodo(listData.title as string, listItems)
					.then((res) => {
						setState(res ? { title: res.title, todos: res.todos } : null);
						setListData((data) => ({ ...data, id: res?.id }));
						if (res) {
							onAction('add', res.id);
						}
					})
					.catch((e) => console.error(e));
			}
		} else {
			console.error('Something went wrong while submitting');
		}
	};

	const DeleteHandler = () => {};

	const isSubmitDisabled = !(listData?.title && listItems.length);

	const handleClose = () => {
		setOpenDialog(false);
	};
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	return (
		<div className="TodoListContainer">
			<div className="TodoListContainer__header">
				<Button onClick={BackHandler}>
					<Typography>Close</Typography>
				</Button>
				<div className="TodoListContainer__headerSide">
					{listId !== 'new' && (
						<Button variant="outlined" onClick={handleOpenDialog}>
							<DeleteIcon className="Icon" />
							<Typography className="Text">Delete</Typography>
						</Button>
					)}
					<Button variant="outlined" onClick={SubmitHandler} disabled={isSubmitDisabled}>
						<CheckIcon className="Icon" />
						<Typography className="Text">Submit</Typography>
					</Button>
				</div>
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
			<Dialog onClose={handleClose} open={openDialog}>
				<DialogTitle>{`"${listData?.title || ''}" list removal`}</DialogTitle>
				<DialogContent className="RemovalDialog">
					<Typography>Are you sure to delete this list?</Typography>
					<DialogActions>
						<Button variant="outlined" onClick={DeleteHandler}>
							Yes
						</Button>
						<Button variant="outlined" onClick={handleClose}>
							No
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default memo(TodoList);
