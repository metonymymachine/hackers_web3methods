# Web3modal Implementation for Hackers PFP

####  create ./src/.env and put the value PRIVATE_KEY in there 

## Generating clean data
#### we have two types of inputs, one for the allowlist and one for the cyclops holders
#### we convert the raw data into formated data with the following command
`npm run format:whitelist` 

## Generating clean whitelists

## Command to generate after above step

`npm run sign` 
 ##### Should output two json files with hashes and signature



--------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Creating bundled file for frontend
#### Above steps need to be done first!

`npm run prod:build` for production

##### should output dist/bundlefile to be used in frontend
