# About

Guitargekis are competitive events where guitarists submit audio/video performances of a pre-chosen theme/song. Currently, all events are manually managed in a private Discord server.

Technologies:
 - Docker
 - API: Node.js running hapi framework
 - Database: PostgreSQL
 - Proxy: NGINX
 - Front end: Single page React app

External services:
 - Auth: Auth0
 - CI/CD: GitLab CI
 - Hosting: DigitalOcean (backend) and Firebase (frontend and secrets database)
 - Database backups: GitHub

Features:
 - Elo rating system
 - Event, match and submission archive 
 - API rate limiting
 - Route auth
 - Logging user requests and internal errors to an external endpoint
 - Auto-generated Swagger documentation