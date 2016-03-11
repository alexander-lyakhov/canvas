window.app = window.app || {};

(function(app, $) {

    /*
     *
     */
    app.Ball = function Ball($element)
    {
        if (!(this instanceof Ball)) {
            return new Ball($element);
        }

        $element[0].width = window.innerWidth;
        $element[0].height = window.innerHeight - 16;

        var xCenter = $element.width()  >> 1;
        var yCenter = $element.height() >> 1;

        var R = 300;
        var deg = Math.PI / 180;

        var aroundXangle = 0;
        var aroundYangle = 0;
        var aroundZangle = 0;

        var vectorAngles = [];
        var color = '';

        var backClipping = false;

        var virtualPage = document.createElement('canvas');
            virtualPage.width  = $element.width();
            virtualPage.height = $element.height();

        var visibleCtx = $element[0].getContext('2d');
        var virtualCtx = virtualPage.getContext('2d');
            virtualCtx.globalCompositeOperation = 'lighten';

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            this.bindEvents();

            for (var ang = 0; ang < 360; ang += 24) {
                vectorAngles.push(ang);
            }

            return this.start();
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            var tracking = false;
            var y0 = 0;
            var r = R;

            $('body')
                .on('mousedown', function(e) {
                    y0 = e.clientY;
                    tracking = true;
                })
                .on('mouseup', function(e) {
                    r = R;
                    tracking = false;
                })
                .on('mousemove', function(e) {
                    if (tracking) {
                        R = r + (e.clientY - y0);
                    }
                });

            $(window).on('resize', function() {

                $element[0].width = window.innerWidth;
                $element[0].height = window.innerHeight - 16;

                xCenter = $element.width()  >> 1;
                yCenter = $element.height() >> 1;
            });
        };

        //==================================================================================
        //
        //==================================================================================
        this.start = function start()
        {
            var _this = this;

            setInterval(function()
            {
                for (var i = 0; i < vectorAngles.length; i++)
                {
                    _this.drawRay(vectorAngles[i]);
                    vectorAngles[i] = (vectorAngles[i] + 3) % 360;
                }

                _this.render();

            }, 50);

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.drawRay = function drawRay(rotation)
        {
            aroundXangle = 0;

            var vectorRadius = 0;

            for (aroundZangle = rotation; aroundZangle > (rotation - 360); aroundZangle -= 6)
            {
                var rgb = (160 + Math.floor(80 * Math.cos(aroundZangle * deg))).toString(16);
                color = '#'+ rgb + rgb + rgb;

                vectorRadius = Math.round(R * Math.sin(aroundXangle * deg));

                var y = yCenter - Math.round(R * Math.cos(aroundXangle * deg));
                var x = xCenter + Math.round(vectorRadius * Math.sin(aroundZangle * deg));

                aroundXangle += 3;

                if (backClipping)
                {
                    if (Math.cos(aroundZangle * deg) < 0) {
                        color = '#000';
                    }
                }

                this.drawParticle(x, y);
            }
        };

        //==================================================================================
        //
        //==================================================================================
        this.drawParticle = function drawParticle(x, y)
        {
            virtualCtx.fillStyle = color;
            virtualCtx.moveTo(x, y);
            virtualCtx.fillRect(x - 2, y - 2, 4, 4);

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.enableBackclipping = function enableBackclipping(val)
        {
            backClipping = Boolean(val);
            return this;
        }

        //==================================================================================
        //
        //==================================================================================
        this.render = function render()
        {
            this.clear(visibleCtx);

            visibleCtx.drawImage(virtualPage, 0, 0);

            return this.clear(virtualCtx);
        };

        //==================================================================================
        //
        //==================================================================================
        this.clear = function clear(context)
        {
            context.clearRect(0, 0, $element.width(), $element.height());
            return this;
        };
    };

    /*
    var ball = new app.Ball($('canvas'));
        ball.init();
    */

})(window.app, jQuery);