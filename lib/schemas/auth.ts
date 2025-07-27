// @/lib/schemas/auth.ts
import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z
      .string({
        required_error: "Everything has a name.",
      })
      .min(2, "First name must be at least 2 characters.")
      .max(25, "First name must be at most 25 characters."),
    lastName: z
      .string({
        required_error: "Please enter your surname.",
      })
      .min(2, "Last name must be at least 2 characters.")
      .max(25, "Last name must be at most 25 characters."),
    email: z
      .string({
        required_error: "Please input your email.",
      })
      .email("Please enter a valid email address."),
    company: z.string().optional(), // 'optional()' automatically makes it not required

    password: z
      .string({
        required_error: "Please enter a password.",
      })
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character."
      ),

    confirmPassword: z.string({
      required_error: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // This path ensures the error message appears under the confirmPassword field
  });

export const signInSchema = z.object({
  email: z
    .string({
      required_error: "Please input your email.",
    })
    .email("Please enter a valid email address."),
  password: z
    .string({
      required_error: "Please enter a password.",
    })
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character."
    ),
});

export const forgotPasswordSchema = z.object({
    email: z
    .string({
      required_error: "Please input your email.",
    })
    .email("Please enter a valid email address."),
})

export type SignUpType = z.infer<typeof signUpSchema>;
export type SignInType = z.infer<typeof signInSchema>
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>
