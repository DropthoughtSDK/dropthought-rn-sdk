# react-native-dt-sdk

dropthought sdk for react-native

## Installation

Using npm:

```sh
npm install @dropthought/react-native-dt-sdk
```

or using yarn:

```sh
yarn add @dropthought/react-native-dt-sdk
```

## Latest version
4.0.40

### Installing dependencies

- [react-native-aes-crypto](https://www.npmjs.com/package/react-native-aes-crypto)
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context#getting-started)
- [react-native-secure-key-store](https://www.npmjs.com/package/react-native-secure-key-store)
- [lottie-react-native](https://github.com/lottie-react-native/lottie-react-native)
- [ramda](https://github.com/ramda/ramda)

## Usage

```js
import {
  SurveyModalContainer,
  useOpenSurvey,
  initialize,
  APPEARANCE,
  THEME_OPTIONS,
} from '@dropthought/react-native-dt-sdk';

initialize({
  apiKey: API_KEY,
  storage: AsyncStorage,
});

<SurveyModalContainer>{/* ... */}</SurveyModalContainer>;
```

### initialize

Used to initialize Dropthought with your apiKey & preferred storage

```js
import { initialize } from '@dropthought/react-native-dt-sdk';
import AsyncStorage from '@react-native-community/async-storage';

initialize({
  apiKey: 'your apiKey',
  storage: AsyncStorage,
});
```

### SurveyModalContainer

This component configures the survey settings.

- Props:
  - `surveyId`: survey id
  - `themeOption`: THEME_OPTION.CLASSIC | THEME_OPTION.OPTION1 | THEME_OPTION.OPTION2 | ...
  - `appearance`: APPEARANCE.SYSTEM | APPEARANCE.LIGHT | APPEARANCE.DARK
  - `fontColor`: [React Native Color Reference](https://reactnative.dev/docs/colors)
  - `backgroundColor`: [React Native Color Reference](https://reactnative.dev/docs/colors)
  - `onClose`: The `onClose` prop allows passing a function that will be called once the modal has been closed.

```js
import { SurveyModalContainer, THEME_OPTIONS } from 'react-native-dt-sdk';

<SurveyModalContainer
  surveyId={surveyId}
  themeOption={themeOption}
  appearance={appearance}
  fontColor={fontColor}
  backgroundColor={backgroundColor}
  onClose={() => {}}
>
  {/* ... */}
</SurveyModalContainer>;
```

It's not necessary to pass these props at `SurveyModalContainer`. You can pass them though `openSurvey`

```js
const openSurvey = useOpenSurvey();

// use visibility
openSurvey({
  visibilityId,
});

// use surveyId
openSurvey({
  surveyId,
  themeOption,
  appearance,
  fontColor,
  backgroundColor,
});
```

### useOpenSurvey

A custom hook returns the function that opens the dropthought survey.

```js
import { useTheme } from '@dropthought/react-native-ui';

const openSurvey = useOpenSurvey();
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Troubleshooting

### Duplicate class org.spongycastle.cert.AttributeCertificateHolder found in modules bcpkix-jdk15on-1.56.0.0.jar (com.madgag.spongycastle:bcpkix-jdk15on:1.56.0.0) and pkix-1.54.0.0.jar ...

please add extra configuration to your app's build.gradle

```diff
dependencies {
    implementation fileTree(dir: "libs", include: ["*.jar"])
    //noinspection GradleDynamicVersion
    implementation "com.facebook.react:react-native:+"  // From node_modules
    //.....
    
+   // add the following config
    configurations.all {
        resolutionStrategy {
            dependencySubstitution {
                substitute module('com.madgag.spongycastle:pkix:1.54.0.0') with module('com.madgag.spongycastle:bcpkix-jdk15on:1.56.0.0')
            }
        }
    }
}


```
