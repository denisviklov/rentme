Ads = new Meteor.Collection('ads');
GeoData = new Meteor.Collection('geodata');

Meteor.publish('adsPub', function(){
    return Ads.find({});
});
Meteor.publish('geoPub', function(){
    return GeoData.find({});
});
//init
Meteor.startup(function(){});