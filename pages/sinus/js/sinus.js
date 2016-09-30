window.app = window.app || {
    modules:{},
    modName:{}
};

(function(app, $) {

    /*
     *
     */
    app.Sinus = function Sinus($element)
    {
        if (!(this instanceof Sinus)) {
            return new Sinus($element);
        }

        app.BaseCanvas.apply(this, arguments);

        var virtualCtx = this.virtualCtx;
        var visibleCtx = this.visibleCtx;

        var deg = this.deg;

        var angleA = 0;
        var angleB = 0;

        var stepAngle = 10;

        var amplitude = 100;
        var range = 90;

        var pathA = [];
        var pathB = [];

        var drawFn = null;

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            var _this = this;

            $(window).on('resize', $.proxy(_this.resizeWindow, _this));

            this.$body
                .on('renderCompltete', function() {
                    setTimeout($.proxy(_this.action, _this), 40);
                })
                .on('mousewheel DOMMouseScroll', function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();

                    var direction = e.originalEvent.detail || e.originalEvent.wheelDelta;

                    if (e.shiftKey)
                    {
                        Math.abs(direction) === 120 ?
                            direction > 0 ? _this.scaleRange(1):_this.scaleRange(-1):
                            direction < 0 ? _this.scaleRange(1):_this.scaleRange(-1);
                    }
                    else
                    {
                        Math.abs(direction) === 120 ?
                            direction > 0 ? _this.scaleAmplitude(1):_this.scaleAmplitude(-1):
                            direction < 0 ? _this.scaleAmplitude(1):_scaleAmplitude.scaleRange(-1);
                    }
                });

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.scaleAmplitude = function scaleAmplitude(val)
        {
            amplitude += amplitude / (val << 4);
            return this;
        };

        this.scaleRange = function scaleRange(val)
        {
            if (val > 0) {
                if (range === 720) { return this; }
            }
            else {
                if (range ===  45) { return this; }
            }

            range += (val * 45);
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            drawFn = this.drawBars;

            return this
                .bindEvents()
                .action();
        };

        //==================================================================================
        //
        //==================================================================================
        this.setDrawFn = function setDrawFn(fn)
        {
            drawFn = fn;
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.action = function action()
        {
            pathA.length = 0;
            pathB.length = 0;

            var angA = angleA;
            var angB = angleB;

            for (var a = -range; a < range; a += stepAngle)
            {
                pathA.push({
                    x: a,
                    val: Math.round((Math.abs(a) - range) / range * amplitude * Math.sin(angA * deg))
                });

                pathB.push({
                    x: a - stepAngle / 2,
                    val: Math.round((Math.abs(a) - range) / range * amplitude * Math.sin(angB * deg))
                });

                angA += stepAngle;
                angB -= stepAngle;
            }

            angleA = (angleA + stepAngle) % 360;
            angleB = (angleB + stepAngle) % 360;

            return drawFn.call(this);
        };

        //==================================================================================
        //
        //==================================================================================
        this.drawBars = function drawBars(ctx)
        {
            ctx = ctx || virtualCtx;

            var x0 = this.xCenter;
            var y0 = this.yCenter;

            pathA.forEach(function(element, index)
            {
                //ctx.fillStyle = '#ccc';
                ctx.fillStyle = '#3e9';
                ctx.fillRect(x0 + element.x, y0, 3, 3 -element.val);
                //ctx.fillRect(x0 + element.x, y0 - element.val, 3, 3);
            });

            pathB.forEach(function(element, index)
            {
                //ctx.fillStyle = '#ccc';
                ctx.fillStyle = '#e90';
                ctx.fillRect(x0 + element.x, y0, 3, -element.val);
                //ctx.fillRect(x0 + element.x, y0 - element.val, 3, 3);
            });

            return this.render();
        };

        //==================================================================================
        //
        //==================================================================================
        this.drawLines = function drawLines(ctx)
        {
            ctx = ctx || virtualCtx;

            var x0 = this.xCenter;
            var y0 = this.yCenter;

            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#3e9';

            pathA.forEach(function(element, index)
            {
                index === 0 ?
                    ctx.moveTo(x0 + element.x, y0 - element.val):
                    ctx.lineTo(x0 + element.x, y0 - element.val);
            });

            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#e90';

            pathB.forEach(function(element, index)
            {
                index === 0 ?
                    ctx.moveTo(x0 + element.x, y0 - element.val):
                    ctx.lineTo(x0 + element.x, y0 - element.val);
            });

            ctx.stroke();
            ctx.closePath();

            return this.render();
        };

        //==================================================================================
        //
        //==================================================================================
        this.resizeWindow = function resizeWindow()
        {
            this.$element[0].width = window.innerWidth;
            this.$element[0].height = window.innerHeight - 16;

            this.xCenter = this.$element.width()  >> 1;
            this.yCenter = this.$element.height() >> 1;

            return this;
        };
    };

    app.Sinus.prototype = Object.create(app.BaseCanvas.prototype);
    app.Sinus.prototype.constructor = app.BaseCanvas;

})(window.app, jQuery);