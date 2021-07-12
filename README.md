![Impel](https://raw.githubusercontent.com/kinshukkar/impel/main/docs/impel.png "Impel")

# Impel

Impel is an innovative solution uniquely designed to help motivate people and communities to become fitter by providing an incentivized approach both from a financial as well as social rewards.

It does so by leveraging the power of blockchain technology specifically the powerful and exhaustive N3 platform to lay out a decentralized smart contract to manage the financial commitments to challenges as well as the rewards and NFT Tokens also managed on N3 for the intangible social rewards via Winner's badges.

Key concepts and flows around the Impel solution - 
- At the core of the solution is the concept of Challenges. These will be system generated and managed and will be focused around various activities, walking/running to begin with. Challenge could be of different types, achieve a maximum target in a single activity or cross a target in aggregate over the challenge period.
- User would sign-in to the solution using the Neoline wallet that will manage the N3 account for the user.
- They will see the list of challenges that are active at the particular moment. Users would be free to join a particular challenge based on their interest. 
- Joining a challenge would involve committing an amount towards the challenge. The currency used here would be the GAS Native Token for it's divisibility and utility. No new NEP-17 token is introduced as there is no additional utility that would bring to the system. 
- There would also be a cap of 50 GAS placed on the commitment amount to reduce the impact of the system being unfairly used.
- The committed amount would be transferred to the Smart Contract and would be used as to join the challenge. This would again by interfaced via the Neoline wallet plugin for its transparent interface in terms of amount transfers.
- All other system-based interactions with the N3 Network would be managed by the Neon-JS library
- Once, the amount is locked in to the contract, there would no action required from the user towards the challenge till the Challenge end date arrives.
- After the challenge ends, the user would be provided a sufficient period of time to submit their activity details. This will be managed by the standard backend server that would integrate with Strava to retrieve the activity records for the user. There would be no manual input of the activity records permitted on the system. Eventually, other popular systems would be integrated with the solution. 
- Once the submission period ends, the system will begin evaluation of the challenge entries to determine the winnerd of the particular change. For users who did not submit their activity records on the system, their committed amount would be forfeited. 
- The complete validation of the challenge winners would be done by the Impel Smart Contract in an automated manner. It will retrieve the normalized activity records from the Impel Backend via an Oracle request.
- Once the determination of the challenge winners is determined by the system, payouts will be made to the winning users by the Smart Contract. The payout would be 20% more than the committed amount for the user. 
- Along with the bonus payout for the winners, a NFT Token would also be generated and associated with the user's account. This would serve as badges for winning the various challenges and would be displayed on the system. The Impel Token as it is termed will follow the NEP-11 NFT interface

### Challenge Lifecycle

![Challenge Lifecycle](https://raw.githubusercontent.com/kinshukkar/impel/main/docs/challenge_lifecycle.png "Challenge Lifecycle")

## Team 
- Kinshuk Kar [Twitter](https://twitter.com/kinshukkar)
- Pompita Sarkar [Twitter](https://twitter.com/sooperminion)

## Pitch

- Impel is a novel solution that combines all the powerful features of the N3 platform to provide a comprehensive, real-world solution for the end-users.
- Seeks to promote the usage of GAS as a currency.
- Utilizes NFT Tokens to incentivize winners of the challenge to promote a sense of accomplishment along with the financial incentives provided.
- Utilizes Oracles to retrieve interface with the APIs but keeps the core execution and evaluation pieces within the Smart Contract on the blockchain.
- Integrated frontend interface implemented for the dapp powered by Neoline wallet for user actions and Neon JS for system activities over the smart contract.
- External system integration [Strava] as a source of truth to reduce/eliminate spurious usage of the app. Implemented as part of the Planation Submission Feedback
- Sustainable and engaging economic model built-in to the system that can be extended to offer variations as well in the future. Again, this was refined as a result of the Planation Submission Feedback

## Economic Model

The economic model behind the solution is presented below - 

We will try to derive a simplistic unit-based economic scenario to determine the feasibility of the solution - 

Setup: 100 units are contributed towards a particular challenge
Assumption: Amount committed is proportional to the number of users in a challenge, i.e there is a consistent average amount that is committed per user. 

Users won: **60% [60 units]**
Users lost: **35% [35 units]** - Amount forfeited by the system
Users not submitted: **5% [5 units]** - Amount forfeited by the system

Payout based on 60% winners including bonus - **60*1.2 = 72 units**
Average costs of running the system [Blockchain interactions, Server/System maintenance] - **20% or 20 units**

Profit margin **[100 - (72 - 20)] = ~8%**

Thus, the system would sustainable from a financial perspective. 

As mentioned in the roadmap, the model would be further enhanced to incorporate these factors to determine the most optimum payouts and system based on %age of winners, challenge commit amounts, running costs, etc.

## Architecture

![Impel Architecture](https://raw.githubusercontent.com/kinshukkar/impel/main/docs/arch.png "Architecture")

## Solution

### SmartContract

There are 2 Smart Contracts that are part of the project

**Impel.ImpelSCv1.0** (The primary smart contract)
Contract Hash - **0x534efcbc737526e49a158355a134fc317db3b406**

**Impel.ImpelTokenv1.0** (The NFT smart contract)
Contract Hash - **0xdfa3dca56168dd9a9ed96e247def777af4166de2**

#### ImpelSC

There is a class `ImpelStorage` for managing the data and supporting the CRUD service layer.

There are 3 main objects in the system `Challenge`, `User`, and `UserChallenge`

`Challenge` objects can only be created by the contract owner and has then necessary details. `challengeActivityType` would be used for the various types of activities (beginning with Walk/Run data). `challengeType` would represent how the challenge is evaluated (Two types are currently supported - Max in an activity and Aggregate across the challenge period). This is used to determine the challenge winners along with the `challengeValue` field. The `challengeState` field is used to track the lifecycle of the challenge, whether it has not started, currently active, ended and submission going on, and evaluation completed

`User` object stores the username against their address when they register via `createUser`

`UserChallengeEntry` stores the mapping between the User and Challenge object once they join a particular challenge. It stores the committed ammount in GAS along with the user and challenge references. It also contains the `state` field that would trace the submission and evaluation states for a challenge for the particular user.

##### Joining a challenge
Users would join a challenge by transferring GAS token (which becomes the committed amount for the challenge) to the Smart Contract address. 
The arguments that need to be passed to the `transfer` call are `['join_challenge', <challenge_id>]` 
This is implemented in the `OnNEP17Payment` callback and managed by the Neoline extension on the frontend 

##### Challenge Lifecycle
`updateChallengeState` method is used to manage the lifecycle of the challenge. It checks and update the state of the Challenge based on the current timestamp. 
This would be invoked as a daily cron job from the backend (Yet to be implemented)

During the state when the challenge is `ChallengeStateActive` there would be no interaction from the user or the smart contract till the endTime of the challenge is reached

After the challenge `endTime` has crossed the challenge would move to `ChallengeStateCompleted`. Now the user would be able to submit the entries for the challenge. The data for each user will not go into the Smart Contract but would be managed by the backend. Submission would be allowed for a period of 15 days from the challenge ending and that is denoted by the `evaluationTime` field. The UserChallengeState will also be updated to reflect that data has been submitted.

##### Challenge Evaluation
Once the challenge evaluationTime has crossed, the evaluation process will begin. Here are the steps that would be triggered by the system contract owner - 

`fetchChallengeEntries` - The first step would be fetching the activity records from the backend via an OracleRequest. The data would be of the form of `Map<String, List<BigInteger>>` where the key is the user address and the value is a list of all activity entries denoted as integer representing the distance travelled in case of Walk/Run Challenge implemented.

`evaluateChallengeEntries` - After the records are fetched, the evaluateChallengeEntries method would be triggered. This would iterate over all the entries for a particular challenge, look at their activity records  from the Oracle Response Map and then perform the evaluation logic based on the activity records and the type of activity. The method would just update the `UserChallenge` Record with the appropriate state of `DataSubmittedQualified` or `DataSubmittedNotQualified`
 
##### Rewards 
The final step in the process would be the distrubution of the rewards based on the status determined above. 

`distributeRewards` - It would iterate over all the winning entries of the challenge and transfer the commmitted GAS back to user including a **20%** bonus. 
It would also mint the IMPT Token NFT corresponding to the Challenge and assign it to the user.
 
### Frontend
   * React Web App built with `React 16.9.0 and Redux Saga` (to make app side effects more efficient to manage and handle)
   * Includes a built-in Auth layer, that logs in a user into the system after connecting to Neo Wallet, and authenticates by checking whether the user is registered into the system.
   * Makes use of NeoLineN3 extension as an interface to connect to Neo Wallet.
   
```
              // to initialise NeoLine
              window.addEventListener('NEOLine.N3.EVENT.READY', () => {
                const n3 = new NEOLineN3.Init();
                console.log('inside login', n3);
                setN3Data(n3);
              });
              // to get address
              neolineN3.pickAddress()
                .then(result => {
                    const { label, address } = result;
                    console.log('label:' + label);
                    console.log('address' + address);
                })
                .catch(({type: string, description: string, data: any}) => {
                    switch(type) {
                        case 'NO_PROVIDER':
                            console.log('No provider available.');
                            break;
                        case 'CANCELED':
                            console.log('The user cancels, or refuses the dapps request');
                            break;
                    }
                });
                 /*Example response*/
                {
                    label: 'N3-Name',
                    address: 'NfuwpaQ1A2xaeVbxWe8FRtaRgaMa8yF3YM'
                }
```
     
   * [This](https://neoline.io/dapi/N3.html) document has been used to refer to NeoLineN3 apis.
   * After successful authentication, user is redirected to their home page, where they can see all 'Active Challenges', 'Joined Challenges' and 'Your Badges' (badges earned from winning a challenge, if any)
   * [NeoJS](https://dojo.coz.io/neo3/neon-js/) library has been used to interact with Smart Contract. This file can be found in `/client/app/utils/neon.js`.
   * Simple example for usage of NeoJS - 
   *
         const createUser = (userAddress, username) => {
            return createTransaction(config.account, config.impelScriptHash, 'registerUser', [
              sc.ContractParam.string(userAddress),
              sc.ContractParam.string(username),
            ]);
          };
    
### Backend

The backend layer is implemented via a `node-js` app. It is primarily to manage the authentication pieces with STRAVA using OAuth2. Once authenticated, it would fetch all the activity records within the given challenge period via the Strava List Activities method - https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities
This is done in the backend to normalize all the records for easy consumption for the smart contract as well as keeping the interface consistent as more integrations would be added later.
The records data are stored in mongodb instance under `challenges` collection and would keep storing the activity records via the Strava APIs above as and when people submit their records during the submission periond after the challenge ends.

### Open Issues

- Error in fetching tokens list  for a user from the NFT Contract - Interop iterator
- Validation of aggregate type challenges fails for certain scenarios
- State validations for joining a challenge to be added

## Roadmap

- Introduce more type of challenges and variable rewards
- Include more types of activities for the challenges
- Improve the economic governance model and make it completely on-chain to determine the best payouts/ rewards to end-users while keeping in mind the incentives for  the dapp
- Integrate with solutions other than Strava to improve reach
- Introduce challenges in the setting of closed user groups instead of just global chalenges
- Make improvements in the NFT model to incorporate levels and growth with consistency 
- Introduce notifications to prod users to complete challenges
- Potential to evolve beyond just the fitness and health domain to other similar setups - Like motivation for tasks/micro-tasks, learning languages, reading books, etc.
- Could evolve to become an ecosystem where traditional apps can connect with the system and setup incentivized challenges on top of their systems to drive engagement

## License
Apache License, Version 2.0
