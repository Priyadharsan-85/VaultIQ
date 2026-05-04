require('dotenv').config();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
      'PLAID-SECRET': process.env.PLAID_SECRET || '',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

async function test() {
  try {
    const request = {
      user: { client_user_id: 'test_user_123' },
      client_name: 'NexaGuard Test',
      products: ['transactions'],
      language: 'en',
      country_codes: ['US'],
    };
    const response = await plaidClient.linkTokenCreate(request);
    console.log('SUCCESS! Token:', response.data.link_token);
  } catch (err) {
    console.error('ERROR:', err.response ? err.response.data : err.message);
  }
}
test();
