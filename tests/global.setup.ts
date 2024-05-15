import { test as setup } from '@playwright/test';
import { Context, createInstance } from '@osaas/client-core';
import { MediaTailorClient, PutPlaybackConfigurationCommand, Mode, FillPolicy, InsertionMode } from '@aws-sdk/client-mediatailor';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function launchTestAdserver(ctx: Context) {
  console.log('Creating Test Adserver in Open Source Cloud...');

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
    process.env.ADSERVER_URL = instance.url;
  } catch (err) {
    console.error('Failed to create Test Adserver:', err);
  }
}

async function createLiveChannel(ctx: Context) {
  console.log('Creating Live Channel in Open Source Cloud...');

  try {
    const serviceAccessToken = await ctx.getServiceAccessToken(
      'channel-engine'
    );
    const channel = await createInstance(
      ctx,
      'channel-engine',
      serviceAccessToken,
      {
        name: 'webplayer',
        type: 'Loop',
        url: 'https://lab.cdn.eyevinn.technology/stswetvplus-promo-2023-5GBm231Mkz.mov/manifest.m3u8',
        opts: {
          useDemuxedAudio: false,
          useVttSubtitles: false,
          preroll: {
            url: 'http://maitv-vod.lab.eyevinn.technology/VINN.mp4/master.m3u8',
            duration: 10500
          }
        }
      }
    );
    process.env.LIVE_CHANNEL_URL = channel.playback;
  } catch (err) {
    console.error('Failed to create Live Channel:', err);
  }
}

async function createAdConfiguration(sourceUrl: URL, adServerUrl: URL) {
  console.log('Creating Ad Configuration in AWS...');

  try {
    const client = new MediaTailorClient({ region: 'eu-north-1' });
    const input = {
      AdDecisionServerUrl: `${adServerUrl.toString()}/api/v1/vast?dur=[session.avail_duration_secs]&uid=[player_params.uid]`,
      AvailSuppression: { // AvailSuppression
        Mode: Mode.OFF,
        FillPolicy: FillPolicy.FULL_AVAIL_ONLY
      },
      InsertionMode: InsertionMode.STITCHED_ONLY,
      ManifestProcessingRules: { // ManifestProcessingRules
        AdMarkerPassthrough: { // AdMarkerPassthrough
          Enabled: false,
        },
      },
      Name: 'webplayer',
      VideoContentSourceUrl: sourceUrl.toString().replace('master.m3u8', ''),
    };
    const command = new PutPlaybackConfigurationCommand(input);
    const response = await client.send(command);
    await delay(6000);
    process.env.SSAI_LIVE_URL = response.HlsConfiguration?.ManifestEndpointPrefix + '/master.m3u8';
  } catch (err) {
    console.error('Failed to create Ad Configuration:', err);
  }
}

setup('create a test-adserver and live-channel', async ({}) => {
  const ctx = new Context();
  await launchTestAdserver(ctx);
  await createLiveChannel(ctx);
  await delay(6000);
  if (process.env.LIVE_CHANNEL_URL && process.env.ADSERVER_URL) {
    await createAdConfiguration(new URL(process.env.LIVE_CHANNEL_URL), new URL(process.env.ADSERVER_URL));
  }
});

