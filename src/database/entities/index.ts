import { Plan } from './plan.entity';
import { Subcription } from './subcription.entity';
import { User } from './user.entity';
import { Wallet } from './wallet.entity';

export * from './user.entity';
export * from './wallet.entity';
export * from './plan.entity';
export * from './subcription.entity';

export default [User, Wallet, Plan, Subcription];
