import { useLocation } from 'react-router-dom';
import { ISearchQuery } from '../types';

export const useGetSearchParams = () => {
	const useQuery = () => new URLSearchParams(useLocation().search);
	const query = useQuery();
	const map = {} as ISearchQuery;

	for (const [key, value] of query.entries() as IterableIterator<[keyof ISearchQuery, string]>) {
		// eslint-disable-next-line
		map[key] = value;
	}

	return map;
};
