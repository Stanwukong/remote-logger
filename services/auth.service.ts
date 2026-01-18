import { SignUpType } from "@/lib/schemas/auth";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie"; 
import { apiClient } from "./config";

export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
  errors?: string[];
  meta?: any;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;

    if (axiosError.response) {
      // Server responded with error status
      const { status, data } = axiosError.response;
      const message = data?.message || "An error occurred";
      const errors = data?.errors;

      throw new ApiError(message, status, errors);
    } else if (axiosError.request) {
      // Network error
      throw new ApiError("Network error. Please check your connection.", 0);
    } else {
      // Something else went wrong
      throw new ApiError("An unexpected error occurred.", 0);
    }
  }

  // Non-axios error
  throw new ApiError("An unexpected error occurred.", 0);
};

export const authService = {
  // Sign up a new user
  signUp: async (payload: SignUpType) => {
    try {
      const { confirmPassword, ...serverPayload } = payload;

      const response = await apiClient.post<ApiResponse>(
        "/users/signup",
        serverPayload
      );

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Sign up failed.",
          response.status,
          response.data.errors
        )
      }

      if (response.data.data?.token) {
        Cookies.set('authToken', response.data.data.token, { expires: 7 }); // expires in 7 days
      }

      return response.data.data;
    } catch (error) {
      handleApiError(error)
    }
  },

  /** * Sign in user
  */
  signIn: async (email: string, password: string) => {
    try {
      const response = await apiClient.post<ApiResponse>('/users/login', { email, password })

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || 'Sign in failed',
          response.status,
          response.data.errors
        )
      }

      if (response.data.data.token) {
        Cookies.set('authToken', response.data.data.token, { expires: 7 });
      }

      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Sign out user
   */
  signOut: async (): Promise<void> => {
    try {
      Cookies.remove('authToken');
    } catch (error) {
      console.error('Sign out error:', error)
    } 
  },

  /**
   * Request password reset
  */
  requestPasswordReset: async (email: string) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        '/users/forgot-password',
        { email }
      )

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to request password reset",
          response.status
        )
      }
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Reset password with token
  */
  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        '/users/reset-password',
        { token, password: newPassword}
      )

      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || 'Failed to reset password',
          response.status
        )
      }
    } catch (error) {
      handleApiError(error)
    }
  }
};


export const signupUser = authService.signUp
export const signinUser = authService.signIn
export const signoutUser = authService.signOut
export const passwordResetRequest = authService.requestPasswordReset
export const changePassword = authService.resetPassword
