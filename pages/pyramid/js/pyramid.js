window.app = window.app || {
    modules:{},
    modName:{}
};

(function(app, $) {

    /*
     *
     */
    app.Pyramid = function Pyramid($element)
    {
        if (!(this instanceof Pyramid)) {
            return new Pyramid($element);
        }

        app.BaseCanvas.apply(this, arguments);

        var DEFAULT_SPHERE_RADIUS = 200;
        var KEY = this.KEY;

        var deg = this.deg;
        var f = 1600; // k = f / (f + item.z);

        var virtualCtx = this.virtualCtx;
        var visibleCtx = this.visibleCtx;

        var rotate = false;
        var rotateStep = 6;

        var timeout = null;

        var flags = {
            autoRotation: 0,
            showVertexes: 1,
            showEdges: 0,
            showPolygons: 1
        };

        var shape =
        {
            vectors: [
                {rotateXY: 330, rotateZX: 90,  rotateZY: 0},
                {rotateXY: 330, rotateZX: 210, rotateZY: 0},
                {rotateXY: 330, rotateZX: 330, rotateZY: 0},
                {rotateXY:  90, rotateZX: 90,  rotateZY: 0}
            ],

            vertexes: [],
            polygons: [],
            normals:  [],

            rotateZY: 0,
            rotateZX: 0,
            rotateXY: 0,

            colors: ['#cce', '#ecc', '#eec', '#cec'],
            R: DEFAULT_SPHERE_RADIUS
        };

        //==================================================================================
        //
        //==================================================================================
        this.getFlags = function getFlags() {
            return flags;
        };

        this.enableAutoRotation = function enableAutoRotation(val)
        {
            flags.autoRotation = Boolean(val);
            val ? this.unbindControls() : this.bindControls();

            return this.draw(virtualCtx);
        };

        this.showVertexes = function showVertexes(val)
        {
            flags.showVertexes = Boolean(val);
            return this.draw(virtualCtx);
        };

        this.showEdges = function showEdges(val)
        {
            flags.showEdges = Boolean(val);
            return this.draw(virtualCtx);
        };

        this.showPolygons = function showPolygons(val)
        {
            flags.showPolygons = Boolean(val);
            return this.draw(virtualCtx);
        };
        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            app.BaseCanvas.prototype.bindEvents.apply(this, arguments);

            var _this = this;

            $(window).on('resize', $.proxy(_this.resizeWindow, _this));

            this.$body
                .on('renderCompltete', function()
                {
                    clearTimeout(timeout);

                    if (flags.autoRotation) {
                        timeout = setTimeout($.proxy(_this.rotate, _this), 30);
                    }
                })
                .on('mousewheel DOMMouseScroll', function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();

                    var direction = e.originalEvent.detail || e.originalEvent.wheelDelta;

                    Math.abs(direction) === 120 ?
                        direction > 0 ? _this.scale(1):_this.scale(-1):
                        direction < 0 ? _this.scale(1):_this.scale(-1);
                });

            return this.bindControls();
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindControls = function bindControls()
        {
            var _this = this;

            var x = 0;
            var y = 0;

            this.$body
                .on('mousedown', function(e) {
                    rotate = 1;
                    x = e.clientX;
                    y = e.clientY;
                })
                .on('mousemove', function(e)
                {
                    if (rotate) {
                        shape.rotateZX = shape.rotateZX + ((e.clientX - x) >> 1) % 360;
                        shape.rotateZY = shape.rotateZY + ((e.clientY - y) >> 1) % 360;

                        x = e.clientX;
                        y = e.clientY;

                        _this.rotate();
                    }
                })
                .on('mouseup', function() {
                    rotate = 0;
                })
                .on('keydown', function(e)
                {
                    if (e.keyCode < 36 || e.keyCode > 40) {
                        return;
                    }

                    if (e.keyCode === KEY.LEFT) {
                        shape.rotateZX = (shape.rotateZX + rotateStep) % 360;
                    }

                    if (e.keyCode === KEY.RIGHT) {
                        shape.rotateZX = (shape.rotateZX - rotateStep) % 360;
                    }

                    if (e.keyCode === KEY.UP) {
                        shape.rotateZY = (shape.rotateZY + rotateStep) % 360;
                    }

                    if (e.keyCode === KEY.DOWN) {
                        shape.rotateZY = (shape.rotateZY - rotateStep) % 360;
                    }

                    if (e.keyCode === KEY.HOME) {
                        _this.reset();
                    }

                    _this.rotate();
                });
        };

        //==================================================================================
        //
        //==================================================================================
        this.unbindControls = function unbindControls()
        {
            this.$body.off('mousedown mousemove mouseup keydown');
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            var _this = this;

            this.bindEvents();

            shape.vectors.forEach(function(vector)
            {
                var x0 = Math.cos(vector.rotateXY * deg);

                var x = x0 * Math.cos(vector.rotateZX * deg);
                var y =  1 * Math.sin(vector.rotateXY * deg);
                var z = x0 * Math.sin(vector.rotateZX * deg);

                shape.vertexes.push({
                    x0: x,
                    y0: y,
                    z0: z,
                    x:  x,
                    y:  y,
                    z:  z,
                    k:  1
                });
            });

            shape.polygons.push(
                [shape.vertexes[0], shape.vertexes[1], shape.vertexes[2]],
                [shape.vertexes[0], shape.vertexes[3], shape.vertexes[1]],
                [shape.vertexes[1], shape.vertexes[3], shape.vertexes[2]],
                [shape.vertexes[2], shape.vertexes[3], shape.vertexes[0]]
            );

            shape.polygons.forEach(function(polygon) {
                shape.normals.push(_this.getNormal(polygon));
            });

            return this.draw(virtualCtx);
            //return this.rotate();
        };

        //==================================================================================
        //
        //==================================================================================
        this.reset = function reset()
        {
            var _this = this;

            $(shape).animate({

                R: DEFAULT_SPHERE_RADIUS,
                rotateZX: 0,
                rotateZY: 0,
                rotateXY: 0
                }, {

                duration: 800,
                step: function(now, fx) {
                    _this.rotate();
                }
            });

            return this.draw(virtualCtx);
        };

        //==================================================================================
        //
        //==================================================================================
        this.rotate = function rotate()
        {
            if (flags.autoRotation) {
                shape.rotateZX = (shape.rotateZX + 3) % 360;
                shape.rotateZY = (shape.rotateZY + 3) % 360;
            }

            var cos_ay = Math.cos(shape.rotateZX * deg);
            var sin_ay = Math.sin(shape.rotateZX * deg);

            var cos_ax = Math.cos(shape.rotateZY * deg);
            var sin_ax = Math.sin(shape.rotateZY * deg);

            shape.vertexes.forEach(function(vertex)
            {
                var z =  vertex.z0 * cos_ay + vertex.x0 * sin_ay;
                var x = -vertex.z0 * sin_ay + vertex.x0 * cos_ay;

                vertex.x = x;
                vertex.z = z;

                var z = vertex.z * cos_ax - vertex.y0 * sin_ax;
                var y = vertex.z * sin_ax + vertex.y0 * cos_ax;

                vertex.y = y;
                vertex.z = z;
            });

            for (var i = 0; i < shape.polygons.length; i++) {
                shape.normals[i] = this.getNormal(shape.polygons[i]);
            }

            return this.draw(virtualCtx);
        };

        //==================================================================================
        // a * b = {ay * bz - az * by;  az * bx - ax * bz;  ax * by - ay * bx}
        //==================================================================================
        this.getNormal = function getNormal(polygon)
        {
            var A = polygon[0];
            var O = polygon[1];
            var B = polygon[2];

            var a = {
                x: A.x * A.k - O.x * O.k,
                y: A.y * A.k - O.y * O.k,
                z: A.z * A.k - O.z * O.k
            };

            var b = {
                x: B.x * B.k - O.x * O.k,
                y: B.y * B.k - O.y * O.k,
                z: B.z * B.k - O.z * O.k
            };

            var normal = {
                //dx: a.y * b.z - a.z * b.y,
                //dy: a.z * b.x - a.x * b.z,
                dz: a.x * b.y - a.y * b.x
            };

            return normal;
        };

        //==================================================================================
        //
        //==================================================================================
        this.scale = function scale(val)
        {
            shape.R += shape.R / (val << 4);
            return this.draw(virtualCtx);
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

            return this.draw(virtualCtx);
        };

        //==================================================================================
        //
        //==================================================================================
        this.draw = function draw(ctx)
        {
            var x0 = this.xCenter;
            var y0 = this.yCenter;

            var R = shape.R;

            shape.vertexes.forEach(function(vertex, index)
            {
                var k = vertex.k = f / (f + vertex.z * R);

                var x = Math.round(k * vertex.x * R);
                var y = Math.round(k * vertex.y * R);

                if (flags.showVertexes)
                {
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(x0 + x - 2, y0 - y - 2, 4, 4);
                }
            });

            //return this.render();

            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;

            shape.polygons.forEach(function(polygon, index)
            {
                ctx.fillStyle = shape.colors[index];
                ctx.beginPath();

                if (shape.normals[index].dz > 0)
                {
                    for (var i = 0; i < polygon.length; i++)
                    {
                        k = polygon[i].k;

                        i === 0 ?
                            ctx.moveTo(x0 + Math.round(k * R * polygon[i].x), y0 - Math.round(k * R * polygon[i].y)):
                            ctx.lineTo(x0 + Math.round(k * R * polygon[i].x), y0 - Math.round(k * R * polygon[i].y));
                    }

                    k = polygon[0].k;
                    ctx.lineTo(x0 + Math.round(k * R * polygon[0].x), y0 - Math.round(k * R * polygon[0].y));

                    flags.showPolygons && ctx.fill();
                    flags.showEdges    && ctx.stroke();

                    ctx.closePath();
                }
            });

            return this.render();
        };
    };

    app.Pyramid.prototype = Object.create(app.BaseCanvas.prototype);
    app.Pyramid.prototype.constructor = app.BaseCanvas;

})(window.app, jQuery);