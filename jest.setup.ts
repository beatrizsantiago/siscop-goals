import '@testing-library/jest-dom';

jest.mock('./src/firebase/config', () => ({
  firestore: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));
