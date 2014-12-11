/**
 * Created by hlogeon on 11.12.14.
 */

Template.poi.events({
    'mouseenter .tag':    function (ev) {
        var element = $(ev.currentTarget);
        element.toggleClass('trans');
    },
    'mouseleave .tag':    function (ev) {
        var element = $(ev.currentTarget);
        element.toggleClass('trans');
    },
    'click .tag': function (ev) {
        var icon = $(ev.currentTarget);
        icon.toggleClass('active-tag');

        var selectedTags = $('.active-tag');
        var tags = [];
        selectedTags.each(function(i, item  ){
            var tagName = $(item).find('h2')[0].textContent.toLowerCase().replace(/\s/g, '');
            if(tagName.substr(tagName.length - 1) === 's')
               tagName = tagName.substr(0, tagName.length - 1);
            tags.push(tagName);
            tags = addTags(tags, tagName);
        });
        console.log(tags);
        var request = {
            location: new google.maps.LatLng(GoogleMaps.map.center.k, GoogleMaps.map.center.D),
            types: tags,
            radius: 500
        };
        var service = getPlacesService(GoogleMaps.map);
        GoogleMaps.searchMarkers.forEach(function(mark){
            mark.setVisible(false);
        });
        service.nearbySearch(request, GoogleMaps.placesSearchCallback);
    }
});

var getPlacesService = function(map){
    return new google.maps.places.PlacesService(map);
};

var addTags = function(tags, tagName){
  if(tagName === 'bank'){
      tags.push('finance');
      tags.push('atm');
  } else if (tagName === 'sport'){
      tags.push("bowling_alley");
      tags.push("gym");
      tags.push("stadium");
  } else if(tagName === 'museum'){
      tags.push("art_gallery");
  } else if(tagName === 'restaurant'){
      //tags.push("food");
  } else if(tagName === "cinema"){
      tags.push("movie_theater");
  } else if(tagName === "shop"){
      tags.push("liquor_store");
      tags.push("store");
      tags.push("shopping_mall");
  }
    return tags;
};