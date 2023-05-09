import { ReactElement, useRef } from 'react';
import type { Identifier, XYCoord } from 'dnd-core';
import { ListItemButton, Typography } from '@mui/material';
import { useDrag, useDrop } from 'react-dnd';
import './ListItem.css';

interface Props {
	text: string;
	id: string | number;
	index: number;
	className?: string;
	moveCard?: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
	index: number;
	id: string;
	type: string;
}

const listClassGet = ({
	isDragging,
	className = '',
}: {
	isDragging: boolean;
	className?: string;
}) => `ListItem ${className} ${isDragging ? 'isDragging' : ''}`;

const ListItem = ({ className, text, index, id, moveCard }: Props): ReactElement => {
	const ref = useRef<HTMLDivElement>(null);

	const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
		accept: 'MenuItem',
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		hover(item: DragItem, monitor) {
			if (!ref.current) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = index;

			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return;
			}

			// Determine rectangle on screen
			const hoverBoundingRect = ref.current?.getBoundingClientRect();

			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			// Determine mouse position
			const clientOffset = monitor.getClientOffset();

			// Get pixels to the top
			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			// Time to actually perform the action
			if (moveCard) {
				moveCard(dragIndex, hoverIndex);
			}

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex;
		},
	});

	const [{ isDragging }, drag] = useDrag({
		type: 'MenuItem',
		item: () => {
			return { id, index };
		},
		collect: (monitor: any) => ({
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			isDragging: monitor.isDragging() as boolean,
		}),
	});

	drag(drop(ref));

	return (
		<ListItemButton
			ref={ref}
			className={listClassGet({ isDragging, className })}
			data-handler-id={handlerId}
		>
			<Typography>{text}</Typography>
		</ListItemButton>
	);
};

export default ListItem;
