if (Meteor.isClient) {
GoogleMaps={
  // public methods
  config:function(options){
    _.extend(this,options);
  },
  ready:function(){
    this._loadingDependency.depend();
    return this._ready;
  },
  // private methods
  _loaded:function(){
    this._ready=true;
    this._loadingDependency.changed();
  },
  // public members
  apiKey:"",
  // private members
  _ready:false,
  _loadingDependency:new Deps.Dependency()
};

_googleMapsLoaded=function(){
  GoogleMaps._loaded();
};

Meteor.startup(function(){
  GoogleMaps.config({apiKey:'AIzaSyDMG2k81XSsGA_RFqLTZENwGDOfh9nXBVo'});
  if(!GoogleMaps.apiKey){
    throw new Meteor.Error(-1,"API key not set, use GoogleMaps.config({apiKey:YOUR_API_KEY});");
  }
  $.getScript("https://maps.googleapis.com/maps/api/js?key="+GoogleMaps.apiKey+"&callback=_googleMapsLoaded");
});

Template.landing.events({
  'click #search': function(event){
    Router.go('/search');
  },
  'mouseenter .tag': function(ev){
    $(ev.currentTarget).toggleClass('trans');
  },
  'mouseleave .tag': function(ev){
    $(ev.currentTarget).toggleClass('trans');
  },
  'click .tag': function(ev){
    $(ev.currentTarget).removeClass('tag');
  },
});

Template.sidebar.events({
  'click #adv-filter': function(event){
    event.preventDefault();
    $('.adv').toggleClass('hidden');
  },
});

  Template.login.events({
    'submit #signup': function(event){
      event.preventDefault();
      event.stopPropagation();
      console.log('submit');
      var form = $(event.currentTarget);
      var submit_btn = form.find('#submit');
      submit_btn.prop('disabled', 'disabled');
      var username = form.find('#inputUsername').val();
      var email = form.find('#inputEmail').val();
      var password = form.find('#inputPassword').val();
      Accounts.createUser({username: username, email: email, password: password},
        function(err){
          if(err){
            toastr.success('error', err.reason);
            submit_btn.prop('disabled', false);
          }else{
            Meteor.call('sendVerificationEmail');
            toastr.success('success', 'For confirm registration. Please, check your email for further instructions')
            Router.go('agentarea');
          }
        });
    },
    'submit #login': function(event){
      event.preventDefault();
      event.stopPropagation();
      var form = $(event.currentTarget);
      var submit_btn = form.find('#submit');
      submit_btn.prop('disabled', 'disabled');
      var email = form.find('#inputEmailLogin').val();
      var password = form.find('#inputPasswordLogin').val();
      Meteor.loginWithPassword(email, password, function(err){
        if(err){
          toastr.error('error', err.reason)
          submit_btn.prop('disabled', false);
        }else{
          Router.go('agentarea');
        }
      });      
    },
  });
/*
Template.googlemap.rendered = function() {  
      function initialize() {
        var mapOptions = {
          center: { lat: -34.397, lng: 150.644},
          zoom: 8
        };
        console.log('google');
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      }
console.log(document.getElementById('map-canvas'));
  google.maps.event.addDomListener(window, 'load', initialize);

  Session.set('map', true);
};
Template.googlemap.destroyed = function() {
  Session.set('map', false);
};*/

Template.googlemap.rendered=function(){
  this.autorun(_.bind(function(){
    if(GoogleMaps.ready()){
      this.mapOptions={
        center:new google.maps.LatLng(11.5448729,104.8921668),
        zoom:12
      };
      this.map=new google.maps.Map(this.find("#map-canvas"),this.mapOptions);

      this.populationOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.4,
        strokeWeight: 2,
        fillColor: '#FF0033',
        fillOpacity: 0.35,
        map: this.map,
        center: new google.maps.LatLng(11.6449730,104.8921668),
        radius: 10000
      };
      this.cityCircle = new google.maps.Circle(this.populationOptions);
      this.populationOptions1 = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.4,
        strokeWeight: 2,
        fillColor: '#33CC66',
        fillOpacity: 0.35,
        map: this.map,
        center: new google.maps.LatLng(11.3449730,104.8981668),
        radius: 21000
      };
      this.cityCircle1 = new google.maps.Circle(this.populationOptions1);
    }
  },this));
};
}
