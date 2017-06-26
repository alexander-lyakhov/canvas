window.app = window.app || {
    modules:{},
    modName:{}
};

window.app.MenuBar = (function(app, $) {

    var MenuBar = function MenuBar($element)
    {
        if (!(this instanceof MenuBar)) {
            return new MenuBar($element);
        }

        this.$element = $element;
        this.$body = $('body');

        this.$allPanels = this.$element.find('.panel');
        this.$allControlBarItems = this.$element.find('.control-bar__item');
        this.$panelHelp = this.$element.find('.panel-help');

        this.bindEvents();
    };

    //==================================================================================
    //
    //==================================================================================
    MenuBar.prototype.bindEvents = function bindEvents()
    {
        var _this = this;

        this.$body
            .on('keydown keyup', function(e)
            {
                if (e.keyCode === 191) // forward slash
                {
                    e.type === 'keydown' ?
                        _this
                            .showTooltip()
                            .showPanel(_this.$panelHelp):
                        _this
                            .hideTooltip()
                            .hidePanel(_this.$panelHelp);
                }
            })
            .on('click', function(e)
            {
                _this.$allPanels.hide();
                _this.$allControlBarItems.removeClass('selected');
            });

        this.$element.on('click', '.control-bar__item', function(e)
        {
            e.stopPropagation();

            _this.$allPanels.hide();

            $('.control-bar__item').each(function()
            {
                var $this = $(this);

                if (this === e.currentTarget)
                {
                    $this
                        .toggleClass('selected')
                        .hasClass('selected') && $this.find('.panel').show();
                }
                else {
                    $this.removeClass('selected');
                }
            });
        });

        return this;
    };

    //==================================================================================
    //
    //==================================================================================
    MenuBar.prototype.showPanel = function showPanel($panel)
    {
        this.$allPanels.hide();
        this.$allControlBarItems.removeClass('selected');

        $panel
            .show()
            .parent('.control-bar__item').addClass('selected');

        return this;
    };

    MenuBar.prototype.hidePanel = function hidePanel($panel)
    {
        this.$allPanels.hide();
        $panel.parent('.control-bar__item').removeClass('selected');

        return this;
    };

    //==================================================================================
    //
    //==================================================================================
    MenuBar.prototype.showTooltip = function showTooltip()
    {
        this.$tooltip && this.$tooltip.addClass('flipped');
        return this;
    };

    //==================================================================================
    //
    //==================================================================================
    MenuBar.prototype.hideTooltip = function hideTooltip()
    {
        this.$tooltip && this.$tooltip.removeClass('flipped');
        return this;
    };

    return MenuBar;

})(window.app, jQuery);
