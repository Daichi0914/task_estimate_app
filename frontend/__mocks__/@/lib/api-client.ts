export const apiClient = {
  get: jest.fn().mockResolvedValue({ data: [] }),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};
