angular.module("starter").controller("PushController", function($location, $rootScope, $scope, $stateParams, LinkService, SB, Push) {
    angular.extend($scope, {
        is_loading: !0,
        value_id: $stateParams.value_id,
        collection: [],
        areas: [],
        toggle_text: !1,
        card_design: !1,
        load_more: !1,
        use_pull_refresh: !0
    }), Push.setValueId($stateParams.value_id), $scope.loadContent = function(loadMore) {
        var offset = $scope.collection.length;
        Push.findAll(offset).then(function(data) {
            data.collection && ($scope.collection = $scope.collection.concat(data.collection), $rootScope.$broadcast(SB.EVENTS.PUSH.readPush)), $scope.page_title = data.page_title, $scope.load_more = data.collection.length >= data.displayed_per_page, $scope.areas = data.areas
        }).then(function() {
            loadMore && $scope.$broadcast("scroll.infiniteScrollComplete"), $scope.is_loading = !1
        })
    }, $scope.pullToRefresh = function() {
        $scope.pull_to_refresh = !0, $scope.load_more = !1, Push.findAll(0, !0).then(function(data) {
            data.collection && ($scope.collection = data.collection, $rootScope.$broadcast(SB.EVENTS.PUSH.readPush)), $scope.load_more = data.collection.length >= data.displayed_per_page
        }).then(function() {
            $scope.$broadcast("scroll.refreshComplete"), $scope.pull_to_refresh = !1
        })
    }, 
    $scope.showItem = function(item) {
        if (item.url) {
            if ($rootScope.isNotAvailableOffline()) return;
            LinkService.openLink(item.url)
        } else item.action_value ? $location.path(item.action_value) : $scope.toggle_text = !$scope.toggle_text
    }, 
    $scope.savepusharea = function (item) {
        Push.savearea(item);
    },
    $scope.loadMore = function() {
        $scope.loadContent(!0)
    }, $scope.loadContent()
});

angular.module('starter').factory('Push', function ($pwaRequest, $session, SB) {
    var factory = {
        value_id                : null,
        device_type             : DEVICE_TYPE,
        device_token            : null,
        unread_count            : 0,
        extendedOptions         : {}
    };

    factory.setValueId = function (valueId) {
        factory.value_id = valueId;
    };

    factory.setExtendedOptions = function (options) {
        factory.extendedOptions = options;
    };

    factory.preFetch = function (page) {
        factory.findAll();
    };

    factory.registerAndroidDevice = function (params) {
        $pwaRequest.post('/push/android/registerdevice', {
            data: angular.extend(params, {
                device_uid: $session.getDeviceUid(),
                provider: 'fcm'
            }),
            cache: false
        });
    };

    factory.registerIosDevice = function (params) {
        $pwaRequest.post('/push/iphone/registerdevice', {
            data : angular.extend(params, {
                device_uid: $session.getDeviceUid()
            }),
            cache : false
        });
    };

    factory.findAll = function (offset, refresh) {
        if (!this.value_id) {
            $pwaRequest.reject('[Factory::Push.findAll] missing value_id');
        }

        return $pwaRequest.get('push/mobile_list/findall', angular.extend({
            urlParams: {
                value_id    : this.value_id,
                device_uid  : $session.getDeviceUid(),
                offset      : offset
            },
            refresh: true
        }, factory.extendedOptions));
    };

    factory.savearea = function (item) {
            return $pwaRequest.get('push/mobile_list/savearea', angular.extend({
                urlParams: {
                    id    : item.id,
                    checked    : item.checked,
                    device_uid  : $session.getDeviceUid()
                },
                refresh: true
            }, factory.extendedOptions));
    };

    factory.updateUnreadCount = function () {
        return $pwaRequest.get('push/mobile/count', {
            urlParams: {
                device_uid: $session.getDeviceUid()
            }
        });
    };

    factory.getInAppMessages = function () {
        return $pwaRequest.get('push/mobile/inapp', {
            urlParams: {
                device_uid: $session.getDeviceUid()
            }
        });
    };

    factory.getLastMessages = function (cache) {
        var localCache = (cache === undefined) ? true : cache;
        return $pwaRequest.get('push/mobile/lastmessages', {
            urlParams: {
                device_uid: $session.getDeviceUid()
            },
            refresh: true,
            cache: localCache
        });
    };

    factory.markInAppAsRead = function () {
        return $pwaRequest.get('push/mobile/readinapp', {
            urlParams: {
                device_uid: $session.getDeviceUid(),
                device_type: factory.device_type
            },
            cache: false
        });
    };

    factory.markAsDisplayed = function (messageId) {
        var url = '';
        switch (factory.device_type) {
            case SB.DEVICE.TYPE_ANDROID:
                url = 'push/android/markdisplayed';
                break;
            case SB.DEVICE.TYPE_IOS:
                url = 'push/iphone/markdisplayed';
                break;
            default:
                return $pwaRequest.reject();
        }

        return $pwaRequest.get(url, {
            data: {
                device_uid: $session.getDeviceUid(),
                message_id: messageId
            },
            cache: false
        });
    };

    return factory;
});
