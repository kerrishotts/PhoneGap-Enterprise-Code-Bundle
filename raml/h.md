The API for Tasker is a RESTful-like API (because it relies on client authentication state) but it also implements HATEOAS.

The initial discovery request is like this:

        GET /
        
The response is something like this:

        {
            "links": {
                "discover": {
                    "title": "Discover the API",
                    "description": "",
                    "href": "/",
                    "method": "get",
                    "accepts": null,
                    "sends": [ "application/json", ... ]
                },
                "get-token": {
                    "title": "Get a CSRF Token",
                    "description": "Call prior to POST, PUT, or DELETEing a URI.",
                    "href": "/auth",
                    "method": "get",
                    "accepts": null,
                    "sends": [ "application/json", "text/json", "text/html" ],
                    "store": [ 
                                { 
                                    title: "CSRF-token",
                                    key: "token"
                                }
                             ]
                },
                "authenticate": {
                    "title": "Authenticate User",
                    "description": "Authenticate a user. Returns a token....",
                    "href": "/auth",
                    "method": "post",
                    "accepts": [ "application/json", "text/json" ],
                    "sends": [ "application/json", "text/json" ],
                    "requires": [ "get-token" ],
                    "headers-template": [
                                            {
                                                title: "CSRF Token",
                                                header: "x-csrf-token",
                                                value: "{CSRF-token}"
                                            }
                                        ],      
                    "template": [
                                    {
                                        title: "User ID",
                                        name: "user-id",
                                        key: "userId",
                                        type: "string",
                                        required: "true",
                                    },
                                    {
                                        title: "Password",
                                        name: "candidate-password",
                                        key: "candidatePassword",
                                        type: "string",
                                        required: "true"
                                    }
                                ],
                    "store": [
                                {
                                    name: "auth-token",
                                    key: "content.nextToken",
                                    type: "string"
                                },
                                {
                                    name: "session-id",
                                    key: "content.sessionId",
                                    type: "string"
                                },
                                {
                                    name: "user-id",
                                    key: "content.userId",
                                    type: "string"
                                },
                                {
                                    name: "session-salt",
                                    key: "content.sessionSalt",
                                    type: "string"
                                }
                             ]
                }
            },
            "actions": {
                "authenticate": [ "get-token", "authenticate" ]
                "discover": [ "discover" ]
            }
        }

At this stage, the client selects the desired action from the `actions` array -- in this case, `authenticate`. Because
this action requires two steps, each one is listed and executed in order. Should one fail, the remainder of the chain
is not executed.

At this point the client now sends this:

        GET /auth

And the server responds with this:

        {
            "token": "csrfToken",
            "links": { ... },
            "actions": {
                "authenticate": [ "authenticate" ],
                "new-task": [ "get-token", "new-task" ],
                "edit-task": [ "edit-task" ],
                ...
            }
        }
        
Now `authenticate` has been updated simply to have only one action, but the client already knows the next step (?)

Sends:

        POST /auth
        
        x-csrf-token: csrfToken
        
        {
            "userId": "JDOE",
            "candidatePassword": "password"
        }
        
The response is:

        {
            "message": "Authenticated.",
            "code": "OK000",
            "content": {
                "nextToken": "abcdef",
                "sessionId": "10493",
                "userId": "JDOE",
                "sessionSalt": "ghijkl"
            },
            "links": {
            },
            "actions": {
                "discoverAuthAPI": [ ]
            }
        }
            
Client:

        GET /auth/authAPI

Response

        links, actions
        
Client:

        GET /tasks
        GET /task/21
        GET /auth
        PUT /task/21
        GET /auth
        POST /task/21/comments
        GET /tasks
        GET /people
        