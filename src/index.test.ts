import { createObjectCompressor } from ".";
import { boolean, choose, number, string } from "./fields";

describe('objectCompressor', () => {
  it ('compresses and decompresses objects', () => {
    const shape = {
      option: choose(['apple', 'banana', 'cucumber']),
      value: number(0, 15),
      isOne: boolean(),
      isTwo: boolean(),
      code: string(3, 'a-z'),
    };

    const compressor = createObjectCompressor(shape);

    const obj = {
      code: 'abc',
      isOne: true,
      isTwo: false,
      value: 9,
      option: 'banana',
    };

    const compressed = compressor.compress(obj);
    const decompressed = compressor.decompress(compressed);

    expect(decompressed).toEqual(obj);
  });
});