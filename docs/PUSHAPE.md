# Pushape

> Register and receive push notifications using pushape backend


## Installation

### Cordova

To install the plugin in your app:

```
npm install pushape-cordova-push
cordova plugins add pushape-cordova-push
```

### Ionic

To install the plugin in your app:

```
npm install pushape-cordova-push
ionic cordova plugins add pushape-cordova-push
```

## Getting Started

```javascript
import { Device } from '@ionic-native/device/ngx';
import Pushape from "pushape-cordova-push/www/push";

...

class PushapeService {

  constructor(
    private readonly device: Device,
  ) {
    const push = Pushape.init({
      enabled: true,
      android: {
        senderID: "<your-firebase-sender-id>" // **NOT MANDATORY**
      },
      ios: {
        // Options
        alert: "true",
        badge: true,
        sound: "false"
      },
      pushape: {
        platform: this.device.platform, // "<your-pushape-app-id>"
        uuid: this.device.uuid, // "<device-platform>" - ios | android
        uuid: "<device-uuid>",
      },
      id_user: "<user-id>" // in order to send notification using your custom id
    });

    push.on('registration', (data) => {
      // data.push_id (pushape id for the specific device)
    });

    push.on('notification', (data) => {
      // data.message,
      // data.title,
      // data.count,
      // data.sound,
      // data.image,
      // data.additionalData
    });

    push.on('error', (e) => {
      // e.message
    });
  }
}
```
