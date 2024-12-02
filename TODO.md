# TODO:

- [ ] Change README from boilerplate to project-specific

- [ ] Fix relationship between grid and ships in `Board` class
  - There is no way to know which ship is in a cell with the state `SHIP`

- [ ] Add validation for ship placement
  - [ ] Actually place ships in the board's grid
  - [ ] Ships can't overlap
  - [ ] Ships can't be placed off the board

- [ ] Implement making a move
  - [ ] Implement `Game` service method `makeMove`
  - [ ] Implement `Board` class method `receiveAttack`

- [ ] Create enums and validation for ship types (name, length)
  - [ ] Create enums
  - [ ] Implement validation

- [ ] Improve error response from validating ship placement
  - Return what ships are invalid and how

- [ ] Make usernames unique?
  - Use usernames as primary key instead of ID

# DONE:

- [x] Change DB board type to just `{ size: number, grid: Cell[][], ships: Ship[] }`
  - This is to accurately represent the board in the DB
- [x] Change `ShipConfig` type and `Ship` class to have the same properties
  - This is to make it easier to convert between the two
  - NOTE: I feel like the two should be the same thing
- [x] Setup local PSQL server
  - Docker or not? (Maybe not at first)
- [x] Install DBeaver
- [x] Install Docker Desktop
