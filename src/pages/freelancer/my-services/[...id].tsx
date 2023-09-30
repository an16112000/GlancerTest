import { LoadingOverlay } from "@mantine/core";
import { type NextPage } from "next";
import { useRouter } from "next/router";

import { Section } from "../../../components";
import { FormService } from "../../../features/my-services";
import { useProtectedPage } from "../../../hooks";
import { api } from "../../../utils/api";

const EditService: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticating, isAuthed } = useProtectedPage();
  const { data, isLoading } = api.service.getById.useQuery(
    { id: id?.at(0) || "" },
    { enabled: isAuthed, refetchOnWindowFocus: false },
  );

  if (isAuthenticating) return <></>;

  return (
    <Section>
      <LoadingOverlay visible={isLoading} />

      <FormService serviceData={data} isEdit />
    </Section>
  );
};

export default EditService;
