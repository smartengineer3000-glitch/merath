import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Merath',
  slug: 'merath',
  scheme: 'merath',
  android: {
    package: 'com.merath_mobile.merath',
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          { scheme: 'merath', host: '*', pathPrefix: '/' },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
});
