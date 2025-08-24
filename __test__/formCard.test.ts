import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormCard from '@/components/formCard';
import type { SubmissionsFormData } from '@/store/formSlice';
import React from 'react';

vi.mock('@/components/formCard/formCard.module.css', () => ({
  default: {
    card: 'card',
    newCard: 'newCard',
    cardTitle: 'cardTitle',
    content: 'content',
    row: 'row',
    label: 'label',
    value: 'value',
    pictureSection: 'pictureSection',
    image: 'image',
  },
}));

vi.mock('classnames', () => ({
  default: vi.fn(() => 'test-class'),
}));

describe('FormCard', () => {
  const mockData: SubmissionsFormData = {
    id: 1,
    type: 'controlled',
    name: 'John Doe',
    age: 25,
    email: 'john@example.com',
    gender: 'male',
    acceptTerms: true,
    country: 'USA',
    password: 'secret123',
    submittedAt: '2024-01-15T10:30:00.000Z',
    pictureBase64: 'data:image/png;base64,test123',
  };

  it('should render all data fields', () => {
    render(React.createElement(FormCard, { data: mockData, index: 0 }));

    expect(screen.getByText('CONTROLLED Form')).toBeInTheDocument();
    expect(screen.getByText('id:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('name:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('age:')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('email:')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('gender:')).toBeInTheDocument();
    expect(screen.getByText('male')).toBeInTheDocument();
    expect(screen.getByText('acceptTerms:')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('country:')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.getByText('password:')).toBeInTheDocument();
    expect(screen.getByText('secret123')).toBeInTheDocument();
    expect(screen.getByText('submittedAt:')).toBeInTheDocument();
  });

  it('should format acceptTerms as "Yes" when true', () => {
    render(React.createElement(FormCard, { data: mockData, index: 0 }));
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('should format acceptTerms as "No" when false', () => {
    const dataWithFalseTerms: SubmissionsFormData = {
      ...mockData,
      acceptTerms: false,
      pictureBase64: null,
    };
    render(
      React.createElement(FormCard, { data: dataWithFalseTerms, index: 0 })
    );
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should display image when pictureBase64 is provided', () => {
    render(React.createElement(FormCard, { data: mockData, index: 0 }));

    const image = screen.getByAltText('Uploaded');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'data:image/png;base64,test123');
  });

  it('should not display image when pictureBase64 is null', () => {
    const dataWithoutImage: SubmissionsFormData = {
      ...mockData,
      pictureBase64: null,
    };
    render(React.createElement(FormCard, { data: dataWithoutImage, index: 0 }));

    expect(screen.queryByAltText('Uploaded')).not.toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    const emptyData: SubmissionsFormData = {
      id: 0,
      type: 'controlled',
      name: '',
      age: 0,
      email: '',
      gender: 'other',
      acceptTerms: false,
      country: '',
      password: '',
      submittedAt: '2024-01-01T00:00:00.000Z',
      pictureBase64: null,
    };

    render(React.createElement(FormCard, { data: emptyData, index: 0 }));

    expect(screen.getByText('CONTROLLED Form')).toBeInTheDocument();
    expect(screen.getByText('name:')).toBeInTheDocument();
    expect(screen.getByText('age:')).toBeInTheDocument();

    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(2); // id и age

    expect(screen.getByText('acceptTerms:')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should display correct values for each field', () => {
    const emptyData: SubmissionsFormData = {
      id: 0,
      type: 'controlled',
      name: '',
      age: 0,
      email: '',
      gender: 'other',
      acceptTerms: false,
      country: '',
      password: '',
      submittedAt: '2024-01-01T00:00:00.000Z',
      pictureBase64: null,
    };

    render(React.createElement(FormCard, { data: emptyData, index: 0 }));

    const ageRow = screen.getByText('age:').closest('.row');
    expect(ageRow).toHaveTextContent('0');

    const idRow = screen.getByText('id:').closest('.row');
    expect(idRow).toHaveTextContent('0');

    const acceptTermsRow = screen.getByText('acceptTerms:').closest('.row');
    expect(acceptTermsRow).toHaveTextContent('No');
  });
});
