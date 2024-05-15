import { test as teardown } from '@playwright/test';
import { Context, removeInstance } from '@osaas/client-core';
import { MediaTailorClient, DeletePlaybackConfigurationCommand } from '@aws-sdk/client-mediatailor';

async function removeTestAdserver(ctx: Context) {
  console.log('Removing Test Adserver in Open Source Cloud...');

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
}

async function removeChannel(ctx: Context) {
  console.log('Removing Live channel in Open Source Cloud...');

  try {
    const serviceAccessToken = await ctx.getServiceAccessToken(
      'channel-engine'
    );
    await removeInstance(
      ctx,
      'channel-engine',
      'webplayer',
      serviceAccessToken
    );
  } catch (err) {
    console.error('Failed to remove Live channel:', err);
  }
}

async function removeAdConfiguration() {
  try {
    const client = new MediaTailorClient({ region: 'eu-north-1' });
    const input = {
      Name: 'webplayer'
    };
    const command = new DeletePlaybackConfigurationCommand(input);
    const response = await client.send(command);
  } catch (err) {
    console.error('Failed to remove Ad Configuration:', err);
  }
}

teardown('remove test adserver and channel', async ({}) => {
  const ctx = new Context();
  await removeAdConfiguration();
  await removeTestAdserver(ctx);
  await removeChannel(ctx);
});
