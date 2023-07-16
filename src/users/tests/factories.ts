import { MockFactory } from '../../common/tests/factories';
import { UserEntity } from '../users.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

export class UserMockFactory extends MockFactory<UserEntity, CreateUserDto> {}
