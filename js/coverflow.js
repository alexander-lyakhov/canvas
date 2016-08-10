window.app = window.app || {};

(function(app, $) {

    app.Gallery = function Gallery($element)
    {
        if (!(this instanceof Gallery)) {
            return new Gallery($element);
        }

        console.log('Gallery')

        var KEY = {
            ENTER:  13,
            ESCAPE: 27,
            END:    35,
            HOME:   36,
            LEFT:   37,
            RIGHT:  39,
            UP:     38,
            DOWN:   40
        };

        var currentIndex = 0;

        data = [
            {imgSrc: 'img/ripples.png', link: 'pages/ripples/'},
            {imgSrc: 'img/ball.png',    link: 'pages/ball/'},
            {imgSrc: 'img/pyramid.png', link: 'pages/pyramid/'},
            {imgSrc: 'img/wheel.png',   link: 'pages/wheel/'},
            {imgSrc: 'img/sinus.png',   link: 'pages/sinus/'}
        ];

        var flags = {
            freeze: 0
        };

        var $body = $('body');
        var $description = $('.description span');

        var $tplCover = $('#tpl-cover').html();

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            this.setImages();
            return this.bindEvents();
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            var _this = this;

            var x0 = 0;

            $element
                .on('mouseover mouseout click', 'a', function(e) {
                    e.stopPropagation();

                    var $item = $(e.currentTarget.parentNode);

                    if ($item.hasClass('cover-center'))
                    {
                        e.type === 'mouseover' ?
                            $item.addClass('hovered'):
                            $item.removeClass('hovered');
                    }
                    else {
                        e.preventDefault();
                    }
                });

            $body
                .on('mousedown', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    x0 = e.clientX;
                })
                .on('mouseup', function(e) {
                    if (e.clientX - x0 < 0) {
                        _this.moveBackward();
                    }

                    if (e.clientX - x0 > 0) {
                        _this.moveForward();
                    }
                })
                .on('keydown', $.proxy(this.keydownHandler, this))
                .on('mousewheel DOMMouseScroll', $.proxy(this.mouseWheelHandle, this));

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.keydownHandler = function keydownHandler(e)
        {
            if (e.keyCode === KEY.ENTER) {
                this.zoomIn();
            }

            if (e.keyCode === KEY.ESCAPE) {
                this.zoomOut();
            }

            if (e.keyCode === KEY.LEFT) {
                this.moveBackward();
            }

            if (e.keyCode === KEY.RIGHT) {
                this.moveForward();
            }

            return this;
        };

        this.mouseWheelHandle = function mouseWheelHandle(e)
        {
            $body.off('mousewheel DOMMouseScroll');

            e.preventDefault();
            e.stopPropagation();

            var direction = e.originalEvent.detail || e.originalEvent.wheelDelta;

            Math.abs(direction) === 120 ?
                direction > 0 ? this.moveForwardAndWait():this.moveBackwardAndWait():
                direction < 0 ? this.moveForwardAndWait():this.moveBackwardAndWait();

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.subscribe = function subscribe(eventName, fn)
        {
            $(this).on(eventName, fn || $.noop);
            return this;
        };

        this.freeze = function freeze()
        {
            flags.freeze = 1;
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.setImages = function setImages()
        {
            var size = data.length < 3 ? data.length:3;

            for (var i = 0; i < size; i++) {
                this.shiftLeft();
                this.addToBack(data[i]);
            }

            /*
             *  If less then 3 images in set then move existing images close to center
             */
            for (; i++ < 3; this.shiftLeft());

            if (data.length > 2 && data[1]) {
                this.moveForward();
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.moveBackwardAndWait = function moveBackwardAndWait()
        {
            var _this = this;

            setTimeout(function() {
                $body.on('mousewheel DOMMouseScroll', $.proxy(_this.mouseWheelHandle, _this));
            },
            200);

            return this.moveBackward();
        };

        //==================================================================================
        //
        //==================================================================================
        this.moveBackward = function moveBackward()
        {
            console.log('moveBackward -> currentIndex', currentIndex);

            if (currentIndex > 0 && !flags.freeze)
            {
                this.scrollRight();

                if (currentIndex > 2)
                {
                    if (data[currentIndex - 3]) {
                        this.addToFront(data[currentIndex - 3]);
                    }
                }

                currentIndex--;
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.moveForwardAndWait = function moveForwardAndWait()
        {
            var _this = this;

            setTimeout(function() {
                $body.on('mousewheel DOMMouseScroll', $.proxy(_this.mouseWheelHandle, _this));
            },
            200);

            return this.moveForward();
        };

        //==================================================================================
        //
        //==================================================================================
        this.moveForward = function moveForward()
        {
            console.log('moveForward -> currentIndex', currentIndex);

            if (currentIndex + 1 < data.length && !flags.freeze)
            {
                this.scrollLeft();

                if (data[currentIndex + 3]) {
                    this.addToBack(data[currentIndex + 3]);
                }

                currentIndex++;
            }

            console.log('currentIndex', currentIndex);

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.putDescription = function putDescription()
        {
            $description.text('');

            setTimeout(function() {
                $description.text((data[currentIndex].caption || {}).text);
            }, 600);

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.shiftLeft = this.scrollLeft = function scrollLeft()
        {
            $element.find('.cover-left-edge').remove();

            $element.find('.cover-left').removeClass('cover-left').addClass('cover-left-edge');
            $element.find('.cover-center').removeClass('cover-center').removeClass('hovered').addClass('cover-left');
            $element.find('.cover-right').removeClass('cover-right').addClass('cover-center');
            $element.find('.cover-right-edge').removeClass('cover-right-edge').addClass('cover-right');

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.shiftRight = this.scrollRight = function scrollRight()
        {
            $element.find('.cover-right-edge').remove();

            $element.find('.cover-right').removeClass('cover-right').addClass('cover-right-edge');
            $element.find('.cover-center').removeClass('cover-center').removeClass('hovered').addClass('cover-right');
            $element.find('.cover-left').removeClass('cover-left').addClass('cover-center');
            $element.find('.cover-left-edge').removeClass('cover-left-edge').addClass('cover-left');

            return this;
        };

        this.addToFront = function addToFront(item)
        {
            item.className = 'cover-left-edge';
            $element.append(Mustache.render($tplCover, item));

            return this;
        };

        this.addToBack = function addToBack(item)
        {
            item.className = 'cover-right-edge';
            $element.append(Mustache.render($tplCover, item));

            return this;
        };
    };

    var gallery = new app.Gallery($('.cover-container')).init();

})(window.app, jQuery);