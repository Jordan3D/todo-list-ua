import { ReactElement, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography, List, ListItemButton } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import TodoList from '../../components/TodoList/TodoList';
import Search from './components/Search/Search';
import { useGetSearchParams } from '../../utils/hooks';
import { fetchAllTodosByFilter } from '../../store/slices/todos';
import { selectTodos } from '../../store/selectors/todosSelectors';
import './SearchView.css';

const SearchView = (): ReactElement => {
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const { id } = useGetSearchParams();
	const list = useSelector(selectTodos);

	const onAction = useCallback(
		(action: 'add' | 'ed' | 'close', value = '') => {
			if (action === 'add' || action === 'close') {
				searchParams.set('id', value);
			}
			setSearchParams(searchParams);
		},
		[searchParams]
	);

	const onAddNew = () => {
		searchParams.set('id', 'new');
		setSearchParams(searchParams);
	};

	const onItemClick = (itemId: string) => {
		searchParams.set('id', itemId);
		setSearchParams(searchParams);
	};

	useEffect(() => {
		// Put default filters in url
		if (!searchParams.get('sort')) {
			searchParams.set('sort', 'title');
		}
		if (!searchParams.get('order')) {
			searchParams.set('order', 'ASC');
		}
		setSearchParams(searchParams);
	}, []);

	useEffect(() => {
		// @ts-ignore
		dispatch(fetchAllTodosByFilter({ count: 20 }));
	}, []);

	return (
		<div className="SearchViewContainer">
			<div className="SearchViewSection">
				<Search />
				<List component="div" className="SearchViewResult">
					{list.map((listItem) => (
						<ListItemButton
							key={listItem.id}
							className="SearchViewResult__item"
							onClick={() => onItemClick(listItem.id)}
						>
							<Typography variant="subtitle1">{listItem.title}</Typography>
						</ListItemButton>
					))}
				</List>
				<Button className="SearchViewButton SearchViewButton__AddNew" onClick={onAddNew}>
					<Typography>Add new</Typography>
				</Button>
			</div>
			{id && (
				<div className="SearchViewSection TodoListSection">
					<TodoList id={id} onAction={onAction} />
				</div>
			)}
		</div>
	);
};

export default SearchView;
