import { BitArray, createBitArray } from "./bitArray";
import { Field } from "./fields";

export function createObjectCompressor(objectShape: Record<string, Field<any>>) {
  if (typeof objectShape !== 'object') {
    throw new Error('createObjectCompressor should be passed an object. Got ' + typeof objectShape);
  }
  const keys = Object.keys(objectShape);

  return {
    compress(obj: Record<string, any>) {
      const data = createBitArray();
      keys.forEach((key) => {
        objectShape[key].compress(data, obj[key]);
      });
      return data.toBase64();
    },
    decompress(base64: string) {
      const data = createBitArray();
      data.fromBase64(base64);
      const obj: Record<string, any> = {};
      keys.forEach((key) => {
        obj[key] = objectShape[key].decompress(data);
      });
      return obj;
    },
    getSize: () => keys.reduce((acc, key) => acc + objectShape[key].getSize(), 0),
  }
}

export * from './fields';

