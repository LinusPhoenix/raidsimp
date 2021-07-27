# TODOs

# Frontend

- Create the frontend application (use `create-react-app`)
- Find a theme / template we can use
- Create an overview of pages we need

# Backend

- Add role/character combination validation (e.g. you cannot create a mage character with the healer role)
- Implement the raider overview endpoint
    - Missing: enchants check and lockout info
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