export const listDateFormat = (date: Date | number) => {
  let newDAte = new Date(date);
  let parsedDate = newDAte.toLocaleDateString('default', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  let time = newDAte.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
  });

  return parsedDate + ' ' + time;
};

export const equalIgnoreCase = (value1: string | number, value2: string | number) => {
  return String(value1).toLowerCase() === String(value2).toLowerCase();
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getDomains (domain: string): string[] {
  const domains = [];
  const parts = domain.split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    domains.push(parts.slice(i).join('.'));
  }
  return domains;
};

export function cutEvent(event: any) {
  const headers = event.headers && removeUndefined({
    'Authorization': event.headers['Authorization']?.substring(0, 200),
    'CloudFront-Viewer-Country': event.headers['CloudFront-Viewer-Country'],
    'Host': event.headers['Host'],
    'origin': event.headers['origin'],
    'Referer': event.headers['Referer'],
    'User-Agent': event.headers['User-Agent'],
    'wl-domain': event.headers['wl-domain'],
    'X-API-Key': maskingString(event.headers['X-API-Key']),
    'X-Forwarded-For': event.headers['X-Forwarded-For'],
    'X-Forwarded-Port': event.headers['X-Forwarded-Port'],
    'X-Forwarded-Proto': event.headers['X-Forwarded-Proto'],
    'X-Trading-Key': event.headers['X-Trading-Key'],
    'X-Wallet-Address': event.headers['X-Wallet-Address'],
    'X-Wallet-Token': event.headers['X-Wallet-Token'],
    'accessToken': maskingString(event.headers['accessToken']),
    'companyId': event.headers['companyId'],
    'seasonId': event.headers['seasonId'],
  });

  const requestContext = event.requestContext && removeUndefined({
    identity: event.requestContext.identity && removeUndefined({
      'userAgent': event.requestContext.identity['userAgent'],
      'sourceIp': event.requestContext.identity['sourceIp'],
    }),
    domainName: event.requestContext.domainName,
  });

  return removeUndefined({
    manage: event.manage,
    path: event.path,
    httpMethod: event.httpMethod,
    headers,
    requestContext,
  });
}

export function maskingString(str: string) {
  if (!str?.length) return str;
  const maskLen = Math.round(str.length / 3);
  const start: number = maskLen;
  const end: number = str.length - maskLen;
  const maskedStr = str.substring(0, start) + "*".repeat(maskLen) + str.substring(end);
  return maskedStr;
}

export function removeField(obj: any, fieldToRemove: string) {
  if (Array.isArray(obj)) {
      return obj.map(item => removeField(item, fieldToRemove));
  } else if (typeof obj === 'object' && obj !== null) {
      return Object.fromEntries(
          Object.entries(obj)
              .filter(([key]) => key !== fieldToRemove)
              .map(([key, value]) => [key, removeField(value, fieldToRemove)])
      );
  }
  return obj; // Return primitives as-is
}

function removeUndefined(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
}

export * from './assert';
export * from './social';
export * from './stat';