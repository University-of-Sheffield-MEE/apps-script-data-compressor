import { createBitArray } from "./bitArray";
import { Field, object } from "./fields";

export function createCompressor<T extends any>(field: Field<T>) {
  return {
    compress(dataIn: T) {
      const data = createBitArray();
      field.compress(data, dataIn);
      return data.toBase64().slice(0, this.getSize());
    },
    decompress(base64: string): T {
      const expectedLength = Math.ceil(Math.ceil(this.getSizeBits()/8) * 4 / 3);
      const finalLength = Math.ceil(expectedLength / 4) * 4;
      base64 = base64.padEnd(expectedLength, 'A').padEnd(finalLength, '=');
      const data = createBitArray();
      data.fromBase64(base64);
      return field.decompress(data);
    },
    getSizeBits: () => field.getSizeBits(),
    getSize: () => Math.ceil(field.getSizeBits() / 6)
  }
}

export function createObjectCompressor(shape: { [key: string]: Field<any> }) {
  return createCompressor(object(shape));
}

export * from './fields';

