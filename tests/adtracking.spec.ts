import { test, expect } from '@playwright/test';

const delay = ms => new Promise(res => setTimeout(res, ms));

async function waitForTrackingEvents(page, adServerUrl, sessionId) {
  const events = {};
  const attempts = new Array(3);
  for (const _ of attempts) {
    let response = await page.request.fetch(`${adServerUrl}/api/v1/sessions/${sessionId}/events`);
    if (response.ok()) {
      const data = await response.json();
      data.events.map((event) => {
        events[event.type] = true;
      })
    }
    await delay(1000);
  }
  return events;
}

test('verify that all ad impressions are tracked', async ({ page }) => {
  const uid = Math.random().toString(36).substring(7);
  const adServerUrl = `${process.env.ADSERVER_URL}`;
  const adTag = `${adServerUrl}/api/v1/vast?dur=5&uid=${uid}`;

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
    const allEvents = await waitForTrackingEvents(page, adServerUrl, sessionId);
    expect(allEvents['start']).toBe(true);
    expect(allEvents['firstQuartile']).toBe(true);
    expect(allEvents['midpoint']).toBe(true);
    expect(allEvents['thirdQuartile']).toBe(true);
    expect(allEvents['complete']).toBe(true);
  }
});