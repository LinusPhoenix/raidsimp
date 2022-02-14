# Frontend

- BUG: Light / Dark switch sets font to black
- Remove light mode toggle
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
- Delete account confirmation dialog: Have the user type "permanently delete" to confirm
- Share component for raid teams
  - Add/remove battletags
  - Set permissions to read-only/full
- Change branding to raidsimp
- Create a raidsimp logo
- Run npm-check on the dependencies

# Backend

## Missing Functionality

- Implement the raider overview endpoint
  - Missing: enchants check
  - Unclear whether enchants will be processed on backend with a boolean for the frontend or full enchant information for the frontend which determines whether anything is missing
- Figure out deployment / hosting (protect the API with basic auth if user awareness is still missing)
  - Get a LetsEncrypt certificate
  - Deploy
- Invite other users (read-only permissions)
  - access: owner, read-only, or full
  - GET /raid-teams/:raidTeamId/collaborators/
  - PUT /raid-teams/:raidTeamId/collaborators/:battleTag
  - DELETE /raid-teams/:raidTeamId/collaborators/:battleTag
  - Does the user have to exist for somebody to invite them?
- Look into CSRF protection

## Improvements

- Improve classes by having a constructor accept a `classOptions` object, which is an interface that contains all the class's properties (see https://github.com/blizzapi/blizzapi/blob/master/src/classes/BlizzAPI.ts for an example of what I mean)
- Replace console with actual logging
- Middleware for logging incoming requests and outgoing responses
- Unit tests
- E2E tests
- Write a README appropriate for github
  - Explain deployment process specifically
- Rename repository to raidsimp and make it public
- Make raid-teams at least read-only automatically if you have a character in that raid team
  - Users can add characters to their account so we know that it belongs to them

## Bugs

- Renaming a raid team does not immediately change the displayed name because of caching.
