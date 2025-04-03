export class ResetUserPasswordDto {
  email: string;
  oldPassword: string;
  newPassword: string;
}
export class ResetUserAdminPasswordDto {
  id: string;
  Password: string;
}
