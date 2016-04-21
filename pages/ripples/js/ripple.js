window.app = window.app || {};

(function(app, $) {

    app.Particle = function Particle(params) {

        if (!(this instanceof Particle)) {
            return new Particle(params);
        }

        params = params || {};

        var xDeviantion = 0;
        var yDeviantion = 0;

        var xPosition = 0;
        var yPosition = 0;

        var x0 = 0;
        var y0 = 0;

        var deg = Math.PI / 180;
        var angle = 0;
        var R = 0;
        var blocked = 1;
        var colorDepth = params.colorDepth || false;

        var operation = params.operation || Math.sin;
        var kf = params.kf || 0.2;
        var color = '#fff';
        var path = [];

        //==================================================================================
        //
        //==================================================================================
        this.unblock = function unblock()
        {
            blocked = 0;
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.enableColorDepth = function enableColorDepth(val)
        {
            colorDepth = Boolean(val);
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.prepare = this.calculateFrames = function prepare()
        {
            path.length = 0;

            for (var angle = 0; angle < 360; angle += 10)
            {
                var rgb = (160 + Math.floor(80 * operation(angle * deg))).toString(16);
                var color = '#'+ rgb + rgb + rgb;

                path.push({
                    offsetX: Math.round(xDeviantion * operation(angle * deg) * kf),
                    offsetY: Math.round(yDeviantion * operation(angle * deg) * kf),
                    color: color
                });
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.nextFrame = function nextFrame()
        {
            if (blocked) {
                return this;
            }

            color = path[0].color;

            xPosition = x0 + path[0].offsetX;
            yPosition = y0 + path[0].offsetY;

            path.push(path.shift());

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.setPosition = function setPosition(x, y)
        {
            xPosition = x0 = x;
            yPosition = y0 = y;

            return this;
        };

        this.getPosition = function getPosition() {
            return {x: xPosition, y: yPosition};
        };

        //==================================================================================
        //
        //==================================================================================
        this.setDeviantion = function setDeviantion(x, y)
        {
            xDeviantion = x0 - x;
            yDeviantion = y0 - y;

            R = Math.sqrt(Math.pow(xDeviantion, 2) + Math.pow(yDeviantion, 2));

            return this;
        };

        this.getDeviation = function getDeviation()
        {
            return {
                xDeviantion: xDeviantion,
                yDeviantion: yDeviantion,
                R: R
            };
        };

        //==================================================================================
        //
        //==================================================================================
        this.draw = function draw(canvas)
        {
            canvas.fillStyle = colorDepth ? color:'#fff';
            canvas.moveTo(xPosition, yPosition);
            canvas.fillRect(xPosition - 2, yPosition - 2, 4, 4);

            return this;
        };
    };

    /*
     *
     */
    app.Ripple = function Ripple($element)
    {
        if (!(this instanceof Ripple)) {
            return new Ripple($element);
        }

        $element[0].width = window.innerWidth;
        $element[0].height = window.innerHeight - 16;

        var xCenter = $element.width()  >> 1;
        var yCenter = $element.height() >> 1;

        var params = {};

        var distance  = 0;
        var dimansion = 0;
        var amplitude = 0;
        var timeInterval = 30;
        var showGrid = false;

        var particles = [];
        var gridPath = [];

        var vbnInterval = null;

        var virtualPage = document.createElement('canvas');
            virtualPage.width  = $element.width();
            virtualPage.height = $element.height();

        var visibleCtx = $element[0].getContext('2d');
        var virtualCtx = virtualPage.getContext('2d');

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            var _this = this;

            $(window).on('resize', function() {

                $element[0].width = window.innerWidth;
                $element[0].height = window.innerHeight - 16;

                xCenter = $element.width()  >> 1;
                yCenter = $element.height() >> 1;

                _this.init(params);
            });

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.init = function init(settings)
        {
            params = settings || {};

            distance  = params.distance  || 20;
            dimansion = params.dimansion || 12;
            amplitude = params.amplitude || 5;
            showGrid  = params.showGrid  || false;

            this.resetParticles();

            for (var col = -dimansion; col <= dimansion; col++)
            {
                for (var row = -dimansion; row <= dimansion; row++)
                {
                    var particle = new app.Particle(params.particle);
                        particle
                            .setPosition(xCenter + row * distance, yCenter + col * distance)
                            .setDeviantion(xCenter, yCenter)
                            .prepare()
                            .draw(virtualCtx);

                    particles.push(particle);
                }
            }

            this.createGrid();

            return this.start();
        };

        //==================================================================================
        //
        //==================================================================================
        this.resetParticles = function resetParticles()
        {
            clearInterval(vbnInterval);

            while (particles[0]) {
                delete particles.shift();
            }

            while (gridPath[0]) {
                delete gridPath.shift();
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.start = function start()
        {
            particles.forEach(function(item)
            {
                setTimeout(function() {
                    item.unblock();
                }, item.getDeviation().R * amplitude);
            });

            return this.vibration();
        };

        //==================================================================================
        //
        //==================================================================================
        this.enableColorDepth = function enableColorDepth(val)
        {
            particles.forEach(function(item) {
                item.enableColorDepth(val);
            });

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.enableGrid = function enableGrid(val)
        {
            showGrid = Boolean(val);
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.createGrid = function createGrid()
        {
            var size = dimansion * 2 + 1;

            gridPath.push(particles[size * (size - 1) + 0]);

            for (var col = 0; col < size - 1; col++)
            {
                /*
                 * from bottom to top
                 */
                for (var row = size - 1; row >= 0; row--) {
                    gridPath.push(particles[row * size + col]);
                }

                /*
                 * ledder from top to bottom
                 */
                for (row = 0; row < size - 1; row++) {
                    gridPath.push(particles[row * size + col + 1]);
                    gridPath.push(particles[(row + 1) * size + col]);
                }

                /*
                 * one step from bottom to the right
                 */
                gridPath.push(particles[size * (size - 1) + col + 1]);
            }

            /*
             * from bottom to top once more
             */
            for (var row = size - 1; row >= 0; row--) {
                gridPath.push(particles[row * size + size - 1]);
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.drawGrid = function drawGrid()
        {
            var ctx = virtualCtx;

            ctx.strokeStyle = "#e0e0e0";
            ctx.beginPath();

            var position = gridPath[0].getPosition();
            ctx.moveTo(position.x, position.y);

            for (var i = 1; i < gridPath.length; i++)
            {
                position = gridPath[i].getPosition();
                ctx.lineTo(position.x, position.y);
            }

            ctx.stroke();
            ctx.closePath();

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.resetWafeCenter = function resetWafeCenter(params)
        {
            particles.forEach(function(item) {
                item.setDeviantion(params.x, params.y).prepare();
            });

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.vibration = function vibration()
        {
            var _this = this;

            vbnInterval = setInterval(function()
            {
                particles.forEach(function(item) {
                    item.nextFrame();
                    item.draw(virtualCtx);
                });

                _this.render();

            }, timeInterval);

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.render = function render()
        {
            this.clear(visibleCtx);

            if (showGrid) {
                this.drawGrid();
            }

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

})(window.app, jQuery);