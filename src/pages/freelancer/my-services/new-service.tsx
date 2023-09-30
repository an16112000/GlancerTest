import { type NextPage } from "next";

import { Section } from "../../../components";
import { FormService } from "../../../features/my-services";
import { useProtectedPage } from "../../../hooks";

const NewService: NextPage = () => {
  const { isAuthenticating } = useProtectedPage();

  if (isAuthenticating) return <></>;

  return (
    <Section>
      <FormService />
    </Section>
  );
};

export default NewService;
