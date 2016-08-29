window.app = window.app || {};

window.app.BaseControlPanel = (function(app, $) {

    console.log('BaseControlPanel');

    var BaseControlPanel = function BaseControlPanel($element)
    {
        if (!(this instanceof BaseControlPanel)) {
            return new BaseControlPanel($element);
        }

        this.$element = $element;
        this.$body = $('body');

        this.$tooltip = $('.tooltip');
        this.$buttonTooltip = $element.find('.button-tooltip');

        this.$controlBar = $('.control-bar');
        this.$allPanels = this.$controlBar.find('.panel');
        this.$allControlBarItems = this.$controlBar.find('.control-bar__item');
        this.$panelHelp = this.$controlBar.find('.panel-help');
    };

    //==================================================================================
    //
    //==================================================================================
    BaseControlPanel.prototype.bindEvents = function bindEvents()
    {
        var _this = this;

        this.$buttonTooltip
            .on('mouseover', $.proxy(_this.showTooltip, _this))
            .on('mouseout',  $.proxy(_this.hideTooltip, _this));

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

        this.$controlBar.on('click', '.control-bar__item', function(e)
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
    BaseControlPanel.prototype.showPanel = function showPanel($panel)
    {
        this.$allPanels.hide();
        this.$allControlBarItems.removeClass('selected');

        $panel
            .show()
            .parent('.control-bar__item').addClass('selected');

        return this;
    };

    BaseControlPanel.prototype.hidePanel = function hidePanel($panel)
    {
        this.$allPanels.hide();
        $panel.parent('.control-bar__item').removeClass('selected');

        return this;
    };

    //==================================================================================
    //
    //==================================================================================
    BaseControlPanel.prototype.showTooltip = function showTooltip()
    {
        this.$tooltip.addClass('flipped');
        return this;
    };

    //==================================================================================
    //
    //==================================================================================
    BaseControlPanel.prototype.hideTooltip = function hideTooltip()
    {
        this.$tooltip.removeClass('flipped');
        return this;
    };

    return BaseControlPanel;

})(window.app, jQuery);