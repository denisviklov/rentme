/**
 * Created by hlogeon on 11.12.14.
 */
Template.googlemap.rendered = function () {
    this.autorun(_.bind(function () {
        var properties = PropertyCollection.find();
        if (GoogleMaps.ready()) {
            this.mapOptions = {
                center:      new google.maps.LatLng(11.5448729, 104.8921668),
                zoom:        14,
                scrollwheel: false
            };
            this.map = new google.maps.Map(this.find("#map-canvas"), this.mapOptions);
            GoogleMaps.map = this.map;
            var self = this;
            properties.forEach(function (item) {
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