import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi girin')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(100, 'Şifre çok uzun'),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi girin')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .max(100, 'Şifre çok uzun')
    .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),
  confirmPassword: z.string(),
  full_name: z
    .string()
    .min(2, 'Ad soyad en az 2 karakter olmalıdır')
    .max(100, 'Ad soyad çok uzun')
    .trim(),
  phone: z
    .string()
    .regex(/^(\+90|0)?[0-9]{10}$/, 'Geçerli bir telefon numarası girin')
    .optional()
    .or(z.literal('')),
  department: z.string().max(100).optional().or(z.literal('')),
  student_level: z.string().max(50).optional().or(z.literal('')),
  terms: z.boolean().refine((val) => val === true, {
    message: 'Kullanım koşullarını kabul etmelisiniz',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi girin')
    .toLowerCase()
    .trim(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mevcut şifre gereklidir'),
  newPassword: z
    .string()
    .min(8, 'Yeni şifre en az 8 karakter olmalıdır')
    .max(100, 'Şifre çok uzun')
    .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

