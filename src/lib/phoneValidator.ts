/**
 * Validates and formats Brazilian phone numbers
 */

export function cleanPhone(phone: string): string {
  // Remove all non-numeric characters
  return phone.replace(/\D/g, '');
}

export function isValidBrazilianPhone(phone: string): boolean {
  const cleaned = cleanPhone(phone);
  
  // Valid Brazilian phone numbers have 10-11 digits
  // Format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
  // Must have area code (first 2 digits)
  
  if (cleaned.length < 10 || cleaned.length > 11) {
    return false;
  }
  
  // Area code (first 2 digits) should be between 11 and 99
  const areaCode = parseInt(cleaned.substring(0, 2), 10);
  if (areaCode < 11 || areaCode > 99) {
    return false;
  }
  
  // For 11-digit numbers (with 9 in position 2 for mobile)
  // Format: XX 9 XXXX-XXXX
  if (cleaned.length === 11) {
    const thirdDigit = cleaned[2];
    if (thirdDigit !== '9') {
      return false;
    }
  }
  
  return true;
}

export function formatBrazilianPhone(phone: string): string {
  const cleaned = cleanPhone(phone);
  
  if (!isValidBrazilianPhone(phone)) {
    throw new Error('Invalid Brazilian phone number');
  }
  
  // Return just the cleaned digits for storage in database
  // Format: AAXXXXXXXXX (10 or 11 digits)
  return cleaned;
}

export function formatPhoneForDisplay(phone: string): string {
  const cleaned = cleanPhone(phone);
  
  if (!isValidBrazilianPhone(phone)) {
    throw new Error('Invalid Brazilian phone number');
  }
  
  // Format for display
  if (cleaned.length === 10) {
    // (XX) XXXX-XXXX
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  } else if (cleaned.length === 11) {
    // (XX) 9 XXXX-XXXX
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  }
  
  return cleaned;
}
