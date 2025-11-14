import { AppDataSource } from './typeorm';
import { User } from './entities/user.entity';
import { Organization } from './entities/organization.entity';
import * as bcrypt from 'bcrypt';

async function run() {
  const ds = await AppDataSource.initialize();
  const org = ds.getRepository(Organization).create({ name: 'Acme Root' });
  await ds.getRepository(Organization).save(org);

  const owner = ds.getRepository(User).create({
    email: 'raheel@abc.com',
    passwordHash: await bcrypt.hash('password1', 10),
    role: 'owner',
    org,
  });
  await ds.getRepository(User).save(owner);

  console.log('Seeded:', owner.email, 'org:', org.name);
  process.exit(0);
}
run();
