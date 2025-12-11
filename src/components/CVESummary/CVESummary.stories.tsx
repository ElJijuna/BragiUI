import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { CVESummary } from './CVESummary';

// Create a client for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

type CVESummaryStory = StoryObj<typeof CVESummary>;

const meta: Meta<typeof CVESummary> = {
  title: 'Components/CVESummary',
  component: CVESummary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <div style={{ width: '100%', maxWidth: '900px', padding: '24px' }}>
            <Story />
          </div>
        </ConfigProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = CVESummaryStory;

/**
 * Default story with a valid CVE ID
 */
export const Default: Story = {
  args: {
    cve: 'CVE-2025-36000',
  },
};

/**
 * Empty state when no CVE ID is provided
 */
export const Empty: Story = {
  args: {
    cve: '',
  },
};

/**
 * Invalid CVE format
 */
export const InvalidCVE: Story = {
  args: {
    cve: 'INVALID-CVE',
  },
};

/**
 * Another real CVE example
 */
export const RealCVEExample: Story = {
  args: {
    cve: 'CVE-2024-1234',
  },
};
