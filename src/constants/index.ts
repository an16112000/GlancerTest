import { OrderStatus } from "@prisma/client";

export * from "./themes";
export * from "./keys";

export const serviceStatusTabs = [
  {
    type: OrderStatus.PENDING,
    label: "Chờ duyệt",
  },
  {
    type: OrderStatus.DOING,
    label: "Đang làm",
  },
  {
    type: OrderStatus.COMPLETED,
    label: "Hoàn thành",
  },
  {
    type: OrderStatus.CANCELED,
    label: "Hủy bỏ",
  },
  {
    type: OrderStatus.REJECTED,
    label: "Từ chối",
  },
];

export const jobStatusTabs = [
  {
    type: OrderStatus.DOING,
    label: "Đang làm",
  },
  {
    type: OrderStatus.COMPLETED,
    label: "Hoàn thành",
  },
  {
    type: OrderStatus.CANCELED,
    label: "Hủy bỏ",
  },
];

export const contestStatusTabs = [
  {
    type: OrderStatus.DOING,
    label: "Đang làm",
  },
  {
    type: OrderStatus.COMPLETED,
    label: "Hoàn thành",
  },
  {
    type: OrderStatus.CANCELED,
    label: "Hủy bỏ",
  },
];

export const revenueChartptions = [
  {
    label: "7 ngày gần nhất",
    value: "7",
  },
  {
    label: "1 tháng gần nhất",
    value: "30",
  },
  {
    label: "3 tháng gần nhất",
    value: "90",
  },
  {
    label: "6 tháng gần nhất",
    value: "180",
  },
];
