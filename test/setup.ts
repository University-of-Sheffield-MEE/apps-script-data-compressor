
vi.stubGlobal('Utilities', {
  base64Encode: (bytes: number[]) => {
    return btoa(String.fromCharCode(...bytes));
  },
  base64Decode: (base64: string) => {
    return atob(base64).split('').map((c) => c.charCodeAt(0));
  }
});