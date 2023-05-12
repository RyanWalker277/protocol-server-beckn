# Beckn Protocol Server

This folder contains the properly setup client and network facing instances of the protocol server to act as a BFF for the Konnect Beckn Provider Platform (BPP) for crop loans.

The code for both the instances of the protocol server is taken from [here](https://github.com/beckn/protocol-server/tree/v2).

## Some things to keep in mind while using the protocol server

1. Make sure that both the client and network facing instances of the protocol server are running on the same machine.
2. For accessing the Beckn Gateway, you need to call the client facing APIs.
3. The network facing instance will be the default BAP for the requests routed via this protocol server. Add this instance as a network participant on the official beckn regsitry [here](https://registry.becknprotocol.io).

## Things to keep in mind while onboarding on the Beckn Registry

1. Make sure that you add the status as `SUBSCRIBED` in the network role configuration.
2. Make sure to generate and add your public keys to the beckn registry with the status of `VERIFIED` and a good enough expiry period.


## How to run
1. Clone this repository locally
2. cd into client and network folders separately
3. Make sure you are using node >= 16.
4. Run `npm install` in both folders
5. Run `npm run dev` in both folders

Voila! You have the protocol server up and running.
