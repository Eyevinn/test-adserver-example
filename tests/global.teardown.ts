import { test as teardown } from '@playwright/test';
import { Context, removeInstance } from '@osaas/client-core';

teardown('remove test adserver', async ({}) => {
  console.log('Removing Test Adserver in Open Source Cloud...');

  const ctx = new Context();
  try {
    const serviceAccessToken = await ctx.getServiceAccessToken(
      'eyevinn-test-adserver'
    );
    await removeInstance(
      ctx,
      'eyevinn-test-adserver',
      'webplayer',
      serviceAccessToken
    );
  } catch (err) {
    console.error('Failed to remove Test Adserver:', err);
  }
});
