# TODO:

- [ ] Change README from boilerplate to project-specific

- [ ] Deploy to AWS
  - [ ] Fix CD pipeline
    - Should deploy using correct ECS cluster
  - [x] Connect to RDS with DBeaver
  - [x] Figure out Application Load Balancer
  - [x] Figure out CloudWatch log groups
  - [x] Setup ECS cluster
  - [x] Deploy app
  - [x] Deploy PSQL
	- [x] Add deployment to CI/CD pipeline

# STRETCH GOALS:

- [ ] Ensure app is using SSL
  - [ ] To connect to RDS
    - https://stackoverflow.com/a/78269214/28325682
  - [ ] For between the app and LB
  - [ ] For between the LB and the client

- [ ] Add user authentication?
  - https://docs.nestjs.com/security/authentication
  - [ ] Implement JWT
  - [ ] Implement user registration
  - [ ] Implement user login
  - [ ] Implement user logout
  - [ ] Implement user authentication middleware
  - [ ] Protect endpoints with authentication middleware
    - Create/join/delete game
    - Make move
  
- [ ] Combine `CreateGameDto` and `JoinGameDto` into `CreateGameDto`

- [ ] Reduce code duplication between `createGame` and `joinGame`

- [ ] Split up `Game` service

- [ ] Add logging for services and classes (app-level logging)

- [ ] Use CloudFormation or TF to define infra?

# DONE:

- [x] Use AWS RDS instead of PSQL container?
- [x] Add CI/CD pipeline
  - [x] GitHub Actions
  - [x] Linting
  - [x] Testing
  - [x] Building
- [x] Tests:
  - [x] Add unit tests for `User` controller
  - [x] Add unit tests for `User` service
  - [x] Add unit tests for `MoveResult` class
  - [x] Add unit tests for `Ship` class
  - [x] Add unit tests for `Board` class
  - [x] Add unit tests for `Game` controller
  - [x] Add unit tests for `Game` service
- [x] Add healthcheck endpoint to app
  - [x] Implement healthcheck endpoint
  - [x] Add healthcheck to Dockerfile
  - [x] Add healthcheck to docker-compose
- [x] Prevent game from being created with non-existent user
- [x] Containerize the app
  - [x] Setup hot reloading
  - [x] Ensure app runs after db
  - [x] Create Dockerfile
    - [x] NestJS app
    - [x] PSQL server
  - [x] Create docker-compose file
- [x] Add logging
  - [x] Log all requests
  - [x] Log all responses
  - [x] Log all errors
- [x] Create enums and validation for ship types (name, length)
  - [x] Prevent users from providing `currentHits` in ship placement
  - [x] Create endpoint for listing available ships
  - [x] Create enums
  - [x] Implement validation
  - [x] Change ship placement to use ship type instead of length
  - [x] Ship placement array should have exactly 5 ships, only 1 of each type
- [x] Improve error response from validating ship placement
  - Return what ships are invalid and how
- [x] Add validation for hitting the same cell twice
  - Should return an error
- [x] Add validation for making a move on a game that isn't ready yet
- [x] Add validation for trying to make a move on a game that is over
  - Should return an error
- [x] Add deleting game functionality
  - [x] Implement `Game` service method `deleteGame`
  - [x] Create endpoint in `GameController`
- [x] Create endpoint to list all games for a user
  - [x] Implement `User` service method `getGamesForUser`
  - [x] Create endpoint in `UserController`
- [x] Create endpoint for finding a game by ID
  - [x] Implement `Game` service method `findById`
  - [x] Create endpoint in `GameController`
- [x] Make usernames unique?
  - Use usernames as primary key instead of ID
- [x] Implement making a move
  - [x] Implement `Game` service method `makeMove`
  - [x] Implement `Board` class method `receiveAttack`
- [x] Fix relationship between grid and ships in `Board` class
  - There is no way to know which ship is in a cell with the state `SHIP`
- [x] Add validation for ship placement
  - [x] Actually place ships in the board's grid
  - [x] Ships can't overlap
  - [x] Ships can't be placed off the board
- [x] Change DB board type to just `{ size: number, grid: Cell[][], ships: Ship[] }`
  - This is to accurately represent the board in the DB
- [x] Change `ShipConfig` type and `Ship` class to have the same properties
  - This is to make it easier to convert between the two
  - NOTE: I feel like the two should be the same thing
- [x] Setup local PSQL server
  - Docker or not? (Maybe not at first)
- [x] Install DBeaver
- [x] Install Docker Desktop
