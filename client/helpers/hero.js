/**
 * Created by hlogeon on 11.12.14.
 */
Template.hero.helpers({
    getCities: function(){
        return CitiesCollection.find({}, {sort: {title: 1}}).fetch();
    },
    getAreasByCityName: function(cityName){
        var city = CitiesCollection.findOne({title: cityName});
        return AreasCollection.find({city: city._id}, {sort: {title: 1}}).fetch();
    }
});