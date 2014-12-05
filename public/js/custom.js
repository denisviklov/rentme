/**
 * Created by hlogeon on 30.11.2014.
 */


$(document).ready(function(){
    $("#advanced-filter-toggle").click(function(event){
        event.preventDefault();
        $("#advanced-filters-top").toggleClass("invisible");
        console.log(this);
    });
});
