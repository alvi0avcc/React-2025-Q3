import {
  describe,
  it,
  expect,
  type Mock,
  beforeEach,
  afterEach,
  vi,
} from 'vitest';
import { convertToBase64 } from '@/utils/convertToBase64';

interface MockFileReader {
  result: string | ArrayBuffer | null;
  error: DOMException | null;
  readAsDataURL: Mock;
  addEventListener: Mock;
  removeEventListener: Mock;
  dispatchEvent: Mock;
  loadCallback?: (event: Event) => void;
  errorCallback?: (event: Event) => void;
}

interface FileReaderEventTarget extends EventTarget {
  result: string | ArrayBuffer | null;
  error: DOMException | null;
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget | null;
}

describe('convertToBase64', () => {
  let mockFileReader: MockFileReader;
  let mockFile: File;

  beforeEach(() => {
    mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

    mockFileReader = {
      result: null,
      error: null,
      readAsDataURL: vi.fn(),
      addEventListener: vi.fn(
        (event: string, callback: (event: Event) => void) => {
          if (event === 'load') {
            mockFileReader.loadCallback = callback;
          }
          if (event === 'error') {
            mockFileReader.errorCallback = callback;
          }
        }
      ),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    global.FileReader = vi.fn(
      () => mockFileReader as unknown as FileReader
    ) as unknown as typeof FileReader;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully convert the file to base64', async () => {
    const expectedBase64 = 'data:text/plain;base64,dGVzdCBjb250ZW50';
    mockFileReader.result = expectedBase64;

    const promise = convertToBase64(mockFile);

    const loadEvent: FileReaderEvent = {
      target: {
        result: expectedBase64,
        error: null,
      } as FileReaderEventTarget,
    } as FileReaderEvent;

    mockFileReader.loadCallback?.(loadEvent);

    await expect(promise).resolves.toBe(expectedBase64);
    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
  });

  it('should reject promise if result is not string', async () => {
    mockFileReader.result = null;

    const promise = convertToBase64(mockFile);

    const loadEvent: FileReaderEvent = {
      target: {
        result: null,
        error: null,
      } as FileReaderEventTarget,
    } as FileReaderEvent;

    mockFileReader.loadCallback?.(loadEvent);

    await expect(promise).rejects.toThrow(
      'File read resulted in non-string data'
    );
  });

  it('should handle errors when target is not FileReader', async () => {
    const promise = convertToBase64(mockFile);

    const errorEvent: FileReaderEvent = {
      target: null,
    } as FileReaderEvent;

    mockFileReader.errorCallback?.(errorEvent);

    await expect(promise).rejects.toThrow('File read error');
  });
});
