import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'tests/',
  use: {
    trace: 'on-first-retry',
    // Necessary to get the media codecs to play video (default 'chromium' doesn't have them)
    channel: 'chrome'
  },
  webServer: {
    command: 'npm run player',
    port: 1234,
    reuseExistingServer: true
  },
  projects: [
    {
      name: 'setup testadserver',
      testMatch: /global\.setup\.ts/,
      teardown: 'cleanup testadserver'
    },
    {
      name: 'cleanup testadserver',
      testMatch: /global\.teardown\.ts/
    },
    {
      name: 'chromium with testadserver',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-web-security']
        }
      },
      dependencies: ['setup testadserver']
    }
  ]
};
export default config;
