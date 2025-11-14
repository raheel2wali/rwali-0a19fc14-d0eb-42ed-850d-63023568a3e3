import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true }) email: string;

  @Column() passwordHash: string;

  @Column({ type: 'text', default: 'viewer' }) role: 'viewer' | 'admin' | 'owner';

  @ManyToOne(() => Organization, { nullable: true })
  org?: Organization | null;
}
