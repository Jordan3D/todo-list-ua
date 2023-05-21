import React, { ReactElement, useEffect, useRef, useState, ChangeEvent } from 'react';
import type { Identifier, XYCoord } from 'dnd-core';
import { ListItemButton, Typography, Button, Popover, OutlinedInput } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useDrag, useDrop } from 'react-dnd';
import './ListItem.css';
import { IListItem } from '../../types';

interface Props {
	text: string;
	id: string;
	index: number;
	className?: string;
	move?: (dragIndex: number, hoverIndex: number) => void;
	onRemove?: (id: string) => void;
	onEdit?: (item: IListItem, index: number) => void;
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

const ListItem = ({ className, text, index, id, move, onEdit, onRemove }: Props): ReactElement => {
	const ref = useRef<HTMLDivElement>(null);
	const sideRef = useRef<HTMLDivElement>(null);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [inputText, setInputText] = useState(text);

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
			if (move) {
				move(dragIndex, hoverIndex);
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

	const onEditHandler = () => setIsEdit(true);

	const onDeleteHandler = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setIsPopoverOpen(true);
	};

	// Remove popover handlers
	const onClosePopover = () => setIsPopoverOpen(false);
	const onSubmitRemoval = () => (onRemove ? onRemove(id) : undefined);

	// Edit item handlers
	const onEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputText(e.target.value);
	};
	const onFinishEditHandler = () => {
		if (onEdit) {
			onEdit({ id, text: inputText }, index);
			setIsEdit(false);
		}
	};
	const onCancelEditHandler = () => setIsEdit(false);

	const onInputKeyHandler = (e: React.KeyboardEvent) => {
		const { key } = e;
		if (key === 'Enter') {
			if (inputText.length) {
				onFinishEditHandler();
			}
		} else if (key === 'Escape') {
			onCancelEditHandler();
		}
	};

	drag(drop(ref));

	useEffect(() => setInputText(text), [text]);

	const renderDefault = () => (
		<>
			<Typography>{text}</Typography>
			<div className="ListItem__actions" ref={sideRef}>
				{onEdit && (
					<Button onClick={onEditHandler}>
						<EditIcon />
					</Button>
				)}
				{onRemove && (
					<Button onClick={onDeleteHandler}>
						<DeleteIcon />
					</Button>
				)}
			</div>
			<Popover
				id={'delete-item-popover'}
				open={isPopoverOpen}
				anchorEl={sideRef?.current}
				onClose={onClosePopover}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<Typography sx={{ p: 2 }}>Are you sure that you want to delete item ?</Typography>
				<div className="ListItemPopover__actions">
					<Button onClick={onSubmitRemoval}>
						<CheckIcon />
					</Button>
					<Button onClick={onClosePopover}>
						<CloseIcon />
					</Button>
				</div>
			</Popover>
		</>
	);

	const renderEdit = () => (
		<div className="EditItem__form" onKeyDown={onInputKeyHandler}>
			<OutlinedInput
				className="EditItem"
				autoFocus
				value={inputText}
				onChange={onEditInputChange}
			/>
			<div className="EditItem__side">
				<Button onClick={onFinishEditHandler} disabled={!inputText.length}>
					<CheckIcon />
				</Button>
				<Button onClick={onCancelEditHandler}>
					<CloseIcon />
				</Button>
			</div>
		</div>
	);

	return (
		<ListItemButton
			ref={isEdit ? null : ref}
			className={listClassGet({ isDragging, className })}
			data-handler-id={handlerId}
		>
			{isEdit ? renderEdit() : renderDefault()}
		</ListItemButton>
	);
};

export default ListItem;
