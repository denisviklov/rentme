Router.onBeforeAction('loading');

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function(){
  this.route('landing', {path: '/'});
  this.route('search');
});
