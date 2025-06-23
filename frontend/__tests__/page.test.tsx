import { render, screen } from '@testing-library/react';
import AppProvider from '../src/provider/AppProvider';
import Home from '../src/app/page';

// Next.jsのuseRouterをモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('Home page', () => {
  it('renders the template text', () => {
    render(
      <AppProvider>
        <Home />
      </AppProvider>
    );
    expect(screen.getByText('TaskEstimate')).toBeInTheDocument();
  });
});
