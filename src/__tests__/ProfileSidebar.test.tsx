import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProfileSidebar from '../components/ProfileSidebar';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('ProfileSidebar', () => {
  it('renders without crashing', () => {
    render(<ProfileSidebar />);
    expect(screen.getByTestId('profile-sidebar')).toBeInTheDocument();
  });
});
