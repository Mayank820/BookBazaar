// if we want the key then we use UserRoleEnum
export const UserRoleEnum = {
  ADMIN: "admin",
  USER: "user",
};
// if we want the whole array then we can use AvailableUserRoles
// so we have to export both values
export const AvailableUserRoles = Object.values(UserRoleEnum);
