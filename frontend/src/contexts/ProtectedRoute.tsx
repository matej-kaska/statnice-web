import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserInfo from "@/zustand/userInfo";

type ProtectedRouteProps = {
  allowedRoles?: string[];
  userIsNeeded?: boolean;
  children: JSX.Element;
};

const ProtectedRoute = ({
  allowedRoles = [],
  userIsNeeded = false,
  children,
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { role, token } = useUserInfo(s => s.userInfo);

  useEffect(() => {
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      navigate("/", { replace: true });
      return;
    }

		if (userIsNeeded && !token) {
      navigate("/", { replace: true });
      return;
    }
  }, [
    role,
		token,
    userIsNeeded,
    allowedRoles,
    navigate,
  ]);

  if (allowedRoles.length > 0) {
    return  allowedRoles.includes(role) ? children : null;
  }

  if (userIsNeeded) {
    if (
      token &&
      (!(allowedRoles.length > 0) || allowedRoles.includes(role))
    ) {
      return children;
    }
    return null;
  }

  return children;
};

export default ProtectedRoute;
