# QUICK SPIN UP OF A READMED

## Why is there no single executable file?
The project had to be broken down into several smaller microservices that connect with each other to create the full application. Because of this, each microservice requires installing the correct packages before running.

Another main reason for why there is no single executable file is because the environment variables regarding the blockchain network need changing depending on the machine being used. This needs to be done manually to point to the correct TLS certificate files and private/public keys. 

## Description of the Folders Submitted:
- <code>wallet_guru</code> folder: This folder contains the code for the frontend (mobile app). 
- <code>testing</code> folder: These contain some tests regarding the Recurrence Rule class and for the blockchain tests.
- <code>middlewareAPINonPersistent</code> folder: This folder contains the code for ExpressJS API. However, this is not used for the actual application. This was used during development to speed up the initialisation instead of having to take a long time starting up the blockchain network. As in the name, this development API uses non-persistent storage. This API was used mainly to test the frontend in a way that simulates the app working.
- <code>middlewareAPI</code> folder: This is the ExpressJS API that is used by the running application.


## Steps To Get The Project Fully Running


## Prerequisites:
- It is required for you to be connected to WiFi (no hotspots, must be WiFi).
- It is required to know your private WiFi IP Address.
- Maybe more.


### Getting An Android Emulator
- Install Android Studio.
- Follow the on-screen instructions with default installation settings until you see the welcome page.
- Click on More Actions --> Virtual Device Manager
- Click on the "+" button at the top left of the "Device Manager" window.
- Select any phone.
- Click "Next" and then "Finish"
- Click on the play icon and this should start the Android Emulator.


### Changing The Environment Variables For Your Machine
Inside the folder <code>wallet_guru</code>:
- The environment variable <code>EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS</code> has 2 parts to it, an IP address and a port number. Leave the port number, change the IP address to your own IP address. The space to change has been marked with "*****".

Inside the folder <code>middlewareAPI</code>:
- The environment variable <code>IP</code> has been marked with "*****". Change it to yur IP address.
- Then there are 4 sets of environment variables, one for each peer.
- For each peer, there are 3 environment variables that need changing.
  - <code>PEER[x]_KEY_DIRECTORY_PATH</code>: This is the private key directory for the specific peer. Relative to the <code>fabric-ca</code> directory, it's path is <code>fabric-ca/peerorg/peer[x]/msp/keystore</code>. Find the directory and copy the absolute path to it. x is the number of the peer between 1 and 4.
  - <code>PEER[x]_CERTIFICATE_DIRECTORY_PATH</code>: This is the signed certificate for the specific peer. Relative to the <code>fabric-ca</code> directory, it's path is <code>fabric-ca/peerorg/peer[x]/msp/signcerts</code>. Find the directory and copy the absolute path to it. x is the number of the peer between 1 and 4.
  - <code>PEER[x]_TLS_CERTIFICATE_PATH</code>: This is the TLS certificate for the specific peer. Relative to the <code>fabric-ca</code> directory, it's path is <code>fabric-ca/peerorg/peer[x]/tls-msp/tlscacerts/tls-0-0-0-0-7052.pem</code>. Find the file and copy the absolute path to the environment variable. x is the number of the peer between 1 and 4.
- Below the environment variables for the 4 peers, there are more variables that need altering. These are specifically for the user to be registered and enrolled to the Certificate Authority.
  - <code>CA_TLS_CERT_PATH</code>: Relative to the <code>fabric-ca</code> directory, it's path is <code>fabric-ca/peerorg/ca/crypto/ca-cert.pem</code>. Find the file and copy the absolute path to the environment variable.
  - <code>ADMIN_SIGNCERT</code>: Relative to the <code>fabric-ca</code> directory, it's path is <code>fabric-ca/peerorg/admin/msp/signcerts/cert.pem</code>. Find the file and copy the absolute path to the environment variable.
  - <code>ADMIN_KEYPATH</code>: Relative to the <code>fabric-ca</code> directory, it's path is <code>fabric-ca/peerorg/admin/msp/keystore/[NAME OF KEY OMITTED]</code>. Find the file and copy the absolute path to the environment variable.

### Downloading Expo Go To Run The Mobile App
- Navigate to the <code>wallet_guru</code> folder via a terminal. For Windows, use PowerShell.
- Run the command <code>npm install</code>
- Run the command <code>npx expo start</code>
- When the initialisation process done by Expo is complete, press "a".
- The terminal window will then give you a choice of install Expo Go on the Android Emulator, proceed with it.
- Expo Go should open automatically once downloaded and complete.
- If the app does not open, press "a" again in the terminal window and it should open.


### Running The Blockchain
- Install docker and docker-compose.
- Follow the instructions regarding the installation of those. The default installation settings should be fine.
- On Windows, IT IS IMPERATIVE TO LEAVE THE DOCKER WINDOW OPEN DUE TO A KNOWN BUG.
- On a separate terminal window, navigate to <code>middlewareAPI</code> --> <code>blockchain-network</code> --> <code>config-files</code>
- Run the command <code>docker-compose -f docker-compose-fabric-ca.yaml up -d</code>. This command starts up the Certificate Authorities.
- If this is the first time you run the command, it may take a few minutes for the images to be pulled.
- Run the command <code>docker-compose up -d</code>. This command runs the peers, orderers and a dedicated bash terminal.
- If this is the first time you run the command, it may take a few minutes for the images to be pulled.
- Run the command <code>docker exec -it cli-peer1 bash</code>. This command will let you access the dedicated bash terminal.
- Run the command <code>export CORE_PEER_MSPCONFIGPATH</code>.
- Run the command <code>peer channel create -c expensechannnel -f path/to/ordererorg/channel.tx -o orderer1-ordererorg:7050 --tls --cafile /path/to/ordererorg/cafile</code>
- Run the command <code>peer channel join -b expensechannel.block</code>
- Run the command <code>export CORE_PEER_ADDRESS=peer2-peerorg:8051</code>
- Run the command <code>peer channel join -b expensechannel.block</code>
- Run the command <code>export CORE_PEER_ADDRESS=peer3-peerorg:9051</code>
- Run the command <code>peer channel join -b expensechannel.block</code>
- Run the command <code>export CORE_PEER_ADDRESS=peer4-peerorg:10051</code>
- Run the command <code>peer channel join -b expensechannel.block</code>
- Run the command <code>peer lifecycle chaincode install /etc/hyperledger/chaincode/basic.tar.gz</code>
- Run the command <code>export CORE_PEER_ADDRESS=peer3-peerorg:9051</code>
- Run the command <code>peer lifecycle chaincode install /etc/hyperledger/chaincode/basic.tar.gz</code>
- Run the command <code>export CORE_PEER_ADDRESS=peer2-peerorg:8051</code>
- Run the command <code>peer lifecycle chaincode install /etc/hyperledger/chaincode/basic.tar.gz</code>
- Run the command <code>export CORE_PEER_ADDRESS=peer1-peerorg:7051</code>
- Run the command <code>peer lifecycle chaincode install /etc/hyperledger/chaincode/basic.tar.gz</code>
- Now, right above where the cursor is in the terminal window, there is a package ID that the previous command just returned. A screenshot has been provided below as an example. If this is not put into the next command correctly, the terminal command will still work fine but the chaincode will not install.
- Run the command <code>peer lifecycle chaincode approveformyorg -o orderer1-ordererorg:7050 --channelID expensechannel --package-id YOUR_PACKAGE_ID --name basic --version 1.0 --sequence 1 --tls --cafile path/to/orderer/ca/file</code>
- Run the command <code>peer lifecycle chaincode commit -o orderer1-ordererorg:7050 --channelID expensechannel --name basic --version 1.0 --sequence 1 --tls --cafile /path/to/orderer/ca/file --peerAddresses peer1-peerorg:7051 --tlsRootCertFiles /path/to/peer1/ca/file</code>
- Now the chaincode should have installed. To check this is true, go to the Docker window and you should see 4 extra containers that started with "dev-peer...". A further method to check is to run the command <code>peer lifecycle chaincode queryinstalled -C expensechannel -n basic</code>.
- The blockchain is now running!



### Running the API connecting the frontend to the blockchain
- Navigate to the <code>middlewareAPI</code> folder using a separate terminal window.
- Run the command <code>npm install</code>
- Run the command <code>npm run dev</code>
- This part is now complete.