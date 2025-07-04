import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('custsup')
export class Custsup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', name: 'companyId' })
  companyId: number;

  @Column({ type: 'char', length: 1, name: 'custSup' })
  custSup: string;

  @Column({ type: 'varchar', length: 10, name: 'cscode' })
  cscode: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'estate' })
  estate: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'add1' })
  add1: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'add2' })
  add2: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'add3' })
  add3: string;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'city' })
  city: string;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'province' })
  province: string;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'district' })
  district: string;

  @Column({ type: 'varchar', length: 55, nullable: true, name: 'country' })
  country: string;

  @Column({ type: 'varchar', length: 55, nullable: true, name: 'region' })
  region: string;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'busreg' })
  busreg: string;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'street' })
  street: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'nic' })
  nic: string;

  @Column({ type: 'varchar', length: 35, nullable: true, name: 'tel' })
  tel: string;

  @Column({ type: 'varchar', length: 35, nullable: true, name: 'fax' })
  fax: string;

  @Column({ type: 'varchar', length: 35, nullable: true, name: 'mobile' })
  mobile: string;

  @Column({ type: 'varchar', length: 250, nullable: true, name: 'email' })
  email: string;

  @Column({ type: 'bigint', nullable: true, name: 'smcurrencyId' })
  smcurrencyId: number;

  @Column({ type: 'bigint', nullable: true, name: 'areaId', default: 0 })
  areaId: number;

  @Column({ type: 'text', nullable: true, name: 'payterm' })
  payterm: string;

  @Column({ type: 'int', default: 0, name: 'paydays' })
  paydays: number;

  @Column({ type: 'bigint', nullable: true, name: 'glsupglgroupId' })
  glsupglgroupId: number;

  @Column({ type: 'bigint', nullable: true, name: 'custsupgroupId' })
  custsupgroupId: number;

  @Column({ type: 'bigint', default: 0, name: 'farmergroupId' })
  farmergroupId: number;

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'busigrp' })
  busigrp: string;

  @Column({ type: 'varchar', length: 15, nullable: true, name: 'taxtype' })
  taxtype: string;

  @Column({ type: 'bigint', nullable: true, name: 'tax1' })
  tax1: number;

  @Column({ type: 'bigint', nullable: true, name: 'tax2' })
  tax2: number;

  @Column({ type: 'bigint', nullable: true, name: 'tax3' })
  tax3: number;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'creaby' })
  creaby: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdat',
  })
  createdat: Date;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'modiby' })
  modiby: string;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    name: 'updatedat',
  })
  updatedat: Date;

  @Column({ type: 'char', length: 1, nullable: true, name: 'pstatus' })
  pstatus: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    name: 'creditlimit',
  })
  creditlimit: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    name: 'creditbalance',
  })
  creditbalance: number;

  @Column({ type: 'char', length: 2, nullable: true, name: 'pmethd' })
  pmethd: string;

  @Column({ type: 'date', nullable: true, name: 'bnkgurexpdt' })
  bnkgurexpdt: Date;

  @Column({ type: 'float', nullable: true, name: 'bnkguramt' })
  bnkguramt: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0.0,
    name: 'inscover',
  })
  inscover: number;

  @Column({ type: 'varchar', length: 15, nullable: true, name: 'repid' })
  repid: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'paynam' })
  paynam: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'pyadd1' })
  pyadd1: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'pyadd2' })
  pyadd2: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'pyadd3' })
  pyadd3: string;

  @Column({ type: 'bigint', nullable: true, name: 'routeId' })
  routeId: number;

  @Column({ type: 'bigint', nullable: true, name: 'productId' })
  productId: number;

  @Column({ type: 'bigint', nullable: true, name: 'bankId' })
  bankId: number;

  @Column({ type: 'bigint', nullable: true, name: 'bankbranchId' })
  bankbranchId: number;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'bankaccno' })
  bankaccno: string;

  @Column({ type: 'enum', enum: ['Y', 'N'], default: 'N', name: 'onetime' })
  onetime: 'Y' | 'N';

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'inshiter' })
  inshiter: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'vatno' })
  vatno: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'svatno' })
  svatno: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'tinno' })
  tinno: string;

  @Column({
    type: 'varchar',
    length: 100,
    default: 'qr_sav.jasper',
    name: 'barcodepath',
  })
  barcodepath: string;

  @Column({ type: 'char', length: 1, nullable: true, name: 'partship' })
  partship: string;

  @Column({ type: 'char', length: 1, nullable: true, name: 'dummy' })
  dummy: string;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'salper' })
  salper: string;

  @Column({ type: 'text', nullable: true, name: 'username' })
  username: string;

  // @Column({ type: 'text', nullable: true, name: 'password' })
  // password: string;

  @Column({
    name: 'password',
    transformer: {
      to: (value: string) => bcrypt.hashSync(value, 10),
      from: (value: string) => value,
    },
  })
  password: string;

  @Column({ type: 'varchar', length: 1, default: 'Y', name: 'firstLogin' })
  firstLogin: string;

  @Column({ type: 'text', nullable: true, name: 'refreshToken' })
  refreshToken: string;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    default: 0.0,
    name: 'tariff_usa',
  })
  tariff_usa: number;
}
