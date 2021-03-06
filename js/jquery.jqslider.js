/**
 *
 */
/**
 * @description A responsive and fast content Slider
 * jQSlider follows a new approach in building a slider. Where most slider-plugins are moving the whole list of slides
 * when animating, jQSlider animates only the two slides necessary for the animation simultaneously. This is not only an
 * way to optimize the performance of the animation, it also allows to realize a 100% css based scaling which leads us to
 * a full responsive slider.
 * @module JQSlider
 * @requires jQuery
 * @param {Object}       $            Aliased jQuery object or alternatively Zepto.
 * @param {HTMLElement}  windows      Reference to the window object
 * @param {HTMLElement}  document     Reference to the document object
 * @param {undefined}    undefined    this is just a way to assure that undefined has not been overloaded with some other value than undefined
 */
;
(function ( $, window, document, undefined ) {
    /**
     * @description Plugin Constructor
     * @class JQSlider
     * @constructor
     * @param {HTMLElement} elem      element to be initialized
     * @param {Object}      options   Options for the Plugin Member
     */
    function JQSlider( elem, options ) {
        /**
         * Stores a reference to the jQuery object of the module
         * @property $el
         * @type Object
         */
        this.$el = $( elem );
        /**
         * Object with the configuration options of the module, the plugin defaults will be extended with options passed
         * while initialisation and last by options set in the data-options attribute of the HTML element of the slider
         * @property o
         * @type Object
         */
        this.o = $.extend( JQSlider.prototype.defaults, options, $.parseJSON( ( this.$el.data( 'options' ) || "" ).replace(/'/g,"\"") ) );
        /**
         * Defines if the layout of the slider is vertical or not. Will be defined initially by the css class 'jqs-vertical' of the element.
         * @property isVertical
         * @type Boolean
         * @default false
         */
        this.isVertical = this.$el.hasClass( 'jqs-vertical' );
        /**
         * set to true while animating to prevent double clicking
         * @property _block
         * @type Boolean
         * @default false
         * @private
         */
        this._block = false;
        /**
         * alignment value shortcuts
         * @property _av
         * @type Array
         * @private
         * @final
         */
        this._av = [
            {pos:'left', size:'width'},
            {pos:'top', size:'height'}
        ];
        /**
         * This "template" is used to generate new slides, it is build using the 'slideTag' config value.
         * @property _tmpl
         * @type String
         * @private
         */
        this._tmpl = '<' + this.o.slideTag + '/>';

        if ( this.o.autoinit !== false ) {
            this.init();
        }
    }

    /**
     * @namespace JQSlider
     */
    JQSlider.prototype = {
        /**
         * Stores all configuration settings, this set will be extended with client configuration objects
         * @type Object
         * @property defaults
         */
        defaults:{
            /**
             * You can prevent an automatic initialisation of the slider if you want to run it later on. This is than
             * helpful, if you need the instance of the plugin to access its methods, like addSlide, but you don't want
             * the slides to be setup. Because JQSlider adds classes to all elements that applies styling to it, like
             * hiding not needed slides, so that it can prevent you from determining the correct height and width values
             * of its child elements.
             * @config autoinit
             * @type Boolean
             * @default true
             */
            autoinit:true,
            /**
             * Set to true, for an endless animation.
             * @config circular
             * @type Boolean
             * @default false
             */
            circular:false,
            /**
             * Zero based index of the slide to start with
             * @config startSlide
             * @type Number
             * @default 0
             */
            startSlide:0,
            /**
             * Duration of the animation
             * @config duration
             * @type Number
             * @default 500
             */
            duration:500,
            /**
             * If you have included the easing plugin, you can define an easing function for the animation.
             * @config easingFunction
             * @type String
             * @default 'linear'
             */
            easingFunction:'linear',
            /**
             * Define the jquery selector of the container element for querying. Must be represented in the markup.
             * @config containerSelector
             * @type String
             * @default '.jqs-container'
             */
            containerSelector:'.jqs-container',
            /**
             * Define the jquery selector of the list element for querying.
             * @config listSelector
             * @type String
             * @default 'ul'
             */
            listSelector:'ul',
            /**
             * Define the tag name of the slide element for querying. It will be used for building the HTML template when
             * creating a new slide.
             * @config slideTag
             * @type String
             * @default 'li'
             */
            slideTag:'li'
        },

        /**
         * Moves to the next slide
         * @public
         * @method next
         */
        next:function () {
            var next = this._getSibblingIndex();
            // if the slider has no circular animation and the last slide is already present, do nothing
            if ( next !== false ) {
                this.gotoSlide( next, false );
            }
        },

        /**
         * Moves to the previous slide
         * @public
         * @method prev
         */
        prev:function () {
            var prev = this._getSibblingIndex( true );
            // if the slider has no circular animation and the first slide is already present, do nothing
            if ( prev !== false ) {
                this.gotoSlide( prev, true );
            }
        },

        /**
         * Moves to the given slide number. The direction, based on the orientation (horizontal/vertical), can be set with
         * counterwise. If you want to jump directly to the slide, without an animation, pass noAnimation as true.
         * @public
         * @method gotoSlide
         * @param {Number}  slideNumber                 number of slide to go to
         * @param {Boolean} [counterwise=false]         optional set to true if the animation should go to the opposite direction
         * @param {Boolean} [noAnimation=false]         optional set to true if slide should be shown instantly without an animation
         */
        gotoSlide:function ( slideNumber, counterwise, noAnimation ) {
            // stop if slider is currently animating or slideNumber number is out of bound
            if ( this._block === true || slideNumber < 0 || slideNumber >= this._slides.length || slideNumber == this.activeIndex ) return;

            this._block = true;

            counterwise = counterwise || false;

            var self = this,
                next = this.getSlide( slideNumber ),
                current = this.getSlide( this.activeIndex ),
                // extend currentCSS with the cssDefaults to avoid value pollution after orientation changes, which means
                // the top ,respectively left value, would be kept in the cssDefault object and cause a diagonal animation
                currentCSS = {},
                // typecast the boolean value this.isVertical to get the first or second index of the array this._av which holds the sting top or left
                elmPos = this._av[ +this.isVertical ].pos,
                // typecast the boolean value this.isVertical to get the first or second index of the array this._av which holds the sting width or height
                elmSize = this._av[ +this.isVertical ].size,
                moveSize = this._list[ elmSize ]() / 2;

            this._startAnimation( slideNumber, counterwise, noAnimation, current, next );

            if ( noAnimation === true ) {
                this._endAnimation( slideNumber, counterwise, noAnimation, current, next );
            } else {
                // jQuery has a calculation bug in IE8 when translating negative percent values in pixels, therefor we set it ourself
                this._list.toggleClass( 'jqs-list-before', counterwise ).css( elmPos, counterwise ? -moveSize : 0 );
                next.addClass( 'jqs-next' );
                currentCSS[ elmPos ] = ( counterwise ) ? '0' : -moveSize;
                this._list.animate( currentCSS, {
                    duration:this.o.duration,
                    easing:this.o.easingFunction,
                    complete:function () {
                        self._endAnimation( slideNumber, counterwise, noAnimation, current, next );
                    }
                } );
            }
        },

        /**
         * This function is called when the animation started. It is excluded from the animation method to help building
         * a inherited Slider class. In this case it triggers the animation start event.
         * @method _startAnimation
         * @private
         * @param {Number} slideNumber          Number of the slide that had been animated in
         * @param {Boolean} counterwise         if true the animation will move to the left or top if it's a vertical animation
         * @param {Boolean} noAnimation         if true the slide will be shown right away, without animation
         */
        _startAnimation:function ( slideNumber, counterwise, noAnimation, current, next ) {
            current.trigger( 'animationoutstart' );
            next.trigger( 'animationinstart' );
            this.$el.trigger( 'animationstart', [ this.activeIndex, slideNumber, counterwise, noAnimation ] );
        },

        /**
         * This function is called when the animation ends. All slides are reset to default with the next slide as current slide.
         * It is excluded from the animation method to help building a inherited Slider class.
         * @method _endAnimation
         * @private
         * @param {Number} slideNumber          Number of the slide that had been animated in
         * @param {Boolean} counterwise         if true the animation will move to the left or top if it's a vertical animation
         * @param {Boolean} noAnimation         if true the slide will be shown right away, without animation
         * @param {Object} current              jQuery element of the slide that was animated out
         * @param {Object} next                 jQuery element of the slide that was animated in
         */
        _endAnimation:function ( slideNumber, counterwise, noAnimation, current, next ) {
            current.removeClass( 'jqs-current' ).trigger( 'animationoutend' );
            next.removeClass( 'jqs-next' ).addClass( 'jqs-current' ).trigger( 'animationinend' );
            this._list.attr( 'style', '' ).removeClass( 'jqs-list-before' );
            this.activeIndex = slideNumber;
            this._block = false;
            this._resetControls();
            this.$el.trigger( 'animationend', [ this.activeIndex, slideNumber, counterwise, noAnimation ] );
        },

        /**
         * Returns the zero based length of the slides array.
         * @public
         * @method getSlideCount
         * @return {Number}     returns the number of all slides
         */
        getSlideCount:function () {
            return this._slides.length;
        },

        /**
         * Switches the orientation of the slider between horizontal and vertical.
         * @public
         * @method switchOrientation
         */
        switchOrientation:function () {
            this.$el.toggleClass( 'jqs-vertical' );
            this.isVertical = !this.isVertical;
        },

        /**
         * Adds a new slide node into the slide container. Optionally the position of the new slide can be defined with slidePosition.
         * @public
         * @method addSlide
         * @param {Number} [slidePosition]     position of the new slide to be appended to
         * @return {Object}                    returns the jquery object of the created slide
         */
        addSlide:function ( slidePosition ) {
            var newSlide = $( this._tmpl, {'class':'jqs-slide'} );
            if ( undefined !== slidePosition && slidePosition < this._slides.length ) {
                this.getSlide( slidePosition ).before( newSlide );
            } else {
                this._list.append( newSlide );
            }
            this._slides = this._list.children('.jqs-slide');

            return newSlide;
        },

        /**
         * Returns the slide node at the given index
         * @public
         * @param {Number} slideIndex
         */
        getSlide:function( slideIndex ){
            return this._slides.eq( slideIndex );
        },

        /**
         * Removes a given slide, defined by the index or ID, or a whole jquery slide set.
         * @public
         * @method removeSlide
         * @param {Number|String|Object} slide    index, ID or jQuery set of the slide to be removed
         */
        removeSlide:function ( slide ) {
            /** TODO: make this more specific */
            var foundSlide = ( typeof slide === 'number' ) ? this.getSlide( slide ) : ( typeof slide === 'string') ? this._slides.find( slide ) : slide;
            this._slides.remove( foundSlide );
        },

        /**
         * Returns the zero based position of the following slider.
         * @private
         * @method _getSibblingIndex
         * @param {Boolean} prev
         * @return {Number|Boolean}     returns index of next slide or false
         */
        _getSibblingIndex:function ( prev ) {
            var index,
                circular = this.o.circular,
                activeIndex = this.activeIndex,
                slidesLength = this._slides.length;

            if ( prev ) {
                index = ( activeIndex > 0 ) ? --activeIndex : circular ? --slidesLength : false;
            } else {
                index = ( ++activeIndex < slidesLength ) ? activeIndex : circular ? 0 : false;
            }
            return index;
        },

        /**
         * Hides the previous handler, respectively next handler, if no circular animation is configured and the first, respectively
         * last slide is reached.
         * @private
         * @method _resetControls
         */
        _resetControls:function () {
            if ( this._handlers.length && !this.o.circular ) {
                this._handlers.removeClass( 'jqs-inactive' );
                if ( this.activeIndex == 0 ) {
                    this._prevHandler.addClass( 'jqs-inactive' );
                } else if ( this.activeIndex == this._slides.length - 1 ) {
                    this._nextHandler.addClass( 'jqs-inactive' );
                }
            }
        },

        _initSlider:function(){

            /**
             * reference of the slider container
             * @property _container
             * @type Object
             * @private
             */
            this._container = this.$el.children( this.o.containerSelector ).addClass('jqs-container');
            /**
             * reference of the slider list element
             * @property _list
             * @type Object
             * @private
             */
            this._list = this._container.children( this.o.listSelector ).addClass( 'jqs-list' );
            /**
             * jQuery set of all slide elements
             * @property _slides
             * @type Object
             * @private
             */
            this._slides = this._list.children( this.o.slideTag ).addClass( 'jqs-slide' );

            var current = this._slides.filter('[class*="jqs-current"]').index();
            /**
             * Index of the current active slide. Can be defined by configuration or by adding the class jqs-current to the appropriate slide.
             * @property activeIndex
             * @type Number
             * @default 0
             */
            this.activeIndex = current >= 0 ? current:this.o.startSlide || 0;

            this.getSlide( this.activeIndex ).addClass( 'jqs-current' );
        },

        /**
         * Initialises the Slider controls and binds them to the previous and next methods.
         * @private
         * @method _initControls
         */
        _initControls:function () {
            var self = this,
                /**
                 * jQuery set with all handlers found inside the jqslider element with the class defined in css.handler.
                 * @private
                 * @property _handlers
                 * @type Object
                 */
                 handlers = this._handlers = this.$el.children( '.jqs-handler' );
            if ( handlers.length ) {
                /**
                 * jQuery set with all handlers found inside the jqslider element with the class defined in css.nextHandler.
                 * @private
                 * @property _nextHandler
                 * @type Object
                 */
                this._nextHandler = handlers.filter( '.jqs-handler-next' ).bind( 'click', function ( e ) {
                    e.preventDefault();
                    self.next();
                } );
                /**
                 * jQuery set with all handlers found inside the jqslider element with the class defined in css.prevHandler.
                 * @private
                 * @property _prevHandler
                 * @type Object
                 */
                this._prevHandler = handlers.filter( '.jqs-handler-prev' ).bind( 'click', function ( e ) {
                    e.preventDefault();
                    self.prev();
                } );
                if ( !this.o.circular && this.activeIndex == 0 ) this._prevHandler.addClass( 'jqs-inactive' );
            }
        },
        /**
         * Initialises the jqslider plugin and binds the available events to it. Finally it triggers the init event.
         * @public
         * @method init
         * @return Object
         */
        init:function () {
            var self = this;

            this._initSlider();

            this._initControls();

            this.$el.bind( {
                /**
                 * @event prev
                 */
                'prev':function () {
                    self.prev();
                },
                /**
                 * @event next
                 */
                'next':function () {
                    self.next();
                },
                /**
                 * @event gotoslide
                 * @param {Number}  slideNumber                 number of slide to go to
                 * @param {Boolean} [counterwise=false]         optional set to true if the animation should go to the opposite direction
                 * @param {Boolean} [noAnimation=false]         optional set to true if slide should be shown instantly without an animation
                 *
                 */
                'gotoslide':function ( e, slideNumber, counterwise, noAnimation ) {
                    self.gotoSlide( slideNumber, counterwise, noAnimation );
                }
            } ).trigger( 'init' );

            return this;
        }
    };
    JQSlider.defaults = JQSlider.prototype.defaults;
    /**
     * @description Initialize each object of the jQuery set as an instance of JQSlider, sets a reference to the instance
     * in data-jqslider which is used as a singleton.
     * @name jqslider
     * @param {Object} options  Object with plugin settings
     * @return {Object} jQuery object
     */
    $.fn.jqslider = function ( options ) {
        return this.each( function () {
            if ( undefined == $( this ).data( 'jqslider' ) ) {
                $( this ).data( 'jqslider', new JQSlider( this, options ) );
            }
        } );
    };
    // We define a global reference to the plugin to be able to access static method of the plugin or for prototypical inheritance.
    window.JQSlider = JQSlider;

})( window.jQuery || window.Zepto, window, document );

