import { PlanRepo } from './plan.repo';
import { SubcriptionRepo } from './subcription.repo';
import { UserRepo } from './user.repo';
import { WalletRepo } from './wallet.repo';

export * from './user.repo';
export * from './wallet.repo';
export * from './plan.repo';
export * from './subcription.repo';

export default [UserRepo, WalletRepo, PlanRepo, SubcriptionRepo];
