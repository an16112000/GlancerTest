import type { FreelancerProfile } from "@prisma/client";

export type PropsConfig = {
  profile: FreelancerProfile;
  onSuccess: () => Promise<void>;
  onCloseDrawer?: () => void;
};
