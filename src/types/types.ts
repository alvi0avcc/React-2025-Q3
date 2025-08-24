export interface MyFormData {
  type: 'controlled' | 'uncontrolled';
  name: string;
  age: number;
  email: string;
  gender: Gender;
  acceptTerms: boolean;
  pictureBase64: string | null;
  country: string;
  password: string;
}

export type Gender = 'male' | 'female' | 'other';
