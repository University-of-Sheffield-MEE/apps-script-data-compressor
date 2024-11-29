import { BitArray } from "./bitArray";

export type Field<T extends any> = {
  compress: (data: BitArray, value: T) => void;
  decompress: (data: BitArray) => T;
  getSizeBits: () => number;
}

export function boolean(): Field<boolean> {
  return {
    compress(data, value) {
      data.writeBit(value ? 1 : 0);
    },
    decompress(data) {
      return data.readBit() === 1;
    },
    getSizeBits() {
      return 1;
    }
  }
}

export function choose<T extends any>(values: T[]): Field<T> {
  const bitSize = Math.ceil(Math.log2(values.length));
  return {
    compress(data, value) {
      const index = values.indexOf(value);
      if (index === -1) {
        throw new Error('Value not found in choose values: ' + value);
      }
      data.writeBits(index, bitSize);
    },
    decompress(data) {
      const index = data.readBits(bitSize);
      if (index >= values.length) {
        throw new Error('Index out of bounds in choose decompression: ' + index + ' (max: ' + values.length + ')');
      }
      return values[index];
    },
    getSizeBits() {
      return bitSize;
    }
  }

}

export function number(min: number, max: number): Field<number> {
  const bitSize = Math.ceil(Math.log2(max - min));
  return {
    compress(data, value) {
      if (value < min || value > max) {
        throw new Error('Value out of bounds in number compression: ' + value + ' (min: ' + min + ', max: ' + max + ')');
      }
      data.writeBits(value - min, bitSize);
    },
    decompress(data) {
      return data.readBits(bitSize) + min;
    },
    getSizeBits() {
      return bitSize;
    }
  }
}

const allCharacters = new Array(0x7e - 0x21).fill(0).map((_, i) => String.fromCharCode(i + 0x21))

export function string(length: number, characterPattern?: string): Field<string> {
  const regex = characterPattern ? new RegExp(`[${characterPattern}]`) : /./;
  const characters = allCharacters.filter(char => regex.test(char));
  const charField = choose([...characters, '']);
  return {
    compress(data, value) {
      for (let i = 0; i < length; i++) {
        const char = value[i] || '';
        charField.compress(data, char);
      }
    },
    decompress(data) {
      let s = "";
      for (let i = 0; i < length; i++) {
        s += charField.decompress(data);
      }
      return s;
    },
    getSizeBits() {
      return charField.getSizeBits() * length;
    }
  }
}

export function object<T extends Record<string, any>>(shape: { [k in keyof T]: Field<T[k]> }): Field<T> {
  if (typeof shape !== 'object') {
    throw new Error('object should be passed an object shape. Got ' + typeof shape);
  }
  const keys = Object.keys(shape) as (keyof T)[];
  return {
    compress(data, value) {
      keys.forEach((key) => {
        shape[key].compress(data, value[key]);
      });
    },
    decompress(data) {
      const obj: Partial<T> = {};
      keys.forEach((key) => {
        obj[key] = shape[key].decompress(data);
      });
      return obj as T;
    },
    getSizeBits() {
      return keys.reduce((acc, key) => acc + shape[key].getSizeBits(), 0);
    }
  }
}