import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './createDto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
