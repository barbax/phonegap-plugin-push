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