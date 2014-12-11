if (Meteor.isClient) {
    PropertyCollection = new Meteor.Collection('properties');
    AddressesCollection = new Meteor.Collection('addresses');
    CitiesCollection = new Meteor.Collection('cities');
    AreasCollection = new Meteor.Collection('areas');

    Meteor.subscribe('propertiesPub');
    Meteor.subscribe('agentsPub');
    Meteor.subscribe('addressesPub');
    Meteor.subscribe('citiesPub');
    Meteor.subscribe('areasPub');
    GoogleMaps = {
        // public methods
        config:             function (options) {
            _.extend(this, options);
        },
        ready:              function () {
            this._loadingDependency.depend();
            return this._ready;
        },
        placesSearchCallback: function(results, status){
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    console.log("place: ", results[i]);
                    var placeLoc = results[i].geometry.location;
                    var marker = new google.maps.Marker({
                        map: GoogleMaps.map,
                        position: results[i].geometry.location,
                        icon: "https://www.filepicker.io/api/file/gyNUDr3oRymf4GsaTgA5/convert?w=32"
                    });
                    GoogleMaps.searchMarkers.push(marker);

                    var infoWindow = new google.maps.InfoWindow();

                    addMarkerListener(marker, infoWindow, results[i], GoogleMaps.map);
                }
            }
        },
        // private methods
        _loaded:            function () {
            this._ready = true;
            this._loadingDependency.changed();
        },
        // public members
        apiKey:             "",
        searchMarkers: [],
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
        $.getScript("https://maps.googleapis.com/maps/api/js?key=" + GoogleMaps.apiKey + "&callback=_googleMapsLoaded&libraries=places");
    });

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


    Template.search.helpers({
        dots:      PropertyCollection.find({}, {limit: 4}),
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

var addMarkerListener = function(marker, infoWindow, place, map){
    google.maps.event.addListener(marker, 'click', function() {
        var image = '';
        if(typeof place.photos !== "undefined" && place.photos.length > 0){
            image = "<img src='" + place.photos[0].getUrl({maxWidth: 200}) + "'>"
        }
        infoWindow.setContent("<h2>"+place.name+"</h2>"+image);
        infoWindow.open(map, this);
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
        infoWindow.close();
    });
};
