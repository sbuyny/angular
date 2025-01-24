
angular.module("starter").service("LinkService", function ($rootScope, $translate, $window, SB, $cordovaInAppBrowser) {
    return {
        openLink: function(url, options) {

            if($rootScope.isNotAvailableInOverview() || $rootScope.isNotAvailableOffline()) {
                return;
            }

            //set default options (inapp + navbar)
            /**
             * @todo maybe extend ?
             */
            if(options === undefined) {
                options = {
                    "hide_navbar"       : true,
                    "use_external_app"  : false
                };
            }

            //by default use inappbrowser
            var target = "_blank";
            var inAppBrowserOptions = [];
            var device = "";

            switch(true) {

                //On android, tel link are opened in current app
                case (/^(tel:).*/.test(url) && (DEVICE_TYPE === SB.DEVICE.TYPE_ANDROID)) :
                    target = "_self";
                    device = "phone";
                    break;
                    
                case (/^(mailto:).*/.test(url) && (DEVICE_TYPE === SB.DEVICE.TYPE_ANDROID)) :
                    target = "_system";
                    device = "email";
                    break;

                case options.use_external_app:

                //if PDF, we force use of external application
                case (/.*\.pdf($|\?)/).test(url):
                    url = 'http://docs.google.com/gview?embedded=true&url='+url;
                    break;

                //On iOS, you cannot hidenavbar and show inappbrowser
                case (options.hide_navbar && (DEVICE_TYPE === SB.DEVICE.TYPE_IOS)):
                    target = "_system";
                    inAppBrowserOptions.push("EnableViewPortScale=yes");
                    break;

                default: 
                    if(options && (options.hide_navbar)) {
                        inAppBrowserOptions.push("location=no");
                        inAppBrowserOptions.push("toolbar=no");
                    } else { //else use standard inAppBrowser with navbar
                        inAppBrowserOptions.push("location=no");
                        inAppBrowserOptions.push("closebuttoncaption=" + $translate.instant("Done"));
                        inAppBrowserOptions.push("transitionstyle=crossdissolve");
                        inAppBrowserOptions.push('toolbar=yes');
                    }

            }
             var options = {
                  location: 'yes',
                  clearcache: 'yes',
                  toolbar: 'yes'
               };
            var wopen = '';
            if(url.match(/paypal.com/gi)) wopen = 1;
            if(url.match(/mailto/g)) wopen = 1;
            
            if(device == "phone" || device == "email" || wopen == 1){
                $window.open(url, target, inAppBrowserOptions.join(","));
            }
            else if(url.match(/paypal_button/gi)){
                var array = url.split('paypal_button_');
                var select = document.getElementById(array[1]).value;
                var id = document.getElementById(array[1]+'_id').value;
                var url = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id='+id+'&on0=Gift%20Card%20Amount&os0='+select;
                $window.open(url, target, inAppBrowserOptions.join(","));
            }
            else {
                $cordovaInAppBrowser.open(encodeURI(url), '_blank', options);
            }
        }
    };
});