import * as z from "zod";

// User role enum
export const UserRoleEnum = z.enum([
  "student",
  "teacher", 
  "admin"
]);

// User schema for validation
export const UserSchema = z.object({
  id: z.number().int().positive().optional(), // bigint, auto-generated
  user_id: z.string().uuid().optional(), // UUID from auth.users
  email: z.string().email("Valid email is required"),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  isStudent: z.boolean().default(true),
  isTeacher: z.boolean().default(false),
  isAdmin: z.boolean().default(false),
  canEdit: z.boolean().default(false),
  isTest: z.boolean().default(false),
  isActive: z.boolean().default(true),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// User input schema for creating/updating users
export const UserInputSchema = z.object({
  email: z.string().email("Valid email is required"),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  isStudent: z.boolean().optional(),
  isTeacher: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  canEdit: z.boolean().optional(),
  isTest: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// User update schema (for partial updates)
export const UserUpdateSchema = UserInputSchema.partial().extend({
  user_id: z.string().uuid("User ID is required"),
});

// User edit schema (for admin editing)
export const UserEditSchema = z.object({
  user_id: z.string().uuid("User ID is required"),
  email: z.string().email("Valid email is required").optional(),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  isStudent: z.boolean().optional(),
  isTeacher: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  canEdit: z.boolean().optional(),
  isTest: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// User profile update schema (for self-editing)
export const UserProfileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url().optional(),
  avatar_url: z.string().url().optional(),
});

// User registration schema (for signup)
export const UserRegistrationSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  isStudent: z.boolean().default(true),
  isTeacher: z.boolean().default(false),
  isAdmin: z.boolean().default(false),
});

// User profile schema (for account management)
export const UserProfileSchema = z.object({
  full_name: z.string().optional(),
  username: z.string().optional(),
  website: z.string().url().optional(),
  avatar_url: z.string().url().optional(),
});

// User filter schema
export const UserFilterSchema = z.object({
  role: UserRoleEnum.optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
  isStudent: z.boolean().optional(),
  isTeacher: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
});

// User sort schema
export const UserSortSchema = z.object({
  field: z.enum([
    "email",
    "firstName",
    "lastName",
    "username",
    "created_at",
    "updated_at"
  ]),
  direction: z.enum(["asc", "desc"]).default("asc"),
});

// User authentication schema
export const UserAuthSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

// User password reset schema
export const UserPasswordResetSchema = z.object({
  email: z.string().email("Valid email is required"),
});

// User password change schema
export const UserPasswordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Helper function to determine user role
export const getUserRole = (user: z.infer<typeof UserSchema>): z.infer<typeof UserRoleEnum> => {
  if (user.isAdmin) return "admin";
  if (user.isTeacher) return "teacher";
  return "student";
};

// Helper function to check if user has permission
export const hasPermission = (
  user: z.infer<typeof UserSchema>, 
  permission: "edit" | "admin" | "teacher" | "student"
): boolean => {
  switch (permission) {
    case "edit":
      return user.canEdit || user.isAdmin;
    case "admin":
      return user.isAdmin;
    case "teacher":
      return user.isTeacher || user.isAdmin;
    case "student":
      return user.isStudent;
    default:
      return false;
  }
};

// Types
export type User = z.infer<typeof UserSchema>;
export type UserInput = z.infer<typeof UserInputSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserEdit = z.infer<typeof UserEditSchema>;
export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserFilter = z.infer<typeof UserFilterSchema>;
export type UserSort = z.infer<typeof UserSortSchema>;
export type UserAuth = z.infer<typeof UserAuthSchema>;
export type UserPasswordReset = z.infer<typeof UserPasswordResetSchema>;
export type UserPasswordChange = z.infer<typeof UserPasswordChangeSchema>;
export type UserRole = z.infer<typeof UserRoleEnum>; 