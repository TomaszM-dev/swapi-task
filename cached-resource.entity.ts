// cached-resource.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class CachedResource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column({ type: 'text' })
  value: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
