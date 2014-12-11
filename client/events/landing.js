/**
 * Created by hlogeon on 11.12.14.
 */


Template.landing.events({
    'click #search':      function (event) {
        Router.go('/search');
    },
    'click #advanced-filter-toggle': function(ev){
        ev.preventDefault();
        if($("#advanced-filter-toggle")[0].firstElementChild.outerHTML == '<span class="glyphicon glyphicon-chevron-down"></span>'){
            $("#advanced-filter-toggle")[0].firstElementChild.outerHTML = '<span class="glyphicon glyphicon-chevron-up"></span>'
        } else{
            $("#advanced-filter-toggle")[0].firstElementChild.outerHTML = '<span class="glyphicon glyphicon-chevron-down"></span>'
        }
        $("#advanced-filters-top").toggleClass("invisible", 'slow');
    },
});
