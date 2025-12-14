import type { Meta, StoryObj } from '@storybook/react-vite';
import Calendar from './Calendar';

const meta = {
	component: Calendar
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
