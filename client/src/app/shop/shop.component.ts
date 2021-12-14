import { ShopParams } from './../shared/models/shopParams';
import { IType } from './../shared/models/productType';
import { IBrand } from './../shared/models/brand';
import { ShopService } from './shop.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../shared/models/product';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: true }) searchTerm: ElementRef;
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParamas = new ShopParams();
  totalCount: number;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParamas).subscribe({
      next: (response) => {
        this.products = response.data;
        this.shopParamas.pageNumber = response.pageIndex;
        this.shopParamas.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: (e) => console.log(e),
    });
  }

  getBrands() {
    this.shopService.getBrands().subscribe({
      next: (response) => (this.brands = [{ id: 0, name: 'All' }, ...response]),
      error: (e) => console.log(e),
    });
  }

  getTypes() {
    this.shopService.getTypes().subscribe({
      next: (response) => (this.types = [{ id: 0, name: 'All' }, ...response]),
      error: (e) => console.log(e),
    });
  }

  onBrandSelected(brandId: number) {
    this.shopParamas.brandId = brandId;
    this.shopParamas.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.shopParamas.typeId = typeId;
    this.shopParamas.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(sort: string) {
    this.shopParamas.sort = sort;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if (this.shopParamas.pageNumber !== event) {
      this.shopParamas.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParamas.search = this.searchTerm.nativeElement.value;
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParamas = new ShopParams();
    this.getProducts();
  }
}
