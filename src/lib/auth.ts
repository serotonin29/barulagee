import { User } from 'firebase/auth';

// Admin email with full privileges
const ADMIN_EMAIL = 'fitrayazid4@gmail.com';

export type UserRole = 'admin' | 'dosen' | 'student';

export interface UserPermissions {
  canUploadMaterials: boolean;
  canDeleteMaterials: boolean;
  canCreateFolders: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
}

export function getUserRole(user: User | null): UserRole {
  if (!user) return 'student';
  
  if (user.email === ADMIN_EMAIL) {
    return 'admin';
  }
  
  // For now, default to student role
  // This can be extended to check user roles from Firestore
  return 'student';
}

export function getUserPermissions(role: UserRole): UserPermissions {
  switch (role) {
    case 'admin':
      return {
        canUploadMaterials: true,
        canDeleteMaterials: true,
        canCreateFolders: true,
        canManageUsers: true,
        canViewAnalytics: true,
      };
    case 'dosen':
      return {
        canUploadMaterials: true,
        canDeleteMaterials: true,
        canCreateFolders: true,
        canManageUsers: false,
        canViewAnalytics: false,
      };
    case 'student':
    default:
      return {
        canUploadMaterials: false,
        canDeleteMaterials: false,
        canCreateFolders: false,
        canManageUsers: false,
        canViewAnalytics: false,
      };
  }
}

export function isAdmin(user: User | null): boolean {
  return getUserRole(user) === 'admin';
}