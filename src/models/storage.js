const repository = (function () {
    'use strict';

    let storage;
    let keyPrefix = 'lottery'

    const getStorage = function () {
        if (typeof (storage) === 'undefined')
            storage = window['sessionStorage'];
        return storage;
    };

    return {
        /**
         * @param {boolean} isPersistent if 'true' then use localStorage, otherwise sessionStorage
         */
        init: function (isPersistent) {
            if (isPersistent)
                storage = window['localStorage'];
            else
                storage = window['sessionStorage'];

            storage.clear();
        },
        getDB: function () {
            return getStorage();
        },
        /**
         * Get value via key.
         *
         * @param {string} strKey key
         * @return {string} value that the key identified
         */
        getByKey: function (strKey) {
            let newKey = `${keyPrefix}.${strKey}`;
            return JSON.parse(getStorage().getItem(newKey)) || {};
        },
        /**
         * Set value in storage by an identify key.
         *
         * @param {string} strKey Get value via key
         * @param {object} objValue Get value via key
         */
        setItem: function (strKey, objValue) {
            let newKey = `${keyPrefix}.${strKey}`;
            getStorage().setItem(newKey, JSON.stringify(objValue));
        },
        clearAll: function () {
            console.log('clear Storage');
            getStorage().clear();
        }
    }
}());