import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Ltxinfor } from './ltxinfor.entity';

@Injectable()
export class LatexOrdersService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Ltxinfor)
    private ltxinforRepository: Repository<Ltxinfor>,
  ) {}

  async getLatexOrders(userId: number): Promise<
    Array<{
      custsupId: number;
      num: string;
      podate: Date;
      itemmasterId: number;
      itmdesc: string;
      qty: number;
      received_qty: number;
      diff: number;
      ltxinfor?: Ltxinfor[];
    }>
  > {
    const latexOrders: Array<{
      custsupId: number;
      num: string;
      podate: Date;
      itemmasterId: number;
      itmdesc: string;
      qty: number;
      received_qty: number;
      diff: number;
      companyId: number;
      ltxinfor?: Ltxinfor[];
    }> = await this.entityManager.query(
      `
      SELECT 
        a.custsupId, 
        a.num, 
        a.podate, 
        b.itemmasterId, 
        c.itmdesc, 
        b.qty, 
        b.received_qty, 
        b.qty - b.received_qty AS diff,
        a.companyId
      FROM purchordhead a
      INNER JOIN purchorddeta b 
        ON a.companyId = b.companyId AND a.id = b.tranheaderId
      INNER JOIN itemmaster c 
        ON a.companyId = c.companyId AND b.itemmasterId = c.id
      WHERE 
        a.companyId = 3 
        AND c.itmgroupId = 57 
        AND b.qty > b.received_qty 
        AND a.podate >= '2025-01-01'
        AND a.custsupId = ?
    `,
      [userId],
    );

    if (latexOrders?.length > 0) {
      for (const order of latexOrders) {
        //check if each order has ltxinfor
        const ltxinfor = await this.ltxinforRepository.find({
          where: {
            custsupId: order.custsupId,
            itemmasterId: order.itemmasterId,
            ponum: order.num,
            companyId: order.companyId,
          },
        });

        if (ltxinfor?.length > 0) {
          order.ltxinfor = ltxinfor;
        }
      }
    }

    return latexOrders;
  }

  async saveSubRow(userId: number, body: Ltxinfor): Promise<Ltxinfor> {
    const data: Partial<Ltxinfor> = {
      ...body,
      modiby: userId.toString(),
      custsupId: userId,
    };
    if (!body.id) {
      data.creaby = userId.toString();
    }
    const ltxinfor = this.ltxinforRepository.create(data);
    const saved = await this.ltxinforRepository.save(ltxinfor);

    return saved;
  }

  async deleteSubRow(userId: number, body: Ltxinfor): Promise<void> {
    await this.ltxinforRepository.save({
      id: body.id,
      companyId: 300,
      modiby: userId.toString(),
    });
  }
}
