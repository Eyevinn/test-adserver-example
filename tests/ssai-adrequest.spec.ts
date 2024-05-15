import { test, expect } from '@playwright/test';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function waitForAdRequest(page, adServerUrl, uid) {
  const attempts = new Array(5);
  for (const _ of attempts) {
    let response = await page.request.fetch(
      `${adServerUrl}/api/v1/users/${uid}`
    );
    if (response.ok()) {
      const data = await response.json();
      return data;
    }
    await delay(5000);
  }
}

test('verify that expected parameters are sent on ssai ad request', async ({
  page
}) => {
  const uid = Math.random().toString(36).substring(7);
  const adServerUrl = `${process.env.ADSERVER_URL}`;

  await page.goto('ssai.html');
  await page.locator('#manifest-input').fill(process.env.SSAI_LIVE_URL + `?uid=${uid}`);
  await page.locator('#load-button').click();
  await page.locator('video').waitFor();

  const adRequest = await waitForAdRequest(page, adServerUrl, uid);
  console.log(adRequest);
});