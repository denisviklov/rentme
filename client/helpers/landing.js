/**
 * Created by hlogeon on 11.12.14.
 */

Template.landing.helpers({
    dots:     function() {
        return PropertyCollection.find({}, {limit: 4})
    },
    getFirst: function (items) {
        return items[0]
    },
    getAddress: function(property){
        var address = AddressesCollection.findOne({_id: property.address});
        var area = AreasCollection.findOne(address.area);
        var city = CitiesCollection.findOne(address.city);
        return "#"+address.building + ", " + address.street + ", " + area.title + ", " + city.title;
    },
    getTypes: function(){

    },
    getCities: function(){
        return CitiesCollection.find({}, {sort: {title: 1}}).fetch();
    }

});