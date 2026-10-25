Deprecated: Please track todos as issues on the github repo.

# Frontend

# Backend

## Missing Functionality

## Improvements

## Bugs

# Data changes needed per patch

- Ilvl color thresholds: edit the rows of the `ilvl_threshold` table in the backend database (no redeploy needed), e.g. `UPDATE ilvl_threshold SET ilvl = 300 WHERE color = '#e6cc80';`
- Ilvl thresholds can also be edited in the frontend admin panel (`/admin`), which is only available to battletags listed in the `admin` table: `INSERT INTO admin(battletag) VALUES ('Name#1234');`
