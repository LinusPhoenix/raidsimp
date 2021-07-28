# TODOs

# Frontend

- Find a color palette for dark / light theme we want to use
- Create an overview of pages we need
- Create a base layout for the website

# Backend

- Add role/character combination validation (e.g. you cannot create a mage character with the healer role)
- Lockout: Get most recent expansion and raid dynamically instead of having to hardcode it
    - Step 1: Take the most recent expansion id from the "Journal Expansions Index" endpoint
    - Step 2: Take the expansion id and use it in the "Journal Expansion Summary" endpoint, then take the id of the most recent raid from the raid array
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