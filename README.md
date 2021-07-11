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
