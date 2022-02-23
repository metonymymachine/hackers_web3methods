# Web3modal Implementation for Cyclops PFP

## Generating whitelist with allowed limit

####  Edit ./src/whitelistAddresses
####  Replace PRIVATE_KEY in ./src/.env
####  Update wallet address with its specific amount allowed

## Command to generate after above step

`npm run sign` 
 ##### Should output json file with hashes and signature



--------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Creating bundled file for frontend
#### Above steps need to be done first!

`npm run prod:build` for production

##### should output dist/bundlefile to be used in frontend
