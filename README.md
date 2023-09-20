# Edu-Sims Monorepo

This repository contains a monorepo setup for the Edu-Sims project, which includes a React client and an Express server.

## Getting Started

### Prerequisites

- Ensure that you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed on your system.

### Installation

To install all the necessary dependencies, run the following command from the root of the project:

```sh
pnpm install
```

This will install all dependencies for both the client and the server.

### Available Scripts

From the project root, you can run the following scripts using `pnpm run <script_name>`:

`dev`: Starts both the client and the server in development mode.
`dev-client`: Starts only the client in development mode.
`dev-server`: Starts only the server in development mode.

Example, to start both the client and server, run:

```sh
pnpm run dev
```

### Project Structure

The project is structured as a monorepo with two main packages:

`apps/client`: React client, bootstrapped with `Vite`.
`apps/server`: Express server.

### API Proxy

A proxy has been set up in the Vite configuration. This means that API calls from the client with paths starting with `/api` will be automatically proxied to the server.

Example, a fetch requesdt in the client to `/api/hello` will be handeled by the server route `/hello`.
