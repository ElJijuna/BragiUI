import type { Meta, StoryObj } from '@storybook/react';
import { CVESummary } from './CVESummary';
import type { CVEData } from './domain/types';

type CVESummaryStory = StoryObj<typeof CVESummary>;

const cveData: CVEData = {
  cveMetadata: {
    cveId: 'CVE-2025-36000',
    assignerOrgName: 'Test Organization',
    assignerShortName: 'TEST',
    dateReserved: '2025-01-01T00:00:00Z',
    datePublished: '2025-01-02T00:00:00Z',
    dateUpdated: '2025-01-03T00:00:00Z',
  },
  containers: {
    cna: {
      title: 'Test Vulnerability',
      descriptions: [{ value: 'This is a test CVE description' }],
      affected: [{ product: 'TestProduct', vendor: 'TestVendor', versions: [] }],
      references: [{ url: 'https://example.com', name: 'Example Reference' }],
    },
  },
};

const meta: Meta<typeof CVESummary> = {
  title: 'Components/CVESummary',
  component: CVESummary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '900px', padding: '24px' }}>
        <Story />
      </div>
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
    data: cveData,
  },
};

/**
 * Empty state when no CVE ID is provided
 */
export const Empty: Story = {
  args: {},
};

/**
 * Invalid CVE format
 */
export const InvalidCVE: Story = {
  args: {
    error: new Error('Invalid CVE format'),
  },
};

/**
 * Another real CVE example
 */
export const RealCVEExample: Story = {
  args: {
    data: cveData,
  },
};
