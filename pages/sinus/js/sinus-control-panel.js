window.app = window.app || {};

(function(app, $) {

    var config = ['Bars', 'Lines'];

    app.SinusControlBar = app.SinusControlPanel = function SinusControlPanel($element) {

        if (!(this instanceof SinusControlPanel)) {
            return new SinusControlPanel($element);
        }

        app.BaseControlPanel.apply(this, arguments);

        var $presetList = $element.find('.preset-list');
        var $selectedItem = null;

        var sinus = new app.Sinus($('canvas'))
            sinus.init();

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
            config.forEach(function(value) {
                $presetList.append('<li class="preset-list__item grey-gradient" data-preset-name="' + value + '"><a href="#">' + value + '</a></li>');
            });

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            app.BaseControlPanel.prototype.bindEvents.apply(this);

            $presetList.on('click', '.preset-list__item', function(e) {

                e.stopPropagation();

                if ($selectedItem) {
                    $selectedItem.removeClass('selected');
                }

                $selectedItem = $(e.currentTarget).addClass('selected');

                sinus.setDrawFn(sinus['draw' + $selectedItem.data('preset-name')]);
            });

            return this;
        };
    };

    app.SinusControlBar.prototype = Object.create(app.BaseControlPanel.prototype);
    app.SinusControlBar.prototype.constructor = app.BaseControlPanel;

    var controlBar = new app.SinusControlPanel($('.sinus-control-panel'));
        controlBar.init();

})(window.app, jQuery);