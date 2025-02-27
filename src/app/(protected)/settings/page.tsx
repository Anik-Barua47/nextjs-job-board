"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingsPage = () => {

  const user = useCurrentUser();
  console.log(user);

  const onClick = () => {
    logout();
  }
  return (
    <div>
      {JSON.stringify(user)}
      <h1>Name: {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      <Button onClick={onClick} type="submit"> Sign out</Button>

    </div>
  );
};

export default SettingsPage;
