import { Breadcrumbs, Button, Divider, Grid, LoadingOverlay, Paper, Title } from "@mantine/core";
import { Box, type ColorScheme, Text } from "@mantine/core";
import { useLocalStorage, useScrollIntoView } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { Section } from "../../components";
import { keys } from "../../constants";
import {
  ButtonContact,
  FreelancerSection,
  GallerySection,
  InfoSection,
  ReviewSection,
  ToolbarSection,
  TopbarSection,
} from "../../features/service-detail";
import { api } from "../../utils/api";
import { formatPrice } from "../../utils/formatter";

const NOTI_KEY = "CREATE_ORDER";

const ServiceDetail: NextPage = () => {
  const { data: session, status } = useSession();
  const [theme] = useLocalStorage<ColorScheme>({ key: keys.COLOR_SCHEME });

  const {
    query: { id },
  } = useRouter();

  const { data, isLoading, refetch } = api.service.getById.useQuery(
    { id: Array.isArray(id) ? id[0] || "" : id || "" },
    { enabled: Array.isArray(id) && !!id[0] },
  );
  const { mutateAsync: createOrder, isLoading: isSubmitting } = api.orderService.create.useMutation();
  const { mutateAsync: checkOrder, isLoading: isChecking } = api.orderService.check.useMutation();

  const { scrollIntoView: scrollToInfo, targetRef: infoRef } = useScrollIntoView<HTMLDivElement>({
    offset: 100,
    duration: 400,
  });
  const { scrollIntoView: scrollToFreelancer, targetRef: freelancerRef } = useScrollIntoView<HTMLDivElement>({
    offset: 100,
    duration: 400,
  });
  const { scrollIntoView: scrollToReviews, targetRef: reviewsRef } = useScrollIntoView<HTMLDivElement>({
    offset: 100,
    duration: 400,
  });

  const isOwned = useMemo(() => session?.user?.id === data?.ownerId, [data?.ownerId, session?.user?.id]);

  const toolbarStyles = useMemo(
    () => ({ bg: theme === "light" ? "white" : "#1A1B1E", borderBottom: theme === "light" ? "#e9ecef" : "#2C2E33" }),
    [theme],
  );

  const handleSendRequest = async () => {
    if (isSubmitting || isChecking) return;

    if (session && session.user && data) {
      const clientId = session.user.id;
      const serviceId = data.id;

      showNotification({
        id: NOTI_KEY,
        color: "orange",
        loading: true,
        disallowClose: true,
        autoClose: false,
        message: "Đang gửi yêu cầu...",
      });

      try {
        const res = await checkOrder({ clientId, serviceId });

        if (!!res) {
          return updateNotification({
            id: NOTI_KEY,
            color: "blue",
            message: "Yêu cầu cũ của bạn đang trong hàng chờ.",
          });
        }

        await createOrder({ clientId, serviceId });

        updateNotification({
          id: NOTI_KEY,
          color: "green",
          message: "Gửi yêu cầu thành công!",
        });

        await refetch();
      } catch (error) {
        console.log(error);

        updateNotification({
          id: NOTI_KEY,
          color: "red",
          message: "Gửi yêu cầu thất bại!",
        });
      }
    } else {
      alert("Vui lòng đăng nhập");
    }
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} pos="fixed" />

      <Box
        bg={toolbarStyles.bg}
        sx={{
          borderBottom: `1px solid ${toolbarStyles.borderBottom}`,
          zIndex: 3,
        }}
        pos="sticky"
        top={60}
      >
        <Section size={1200} py="md">
          <ToolbarSection
            isOwned={isOwned}
            favorites={data?.favorites}
            scrollToFreelancer={scrollToFreelancer}
            scrollToInfo={scrollToInfo}
            scrollToReviews={scrollToReviews}
            onSuccess={async () => {
              await refetch();
            }}
            serviceId={data?.id}
          />
        </Section>
      </Box>

      <Section size={1200}>
        <Grid gutter="xl">
          <Grid.Col span={8}>
            <Breadcrumbs separator=">">
              <Link href="/">
                <Text variant="link">Dịch vụ</Text>
              </Link>

              <Link href="/">
                <Text variant="link">{data?.category.name}</Text>
              </Link>
            </Breadcrumbs>

            <Title my="xl">{data?.name}</Title>

            <TopbarSection service={data} />

            <Box py={50}>
              <GallerySection galleryJson={data?.gallery} />
            </Box>

            <Divider />

            <Box py={50} ref={infoRef}>
              <InfoSection info={data?.info} />
            </Box>

            <Divider />

            <Box py={50} ref={freelancerRef}>
              <FreelancerSection owner={data?.owner} isOwned={isOwned} />
            </Box>

            <Divider />

            <Box py={50} ref={reviewsRef}>
              <ReviewSection reviews={data?.reviews} />
            </Box>
          </Grid.Col>

          <Grid.Col span={4}>
            <Box pos="sticky" top={155}>
              <Paper p="md" withBorder>
                <Text fw="bold" ta="end">
                  {formatPrice(data?.price || "")}
                </Text>

                <Button
                  fullWidth
                  mt="sm"
                  disabled={isOwned || status !== "authenticated"}
                  onClick={() => void handleSendRequest()}
                >
                  Gửi yêu cầu
                </Button>
              </Paper>

              <ButtonContact
                disabled={isOwned || status !== "authenticated"}
                mt="xl"
                otherPersonId={data?.ownerId || ""}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Section>
    </>
  );
};

export default ServiceDetail;
