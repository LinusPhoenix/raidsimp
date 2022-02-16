# Frontend

- BUG: Light / Dark switch sets font to black
- Solve the key issue in the add raider dialog
- Improve look of raid team list page
- Add a better page for when there are no raid teams / no raiders in a raid team
- Add a home page
- Fix eslint issues
- Raid team page: In "No. of Raiders per Role", Ranged DPS line-wraps in an ugly way
- Implement footer
  - Create email address for project
  - Create twitter account for project?
  - Create discord for project
  - Create Ko-fi for project
  - Improve styling
- Create a raidsimp logo
- Run npm-check on the dependencies
- Add raider dialog
  - Add button for "Add another" to bring up the dialog again
  - Suggest roles for classes
  - Radio group instead of dropdown for roles?
- Raider DataGrid
  - Central button for toggling column visibility
  - Store visibility toggle in local storage so it persists between refreshes
- Raid Teams Page: EU/US/KR/TW flags instead of letters

# Backend

## Missing Functionality

- Implement the raider overview endpoint
  - Missing: enchants check
  - Unclear whether enchants will be processed on backend with a boolean for the frontend or full enchant information for the frontend which determines whether anything is missing
  - Add something that can replace renown as a column
- Look into CSRF protection

## Improvements

- Improve classes by having a constructor accept a `classOptions` object, which is an interface that contains all the class's properties (see https://github.com/blizzapi/blizzapi/blob/master/src/classes/BlizzAPI.ts for an example of what I mean)
- Middleware for logging incoming requests and outgoing responses
- Unit tests
- E2E tests
- Write a README appropriate for github
- Rename repository to raidsimp and make it public
- Make raid-teams at least read-only automatically if you have a character in that raid team
  - Users can add characters to their account so we know that it belongs to them
- Raid team create / rename: trim name and check if non-empty

## Bugs

# Data changes needed per patch

- Ilvl color thresholds in `frontend\src\config\current-tier-config.ts`
