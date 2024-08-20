import { createGlobalState } from ".";
import { getUserData } from "../lib/actions";
import { TUserData } from "../types/types";

export const useUserState = (userId: number) =>
  createGlobalState<TUserData>("userData", async () => {
    const userData = await getUserData(userId); // Fetch user data from the database
    return userData;
  })();
