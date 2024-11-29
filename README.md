# Data Compressor

A Google Apps Script library for compressing (and decompressing) arbitrary data into a compact utf-8 string of characters that will be accepted by almost any system. Data is encoded as [base 64](https://www.freecodecamp.org/news/what-is-base64-encoding/), and may contain any uppercase and lowercase letter, the numerals, and the characters + and /

The original use-case was encoding meta-data about a purchase into the 9 character ID field of a financial transaction on SAP.

It could be used outside of Apps Script, but instances of `Utilities.base64Encode` and `Utilities.base64Decode` would need to be replaced with the native JS equivalent (see [the implementation used in unit tests](/test/setup.ts))

