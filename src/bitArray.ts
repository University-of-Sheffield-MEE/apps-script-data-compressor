export function createBitArray(maxBytes: number = 256) {
  return {
    bytes: new Array(maxBytes).fill(0),
    bits: 0,
    readHead: 0,

    readBit() {
      const index = Math.floor(this.readHead / 8);
      const bitIndex = 7 - this.readHead % 8;
      this.readHead++;
      return (this.bytes[index] >> bitIndex) & 1;
    },

    readBits(bits: number) {
      let result = 0;
      for (let i = 0; i < bits; i++) {
        result |= this.readBit() << i;
      }
      return result;
    },

    writeBit(bit: number) {
      const index = Math.floor(this.bits / 8);
      const bitIndex = 7 - this.bits % 8;
      this.bytes[index] |= (bit > 0 ? 1 : 0) << bitIndex;
      this.bits++;
    },

    writeBits(number: number, bits: number) {
      for (let i = 0; i < bits; i++) {
        this.writeBit(number & 1);
        number >>= 1;
      }
    },

    getBytes() {
      return this.bytes.slice(0, Math.ceil(this.bits / 8));
    },
    
    toBase64() {
      return Utilities.base64Encode(this.getBytes())
    },

    fromBase64(base64: string) {
      this.bytes = Utilities.base64Decode(base64);
      this.bits = this.bytes.length * 8;
      return this;
    },
  }
}

export type BitArray = ReturnType<typeof createBitArray>;