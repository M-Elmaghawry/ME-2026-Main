import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateUtf8 } from '../scripts/ssg-integrity.mjs';

test('integrity guard accepts Arabic, English and multibyte Unicode', () => {
  const bytes = Buffer.from('<main>مرحبا — English 🏗️</main>');
  assert.deepEqual(validateUtf8(bytes), { byteLength: bytes.length, validUtf8: true, nulBytes: 0, replacementCharacters: 0 });
});
test('integrity guard rejects raw NUL bytes, including exact offsets', () => {
  assert.throws(() => validateUtf8(Uint8Array.from([65, 0, 66, 0])), /offsets 1, 3/);
});
test('integrity guard rejects malformed and truncated UTF-8 before replacement decoding', () => {
  for (const bytes of [[0xc3, 0x28], [0xe2, 0x82], [0xff], [0xed, 0xa0, 0x80]]) assert.throws(() => validateUtf8(Uint8Array.from(bytes)));
  assert.throws(() => validateUtf8(Buffer.from('bad\ufffdtext')), /replacement character/);
});
