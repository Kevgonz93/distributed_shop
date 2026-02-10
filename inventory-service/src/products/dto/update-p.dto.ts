import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-p.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
