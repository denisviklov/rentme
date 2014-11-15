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
}
