PropertyCollection = new Meteor.Collection('properties');
AddressesCollection = new Meteor.Collection('addresses');
CitiesCollection = new Meteor.Collection('cities');
AreasCollection = new Meteor.Collection('areas');

Meteor.publish('propertiesPub', function () {
    return PropertyCollection.find({});
});
Meteor.publish('agentsPub', function () {
    return Meteor.users.find({type: "agent"});
});
Meteor.publish('addressesPub', function () {
    return AddressesCollection.find({});
});
Meteor.publish('citiesPub', function () {
    return CitiesCollection.find({});
});
Meteor.publish('areasPub', function () {
    return AreasCollection.find({});
});

//init
Meteor.startup(function () {
    if (Meteor.isServer) {
        testPropertiesData();
        testCitiesData();
        testAreasData();
        testAddressesData();
        createTestAgents();

    }
});

/**
 * Generate properties
 */
var testPropertiesData = function () {
    if (PropertyCollection.find().count() === 0) {
        var propertiesJson = JSON.parse(Assets.getText("properties.json"));
        propertiesJson.forEach(function (item, i) {
            PropertyCollection.insert(item);
        });
        console.log("Added " + propertiesJson.length + " properties to DB");
    } else {
        console.log("Property collection has " + PropertyCollection.find().count() + " elements");
    }
};

/**
 * Generates areas and attaches it to cities
 * @NOTE: modifies CitiesCollection
 */
var testAreasData = function () {
    if (AreasCollection.find().count() === 0) {
        var areasJson = JSON.parse(Assets.getText("areas.json"));
        areasJson.forEach(function (item) {
            //item.city = new ObjectId(item.city);
            var relatedCity = CitiesCollection.findOne({"_id": item.city});
            if (typeof relatedCity !== "undefined") {
                if (typeof relatedCity.areas === "undefined")
                    relatedCity.areas = [];
                relatedCity.areas.push(item._id);
                CitiesCollection.update({_id: relatedCity._id}, {$set: {areas: relatedCity.areas}});
            }
            AreasCollection.insert(item);
        });
        console.log("Added " + areasJson.length + " areas to DB");
    } else {
        console.log("Areas collection has " + AreasCollection.find().count() + " elements");
    }
};

/**
 * Generate cities
 */
var testCitiesData = function () {
    if (CitiesCollection.find().count() === 0) {
        var citiesJson = JSON.parse(Assets.getText("cities.json"));
        citiesJson.forEach(function (item) {
            CitiesCollection.insert(item);
        });
        console.log("Added " + citiesJson.length + " cities to DB");
    } else {
        console.log("Cities collection has " + CitiesCollection.find().count() + " elements");
    }
};

/**
 * Generate addresses, attaches cities and areas to it and then attaches address to property
 * @NOTE: modifies PropertyCollection
 */
var testAddressesData = function () {

    if (AddressesCollection.find().count() === 0) {
        var addressesJson = JSON.parse(Assets.getText('addresses.json'));
        var cities = CitiesCollection.find({}).fetch();
        var properties = PropertyCollection.find({}).fetch();
        properties.forEach(function (property, i) {
            var address = addressesJson[i];
            var city = cities[getRandomInt(0, cities.length - 1)];
            var area = city.areas[getRandomInt(0, city.areas.length - 1)];
            address.city = city._id;
            address.area = area;
            address.location = property.location;
            property.address = address._id;
            PropertyCollection.update({_id: property._id}, {$set: {address: property.address}});
            AddressesCollection.insert(address);
        });
        console.log("Added " + properties.length + " addresses to DB");
    } else {
        console.log("Cities collection has " + AddressesCollection.find().count() + " elements");
    }
};

/**
 * Creates agents and attaches tem to properties
 * @NOTE: modifies PropertyCollection
 * @TODO: REFACTOR THIS SHIT
 */
var createTestAgents = function () {

    if (Meteor.users.find({"profile.type": "agent"}).count() === 0) {
        var agents = JSON.parse(Assets.getText('agents.json'));
        var properties = PropertyCollection.find({}).fetch();
        agents.forEach(function (agent) {
            var agentsProperties = [];
            var agentPropertyIds = [];
            var amount = getRandomInt(1, properties.length - 1);
            while (amount > 0) {
                agentsProperties.push(properties.pop());
                amount--;
            }
            agentsProperties.forEach(function (prop) {
                agentPropertyIds.push(prop._id);
            });
            var profile = agent;
            profile.properties = agentPropertyIds;
            Accounts.createUser({
                username: agent.login,
                email: agent.email,
                password: agent.password,
                profile: profile
            });
            agentsProperties.forEach(function (property) {
                PropertyCollection.update({_id: property._id}, {$set: {agent: agent._id}});
            });
        });

        console.log("Added " + agents.length + " agents to DB");
    } else {
        console.log("User collection has " + Meteor.users.find().count() + " agents");
    }
};


var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var dropDatabase = function () {
    var globalObject = global;
    for (var property in globalObject) {
        var object = globalObject[property];
        if (object instanceof Meteor.Collection) {
            object.remove({});
        }
    }
};