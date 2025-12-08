import type { Meta, StoryObj } from '@storybook/react';
import { ColorSchemeToggle } from './ColorSchemeToggle';

const meta = {
  title: 'Components/ColorSchemeToggle',
  component: ColorSchemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorSchemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDarkDefault: Story = {
  args: {
    defaultScheme: 'dark',
  },
};

export const WithCallback: Story = {
  args: {
    onToggle: (scheme: 'light' | 'dark') => console.log('Scheme changed to:', scheme),
  },
};
