# TODO:

- [] Change README from boilerplate to project-specific
- [] Create config service
  - [] Add board size
  - [] Add ship sizes, types, etc?
- [] Implement `Game` controller method `makeMove`
  - [] Implement `Board` model method `receiveAttack`
- [] Add validation for ship placement
  - [] Implement `Board` model method `placeShip`
  - [] Ships can't overlap
  - [] Ships can't be placed off the board
- [] Improve error response from validating ship placement
  - Return what ships are invalid and how
- [] Make usernames unique?

# DONE:

- [x] Setup local PSQL server
  - Docker or not? (Maybe not at first)
- [x] Install DBeaver
- [x] Install Docker Desktop
