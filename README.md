## Install Instructions

```bash
npm i
cd src/

// compatible with release/v0.8 branch
ln -s <path-to-../keeper-contracts/build/contracts> contracts
cd ..
```

## Running
Make sure you have deployed the keeper-contracts to `ganache` 

See [keeper-contracts](https://github.com/oceanprotocol/keeper-contracts) for instructions

Point metamask to `localhost:8545`

Now, you can simply run the app with:
``` bash
npm start
```

