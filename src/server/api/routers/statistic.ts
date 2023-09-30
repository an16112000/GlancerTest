/* eslint-disable max-lines */
import moment from "moment";
import { z } from "zod";

import { revenueChartptions } from "../../../constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const statisticRouter = createTRPCRouter({
  /**
   *
   */
  getRevenueComparedToLastMonth: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx: { prisma }, input: { id } }) => {
      const lastMonthFirstDay = moment().subtract(1, "month").startOf("month");
      const thisMonthFirstDay = moment().startOf("month");

      const transactions = await prisma.transaction.findMany({
        where: {
          receiverId: id,
          createdAt: {
            gte: lastMonthFirstDay.toDate(),
          },
          done: true,
        },
      });

      const revenueThisMonth = transactions
        .filter(({ createdAt }) => moment(createdAt).isSameOrAfter(thisMonthFirstDay, "days"))
        .reduce((sum, item) => (sum += item.amount), 0);

      const revenueLastMonth = transactions
        .filter(
          ({ createdAt }) =>
            moment(createdAt).isSameOrAfter(lastMonthFirstDay, "days") &&
            moment(createdAt).isBefore(thisMonthFirstDay, "days"),
        )
        .reduce((sum, item) => (sum += item.amount), 0);

      const subsRevenue = revenueLastMonth - revenueThisMonth;

      const ratioComparedToLastMonth = (Math.abs(subsRevenue) / revenueLastMonth) * 100;

      const revenueThisMonthIsHigher = subsRevenue < 0;

      return {
        revenueThisMonth,
        ratioComparedToLastMonth,
        revenueThisMonthIsHigher,
      };
    }),

  /**
   *
   */
  getTotalReviewComparedToLastMonth: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx: { prisma }, input: { id } }) => {
      const lastMonthFirstDay = moment().subtract(1, "month").startOf("month");
      const thisMonthFirstDay = moment().startOf("month");

      const reviews = await prisma.reviewUser.findMany({
        where: {
          userIdBeReviewed: id,
          createdAt: {
            gte: lastMonthFirstDay.toDate(),
          },
        },
      });

      const totalReviewThisMonth = reviews.filter(({ createdAt }) =>
        moment(createdAt).isSameOrAfter(thisMonthFirstDay, "days"),
      ).length;

      const totalReviewLastMonth = reviews.filter(
        ({ createdAt }) =>
          moment(createdAt).isSameOrAfter(lastMonthFirstDay, "days") &&
          moment(createdAt).isBefore(thisMonthFirstDay, "days"),
      ).length;

      const subsTotalReviews = totalReviewLastMonth - totalReviewThisMonth;

      const ratioComparedToLastMonth = (Math.abs(subsTotalReviews) / totalReviewLastMonth) * 100;

      const totalReviewThisMonthIsHigher = subsTotalReviews < 0;

      return {
        totalReviewThisMonth,
        ratioComparedToLastMonth,
        totalReviewThisMonthIsHigher,
      };
    }),

  /**
   *
   */
  getTotalDoneOrderComparedToLastMonth: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx: { prisma }, input: { id } }) => {
      const lastMonthFirstDay = moment().subtract(1, "month").startOf("month");
      const thisMonthFirstDay = moment().startOf("month");

      const serviceOrders = (
        await prisma.orderService.findMany({
          where: {
            service: {
              ownerId: id,
            },
            createdAt: {
              gte: lastMonthFirstDay.toDate(),
            },
            status: {
              in: ["CANCELED", "DOING", "COMPLETED"],
            },
          },
        })
      ).map(({ createdAt }) => ({ createdAt }));

      const jobOrders = (
        await prisma.orderJob.findMany({
          where: {
            freelancerId: id,
            createdAt: {
              gte: lastMonthFirstDay.toDate(),
            },
            status: {
              in: ["CANCELED", "DOING", "COMPLETED"],
            },
          },
        })
      ).map(({ createdAt }) => ({ createdAt }));

      const contestOrders = (
        await prisma.orderContest.findMany({
          where: {
            freelancerId: id,
            createdAt: {
              gte: lastMonthFirstDay.toDate(),
            },
            status: {
              in: ["CANCELED", "DOING", "COMPLETED"],
            },
          },
        })
      ).map(({ createdAt }) => ({ createdAt }));

      const orders = [...serviceOrders, ...contestOrders, ...jobOrders];

      const totalOrderDoneThisMonth = orders.filter(({ createdAt }) =>
        moment(createdAt).isSameOrAfter(thisMonthFirstDay, "days"),
      ).length;

      const totalOrderDoneLastMonth = orders.filter(
        ({ createdAt }) =>
          moment(createdAt).isSameOrAfter(lastMonthFirstDay, "days") &&
          moment(createdAt).isBefore(thisMonthFirstDay, "days"),
      ).length;

      const subsTotalOrderDone = totalOrderDoneLastMonth - totalOrderDoneThisMonth;

      const ratioComparedToLastMonth = (Math.abs(subsTotalOrderDone) / totalOrderDoneLastMonth) * 100;

      const totalOrderDoneThisMonthIsHigher = subsTotalOrderDone < 0;

      return {
        totalOrderDoneThisMonth,
        ratioComparedToLastMonth,
        totalOrderDoneThisMonthIsHigher,
      };
    }),

  /**
   *
   */
  getServiceOrderResponseRate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx: { prisma }, input: { id } }) => {
      const serviceOrders = await prisma.orderService.findMany({
        where: {
          service: {
            ownerId: id,
          },
          status: {
            in: ["CANCELED", "DOING", "COMPLETED"],
          },
        },
      });

      const totalOrder = serviceOrders.length;

      const totalOrderPending = serviceOrders.filter(({ status }) => status === "PENDING").length;

      const subsTotalOrder = totalOrder - totalOrderPending;

      const rate = (subsTotalOrder / totalOrder) * 100;

      return {
        rate,
      };
    }),

  /**
   *
   */
  getOrderCompletionRate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx: { prisma }, input: { id } }) => {
      const serviceOrders = await prisma.orderService.findMany({
        where: {
          service: {
            ownerId: id,
          },
          status: {
            in: ["CANCELED", "DOING", "COMPLETED"],
          },
        },
      });

      const jobOrders = await prisma.orderJob.findMany({
        where: {
          freelancerId: id,
          status: {
            in: ["CANCELED", "DOING", "COMPLETED"],
          },
        },
      });

      const contestOrders = await prisma.orderContest.findMany({
        where: {
          freelancerId: id,
          status: {
            in: ["CANCELED", "DOING", "COMPLETED"],
          },
        },
      });

      const totalServiceOrder = serviceOrders.length;
      const totalJobOrder = jobOrders.length;
      const totalContestOrder = contestOrders.length;

      const totalServiceOrderDone = serviceOrders.filter(({ status }) => status === "COMPLETED").length;
      const totalJobOrderDone = jobOrders.filter(({ status }) => status === "COMPLETED").length;
      const totalContestOrderDone = contestOrders.filter(({ status }) => status === "COMPLETED").length;

      const totalOrder = totalServiceOrder + totalJobOrder + totalContestOrder;
      const totalOrderDone = totalServiceOrderDone + totalJobOrderDone + totalContestOrderDone;

      const rate = (totalOrderDone / totalOrder) * 100;

      return {
        rate,
      };
    }),

  /**
   *
   */
  getRevenueChart: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        dayRange: z.enum(revenueChartptions.map((item) => item.value) as [string, ...string[]]),
      }),
    )
    .query(async ({ ctx: { prisma }, input: { id, dayRange } }) => {
      const intDayRange = parseInt(dayRange);

      const startFrom = moment().subtract(intDayRange, "days");

      const transactions = await prisma.transaction.findMany({
        where: {
          receiverId: id,
          createdAt: {
            gte: startFrom.toDate(),
          },
          done: true,
        },
      });

      console.log(transactions);

      const temp: Record<string, number> = {};

      transactions.forEach(({ amount, createdAt }) => {
        const date = moment(createdAt).format("DD/MM");

        temp[date] = (temp[date] ?? 0) + amount;
      });

      return Object.keys(temp).map((date) => ({
        name: date,
        "Tổng cộng": temp[date],
      }));
    }),
});
