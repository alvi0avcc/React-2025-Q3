import { render, screen } from '@testing-library/react';
import { Wrapper } from '@/components/wrapper/wrapper';

describe('Wrapper Component', () => {
  it('should render children correctly', () => {
    const testContent = 'Test Content';
    render(
      <Wrapper>
        <div>{testContent}</div>
      </Wrapper>
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    render(
      <Wrapper>
        <div>Child 1</div>
        <div>Child 2</div>
      </Wrapper>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
