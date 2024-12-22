import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { ProfileMenu } from "../profile-menu";

export default async function AuthButtons() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return <ProfileMenu user={user} />;
  }

  return (
    <Link href="/entrar">
      <Button variant="ghost" className="text-white hover:text-[#ff9900]">
        <UserIcon className="h-5 w-5 mr-1" />
        Entrar
      </Button>
    </Link>
  );
}
