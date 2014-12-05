if (Meteor.isClient) {
    Meteor.subscribe('geoPub');
    var GeoData = new Meteor.Collection('geodata');
    GoogleMaps = {
        // public methods
        config:             function (options) {
            _.extend(this, options);
        },
        ready:              function () {
            this._loadingDependency.depend();
            return this._ready;
        },
        // private methods
        _loaded:            function () {
            this._ready = true;
            this._loadingDependency.changed();
        },
        // public members
        apiKey:             "",
        // private members
        _ready:             false,
        _loadingDependency: new Deps.Dependency()
    };

    _googleMapsLoaded = function () {
        GoogleMaps._loaded();
    };

    Meteor.startup(function () {
        GoogleMaps.config({apiKey: 'AIzaSyDMG2k81XSsGA_RFqLTZENwGDOfh9nXBVo'});
        if (!GoogleMaps.apiKey) {
            throw new Meteor.Error(-1, "API key not set, use GoogleMaps.config({apiKey:YOUR_API_KEY});");
        }
        $.getScript("https://maps.googleapis.com/maps/api/js?key=" + GoogleMaps.apiKey + "&callback=_googleMapsLoaded");
    });

    Template.landing.events({
        'click #search':      function (event) {
            Router.go('/search');
        },
        'mouseenter .tag':    function (ev) {
            $(ev.currentTarget).toggleClass('trans');
        },
        'mouseleave .tag':    function (ev) {
            $(ev.currentTarget).toggleClass('trans');
        },
        'click .tag, .trans': function (ev) {
            var icon = $(ev.currentTarget);
            icon.toggleClass('tag');
        },
        'click #advanced-filter-toggle': function(ev){
            ev.preventDefault();
            $("#advanced-filters-top").toggleClass("invisible", 'slow');
        }

    });

    Template.landing.rendered = function(){
        //First check if we have items in collection and create samples if nothing found
        if(GeoData.find({}, {order: {price: 1}}).count() > 0){
            var properties = GeoData.find({}, {order: {price: 1}}).fetch();
        } else{
            var properties = [{price: 150}, {price: 1235}];
        }
        //Attach slider to price
        $('#price-slider').noUiSlider({
            connect: true,
            start: [parseInt(properties[0].price) + 10, parseInt(properties[properties.length - 1].price) - 10],
            range: {
                'min': [properties[0].price],
                'max': [properties[properties.length - 1].price]
            },
            step: 10
        });
        //Show values selected on price slider
        $('#price-slider').Link('upper').to($('#price-slider-value-max'));
        $('#price-slider').Link('lower').to($('#price-slider-value-min'));

        //Make location select more functional by attaching 2Select
        $('#top-location-filter').select2({
            allowClear: true,
            placeholder: "Select locations"
            //multiple: true
        });

    };

    Template.sidebar.events({
        'click #adv-filter': function (event) {
            event.preventDefault();
            $('.adv').toggleClass('hidden');
        }
    });

    Template.login.events({
        'submit #signup': function (event) {
            event.preventDefault();
            event.stopPropagation();
            var form = $(event.currentTarget);
            var submit_btn = form.find('#submit');
            submit_btn.prop('disabled', 'disabled');
            var username = form.find('#inputUsername').val();
            var email = form.find('#inputEmail').val();
            var password = form.find('#inputPassword').val();
            Accounts.createUser({username: username, email: email, password: password},
                function (err) {
                    if (err) {
                        toastr.success('error', err.reason);
                        submit_btn.prop('disabled', false);
                    } else {
                        Meteor.call('sendVerificationEmail');
                        toastr.success('success', 'For confirm registration. Please, check your email for further instructions')
                        Router.go('agentarea');
                    }
                });
        },
        'submit #login':  function (event) {
            event.preventDefault();
            event.stopPropagation();
            var form = $(event.currentTarget);
            var submit_btn = form.find('#submit');
            submit_btn.prop('disabled', 'disabled');
            var email = form.find('#inputEmailLogin').val();
            var password = form.find('#inputPasswordLogin').val();
            Meteor.loginWithPassword(email, password, function (err) {
                if (err) {
                    toastr.error('error', err.reason)
                    submit_btn.prop('disabled', false);
                } else {
                    Router.go('agentarea');
                }
            });
        },
    });

    Template.googlemap.rendered = function () {
        this.autorun(_.bind(function () {
            if (GeoData.findOne())
                var test = GeoData.find();
            else
                var test = {long: 104.8921668, lat: 11.5448729};
            if (GoogleMaps.ready()) {
                this.mapOptions = {
                    center:      new google.maps.LatLng(11.5448729, 104.8921668),
                    zoom:        14,
                    scrollwheel: false
                };
                this.map = new google.maps.Map(this.find("#map-canvas"), this.mapOptions);
                var self = this;
                test.forEach(function (item) {
                    if (item.security < 3) {
                        var fillColor = '#FF0033';
                    }
                    else if (item.security == 5) {
                        var fillColor = '#99FF33';
                    }
                    else {
                        var fillColor = '#CCFF00';
                    }

                    this.populationOptions = {
                        strokeColor:   '#FF0000',
                        strokeOpacity: 0.4,
                        strokeWeight:  2,
                        fillColor:     fillColor,
                        fillOpacity:   0.35,
                        map:           self.map,
                        //center: new google.maps.LatLng(11.6449730,104.8921668),
                        center:        new google.maps.LatLng(item.location.lat, item.location.long),
                        radius:        500
                    };
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(item.location.lat, item.location.long),
                        map:      self.map,
                        title:    item.title
                    });
                    marker.setMap(self.map);
                    this.cityCircle = new google.maps.Circle(this.populationOptions);
                });
            }
        }, this));
    };

    Template.landing.helpers({
        dots:     GeoData.find({}, {limit: 4}),
        getFirst: function (items) {
            return items[0]
        },

    });

    Template.search.helpers({
        dots:      GeoData.find({}, {limit: 4}),
        getFirst:  function (items) {
            return items[0]
        },
        getRandom: function () {
            return parseInt(Math.random() * (300 - 12) + 12);
        }
    });

    Template.agentarea.events({
        "submit": function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var form = $(ev.currentTarget);
            var items = form.serializeArray();
            var data = {};
            items.map(function (x) {
                data[x.name] = x.value;
            });
        },
    });

}
