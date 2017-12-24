import { HTTP } from 'meteor/http'
// on startup run resizing event
Meteor.startup(function() {
	$(window).resize(function() {
		$('#map').css('height', window.innerHeight - 82);
	});

	$(window).resize(); // trigger resize event
});

// create marker collection
Meteor.subscribe('areas');


Template.mapPage.rendered = function() {

		HTTP.call("GET", "https://34c3.c3nav.de/api/updates/fetch/", {
			beforeSend: function(xhttp) {
				xhttp.withCredentials = true;
			}
		}, function() {});

		setInterval(function() {
			HTTP.call("GET", "https://34c3.c3nav.de/api/updates/fetch/", {
				beforeSend: function(xhttp) {
					xhttp.withCredentials = true;
				}
			}, function() {});
		}, 30000);

	$('#map').css('height', window.innerHeight - 82);

	var leafletMap = new LeafletMap("map");
	console.log(leafletMap);
	Meteor.subscribe('layers');
	Layers.find().observe({
		added: $.proxy(function (newDocument) {
			leafletMap.addDataLayer(new LeafletDataLayer(newDocument.title, newDocument._id));
		}, leafletMap),
		removed: $.proxy(function (oldDocument) {
			this.removeDataLayer(oldDocument._id);
		}, leafletMap),
		changed: $.proxy(function (newDocument, oldDocument) {

			oldDataLayerName = this.currentDataLayer.layerName;
			newDataLayer = new LeafletDataLayer(newDocument.title, newDocument._id);

			this.removeDataLayer(oldDocument._id);
			this.addDataLayer(newDataLayer);
		}, leafletMap)

	});
};
