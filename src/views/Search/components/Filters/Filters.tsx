import { ReactElement, memo } from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useGetSearchParams } from '../../../../utils/hooks';

const FILTERS = [
	{ key: 'title', title: 'Title' },
	{ key: 'createDate', title: 'Create date' },
];

const Filters = ({ className }: { className?: string }): ReactElement => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { sort, order } = useGetSearchParams();

	const onChangeSortBy = (e: SelectChangeEvent) => {
		searchParams.set('sort', e.target.value);
		setSearchParams(searchParams);
	};

	const onChangeOrder = (e: SelectChangeEvent) => {
		searchParams.set('order', e.target.value);
		setSearchParams(searchParams);
	};

	return (
		<div className={`${className ?? ''} Filters`}>
			<FormControl className="FilterForm">
				<InputLabel id="sort-by-label">Sort by</InputLabel>
				<Select
					labelId="sort-by-label"
					id="sort-by-select"
					value={sort}
					label="Sort by"
					onChange={onChangeSortBy}
				>
					{FILTERS.map(({ key, title }: { key: string; title: string }) => (
						<MenuItem key={key} value={key}>
							{title}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<FormControl className="FitlerForm">
				<InputLabel id="sort-by-label">Order</InputLabel>
				<Select
					labelId="order-label"
					id="order-select"
					value={order}
					label="Order"
					onChange={onChangeOrder}
				>
					<MenuItem value={'ASC'}>ASC</MenuItem>
					<MenuItem value={'DESC'}>DESC</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
};

export default memo(Filters);
