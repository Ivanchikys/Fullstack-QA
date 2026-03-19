export type Address = {
  address1: string;
  address2?: string;
  city: string;
  country_id: string;
  zone_id: string;
  postcode: string;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  fax?: string;
  company?: string;
  loginName: string;
  password: string;
  address: Address;
};

export function generateUniqueUser(): User {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const unique = `${timestamp}${random}`;
  return {
    firstName: 'Test',
    lastName: 'User',
    email: `testuser.${unique}@example.com`,
    telephone: '+1234567890',
    fax: '12345',
    company: 'TestCompany',
    loginName: `testuser${unique}`,
    password: 'Test123!',
    address: {
      address1: '123 Main St',
      address2: '',
      city: 'Ararat',
      country_id: '11', // ARMENIA
      zone_id: '181', // ARARAT
      postcode: '10001',
    },
  };
}
