import { test as setup } from '@playwright/test';
import { Context, createInstance } from '@osaas/client-core';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

setup('create a test-adserver', async ({}) => {
  console.log('Creating Test Adserver in Open Source Cloud...');

  const ctx = new Context();
  try {
    const serviceAccessToken = await ctx.getServiceAccessToken(
      'eyevinn-test-adserver'
    );
    const instance = await createInstance(
      ctx,
      'eyevinn-test-adserver',
      serviceAccessToken,
      {
        name: 'webplayer'
      }
    );
    await delay(6000);
    process.env.ADSERVER_URL = instance.url;
  } catch (err) {
    console.error('Failed to create Test Adserver:', err);
  }
});
