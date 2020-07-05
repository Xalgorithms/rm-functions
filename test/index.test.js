import { processText } from '../src';

test('Process returns identical string', () => {
    const s = 'asdfjkl;';
    expect(processText(s)).toBe(s);
});
