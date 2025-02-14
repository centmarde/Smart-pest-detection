import { computed, ref } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";
import { useToast } from "vue-toastification";

const toast = useToast();
interface UserData {
  id?: string;
  email?: string;
  created_at?: string;
  username: string | null;
  profile_image: string | null;
}

interface SessionUser {
  id: string;
  email?: string;
  user_metadata: Record<string, any>;
}

export const useAuthUserStore = defineStore("authUser", () => {
  // States
  const userData: Ref<UserData | null> = ref(null);
  const authPages: Ref<string[]> = ref([]);
  const authBranchIds: Ref<number[]> = ref([]);
  const router = useRouter();

  async function registerUser(
    email: string,
    password: string,
    username: string
  ) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

    if (signUpError) {
      return { error: signUpError };
    }

    if (!signUpData.user) {
      return { error: "Signup failed" };
    }

    const userId = signUpData.user.id;

    const { error: insertError } = await supabase.from("users").insert([
      {
        user_id: userId,
      },
    ]);

    if (insertError) {
      return { error: insertError };
    }

    return { data: { id: userId, email } };
  }

  async function signIn(email: string, password: string, value: boolean) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    if (!data.session) {
      return { error: "No session" };
    }

    const user = data.user;
    localStorage.setItem("access_token", data.session.access_token);
    localStorage.setItem("refresh_token", data.session.refresh_token);
    localStorage.setItem("auth_id", user.id);

    const { data: profiles, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      return { error: profileError };
    }

    localStorage.setItem("user_id", profiles.id);

    userData.value = {
      id: user.id,
      email: user.email,
    };

    return { user };
  }

  return {
    userData,
    authPages,
    authBranchIds,
    registerUser,
    signIn,
  };
});

export async function fetchUserData() {
  const loading = ref(true);
  const error = ref<Error | null>(null);
  const userData = ref<UserData | null>(null);
  try {
    loading.value = true;
    error.value = null;

    // Get user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("No authenticated user");

    // Get additional user data from Supabase database
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("username, profile_image")
      .eq("user_id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      // Ignore "no rows returned" error
      throw profileError;
    }

    userData.value = {
      id: user.id,
      email: user.email || "",
      username: profile?.username || null,
      profile_image: profile?.profile_image || null,
    };
  } catch (e) {
    console.error("Error fetching user info:", e);
    error.value = e instanceof Error ? e : new Error("Unknown error occurred");
  } finally {
    loading.value = false;
  }
}

// Initial fetch
fetchUserData();
export { supabase };

export function useUserData() {
  const user = ref<UserData | null>(null);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const fetchUserData = async () => {
    try {
      loading.value = true;
      error.value = null;

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!authUser) throw new Error("No authenticated user");

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("username, profile_image")
        .eq("user_id", authUser.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      user.value = {
        id: authUser.id,
        email: authUser.email || "",
        username: profile?.username || null,
        profile_image: profile?.profile_image || null,
      };
    } catch (e) {
      console.error("Error fetching user info:", e);
      error.value =
        e instanceof Error ? e : new Error("Unknown error occurred");
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchUserData);

  return {
    user,
    loading,
    error,
    refresh: fetchUserData,
  };
}
