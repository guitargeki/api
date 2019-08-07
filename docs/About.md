# About

Guitargekis are competitive events where guitarists submit audio/video performances of a pre-chosen theme/song. At the end of each match or event, a panel of judges will vote for their favourite submission or rate each submission. The winner is the submission with the highest number of votes or rating. Currently, all events are manually managed in a private Discord server.

The two main reasons for developing this API were to:
 - Archive all submissions in case of server shutdown.
 - Assign each participant a ranking using some sort of rating system.

The main features of the API are:
 - Elo rating system
 - Authentication and authorization using JWTs
 - Rate limiting
 - Auto-generated Swagger documentation

The rest of this document will go into detail about technologies used, why I chose them and things I tried before landing on a solution.

# Technologies

## Containerization: Docker

## Back End: Node.js

 - Originally used Express framework
 - Originally wrote Swagger manually to generate endpoints

## Database: PostgreSQL

Originally wrote site as a static site with Google Sheets as a database

## Reverse Proxy: NGINX

## Front End: React

## Authentication/Authorization: Auth0

## CI/CD: GitLab

## Hosting: DigitalOcean and Firebase

## CDN: Cloudflare

## Secrets Management: Custom

 - Secrets originally stored as plaintext then encrypted in repo.
 - Also tried storing in GitLab CI environment variables.