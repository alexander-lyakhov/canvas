window.app = window.app || {
    modules:{},
    modName:{}
};

(function(app, $) {

    app.SinusControlPanel = function SinusControlPanel($element) {

        if (!(this instanceof SinusControlPanel)) {
            return new SinusControlPanel($element);
        }

        var $presetList = $element.find('.preset-list');
        var $selectedItem = null;

        var sinus = new app.Sinus($('canvas'))
            sinus.init();

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            this.bindEvents();

            $('.preset-list__item:eq(0)').click();

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

                sinus.setDrawFn(sinus['draw' + $selectedItem.data('preset-name')]);
            });

            return this;
        };
    };

})(window.app, jQuery);