# TODO:

- [ ] Change README from boilerplate to project-specific

- [ ] Create endpoint for finding a game by ID
  - [ ] Implement `Game` service method `findById`
  - [ ] Create endpoint in `GameController`

- [ ] Add validation for hitting the same cell twice
  - Should return an error

- [ ] Create enums and validation for ship types (name, length)
  - [ ] Create enums
  - [ ] Implement validation
  - [ ] Create endpoint for listing available ships
  - [ ] Change ship placement to use ship type instead of length

- [ ] Improve error response from validating ship placement
  - Return what ships are invalid and how

- [ ] Add user authentication?
  - https://docs.nestjs.com/security/authentication
  - [ ] Implement JWT
  - [ ] Implement user registration
  - [ ] Implement user login
  - [ ] Implement user logout
  - [ ] Implement user authentication middleware

# DONE:

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
