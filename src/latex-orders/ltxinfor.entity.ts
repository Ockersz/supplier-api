// CREATE TABLE `hexsys`.`ltxinfor` (
//   `id` BIGINT(100) NOT NULL,
//   `ponum` VARCHAR(45) NOT NULL,
//   `custsupId` BIGINT(100) NOT NULL,
//   `date` DATE NULL DEFAULT NULL,
//   `tnkno` VARCHAR(45) NULL DEFAULT NULL,
//   `proddate` DATE NULL DEFAULT NULL,
//   `qty` DECIMAL(16,4) NULL DEFAULT 0.00,
//   `tsc` VARCHAR(45) NULL DEFAULT NULL,
//   `drc` VARCHAR(45) NULL DEFAULT NULL,
//   `vfano` VARCHAR(45) NULL DEFAULT NULL,
//   `ph` VARCHAR(45) NULL DEFAULT NULL,
//   `ammonia` VARCHAR(45) NULL DEFAULT NULL,
//   `mst` VARCHAR(45) NULL DEFAULT NULL,
//   `creadt` DATETIME NULL DEFAULT NULL,
//   `creaby` VARCHAR(45) NULL DEFAULT NULL,
//   `modidt` DATETIME NULL DEFAULT NULL,
//   `modiby` VARCHAR(45) NULL DEFAULT NULL,
//   PRIMARY KEY (`id`));

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// ALTER TABLE `hexsys`.`ltxinfor`
// CHANGE COLUMN `id` `id` BIGINT(100) NOT NULL AUTO_INCREMENT ;

// ALTER TABLE `hexsys`.`ltxinfor`
// ADD COLUMN `itemmasterId` BIGINT(100) NOT NULL AFTER `custsupId`;

// ALTER TABLE `hexsys`.`ltxinfor`
// ADD COLUMN `companyId` BIGINT(100) NOT NULL AFTER `id`;

@Entity('ltxinfor')
export class Ltxinfor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', name: 'companyId' })
  companyId: number;

  @Column({ type: 'varchar', length: 45, name: 'ponum' })
  ponum: string;

  @Column({ type: 'bigint', name: 'custsupId' })
  custsupId: number;

  @Column({ name: 'itemmasterId', type: 'bigint' })
  itemmasterId: number;

  @Column({ type: 'date', nullable: true, name: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'tnkno' })
  tnkno: string;

  @Column({ type: 'date', nullable: true, name: 'proddate' })
  proddate: Date;

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 4,
    default: 0.0,
    name: 'qty',
  })
  qty: number;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'tsc' })
  tsc: string;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'drc' })
  drc: string;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'vfano' })
  vfano: string;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'ph' })
  ph: string;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'ammonia' })
  ammonia: string;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'mst' })
  mst: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'creadt',
    nullable: true,
  })
  creadt: Date;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'creaby' })
  creaby: string;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    name: 'modidt',
  })
  modidt: Date;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'modiby' })
  modiby: string;
}
