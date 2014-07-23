var express = require("express");

module.exports = {
  createRouterForApi:function (api) {
		var router = express.Router();
		// process each route in the api; a route consists of the uri (route) and a series of verbs (get, post, etc.)
		api.forEach ( function ( apiRoute ) {
				// add params
				if ( typeof apiRoute.params !== "undefined" )
				{
					apiRoute.params.forEach ( function ( param ) {
						router.param( param.name, param.handler );
					});
				}
				var uri = apiRoute.route;
				// create a new route with the uri
				var route = router.route ( uri ); 
				// process through each action
				apiRoute.actions.forEach ( function (action) {
						// just in case we have more than one verb, split them out
						var verbs = action.verb.split(",");
						// and add the handler specified to the route (if it's a valid verb)
						verbs.forEach ( function (verb) {
								if (typeof route[verb] === "function") {
										route[verb]( action.handler );
								}
						});
				});
		});
		return router;
	},
  generateHypermediaForAction: function ( action, parent ) {
		var hm = {};
		hm.allow = action.verb;
		if (typeof action.description.title !== "undefined" ) { hm.title = action.description.title; }
		if (typeof action.description.type !== "undefined" ) { hm.type = action.description.type; }
		if (typeof action.description.accept !== "undefined" ) { hm.accept = action.description.accept; }
		if (typeof action.description.href !== "undefined" ) { hm.href = action.description.href; }
		if (typeof action.description.template !== "undefined" ) { hm.template = action.description.template; }
		if (typeof parent !== "undefined")
		{
			parent[action.action] = hm;
			return hm;
		}
		else
		{
			parent = {};
			parent[action.action] = hm;
			return parent;
		}
	},
  generateHypermediaForApi: function ( api ) {
		var hm = {};
		var self = this;
		api.forEach ( function ( apiRoute ) {
			apiRoute.actions.forEach ( function ( action ) {
				self.generateHypermediaForAction( action, hm );
			});
		});
		return { "links": hm };
	}
};