const allRoles: Record<string, string[]> = {
  customer: [],
  admin: ['employee', 'managerUsers']
}

export const roles = Object.keys(allRoles)

export const roleRight = new Map(Object.entries(allRoles))
