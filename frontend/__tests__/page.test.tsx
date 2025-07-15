import AppProvider from '@/provider/AppProvider';
import Home from '@/app/page';
import { render, screen } from '@testing-library/react';

describe('Home', () => {
  it('renders a heading', () => {
    render(
      <AppProvider>
        <Home />
      </AppProvider>
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
