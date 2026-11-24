import assert from 'node:assert/strict';

// Validate original bytes, not a string already decoded with replacement.
export function validateUtf8(bytes, label = 'HTML') {
  const nulByteOffsets = [];
  for (let i = 0; i < bytes.length; i++) if (bytes[i] === 0) nulByteOffsets.push(i);
  assert.equal(nulByteOffsets.length, 0, `${label}: NUL bytes at offsets ${nulByteOffsets.join(', ')}`);
  const html = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  assert.ok(!html.includes('\ufffd'), `${label}: replacement character`);
  return { byteLength: bytes.length, validUtf8: true, nulBytes: 0, replacementCharacters: 0 };
}
