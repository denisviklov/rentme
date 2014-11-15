// Set of validators.
Accounts.onCreateUser(function(options, user){
    if(user.services && user.services.facebook)
        user.username = options.profile.name
    if(user.services && user.services.google)
        user.username = options.profile.name
    user.profile = options;
    user.profile = {type: 'agent'};
    return user;
});

Accounts.validateNewUser(function (user) {
    if(user.services && user.services.facebook)
        return true;
    if(user.services && user.services.google)
        return true;
    if (user.username && user.username.length >= 3)
        return true;
    throw new Meteor.Error(403, "Username must have at least 3 characters");
});

Accounts.validateNewUser(function (user) {
    if(user.services && user.services.facebook)
        return true;
    if(user.services && user.services.google)
        return true;
    function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    if (validateEmail(user.emails[0].address))
        return true;
    throw new Meteor.Error(403, "Incorrect email");
});

Accounts.validateNewUser(function (user) {
    if (user.username && user.username.length >= 3)
        return true;
    throw new Meteor.Error(403, "Username must have at least 3 characters");
});