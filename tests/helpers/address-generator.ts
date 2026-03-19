import { AddressData } from '../pages/addressBook.page';

export function generateAddress(overrides?: Partial<AddressData>): AddressData {
  const timestamp = Date.now();
  return {
    firstName: `Test${timestamp}`,
    lastName: `User${timestamp}`,
    address1: `${timestamp} Main St`,
    city: 'GOROD',
    postcode: '10001',
    countryId: '223', // US
    zoneId: '3655', // New York
    ...overrides,
  };
}
