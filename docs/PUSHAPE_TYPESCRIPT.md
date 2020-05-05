# Typescript Pushape definitions

For those of you who use Typescript, we're glad to say that we provide the complete definition file along with our package.

All objects will be understood as having a defined type, including init options and eventHandler parameters.
All available attributes and properties will have autocomplete support and type checkings.

## How to use

### Cordova

Add import below (not tested):

```TS
import 'pushape-cordova-push/types';
```

### Ionic

#### Plain plugin

In order to expose types you need to add type definition in `tsconfig.app.json` as below:

```JSON
{
  ...
  "compilerOptions": {
    ...
    "types": ["pushape-cordova-push/types"]
  },
  ...
}
```

Refer to issue: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/14447


#### Ionic Native

A better way is to use the native wrapper: https://github.com/ionic-team/ionic-native/pull/3405/commits/d30bffcfba5d05fdf2d3cb94d6eeeb4c838b3f40#diff-5c2606d42cfe9adc273fb2e73b19ded5

See also the Playground in order to check how to use it: https://github.com/gluelabs/pushape-playground