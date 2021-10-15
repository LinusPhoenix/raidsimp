# TODOs

# Frontend

- Solve the key issue in the add raider dialog
- Improve look of raid team list page
- Add a better page for when there are no raid teams / no raiders in a raid team
- Login integration
- Authenticate API calls
- Logout

# Backend

- Improve classes by having a constructor accept a `classOptions` object, which is an interface that contains all the class's properties (see https://github.com/blizzapi/blizzapi/blob/master/src/classes/BlizzAPI.ts for an example of what I mean)
- Implement the raider overview endpoint
    - Missing: enchants check
    - Unclear whether enchants will be processed on backend with a boolean for the frontend or full enchant information for the frontend which determines whether anything is missing
- Replace console with actual logging
- Unit tests
- E2E tests
- Figure out deployment / hosting (protect the API with basic auth if user awareness is still missing)
- Add auth
    - Login endpoint (bnet via oauth2)
    - Protect the rest of the endpoints (oauth2)
- Make raid teams user-specific
- Invite other users (full permissions)
- Add user management
    - Change Password
    - Forgot Password
    - Delete Account
- Add login via google and battle net
- Add endpoint for checking if a raid-team name is available
- Figure out hosting
- Write a README appropriate for github

# Other Notes

## Raider Overview Model

- Character Portrait
- Character Name
- Character Realm
- Raider Role
- Character Class
- Character Spec
- Character Average Item Level
- Missing Enchants / Gems (Yes / No)
- Lockouts for latest raid tier
- Covenant
- Renown

## Raider Details Model

- Character equipment per slot
- Detailed enchants
- Vault contents & mythic+
- Covenant Traits
- Reputation (relevant ones for the tier)