import { convertTimezoneToIANA } from './utils/timezone';

/**
 * Format a job assignment message for a coach
 */
export const formatJobAssignmentMessage = (
  coachName: string,
  jobDetails: {
    characterName: string;
    characterRealm: string;
    version: string;
    bracket: string;
    hours: string;
    availabilityStartDateTime: string;
    availabilityEndDateTime: string;
    jobId?: string;
    timezone?: string;
  }
): string => {
  const startDate = new Date(jobDetails.availabilityStartDateTime);
  const endDate = new Date(jobDetails.availabilityEndDateTime);

  // Format dates in user's timezone if provided, otherwise use default
  // Convert timezone abbreviation to IANA format if needed
  const timezoneAbbr = jobDetails.timezone || 'UTC';
  const timezoneIANA = convertTimezoneToIANA(timezoneAbbr);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezoneIANA,
    timeZoneName: 'short',
  };

  const startDateFormatted = startDate.toLocaleString('en-US', dateOptions);
  const endDateFormatted = endDate.toLocaleString('en-US', dateOptions);

  return `🎯 **New Coaching Session Assignment**

Hello ${coachName},

You have been assigned to a new coaching session. Here are the details:

**Character:** ${jobDetails.characterName} - ${jobDetails.characterRealm}
**Version:** ${jobDetails.version}
**Bracket:** ${jobDetails.bracket || 'N/A'}
**Hours:** ${jobDetails.hours}
**Availability:** ${startDateFormatted} - ${endDateFormatted}

Please log in to your dashboard to view more details and manage this session.

${jobDetails.jobId ? `Job ID: ${jobDetails.jobId}` : ''}`;
};

/**
 * Format a job creation message for a customer
 */
export const formatJobCreatedMessage = (
  customerName: string,
  jobDetails: {
    characterName: string;
    characterRealm: string;
    version: string;
    bracket: string;
    hours: string;
    availabilityStartDateTime: string;
    availabilityEndDateTime: string;
    jobId?: string;
    timezone?: string;
  },
  frontendUrl?: string
): string => {
  const startDate = new Date(jobDetails.availabilityStartDateTime);
  const endDate = new Date(jobDetails.availabilityEndDateTime);

  // Format dates in user's timezone if provided, otherwise use default
  // Convert timezone abbreviation to IANA format if needed
  const timezoneAbbr = jobDetails.timezone || 'UTC';
  const timezoneIANA = convertTimezoneToIANA(timezoneAbbr);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezoneIANA,
    timeZoneName: 'short',
  };

  const startDateFormatted = startDate.toLocaleString('en-US', dateOptions);
  const endDateFormatted = endDate.toLocaleString('en-US', dateOptions);

  const jobDetailsUrl = jobDetails.jobId && frontendUrl
    ? `${frontendUrl}/job/${jobDetails.jobId}`
    : '';

  return `✅ **Your Coaching Session Request Has Been Booked**

Hello ${customerName},

Your coaching session request has been successfully booked and assigned to a coach. Here are the details:

**Character:** ${jobDetails.characterName} - ${jobDetails.characterRealm}
**Version:** ${jobDetails.version}
**Bracket:** ${jobDetails.bracket || 'N/A'}
**Hours:** ${jobDetails.hours}
**Availability:** ${startDateFormatted} - ${endDateFormatted}

Your assigned coach will contact you soon.

${jobDetailsUrl ? `📋 **View your booking details:** ${jobDetailsUrl}` : ''}

${jobDetails.jobId ? `Job ID: ${jobDetails.jobId}` : ''}`;
};

