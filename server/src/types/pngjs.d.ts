declare module 'pngjs' {
  export interface PNGOptions {
    width?: number;
    height?: number;
    checkCRC?: boolean;
    deflateChunkSize?: number;
    deflateLevel?: number;
    deflateStrategy?: number;
    filterType?: number;
    colorType?: number;
    bitDepth?: number;
    inputHasAlpha?: boolean;
  }

  export class PNG {
    width: number;
    height: number;
    data: Buffer;

    constructor(options?: PNGOptions);

    pack(): PNG;
    parse(data: Buffer, callback?: (error: Error | null, data: PNG) => void): PNG;

    static sync: {
      read(buffer: Buffer): PNG;
      write(png: PNG): Buffer;
    };
  }
}