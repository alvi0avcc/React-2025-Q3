import type { MyFormData } from '@/types/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SubmissionsFormData extends MyFormData {
  id: string;
  submittedAt: string;
}

interface FormsState {
  submissions: SubmissionsFormData[];
  countries: string[];
}

const initialState: FormsState = {
  submissions: [],
  countries: [
    'United States',
    'United Kingdom',
    'Germany',
    'France',
    'Japan',
    'Canada',
    'Australia',
    'Brazil',
    'India',
    'China',
    'Italy',
    'Spain',
    'Mexico',
    'South Korea',
  ],
};

const formSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addFormSubmission: (
      state,
      action: PayloadAction<Omit<SubmissionsFormData, 'id' | 'submittedAt'>>
    ) => {
      const newSubmission: SubmissionsFormData = {
        ...action.payload,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
      };
      state.submissions.push(newSubmission);
    },
    clearFormSubmissions: state => {
      state.submissions = [];
    },
  },
});

export const { addFormSubmission, clearFormSubmissions } = formSlice.actions;
export default formSlice.reducer;
