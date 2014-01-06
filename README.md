# BitPremier for Hive Wallet

A Hive Wallet app for interacting with the [BitPremier API](http://www.bitpremier.com/api/doc/).

![BitPremier Autos](http://i.imgur.com/zw9WUeg.png)

## Developers
```
cd ~ && git clone https://github.com/tgerring/hiveapp-bitpremier.git
cd ~/Library/Application\ Support/Hive/Applications/
ln -s ~/hiveapp-bitpremier/assets/ bitpremier
```

This should get the latest repository and symlink it into Hive's app directory. From here, you'll need to access `Tools > Debugging Tools... > Rebuild application list` from Hive's menubar.