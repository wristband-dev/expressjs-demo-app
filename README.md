<div align="center">
  <a href="https://wristband.dev">
    <picture>
      <img src="https://assets.wristband.dev/images/email_branding_logo_v1.png" alt="Github" width="297" height="64">
    </picture>
  </a>
  <p align="center">
    Enterprise-ready auth that is secure by default, truly multi-tenant, and ungated for small businesses.
  </p>
  <p align="center">
    <b>
      <a href="https://wristband.dev">Website</a> •
      <a href="https://docs.wristband.dev">Documentation</a>
    </b>
  </p>
</div>

<br/>

---

<br/>

# Invotastic for Business (ExpressJS) -- A multi-tenant demo app

"Invotastic for Business" is a Wristband multi-tenant demo app that serves other companies as its customers. This repo utilizes the Backend Server integration pattern. It consists of ExpressJS server that hosts and serves up a React single-page application to the browser upon request.
<br>
<br>

> **Disclaimer:**
> Invotastic for Business is not a real-world application and cannot be used to send invoices to real people.

<br>
<hr />
<br>

## Getting Started

You can start up the demo application in a few simple steps.

### 1) Sign up for an Wristband account.

First thing is first: make sure you sign up for an Wristband account at [https://wristband.dev](https://wristband.dev).

### 2) Provision the B2B ExpressJS demo application in the Wristband Dashboard.

After your Wristband account is set up, log in to the Wristband dashboard.  Once you land on the home page of the dashboard, click the button labeled "Add Demo App".  Make sure you choose the following options:

- Step 1: Subject to Authenticate - Humans
- Step 2: Application Framework - Express Backend, React Frontend

You can also follow the [Demo App Guide](https://docs.wristband.dev/docs/setting-up-a-demo-app) for more information.

### 3) Apply your Wristband configuration values to the Express server configuration

After completing demo app creation, you will be prompted with values that you should use to create environment variables for the Express server. You should see:

- `APPLICATION_VANITY_DOMAIN`
- `CLIENT_ID`
- `CLIENT_SECRET`

Copy those values, then create an environment variable file on the server at: `backend/.env`. Once created, paste the copied values into this file.

### 4) Install dependencies and build artifacts

> [!WARNING]
> Make sure you are in the root directory of this repository.

Before attempting to run the application, you'll need to setup the project. From the root directory of this repo, run the following:

```bash
npm run setup
```

This command will do the following:
- Clean old build artifacts
- Install all dependencies for both React and Express
- Build the React asset bundle that will be served up by Express (asset bundle target location is `backend/dist/`)

### 5) Run the application in "production" mode 

Start up the Express server in "production" mode. This lets Express serve the React static assets bundle, and it runs on port `6001`.

```bash
npm start
```

<br>
<hr>
<br>

## How to interact with the demo app

### Signup Users

Now that the demo app is up and running, you can sign up your first customer on the Signup Page at the following location:

- `https://{application_vanity_domain}/signup`, where `{application_vanity_domain}` should be replaced with the value of the "Application Vanity Domain" value of the application (can be found in the Wristband Dashboard by clicking the Application Settings side menu of this app).

This signup page is hosted by Wristband.  Completing the signup form will provision both a new tenant with the specified tenant domain name and a new user that is assigned to that tenant.

### Home Page

For reference, the home page of this app can be accessed at [http://localhost:6001/home](http://localhost:6001/home).

### Application-level Login (Tenant Discovery)

Users of this app can access the Application-level Login Page at the following location:

- `https://{application_vanity_domain}/login`, where `{application_vanity_domain}` should be replaced with the value of the "Application Vanity Domain" value of the application (can be found in the Wristband Dashboard by clicking the Application Settings side menu of this app).

This login page is hosted by Wristband.  Here, the user will be prompted to enter their tenant's domain name for which they want to log in to.  Successfully entering the tenant domain name will redirect the user to the tenant-level login page for their specific tenant.

Users also have the option here to execute the Forgot Tenant workflow and entering their email address in order to receive a list of all tenants that they belong to.

### Tenant-level Login

If users wish to directly access their Tenant-level Login Page without having to go through tenant discovery, they can do so at [http://localhost:6001/api/auth/login?tenant_domain={tenant_domain}](http://localhost:6001/home), where `{tenant_domain}` should be replaced with the value of the desired tenant's domain name.

This login page is hosted by Wristband.  Here, the user will be prompted to enter their credentials in order to login to the application.

<br>
<hr>
<br>

## Demo App Overview

Below is a quick overview of how this demo app interacts with Wristband.

### Entity Model
<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://assets.wristband.dev/docs/b2b-expressjs-demo-app/b2b-expressjs-demo-app-entity-model-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://assets.wristband.dev/docs/b2b-expressjs-demo-app/b2b-expressjs-demo-app-entity-model-light.png">
  <img alt="entity model" src="https://assets.wristband.dev/docs/b2b-expressjs-demo-app/b2b-expressjs-demo-app-entity-model-light.png">
</picture>

The entity model starts at the top with an application that encapsulates everything related to Invotastic for Business.  The application has the Wristband identity provider enabled by default so that all users can login with an email and a password.  The application has one OAuth2 client through which users will be authenticated.  In this case, the client is an Express server.

Companies that signup with Invotastic for Business will be provisioned a tenant under the application (1 company = 1 tenant). When a new user signs up their company, they are assigned the "Owner" role by default and have full access to their company resources.  Owners of a company can also invite new users into their company.  Invited users can be assigned either the "Owner" role or the "Viewer" role.  A user that is assigned the "Viewer" role can't perform the following operations:

- Create new invoices
- Cancel invoices
- Invite admins 

### Architecture
<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://assets.wristband.dev/docs/b2b-expressjs-demo-app/b2b-expressjs-demo-app-architecture-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://assets.wristband.dev/docs/b2b-expressjs-demo-app/b2b-expressjs-demo-app-architecture-light.png">
  <img alt="entity model" src="https://assets.wristband.dev/docs/b2b-expressjs-demo-app/b2b-expressjs-demo-app-entity-model-light.png">
</picture>

The application in this repository utilizes the Backend for Frontend (BFF) pattern, where Express is the backend for the React frontend. The server is responsible for:

- Storing the client ID and secret.
- Handling the OAuth2 authorization code flow redirections to and from Wristband during user login.
- Creating the application session cookie to be sent back to the browser upon successful login.  The application session cookie contains the access and refresh tokens as well as some basic user info.
- Refreshing the access token if the access token is expired.
- Orchestrating all API calls from the React frontend to both Wristband and the Invotastic backend data store.
- Destroying the application session cookie and revoking the refresh token when a user logs out.

API calls made from React to Express pass along the application session cookie and a [CSRF token](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie) with every request.  The server has two middlewares for all protected routes responsbile for:

- Validating the session and refreshing the access token (if necessary)
- Validating the CSRF token

For any Invotastic-specific APIs (i.e. invoice APIs), the server will perform an authorization check before processing the API request by checking against the permissions assigned to the session user's role.

It is also important to note that Wristband hosts all onboarding workflow pages (signup, login, etc), and the Express server will redirect to Wristband in order to show users those pages.

### Wristband Code Touchpoints

Within the demo app code base, you can search in your IDE of choice for the text `WRISTBAND_TOUCHPOINT`.  This will show the various places in both the React frontend code and Express backend code where Wristband is involved.  You will find the search results return one of a few possible comments using that search text:

- `/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */` - Code that deals with an authenticated user's application session.  This includes managing their application session cookie and JWTs, OAuth2-related endpoints for login/callback/logout, middleware for validating/refreshing tokens, and React context used to check if the user is authenticated.
- `/* WRISTBAND_TOUCHPOINT - AUTHORIZATION */` - Code that checks whether a user has the required permissions to interact with Invotastic-specific resource APIs or can access certain application functionality in the UI.
- `/* WRISTBAND_TOUCHPOINT - RESOURCE API */` - Code that interacts with any Wristband-specific resource APIs or workflow APIs that are not related to authentication or authorization directly.  For example, it could be an API call to update the user's profile or change their password.

There are also some visual cues in the Invotastic for Business UI that indicate if certain forms or buttons will trigger the execution of code that runs through any of the touchpoint categories above. For example, if we look at the Invite Admins UI:
<br>
<br>

![touchpoint](https://assets.wristband.dev/docs/b2b-expressjs-demo-app/b2b-demo-app-invite-admins-touchpoint.png)

Submitting the form to invite another admin into your company will ultimately trigger an API call to Wristband to peform the Invite New User workflow, and thus would execute code in the category of `WRISTBAND_TOUCHPOINT - RESOURCE API`.

<br>
<hr />
<br/>

## Run the application in "dev" mode to experiment with the code and debug

You can run this demo application in "dev" mode in order to actively debug or experiment with any of the code.  After installing all dependencies, run the following from the root directory of this repo:

```bash
npm run dev
```

The Vite dev server will start on port `6001`. The Express server will start on port `3001`. All URL locations should remain the same as when using the app in "production" mode.

<br>
<hr />
<br/>

## Wristband Express Auth SDK

This demo app is leveraging the [Wristband express-auth SDK](https://github.com/wristband-dev/express-auth) for all authentication interaction in the Express server. Refer to that GitHub repository for more information.

<br>

## Wristband React Client Auth SDK

This demo app is leveraging the [Wristband react-client-auth SDK](https://github.com/wristband-dev/react-client-auth) for any authenticated session interaction in the React frontend. Refer to that GitHub repository for more information.

<br/>

## CSRF Protection

Cross Site Request Forgery (CSRF) is a security vulnerability where attackers trick authenticated users into unknowingly submitting malicious requests to your application. This demo app is leveraging a technique called the Syncrhonizer Token Pattern to mitigate CSRF attacks by employing two cookies: a session cookie for user authentication and a CSRF token cookie containing a unique token. With each request, the CSRF token is included both in the cookie and the request payload, enabling server-side validation to prevent CSRF attacks.

Refer to the [OWASP CSRF Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) for more information about this topic.

> [!WARNING]
> Your own application should take effort to mitigate CSRF attacks in addition to any Wristband authentication, and it is highly recommended to take a similar approach as this demo app to protect against thse types of attacks.

Within the demo app code base, you can search in your IDE of choice for the text `CSRF_TOUCHPOINT`.  This will show the various places in both the React frontend code and Express backend code where CSRF is involved.

<br/>

## Questions

Reach out to the Wristband team at <support@wristband.dev> for any questions regarding this demo app.

<br/>
