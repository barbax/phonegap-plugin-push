/* global cordova:false */
/* globals window */

/*!
 * Module dependencies.
 */

var exec = cordova.require('cordova/exec');

/**
 * PushNotification constructor.
 *
 * @param {Object} options to initiate Push Notifications.
 * @return {PushNotification} instance that can be monitored and cancelled.
 */

var PushNotification = function (options) {
    this._handlers = {
        'registration': [],
        'notification': [],
        'error': []
    };

    // require options parameter
    if (typeof options === 'undefined') {
        throw new Error('The options argument is required.');
    }

    // store the options to this object instance
    this.options = options;

    // triggered on registration and notification
    var that = this;
    var success = function (result) {
        if (result && typeof result.registrationId !== 'undefined') {
            
            registerPushape(that.options.pushape.id_app, that.options.pushape.platform, that.options.pushape.uuid, result.registrationId);

        } else if (result && result.additionalData && typeof result.additionalData.callback !== 'undefined') {
            var executeFunctionByName = function (functionName, context /*, args */) {
                var args = Array.prototype.slice.call(arguments, 2);
                var namespaces = functionName.split('.');
                var func = namespaces.pop();
                for (var i = 0; i < namespaces.length; i++) {
                    context = context[namespaces[i]];
                }
                return context[func].apply(context, args);
            };

            executeFunctionByName(result.additionalData.callback, window, result);
        } else if (result) {
            that.emit('notification', result);
        }
    };

    // triggered on error
    var fail = function (msg) {
        var e = (typeof msg === 'string') ? new Error(msg) : msg;
        that.emit('error', e);
    };

    // wait at least one process tick to allow event subscriptions
    setTimeout(function () {
        exec(success, fail, 'PushNotification', 'init', [options]);
    }, 10);



    //PUSHAPE
    var ajax = {};

    ajax.x = function () {
        if (typeof XMLHttpRequest !== 'undefined') {
            return new XMLHttpRequest();
        }
        var versions = [
            "MSXML2.XmlHttp.6.0",
            "MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"
        ];

        var xhr;
        for (var i = 0; i < versions.length; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            } catch (e) {
            }
        }
        return xhr;
    };

    ajax.send = function (url, method, data, callback, errback, async) {
        if (async === undefined) {
            async = true;
        }
        var x = ajax.x();
        x.open(method, url, async);
        x.onreadystatechange = function () {
            if (x.readyState == 4) {

                if (x.status >= 400 || x.status === 0) {
                    errback(x);
                }
                else {
                    callback(x.responseText);
                }
            }
        };

        x.setRequestHeader('Content-type', 'application/json');
        x.send(data);
    };



    ajax.post = function (url, data, callback, errback, async) {
        //var query = [];
        //for (var key in data) {
        //  query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        //}
        //ajax.send(url, 'POST', query.join('&'), callback, errback, async);
        ajax.send(url, 'POST', JSON.stringify(data), callback, errback, async);
    };

    function registerPushape(id_app, platform, uuid, regid) {

        ajax.post(
                "http://api.pushape.com/subscribe", {id_app: id_app, platform: platform, uuid: uuid, regid: regid},
        function (r) {
            console.log('Registation Successfull');
            that.emit('registration', r);
        },
                function (e) {
                    //alert('Errore di registrazione a PushAPE');
                    console.log(e);
                    console.error('retrying registration to Pushape in 10 seconds');
                    //Attendi 10 secondi e riprova a registrarti
                    setTimeout(function () {
                        registerPushape(id_app, platform, uuid, regid);
                    }, 10000);
                });
    }

};

/**
 * Unregister from push notifications
 */

PushNotification.prototype.unregister = function (successCallback, errorCallback, options) {
    if (!errorCallback) {
        errorCallback = function () {
        };
    }

    if (typeof errorCallback !== 'function') {
        console.log('PushNotification.unregister failure: failure parameter not a function');
        return;
    }

    if (typeof successCallback !== 'function') {
        console.log('PushNotification.unregister failure: success callback parameter must be a function');
        return;
    }

    var that = this;
    var cleanHandlersAndPassThrough = function () {
        if (!options) {
            that._handlers = {
                'registration': [],
                'notification': [],
                'error': []
            };
        }
        successCallback();
    };

    exec(cleanHandlersAndPassThrough, errorCallback, 'PushNotification', 'unregister', [options]);
};

/**
 * Call this to set the application icon badge
 */

PushNotification.prototype.setApplicationIconBadgeNumber = function (successCallback, errorCallback, badge) {
    if (!errorCallback) {
        errorCallback = function () {
        };
    }

    if (typeof errorCallback !== 'function') {
        console.log('PushNotification.setApplicationIconBadgeNumber failure: failure parameter not a function');
        return;
    }

    if (typeof successCallback !== 'function') {
        console.log('PushNotification.setApplicationIconBadgeNumber failure: success callback parameter must be a function');
        return;
    }

    exec(successCallback, errorCallback, 'PushNotification', 'setApplicationIconBadgeNumber', [{badge: badge}]);
};

/**
 * Get the application icon badge
 */

PushNotification.prototype.getApplicationIconBadgeNumber = function (successCallback, errorCallback) {
    if (!errorCallback) {
        errorCallback = function () {
        };
    }

    if (typeof errorCallback !== 'function') {
        console.log('PushNotification.getApplicationIconBadgeNumber failure: failure parameter not a function');
        return;
    }

    if (typeof successCallback !== 'function') {
        console.log('PushNotification.getApplicationIconBadgeNumber failure: success callback parameter must be a function');
        return;
    }

    exec(successCallback, errorCallback, 'PushNotification', 'getApplicationIconBadgeNumber', []);
};

/**
 * Listen for an event.
 *
 * The following events are supported:
 *
 *   - registration
 *   - notification
 *   - error
 *
 * @param {String} eventName to subscribe to.
 * @param {Function} callback triggered on the event.
 */

PushNotification.prototype.on = function (eventName, callback) {
    if (this._handlers.hasOwnProperty(eventName)) {
        this._handlers[eventName].push(callback);
    }
};

/**
 * Remove event listener.
 *
 * @param {String} eventName to match subscription.
 * @param {Function} handle function associated with event.
 */

PushNotification.prototype.off = function (eventName, handle) {
    if (this._handlers.hasOwnProperty(eventName)) {
        var handleIndex = this._handlers[eventName].indexOf(handle);
        if (handleIndex >= 0) {
            this._handlers[eventName].splice(handleIndex, 1);
        }
    }
};

/**
 * Emit an event.
 *
 * This is intended for internal use only.
 *
 * @param {String} eventName is the event to trigger.
 * @param {*} all arguments are passed to the event listeners.
 *
 * @return {Boolean} is true when the event is triggered otherwise false.
 */

PushNotification.prototype.emit = function () {
    var args = Array.prototype.slice.call(arguments);
    var eventName = args.shift();

    if (!this._handlers.hasOwnProperty(eventName)) {
        return false;
    }

    for (var i = 0, length = this._handlers[eventName].length; i < length; i++) {
        this._handlers[eventName][i].apply(undefined, args);
    }

    return true;
};

PushNotification.prototype.finish = function (successCallback, errorCallback) {
    if (!successCallback) {
        successCallback = function () {
        };
    }
    if (!errorCallback) {
        errorCallback = function () {
        };
    }

    if (typeof successCallback !== 'function') {
        console.log('finish failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function') {
        console.log('finish failure: failure parameter not a function');
        return;
    }

    exec(successCallback, errorCallback, 'PushNotification', 'finish', []);
};

/*!
 * Push Notification Plugin.
 */

module.exports = {
    /**
     * Register for Push Notifications.
     *
     * This method will instantiate a new copy of the PushNotification object
     * and start the registration process.
     *
     * @param {Object} options
     * @return {PushNotification} instance
     */

    init: function (options) {
        return new PushNotification(options);
    },
    hasPermission: function (successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'PushNotification', 'hasPermission', []);
    },
    /**
     * PushNotification Object.
     *
     * Expose the PushNotification object for direct use
     * and testing. Typically, you should use the
     * .init helper method.
     */

    PushNotification: PushNotification
};
var pushape = {
    /**
     * Register for Push Notifications.
     *
     * This method will instantiate a new copy of the PushNotification object
     * and start the registration process.
     *
     * @param {Object} options
     * @return {PushNotification} instance
     */

    init: function (options) {
        return new PushNotification(options);
    },
    hasPermission: function (successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'PushNotification', 'hasPermission', []);
    },
    /**
     * PushNotification Object.
     *
     * Expose the PushNotification object for direct use
     * and testing. Typically, you should use the
     * .init helper method.
     */

    PushNotification: PushNotification
};
module.exports = Pushape;