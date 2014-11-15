Ads = new Meteor.Collection('ads');

Meteor.publish('adsPub', function(){
    return Ads.find({});
});

//init
Meteor.startup(function(){});