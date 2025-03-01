import { createBitArray } from "./bitArray";
import { boolean, choose, number, object, string } from "./fields";

describe('boolean', () => {
  it('compresses', () => {
    const field = boolean();
    const data = createBitArray();
    field.compress(data, true);
    field.compress(data, false);
    // @ts-ignore
    field.compress(data, 1);
    // @ts-ignore
    field.compress(data, null);
    // btoa(String.fromCharCode(0b10100000))
    expect(data.toBase64()).toBe('oA==');
  });

  it('decompresses', () => {
    const field = boolean();
    const data = createBitArray();
    data.fromBase64('oA==');
    expect(field.decompress(data)).toBe(true);
    expect(field.decompress(data)).toBe(false);
    expect(field.decompress(data)).toBe(true);
    expect(field.decompress(data)).toBe(false);
  });

  it('reports its size',  () => {
    const field = boolean();
    expect(field.getSizeBits()).toBe(1);
  })
});

describe('number', () => {
  it('compresses', () => {
    const field = number(0, 15);
    const data = createBitArray();
    field.compress(data, 5);
    field.compress(data, 15);
    field.compress(data, 0);
    // btoa(String.fromCharCode(0b10101111, 0b0000))
    expect(data.toBase64()).toBe('rwA=');
  });

  it('decompresses', () => {
    const field = number(0, 15);
    const data = createBitArray();
    data.fromBase64('rwA=');
    expect(field.decompress(data)).toBe(5);
    expect(field.decompress(data)).toBe(15);
    expect(field.decompress(data)).toBe(0);
  });

  it('validates out of bounds', () => {
    const field = number(0, 15);
    const data = createBitArray();
    expect(() => field.compress(data, 16)).toThrow();
    expect(() => field.compress(data, -1)).toThrow();
  });

  it('reports its size',  () => {
    const field = number(0, 15);
    expect(field.getSizeBits()).toBe(4);
  })
});

describe('choose', () => {
  it('compresses', () => {
    const field = choose(['a', 'b', 'c']);
    const data = createBitArray();
    field.compress(data, 'a');
    field.compress(data, 'c');
    field.compress(data, 'b');
    // btoa(String.fromCharCode(0b011000))
    expect(data.toBase64()).toBe('GA==');
  });

  it('decompresses', () => {
    const field = choose(['a', 'b', 'c']);
    const data = createBitArray();
    data.fromBase64('GA');
    expect(field.decompress(data)).toBe('a');
    expect(field.decompress(data)).toBe('c');
    expect(field.decompress(data)).toBe('b');
  });

  it('validates out of bounds', () => {
    const field = choose(['a', 'b', 'c']);
    const data = createBitArray();
    expect(() => field.compress(data, 'd')).toThrow();
  });

  it('reports its size',  () => {
    const field = choose(['a', 'b', 'c']);
    expect(field.getSizeBits()).toBe(2);
  })
});

describe('string', () => {
  it('compresses and decompresses', () => {
    const field = string(3);
    const dataIn = createBitArray();
    field.compress(dataIn, 'xyz');
    const base64 = dataIn.toBase64();

    const dataOut = createBitArray();
    dataOut.fromBase64(base64);
    const result = field.decompress(dataOut);
    expect(result).toBe('xyz');
  });

  it('has a constant byte length', () => {
    const field = string(3);

    const data1 = createBitArray();
    field.compress(data1, 'xyz');
    expect(data1.getBytes().length).toBe(3);

    const data2 = createBitArray();
    field.compress(data2, 'x');
    expect(data2.getBytes().length).toBe(3);
  });

  it('uses fewer bits with a character pattern', () => {
    const field = string(2, 'a-o'); // 8 bits

    const dataIn = createBitArray();
    field.compress(dataIn, 'of');
    expect(dataIn.getBytes().length).toBe(1); 
    const base64 = dataIn.toBase64();
    expect(base64.replaceAll('=', '').length).toBe(2);

    const dataOut = createBitArray();
    dataOut.fromBase64(base64);
    const result = field.decompress(dataOut);
    expect(result).toBe('of');
  });

  it('reports its size', () => {
    const field = string(2, 'a-o')
    expect(field.getSizeBits()).toBe(8);
  });
});

describe('object', () => {
  it ('compresses and decompresses objects', () => {
    const shape = {
      option: choose(['apple', 'banana', 'cucumber']),
      value: number(0, 15),
      isOne: boolean(),
      isTwo: boolean(),
      code: string(3, 'a-z'),
    };

    const compressor = object(shape);

    const obj = {
      code: 'abc',
      isOne: true,
      isTwo: false,
      value: 9,
      option: 'banana',
    };

    const data = createBitArray();

    const compressed = compressor.compress(data, obj);
    const decompressed = compressor.decompress(data);

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

    const compressor = object(shape);
    expect(compressor.getSizeBits()).toBe(16);
  });
});