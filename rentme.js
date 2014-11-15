if (Meteor.isClient) {

Template.landing.events({
  'click #search': function(event){
    Router.go('/search');
  },
});

Template.sidebar.events({
  'click #adv-filter': function(event){
    event.preventDefault();
    $('.adv').toggleClass('hidden');
  },
});
}
