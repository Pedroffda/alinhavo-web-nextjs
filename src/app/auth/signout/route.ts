import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  // return NextResponse.redirect(new URL("/entrar", req.url), {
  //   status: 302,
  // });
  // get /entrar
  return NextResponse.redirect(new URL("/auth/signin", req.url), {
    status: 302,
  });
}
