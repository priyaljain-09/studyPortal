export interface IApplicationState {
  isLoading: boolean;
  successLogin: boolean;
  type: string;
  toastMessage: string;
  showToast: boolean;
  showWarningModal: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
