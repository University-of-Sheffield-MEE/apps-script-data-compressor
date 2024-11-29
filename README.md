# Data Compressor

A Google Apps Script library for compressing (and decompressing) arbitrary data into a compact utf-8 string of characters that will be accepted by almost any system. Data is encoded as [base 64](https://www.freecodecamp.org/news/what-is-base64-encoding/), and may contain any uppercase and lowercase letter, the numerals, and the characters + and /

The original use-case was encoding meta-data about a purchase into the 9 character ID field of a financial transaction on our SAP finance system.

It could be used outside of Apps Script, but instances of `Utilities.base64Encode` and `Utilities.base64Decode` would need to be replaced with the native JS equivalent (see [the implementation used in unit tests](/test/setup.ts))

## Usage

```js
// Define the format of your data
let compressor = DataCompressor.createCompressor(
  // We want to compress a complex (object) value with the following fields:
  DataCompressor.object({
    // One of a pre-defined set of options
    theme: DataCompressor.choose(['ACME', 'MBCE', 'CCEE', 'AMT']),
    // A number within a set range
    activityNumber: DataCompressor.number(0, 999),
    // A true/false value
    isRemote: DataCompressor.boolean()
    // 6 characters of text containing only uppercase letters and numbers
    moduleCode: DataCompressor.string(6, 'A-Z0-9'),
  })
)

// Take a data object matching the above
let data = {
  theme: 'MBCE',
  activityNumber: 101,
  isRemote: false,
  moduleCode: 'CIV201',
}

// Compress to a fixed-length compact string
let compressedString = compressor.compress(data);
// Returns "qYGJfIAQA"

// And decompress it back to its original form later
let data2 = compressor.decompress(compressedString);
```

## Development

### Prerequisites

* Node JS
* [Clasp](https://github.com/google/clasp) (`npm i -g @google/clasp`)

### Setup

1. Clone this repository
1. `npm install`
1. `clasp login`
1. Add the ID of the Apps Script project to `.clasp.json` (see instructions in next section)

#### Finding the Apps Script ID

1. Open the spreadsheet
1. Extensions -> Apps Scripts
1. The script ID is in Project Settings (and also in the URL)

### Running unit tests

Unit test validate the behaviour of all functionality

```sh
npm test
```

### Pushing the application to Google

The project must first be built and then pushed using clasp:

```sh
npm run build
npm run push
```