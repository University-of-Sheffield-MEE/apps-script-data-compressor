import { createCompressor } from ".";
import { boolean, choose, number, object, string } from "./fields";

describe('compressor', () => {
  it ('compresses and decompresses single fields', () => {
    const compressor = createCompressor(boolean());
    expect(compressor.compress(true)).toBe('AQ');
    expect(compressor.decompress('AQ')).toBe(true);
  });

  it('compresses and decompresses objects', () => {
    const shape = {
      option: choose(['apple', 'banana', 'cucumber']),
      value: number(0, 15),
      isOne: boolean(),
      isTwo: boolean(),
      code: string(3, 'a-z'),
    };

    const compressor = createCompressor(object(shape));

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

  it ('compresses and decompresses compound objects', () => {
    const shape = {
      option: choose(['apple', 'banana', 'cucumber']),
      isOne: boolean(),
      sub: object({
        subOption: choose(['one', 'two', 'three']),
        subValue: number(0, 15),
      })
    };

    const compressor = createCompressor(object(shape));

    const obj = {
      isOne: true,
      option: 'banana',
      sub: {
        subOption: 'two',
        subValue: 7,
      }
    };

    const compressed = compressor.compress(obj);
    const decompressed = compressor.decompress(compressed);

    expect(decompressed).toEqual(obj);
  });

  it('reports its size', () => {
    const shape = {
      option: choose(['apple', 'banana', 'cucumber']),
      value: number(0, 15),
      isOne: boolean(),
      isTwo: boolean(),
      code: string(2, 'a-o'),
    };

    const compressor = createCompressor(object(shape));
    expect(compressor.getSizeBits()).toBe(16);
    expect(compressor.getSize()).toBe(3);

    const obj = {
      code: 'abc',
      isOne: true,
      isTwo: false,
      value: 9,
      option: 'banana',
    };
    const compressed = compressor.compress(obj);
    expect(compressed.length).toBe(3);
  });
});