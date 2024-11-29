import { createBitArray } from "./bitArray";

describe('bitArray', () => {
  it('writes bits', () => {
    const data = createBitArray(4);
    for (let i = 0; i < 16; i++) {
      data.writeBit(i % 2);
    }
    expect(data.bytes).toEqual([0b01010101, 0b01010101, 0, 0]);
  });

  it('writes multiple bits', () => {
    const data = createBitArray(4);
    data.writeBits(0b0000, 4);
    data.writeBits(0b111, 3);
    data.writeBits(0b000, 3);
    data.writeBits(0b1, 1);
    expect(data.bytes).toEqual([0b00001110, 0b00100000, 0, 0]);
  });

  it('reads a bit', () => {
    const data = createBitArray(4);
    data.writeBits(0b10101010, 8);
    expect(data.readBit()).toBe(0);
    expect(data.readBit()).toBe(1);
    expect(data.readBit()).toBe(0);
    expect(data.readBit()).toBe(1);
  })

  it('reads bits', () => {
    const data = createBitArray(4);
    data.writeBits(0b10101111, 8);
    expect(data.readBits(4)).toBe(0b1111);
    expect(data.readBits(4)).toBe(0b1010);
  });


  it('encodes to base64',  () => {
    const data = createBitArray(16);
    data.writeBits(1, 8)
    data.writeBits(2, 8)
    expect(data.toBase64()).toBe('gEA=');
  })

  it('decodes from base64', () => {
    const data = createBitArray(16);
    data.fromBase64('gEA=');
    const out = [
      data.readBits(8),
      data.readBits(8)
    ]
    expect(out).toEqual([1, 2]);
  });

});
