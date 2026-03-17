import { supabase } from "@/lib/supabaseClient";
import { apiClient } from "@/lib/apiClient";
import type { LoginCredentials, RegisterRole, RegisterUserInput } from "@/types/Auth";

function getLocalUserEndpoint(role: RegisterRole) {
  return role === "patient" ? "/api/Patients" : "/api/Personnel";
}

async function createLocalUser(
  role: RegisterRole,
  userId: string,
  name: string,
  email: string,
) {
  await apiClient.post(getLocalUserEndpoint(role), {
    supabaseUserId: userId,
    name,
    email,
  });
}

export async function loginWithPassword({ email, password }: LoginCredentials) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function registerUser({
  role,
  name,
  email,
  password,
}: RegisterUserInput) {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: {
      data: {
        role,
        fullName: trimmedName,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const userId = data.user?.id;
  if (!userId) {
    throw new Error(
      "Brukeren ble opprettet i Supabase, men mangler bruker-ID for lokal lagring.",
    );
  }

  await createLocalUser(role, userId, trimmedName, trimmedEmail);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
