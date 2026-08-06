/**
 * Standard utility to generate Cục SHTT WIPO Publish IP Vietnam detail URL and ID.
 * Rule:
 * Input appNumber e.g. "4-2001-02720", "VN-4-2001-02720", "4200102720"
 * 1. Remove hyphens (-) and spaces
 * 2. Remove leading "VN" if present
 * 3. Prepend "VN"
 * Output ID: "VN4200102720"
 * Output URL: "https://wipopublish.ipvietnam.gov.vn/wopublish-search/public/detail/trademarks?id=VN4200102720"
 */

export function formatWipoPublishId(appNumber: string): string {
  if (!appNumber) return 'VN';
  const clean = appNumber.replace(/[- ]/g, '');
  const noVN = clean.replace(/^VN/i, '');
  return `VN${noVN}`;
}

export function formatWipoPublishUrl(appNumber: string): string {
  if (!appNumber) return 'https://wipopublish.ipvietnam.gov.vn/wopublish-search/public/detail/trademarks';
  const wipoId = formatWipoPublishId(appNumber);
  return `https://wipopublish.ipvietnam.gov.vn/wopublish-search/public/detail/trademarks?id=${wipoId}`;
}

export function formatWipoBrandDbId(appNumber: string): string {
  if (!appNumber) return 'VN502019000046858';
  const clean = appNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (clean.startsWith('VN50')) {
    return clean;
  }

  const matchYear = appNumber.match(/(20\d{2})[^\d]*(\d{4,8})/);
  if (matchYear) {
    const year = matchYear[1];
    const serialRaw = matchYear[2].replace(/^0+/, '');
    const serialPadded = serialRaw.padStart(9, '0');
    return `VN50${year}${serialPadded}`;
  }

  const digits = clean.replace(/\D/g, '');
  if (digits.length >= 8) {
    const year = digits.substring(0, 4);
    const serial = digits.substring(4).padStart(9, '0');
    return `VN50${year}${serial}`;
  }

  return `VN50${clean}`;
}

export function formatWipoBrandDbUrl(appNumber: string): string {
  const brandDbId = formatWipoBrandDbId(appNumber);
  return `https://branddb.wipo.int/en/similarname/brand/${brandDbId}?sort=score%20desc&start=0&rows=30&asStructure=%7B%22_id%22:%22da4c%22,%22boolean%22:%22AND%22,%22bricks%22:%5B%7B%22_id%22:%22da4d%22,%22key%22,%22value%22:%22a%22,%22strategy%22:%22Simple%22%7D,%7B%22_id%22:%22da50%22,%22key%22:%22designation%22,%22value%22:%5B%7B%22value%22:%22VN%22,%22label%22:%22(VN)%20Viet%20Nam%22,%22score%22:99,%22highlighted%22:%22(%3Cem%3EVN%3C%2Fem%3E)%20Viet%20Nam%22%7D%5D,%22strategy%22:%22any_of%22%7D%5D%7D&_=1786000653995&fg=_void_&i=24`;
}
