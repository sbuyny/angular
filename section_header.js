
angular.module('starter').run(function($rootScope, $injector) {
    var HomepageLayout = $injector.get('HomepageLayout');
    $rootScope.headerData = {};

    HomepageLayout.getOptions().then(function(options) {
        options.forEach(function(opt) {
            if (opt.id) {
                $rootScope.headerData[opt.id] = {
                    image: opt.custom_fields.section_header_image,
                    showTitle: opt.custom_fields.section_header_show_title,
                    showBack: opt.custom_fields.section_header_show_back,
                    imageBack: opt.custom_fields.section_header_image_back,
                    bgColor: opt.custom_fields.section_header_background_color,
                    bgAlign: opt.custom_fields.section_header_background_align,
                    fontFamily: opt.custom_fields.section_header_font_family,
                    fontColor: opt.custom_fields.section_header_font_color
                };
            }
        });
    });
}).decorator('ionHeaderBarDirective', function($delegate, $rootScope, $injector, $ionicHistory) {
    var directive = $delegate[0];
    var compile = directive.compile;

    var header = {
        setBackgroundImage: function(data, tElement) {
            var headerData = this._getHeaderData(data);
            if (headerData) {
                if (headerData.image) {
                    tElement.css('backgroundImage', 'url("http://13.88.188.171' + headerData.image + '")');
                } else {
                    tElement.css('backgroundImage', null);
                }
                //tElement.css('backgroundPosition', 'center center');
                tElement.css('backgroundSize', 'auto 48px');
                tElement.css('backgroundRepeat', 'no-repeat');
            }
        },
        getBackgroundImage: function(valueId, tElement) {
            if ($rootScope.headerData[valueId]) {
                return $rootScope.headerData[valueId].image;
            } else {
                var url = tElement.css('backgroundImage');
                if (url) {
                    return url.replace(/url\(([^\)])\)/gi, "$1");
                }
                return '';
            }
        },
        setBackgroundImageAlign: function(data, tElement) {
            var headerData = this._getHeaderData(data);
            if (headerData) {
                if (headerData.image) {
                    var pos = 'center';
                    if (parseInt(headerData.bgAlign) == 2) {
                        pos = 'right ';
                    } else if (parseInt(headerData.bgAlign) == 1) {
                        pos = 'left';
                    }
                    tElement.css('backgroundPosition', pos + ' top 1px');//16px
                }
            }
        },
        getBackgroundImageAlign: function(valueId, tElement) {
            if (tElement[0]) {
                var pos = tElement.css('backgroundPosition');
                if (/^left\s/gi.test(pos)) {
                    return 1;
                }
                if (/^right\s/gi.test(pos)) {
                    return 2;
                }
            } else if ($rootScope.headerData[valueId]) {
                return $rootScope.headerData[valueId].bgAlign;
            }
            return 0;
        },
        setBackgroundColor: function(data, tElement) {
            var headerData = this._getHeaderData(data);
            if (headerData) {
                tElement.css('backgroundColor', headerData.bgColor);
            }
        },
        setTitleState: function(data, tElement) {
            var headerData = this._getHeaderData(data);
            if (headerData) {
                var titleEl = tElement[0].getElementsByClassName('title');
                if (parseInt(headerData.showTitle) == 1) {
                    angular.element(titleEl[0]).css('display', 'none');
                } else {
                    angular.element(titleEl[0]).css('display', 'block');
                }
            }
        },
        getTitleState: function(valueId, tElement) {
            if (tElement[0]) {
                var titleEl = tElement[0].getElementsByClassName('title');
                return angular.element(titleEl[0]).css('display') == 'block' ? 0 : 1;
            } else if ($rootScope.headerData[valueId]) {
                return $rootScope.headerData[valueId].showTitle;
            }
            return 0;
        },
        setBackState: function(data, tElement) {
            var headerData = this._getHeaderData(data);
            if (headerData) {
                var titleEl = tElement[0].getElementsByClassName('default-title');
                if (parseInt(headerData.showBack) == 1) {
                    angular.element(titleEl[0]).css('display', 'none');
                } else {
                    angular.element(titleEl[0]).css('display', 'inline-block');
                }
                var el2 = angular.element(tElement[0].querySelectorAll('i.icon'));

                if(headerData.imageBack && el2.css('display')!='none'){
                    el2.after('<img height="20" class="image_back" style="margin-top: 6px;float: left;margin-right: 3px;" src="http://13.88.188.171'+headerData.imageBack+'">');
                    el2.css('display', 'none');
                }
            }
        },
        getBackState: function(valueId, tElement) {
            if (tElement[0]) {
                var titleEl = tElement[0].querySelectorAll('i.icon');
                return angular.element(titleEl[0]).css('display') == 'inline-block' ? 0 : 1;
            } else if ($rootScope.headerData[valueId]) {
                return $rootScope.headerData[valueId].showTitle;
            }
            return 0;
        },
        setTitleColor: function(data, tElement) {
            var headerData = this._getHeaderData(data);
            if (headerData) {
                if (headerData.fontColor) {
                    tElement.children().css('color', headerData.fontColor);
                } else {
                    tElement.children().css('color', null);
                }
            }
        },
        setFontFamily: function(data, tElement) {
            var headerData = this._getHeaderData(data);
            if (headerData) {
                if (headerData.fontFamily) {
                    tElement.children().css('fontFamily', headerData.fontFamily);
                } else {
                    tElement.children().css('fontFamily', null);
                }
            }
        },
        _getHeaderData: function(data) {
            if (data.stateParams) {
                var valueId = parseInt(data.stateParams.value_id);
                if ($rootScope.headerData[valueId]) {
                    return $rootScope.headerData[valueId];
                }
            }
            return false;
        }
    };

    directive.compile = function(tElement, tAttrs) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if ($rootScope.headerData[fromParams.value_id]) {
                $rootScope.headerData[fromParams.value_id].bgColor = tElement.css('backgroundColor');
                $rootScope.headerData[fromParams.value_id].image = header.getBackgroundImage(fromParams.value_id, tElement);
                $rootScope.headerData[fromParams.value_id].bgAlign = header.getBackgroundImageAlign(fromParams.value_id, tElement);
                $rootScope.headerData[fromParams.value_id].showTitle = header.getTitleState(fromParams.value_id, tElement);
                $rootScope.headerData[fromParams.value_id].showBack = header.getBackState(fromParams.value_id, tElement);
                $rootScope.headerData[fromParams.value_id].fontColor = tElement.children().css('color');
                $rootScope.headerData[fromParams.value_id].fontFamily = tElement.children().css('fontFamily');
            }
        });
        $rootScope.$on('$ionicView.loaded', function (event, data) {
            header.setBackgroundImage(data, tElement);
            header.setBackgroundImageAlign(data, tElement);
            header.setBackgroundColor(data, tElement);
            header.setTitleState(data, tElement);
            header.setBackState(data, tElement);
            header.setTitleColor(data, tElement);
            header.setFontFamily(data, tElement);
        });
        $rootScope.$on('$ionicView.beforeLeave', function (event, data) {
            if (data.stateParams) {
                var imageChanged = angular.element(tElement[0]).attr('image-changed');
                var valueId = parseInt(data.stateParams.value_id);
                if ($rootScope.headerData[valueId] && angular.isDefined(imageChanged)) {
                    $rootScope.headerData[valueId].image = imageChanged;
                    angular.element(tElement[0]).removeAttr('image-changed');
                }
            }
        });
        return compile.apply(this, arguments);
    };

    return $delegate;
});

const arr = [
        'layout_1',
        'layout_2',
        'layout_3',
        'layout_4',
        'layout_5',
        'layout_6',
        'layout_7',
        'layout_8',
        'layout_9',
        'layout_10',
        'layout_3_h',
        'layout_4_h',
        'layout_5_h',
        'layout_14',
        'layout_15',
        'layout_16',
        'layout_17',
    ];

arr.forEach(function(element) {
    App.service(element, function ($http, $rootScope, HomepageLayout, $window) {
    var service = {};
    var layoutCode = HomepageLayout.properties.layoutCode;

    service.getTemplate = function() {
        return "modules/section_header/view_"+layoutCode+".html";
    };

    service.getModalTemplate = function() {
        return "templates/home/l10/modal.html";
    };

    service.onResize = function() {
        /** Do nothing for this particular one */
    };
    
    service.features = function(features) {
        _features = features;     
        return _features;
    };
    return service;

});

});
