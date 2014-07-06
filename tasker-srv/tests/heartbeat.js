var app = require( "../app"),
    expect = require( "chai").expect,
    request = require("supertest");
    
describe ("heartbeat", function () {
	describe ("when I access /heartbeat", function () {
		it ("should respond with 200", function(done) {
			request (app)
			.get ("/heartbeat")
			.expect("Content-Type", /json/)
			.expect(200, done);
		});
	});
});
