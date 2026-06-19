export const DUMMY_ADMIN_EMAIL = 'swayamadmin@gmail.com'
export const DUMMY_ADMIN_PASSWORD = 'Admin@123'

export function isDummyAdminEmail(email?: string | null) {
  return email?.toLowerCase() === DUMMY_ADMIN_EMAIL
}
