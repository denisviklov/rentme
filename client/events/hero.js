/**
 * Created by hlogeon on 11.12.14.
 */


Template.hero.events({
    'change #top-location-filter': function(ev){
        var cityName = $(ev.currentTarget).val();
        if(cityName === '' || typeof cityName === 'undefined')
            return;
        var city = CitiesCollection.findOne({title: cityName});
        var areas = AreasCollection.find({city: city._id}, {sort: {title: 1}}).fetch();
        var optionsTags = '';
        areas.forEach(function(area){
            optionsTags += '<option>' + area.title + '</option>'
        });
        $('#top-district-filter')[0].innerHTML = optionsTags;
    }

});

Template.hero.rendered = function(){
    var properties = PropertyCollection.find({}, {sort: {price: 1}}).fetch();
    if(properties.length === 0)
        properties = [{price:0}, {price: 5000}];
    //Attach slider to price
    $('#price-slider').noUiSlider({
        connect: true,
        start: [parseInt(properties[0].price), parseInt(properties[properties.length - 1].price)],
        range: {
            'min': [properties[0].price],
            'max': [properties[properties.length - 1].price]
        },
        step: 10
    });
    //Show values selected on price slider
    $('#price-slider').Link('upper').to($('#price-slider-value-max'));
    $('#price-slider').Link('lower').to($('#price-slider-value-min'));

    //Make location select more functional by attaching 2Select
    $('#top-location-filter').select2({
        allowClear: true,
        placeholder: "Select locations"
        //multiple: true
    });

    $('#top-type-filter').select2({
        allowClear: true
        //placeholder: "Select locations"
        //multiple: true
    });
    $('#top-district-filter').select2({
        allowClear: true
    });

};