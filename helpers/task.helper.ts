export function getNextRankString(lastRank: string | null): string {
  if (!lastRank) {
    return '0|aaaa:';
  }

  let i = lastRank.length - 1;
  while (i >= 0 && lastRank[i] === 'z') {
    i--;
  }

  if (i < 0) {
    return lastRank + 'a';
  }

  const nextChar = String.fromCharCode(lastRank.charCodeAt(i) + 1);
  return lastRank.substring(0, i) + nextChar + lastRank.substring(i + 1);
}

export function calculateMiddleRankString(prevRank: string, nextRank: string): string {
  const maxLength = Math.max(prevRank.length, nextRank.length);
  let newRank = '';

  for (let i = 0; i < maxLength; i++) {
    const prevChar = i < prevRank.length ? prevRank[i] : '!';
    const nextChar = i < nextRank.length ? nextRank[i] : 'z';

    if (prevChar === nextChar) {
      newRank += prevChar;
    } else {
      const diff = nextChar.charCodeAt(0) - prevChar.charCodeAt(0);

      if (diff > 1) {
        newRank += String.fromCharCode(prevChar.charCodeAt(0) + Math.floor(diff / 2));
      } else {
        newRank += prevChar + '!'; // Here, we're just appending '!' instead of checking next characters.
        break; // Since we added a character, we can break out.
      }
    }
  }

  return newRank;
}
