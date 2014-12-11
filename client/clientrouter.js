Router.onBeforeAction('loading');

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  before: function(){
    console.log(this.route._path);
    if(!Meteor.user() && this.route._path == '/agentarea'){
      Router.go('login');
      this.stop();
    }
    if(Meteor.user()){
      Router.go('agentarea');
    }

    if(this.route._path == '/logout'){
      this.stop();
      Meteor.logout();
      Router.go('/');
      return;
    }
    this.next();
  },
});

Router.map(function(){
  this.route('landing', {path: '/'});
  this.route('search');
  this.route('login');
  this.route('detailed/:_id', function(){
    console.log(this.params._id);
    this.render('detailed');
  });
  this.route('agentarea');
  this.route('logout', {
    onRun: function(){
      Meteor.logout();
      Router.go('/');
    }
  });
});
