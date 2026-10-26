# @disflow-team/utils

A set of utilities used by DisFlow. This module contains two parts. Crypto and Workspace.

# Workspace

Simple to understand. Provides an easy to use editor and utilities to work with litegraph.js.

# Crypto

Handles encryptions, decryption, key derivation and sudo mode. Very rarely, you will touch this module unless you are working on `@disflow-team/local-data`.

## Deriving a key from pin number

We can derive a key from a pin number using the following code.

```ts
import { Crypto } from "@disflow-team/utils";

const salt = await crypto.getRandomValues(new Uint8Array(16));
const key = await Crypto.deriveKey("123456", salt); // will return an CryptoKey that can be used to decrypt and encrypt data
```

## Creating a master key

A master key handles everything. It is randomly generated, encrypted and stored in localstorage and only decrypted when the suer provides their 6 digit pin number.

```ts
const masterKey = await Crypto.createMasterKey("123456", false); // second param is 'override'
```

However, if the master key is already in localstorage, you may retrive and decrypt it using the following code.

```ts
const masterKey = await Crypto.getMasterKey("123456", false);
```

## Encrypting and Decrypting

The following methods encrypt and decrypt data and are pretty self-explainatory.

```ts
function encryptData(data: string | Uint8Array<ArrayBuffer>, key: CryptoKey): Promise<{ enc: ArrayBuffer, iv: Uint8Array<ArrayBuffer> }>
function decryptData(data: ArrayBuffer, iv: Uint8Array<ArrayBuffer>, key: CryptoKey): Promise<ArrayBuffer>;
```

Of course, you must pass the decrypted data into a `TextDecoder` to convert it back into regular text.

```ts
const decrypted = await Crypto.decryptData(someData, someIv, someKey);
const text = (new TextDecoder).decode(decrypted);
```

# Sudo Mode

Imagine you have to enter your key over and over again just to use the app. Not very cool right? This is where Sudo Mode comes into play.

## Entering Sudo mode

```ts
import { SudoMode } from "@disflow-team/utils";
import { createSingleton } from "@disflow-team/local-data";

await SudoMode.enterSudo("123456"); // sudo is entered

// do some operations that require SUDO
const db = createSingleton();

// no need to pass PIN
await db.appManager.create({
    ...otherOptions,
    token: "to be encrypted discord bot JWT."
});

// leave sudo
await SudoMode.exitSudo();

// ERROR!!!!! Cannot be used outside of SUDO
await db.appManager.create({
    ...otherOptions,
    token: "to be encrypted discord bot JWT."
});
```

## Type guard

`SudoMode` comes with a type guard that ensures masterKey property on `SudoMode` is defined. It is named `.isSudo()`.

```ts
if(SudoMode.isSudo()) {
    // in sudo mode!!
    console.log(SudoMode.masterKey); // always defined
} else {
    // outside sudo :(
}
```