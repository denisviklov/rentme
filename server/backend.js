Ads = new Meteor.Collection('ads');
GeoData = new Meteor.Collection('geodata');

Meteor.publish('adsPub', function(){
    console.log("adsPub: ", Ads.find({}));
    return Ads.find({});
});
Meteor.publish('geoPub', function(){
    return GeoData.find({});
});
//init
Meteor.startup(function(){});