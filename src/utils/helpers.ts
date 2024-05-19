/**
 * @param { Date } date date object
 * @returns { string } date in YYYY-MM-DD HH:mm:ss format
 * @description converts date object to YYYY-MM-DD HH:mm:ss format
 */
export const formatToDBTimestamp = (date: Date): string => {
  return date.toISOString().slice(0, 19).replace('T', ' ')
}
