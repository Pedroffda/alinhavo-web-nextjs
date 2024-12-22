import { createBrowserClient } from "@supabase/ssr";

// const supabase = createClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL as string,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
// );

function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const supabase = createClient();

export { createClient, supabase };
