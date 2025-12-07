# MiniProjectAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## JSON-Server (mock backend)

This project uses `json-server` as a simple REST API for development. A `db.json` file is included with `categories`, `products`, and a mocked `users` collection for authentication.

Start the mock API in a separate terminal from the project root:

```powershell
cd "mini-project-angular"
npm run start:api
```

The API will run at `http://localhost:3000/`.

Endpoints of interest:
- `GET /categories`
- `GET /products`
- `GET /products?categoryId=1` (filter by category)
- `POST /products`, `PUT /products/:id`, `DELETE /products/:id`

Authentication is mocked via the `users` collection in `db.json`; the frontend will send credentials and the application will validate them against the `users` resource.

## Run the app

1. Install dependencies (from project root):

```powershell
cd "mini-project-angular"
npm install
```

2. Start the mock API:

```powershell
npm run start:api
```

3. In another terminal, start the Angular dev server:

```powershell
npm start
```

Open `http://localhost:4200/` in your browser.
