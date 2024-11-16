import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LifeAssistantApp from '../pages/life-assistant-pages';

describe('LifeAssistantApp', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    render(<LifeAssistantApp />);
  });

  test('renders welcome page', () => {
    expect(screen.getByText('Welcome to Life AI')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  test('navigation works correctly', async () => {
    // Click Get Started to move past welcome page
    await user.click(screen.getByText('Get Started'));

    // Verify we're on the home page
    expect(screen.getByText('Welcome back, Alex')).toBeInTheDocument();
    
    // Click chat button in navigation
    await user.click(screen.getByRole('button', { name: 'Navigation: Chat' }));
    expect(screen.getByLabelText('Message input')).toBeInTheDocument();
    
    // Click settings button in navigation
    await user.click(screen.getByRole('button', { name: 'Navigation: Settings' }));
    expect(screen.getByText('Settings')).toBeInTheDocument();

    // Click home button in navigation
    await user.click(screen.getByRole('button', { name: 'Navigation: Home' }));
    expect(screen.getByText('Welcome back, Alex')).toBeInTheDocument();
  });

  test('chat functionality', async () => {
    // Click Get Started to move past welcome page
    await user.click(screen.getByText('Get Started'));
    
    // Navigate to chat using navigation button
    await user.click(screen.getByRole('button', { name: 'Navigation: Chat' }));
    
    // Type and send message
    const input = screen.getByLabelText('Message input');
    await user.type(input, 'Hello');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    
    // Wait for message to appear
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  test('settings navigation and interaction', async () => {
    // Click Get Started to move past welcome page
    await user.click(screen.getByText('Get Started'));
    
    // Navigate to settings using navigation button
    await user.click(screen.getByRole('button', { name: 'Navigation: Settings' }));
    
    // Check settings sections
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    
    // Test navigation within settings
    await user.click(screen.getByText('Profile'));
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('quick actions are accessible', async () => {
    // Click Get Started to move past welcome page
    await user.click(screen.getByText('Get Started'));

    // Verify quick action buttons are present with correct labels
    expect(screen.getByRole('button', { name: 'Quick action: Voice Call' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quick action: Chat' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quick action: Wellness' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quick action: Schedule' })).toBeInTheDocument();
  });
});
