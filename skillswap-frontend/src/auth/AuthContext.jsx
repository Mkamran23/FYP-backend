import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  forgotPassword as forgotPasswordAction,
  resetPassword as resetPasswordAction,
  signIn as signInAction,
  signOut as signOutAction,
  signUp as signUpAction,
  updateProfile as updateProfileAction,
  uploadProfilePhoto as uploadProfilePhotoAction,
  verifySession,
} from "../store/authSlice";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifySession());
  }, [dispatch]);

  return children;
}

// The hook is intentionally colocated with the bootstrap provider for compatibility with existing consumers.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    user: auth.user,
    token: auth.accessToken,
    isAuthenticated: Boolean(auth.accessToken),
    isCheckingAuth: auth.isCheckingAuth,
    signIn: (payload) => dispatch(signInAction(payload)).unwrap().then((data) => data.user),
    signUp: (payload) => dispatch(signUpAction(payload)).unwrap().then((data) => data.user),
    signOut: () => dispatch(signOutAction()),
    forgotPassword: (payload) => dispatch(forgotPasswordAction(payload.email)).unwrap(),
    resetPassword: (payload) => dispatch(resetPasswordAction(payload)).unwrap(),
    updateProfile: (profile) => dispatch(updateProfileAction(profile)).unwrap().then((data) => data.user),
    uploadProfilePhoto: (photo) => dispatch(uploadProfilePhotoAction(photo)).unwrap().then((data) => data.user),
  };
}
