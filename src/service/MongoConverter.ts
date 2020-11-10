import { UserDocument } from '../DAO/documents/UserDocument';

export const fromUser = (
  user: UserDocument,
): {
  id: string;
  login: string;
  email: string;
  displayName?: string;
  profileImageUrl?: string;
} => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    displayName: user.displayName,
    profileImageUrl: user.profileImageUrl,
  };
};
