window.app = window.app || {
    modules:{},
    modName:{}
};

(function(app, $) {

    var config =
    {
        'preset 1': {
            dimansion: 12,
            amplitude: 5
        },
        'preset 2': {
            dimansion: 12,
            amplitude: 8
        },
        'preset 3': {
            dimansion: 12,
            amplitude: 2
        },
        'preset 4': {
            dimansion: 15,
            amplitude: 5,
            particle: {
                colorDepth: 1,
                kf: 0.05
            }
        },
        'preset 5': {
            dimansion: 15,
            amplitude: 15,
            particle: {
                kf: 0.05
            }
        }
    };

    app.RippleControlPanel = function RippleControlPanel($element) {

        if (!(this instanceof RippleControlPanel)) {
            return new RippleControlPanel($element);
        }

        var $checkboxColorDepth = $element.find('#checkbox-color-depth');
        var $checkboxShowGrid = $element.find('#checkbox-show-grid');
        var $presetList = $element.find('.preset-list');

        var $selectedItem = null;

        var ripple = new app.Ripple($('canvas')).bindEvents();

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            this
                .createPresetList()
                .bindEvents();

            $('.preset-list__item:eq(0)').click();

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.createPresetList = function createPresetList()
        {
            for (var key in config) {
                $presetList.append('<li class="preset-list__item grey-gradient" data-preset-name="' + key + '"><a href="#">' + key + '</a></li>');
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            $presetList.on('click', '.preset-list__item', function(e) {

                e.stopPropagation();

                if ($selectedItem) {
                    $selectedItem.removeClass('selected');
                }

                $selectedItem = $(e.currentTarget).addClass('selected');

                var settings = config[$selectedItem.data('preset-name')];

                $checkboxColorDepth.prop('checked', Boolean((settings.particle || {}).colorDepth));
                $checkboxShowGrid  .prop('checked', Boolean((settings || {}).showGrid));

                ripple.init(settings);
            });

            $checkboxColorDepth.on('change', function(e) {
                ripple.enableColorDepth($(this).is(':checked'));
            });

            $checkboxShowGrid.on('change', function(e) {
                ripple.enableGrid($(this).is(':checked'));
            });
        };
    };

})(window.app, jQuery);