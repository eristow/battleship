# TODO:

- [] Change README from boilerplate to project-specific
- [] Change DB board type to just `{ size: number, grid: Cell[][] }`
  - This is to accurately represent the board in the DB
- [] Change `ShipConfig` type and `Ship` class to have the same properties
  - This is to make it easier to convert between the two
  - NOTE: I feel like the two should be the same thing
- [] Implement making a move
  - [] Implement `Game` service method `makeMove`
  - [] Implement `Board` class method `receiveAttack`
- [] Add validation for ship placement
  - [] Implement `Board` class method `placeShip`
  - [] Ships can't overlap
  - [] Ships can't be placed off the board
- [] Create enums and validation for ship types (name, length)
  - [] Create enums
  - [] Implement validation
- [] Improve error response from validating ship placement
  - Return what ships are invalid and how
- [] Make usernames unique?
  - Use usernames as primary key instead of ID

# DONE:

- [x] Setup local PSQL server
  - Docker or not? (Maybe not at first)
- [x] Install DBeaver
- [x] Install Docker Desktop
