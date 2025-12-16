import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useQueryClient } from '@tanstack/react-query';

import Calendar from './Calendar';

const meta = {
	component: Calendar
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		userId: 'exampleUserId'
	},
	render: () => {
		const queryClient = useQueryClient();
		const [date, setDate] = useState<Date | null>(null);

		return (
			<div className="space-y-4">
				<Calendar value={date} onChange={setDate} userId={'exampleUserId'} />
				<div className="text-sm">선택된 날짜: {date?.toDateString()}</div>
			</div>
		);
	}
};
