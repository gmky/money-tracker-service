import { PlanRepo } from './plan.repo';
import { SubscriptionRepo } from './subscription.repo';
import { UserRepo } from './user.repo';
import { WalletRepo } from './wallet.repo';

export * from './user.repo';
export * from './wallet.repo';
export * from './plan.repo';
export * from './subscription.repo';

export default [UserRepo, WalletRepo, PlanRepo, SubscriptionRepo];
