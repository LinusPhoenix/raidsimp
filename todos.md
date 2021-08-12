# TODOs

# Frontend

- Improve styling of pages
- Integrate wowranks.io API into add raider dialog to provide autocomplete for character name / realm
- Make raider overview prettier (ilvl colors, lockout progress colors)
- On raid overview, move "add raider" / "delete raider" buttons to the top right
- Make data grid's column width more flexible (don't hardcode width everywhere, use minWidth and flex instead)
- Add charts and other visualizations to raid team page (roles / classes / specs)
- Improve look of raid team list page
- Move "new team" button to the top right
- Set page title for each page (or at least one appropriate static one)

# Backend

- Storing the most recent raid tier doesn't really work
- Improve classes by having a constructor accept a `classOptions` object, which is an interface that contains all the class's properties (see https://github.com/blizzapi/blizzapi/blob/master/src/classes/BlizzAPI.ts for an example of what I mean)
- Implement the raider overview endpoint
    - Missing: enchants check
    - Unclear whether enchants will be processed on backend with a boolean for the frontend or full enchant information for the frontend which determines whether anything is missing
- Implement the raider details endpoint
- Unit tests
- E2E tests
- Figure out deployment / hosting (protect the API with basic auth if user awareness is still missing)
- Implement user awareness
- Add login via google and battle net
- Add endpoint for checking if a raid-team name is available

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