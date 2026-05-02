import { BASE_URL } from './constants';

describe('constants', () => {
  it('should export BASE_URL with correct value', () => {
    expect(BASE_URL).toBe('@API:BASE_URL');
  });

  it('should export BASE_URL as a string', () => {
    expect(typeof BASE_URL).toBe('string');
  });
});
