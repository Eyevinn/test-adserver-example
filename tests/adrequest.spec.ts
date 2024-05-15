import { test, expect } from '@playwright/test';

test('verify that expected parameters are sent on ad request', async ({ page }) => {
  const uid = Math.random().toString(36).substring(7);
  const adServerUrl = `${process.env.ADSERVER_URL}`;
  const adTag = `${adServerUrl}/api/v1/vast?dur=5&uid=${uid}&x=1&y=2&z=3`;

  await page.goto('index.html');
  await page.locator('#adtag-input').fill(adTag);
  await page.locator('#load-button').click();

  await page.waitForResponse(response => response.url().includes(`${adServerUrl}/api/v1/vast`) && response.ok());
  await page.locator('#play-button').click();

  await page.waitForTimeout(5000);
  const response = await page.request.fetch(`${adServerUrl}/api/v1/users/${uid}`);
  if (response.ok()) {
    const data = await response.json();
    const sessionId = data[0].sessionId;
    const sessionResponse = await page.request.fetch(`${adServerUrl}/api/v1/sessions/${sessionId}`);
    const session = await sessionResponse.json();
    expect(session.clientRequest.x).toBe('1');
    expect(session.clientRequest.y).toBe('2');
    expect(session.clientRequest.z).toBe('3');
  }

});
