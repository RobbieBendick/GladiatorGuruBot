/**
 * Convert timezone abbreviation (PST, EST, etc.) to IANA timezone identifier
 * This is needed because Intl.DateTimeFormat requires IANA identifiers, not abbreviations
 */
export const convertTimezoneToIANA = (timezone: string): string => {
  if (!timezone || timezone === 'UTC') {
    return 'UTC';
  }

  // If it's already an IANA timezone (contains '/'), return as is
  if (timezone.includes('/')) {
    return timezone;
  }

  // Map common abbreviations to IANA timezones
  const abbreviationMap: Record<string, string> = {
    PST: 'America/Los_Angeles',
    PDT: 'America/Los_Angeles',
    EST: 'America/New_York',
    EDT: 'America/New_York',
    CST: 'America/Chicago',
    CDT: 'America/Chicago',
    MST: 'America/Denver',
    MDT: 'America/Denver',
    AKST: 'America/Anchorage',
    AKDT: 'America/Anchorage',
    HST: 'Pacific/Honolulu',
    GMT: 'Europe/London',
    UTC: 'UTC',
  };

  const upperTimezone = timezone.toUpperCase();
  return abbreviationMap[upperTimezone] || 'UTC';
};

