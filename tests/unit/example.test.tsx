import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

function Hello({ name }: { name: string }) {
  return <h1>Hello {name}</h1>;
}

describe('Hello component', () => {
  it('renders greeting', () => {
    render(<Hello name="Artur" />);
    expect(screen.getByText('Hello Artur')).toBeInTheDocument();
  });
});
