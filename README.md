# sample-nodejs-okta-project
A lightweight NodeJS ExpressJS app to help developers get started with Flex OKTA authentication.

> **Note**: To see OKTA’s official documentation, visit this link:
https://developer.okta.com/documentation/. 
This document is for NodeJS Flex developers who wish to incorporate OKTA authentication into their web applications. 

Follow the steps below to create your own NodeJS app with integrated OKTA authentication. Alternative, you can get started by cloning this app and use it as a starting point for your next project.

1. Have the prerequisites ready for obtaining an OKTA client ID and secret key. This can be done by completing the following steps:

    1. Have a callback URL route ready in your application that will handle the authenticated user when they return from OKTA (such as `/login/callback`). Leave it empty for now.
    2. Have an image for your app ready.

2. Request a client ID and secret from OKTA. This can be done by emailing Hector Arrington <hector.arrington@flex.com> or Nidhin C K <nidhin.ck@flex.com>, requesting a client ID and secret for your app. Note that they will ask for your URL routes and your app logo image.

3. Install & configure the required dependencies:

    1. NPM install the OKTA OID and session middleware:

            npm install @okta/oidc-middleware express-session

4. Configure the session and OKTA middleware in your express app using the code below. In the code, be sure to fill out:

    * **SESSION_SECRET** - A secret string you want to use to hash components of the session protocal.
    * **MY_FLEX_OKTA_CLIENT_ID** - Your Flex OKTA client ID 
    * **MY_FLEX_OKTA_CLIENT_SECRET** - Your Flex OKTA client secret
    * **MY_REDIRECT_URI** - The URL you want OKTA to send the user’s information to.


            /**
            * Session and OKTA support
            */
            const session = require('express-session');
            const { ExpressOIDC } = require('@okta/oidc-middleware');
            const FLEX_OKTA_DOMAIN = "https://flex.okta.com";

            /**
            * Fill out the following options:
            */
            const SESSION_SECRET = "SOMETHING_SECRET_AND_RANDOM";
            const MY_FLEX_OKTA_CLIENT_ID = "YOUR_CLIENT_ID";
            const MY_FLEX_OKTA_CLIENT_SECRET = "YOUR_CLIENT_SECRET";
            const MY_REDIRECT_URI = "YOUR_REDIRECT_URI";

            app.use(session({
                secret: SESSION_SECRET,
                resave: true,
                saveUninitialized: false
            }));

            const oidc = new ExpressOIDC({
                issuer: FLEX_OKTA_DOMAIN,
                client_id: MY_FLEX_OKTA_CLIENT_ID,
                client_secret: MY_FLEX_OKTA_CLIENT_SECRET,
                redirect_uri: MY_REDIRECT_URI,
                scope: 'openid profile'
            });

            // ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
            app.use(oidc.router);

    At this point, authentication should be ready and working. Once the user visits `/login`, they should be redirected to flex.okta.com to signin. Once they sign in, they will be taken back to `/login/calllback` (or what route you set up in `MY_REDIRECT_URI`).


5. In the `/login/callback` route, use `req.userinfo` to retrieve the authenticated user’s information. At this point, you may insert them into a database if they’re not stored yet.

    The user information should be consistently be available via req.userinfo across all your routes.

    Here is an example callback route that reads the authenticated user’s information:

        router.get("/login/callback", (req, res) => {
            const authenticatedUser = req.userinfo;
            const lastName = authenticatedUser.family_name;
            const firstName = authenticatedUser.given_name;
            const email = authenticatedUser.preferred_username;
            // now we can save the user's information to a secure database in our app.
            res.json(authenticatedUser);
        });

