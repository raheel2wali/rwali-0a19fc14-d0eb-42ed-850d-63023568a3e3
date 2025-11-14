import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true }) name: string;

  // 2-level hierarchy: parent nullable => root or child
  @ManyToOne(() => Organization, org => org.children, { nullable: true })
  parent?: Organization | null;

  @OneToMany(() => Organization, org => org.parent)
  children?: Organization[];
}
