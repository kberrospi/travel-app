import type { Access } from 'payload'

export const isAdminOrAdvisor: Access = ({ req: { user } }) => {
  return user?.role === 'admin' || user?.role === 'advisor'
}
