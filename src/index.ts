import { createBitArray } from "./bitArray";
import { Field, object } from "./fields";

export function createCompressor<T extends any>(field: Field<T>) {
  return {
    compress(dataIn: T) {
      const data = createBitArray();
      field.compress(data, dataIn);
      return data.toBase64();
    },
    decompress(base64: string): T {
      const data = createBitArray();
      data.fromBase64(base64);
      return field.decompress(data);
    },
    getSizeBits: () => field.getSizeBits(),
    getSize: () => Math.ceil(field.getSizeBits() / 6)
  }
}

export function createObjectCompressor<T extends any>(shape: { [key: string]: Field<any> }) {
  return createCompressor(object(shape));
}

export * from './fields';

