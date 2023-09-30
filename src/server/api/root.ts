import {
  bidJobRouter,
  categoryRouter,
  contestRouter,
  degreeRouter,
  educationRouter,
  employmentRouter,
  favoriteSeriveRouter,
  freelancerProfileRouter,
  jobRouter,
  orderContestRouter,
  orderJobRouter,
  orderServiceRouter,
  portfolioRouter,
  productContestRouter,
  reviewRouter,
  saveContestRouter,
  saveJobRouter,
  serviceRouter,
  stripeRouter,
  transactionRouter,
  userRouter,
} from "./routers";
import { statisticRouter } from "./routers/statistic";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  category: categoryRouter,
  degree: degreeRouter,
  service: serviceRouter,
  job: jobRouter,
  contest: contestRouter,
  orderContest: orderContestRouter,
  orderService: orderServiceRouter,
  orderJob: orderJobRouter,
  transaction: transactionRouter,
  review: reviewRouter,
  user: userRouter,
  freelancerProfile: freelancerProfileRouter,
  portfolio: portfolioRouter,
  education: educationRouter,
  employment: employmentRouter,
  bidJob: bidJobRouter,
  favoriteService: favoriteSeriveRouter,
  saveJob: saveJobRouter,
  saveContest: saveContestRouter,
  productContest: productContestRouter,
  stripe: stripeRouter,
  statistic: statisticRouter,
});

export type AppRouter = typeof appRouter;
