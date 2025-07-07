import { Injectable } from '@nestjs/common';
import { Custsup } from './entities/custsup.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustsupService {
  constructor(
    @InjectRepository(Custsup)
    private custsupRepository: Repository<Custsup>,
  ) {}

  findAll(): Promise<Custsup[]> {
    try {
      return this.custsupRepository.find({
        select: ['id', 'name', 'username', 'email'],
      });
    } catch (error) {
      console.error('Error fetching all records:', error);
      throw error;
    }
  }

  findOne(id: number, userId: number): Promise<Custsup | null> {
    try {
      if (id <= 0) {
        return this.custsupRepository.findOne({
          where: { id: userId },
          select: ['id', 'name', 'username', 'email'],
        });
      }

      return this.custsupRepository.findOne({
        where: { id },
        select: ['id', 'name', 'username', 'email'],
      });
    } catch (error) {
      console.error(`Error fetching record with id ${id}:`, error);
      throw error;
    }
  }
}
