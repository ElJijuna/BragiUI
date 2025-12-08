import type { Meta, StoryObj } from '@storybook/react';
import { Welcome } from './Welcome';

const meta = {
  title: 'Components/Welcome',
  component: Welcome,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Welcome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomContent: Story = {
  args: {
    title: 'Hello World',
    message: 'This is a custom welcome message',
  },
};
