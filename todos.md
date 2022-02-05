# Frontend

- BUG: Light / Dark switch sets font to black
- Solve the key issue in the add raider dialog
- Improve look of raid team list page
- Add a better page for when there are no raid teams / no raiders in a raid team
- Add a login dialog
  - No token cookie => Redirect to login
  - Token cookie => Redirect to raid teams page
- Add a home page
- Fix eslint issues
- Raid team page: In "No. of Raiders per Role", Ranged DPS line-wraps in an ugly way
- Implement footer
  - Create email address for project
  - Create twitter account for project?
  - Create discord for project
  - Create Ko-fi for project
  - Improve styling

# Backend

## Missing Functionality

- Implement the raider overview endpoint
  - Missing: enchants check
  - Unclear whether enchants will be processed on backend with a boolean for the frontend or full enchant information for the frontend which determines whether anything is missing
- Figure out deployment / hosting (protect the API with basic auth if user awareness is still missing)
- Invite other users (read-only permissions)
  - access: read-only or full
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
