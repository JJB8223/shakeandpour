import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { KitsDisplayComponent } from './kits-display/kits-display.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import {LoginComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import { UserComponent } from './user/user.component';
import {RegisterComponent} from './register/register.component';
import { OrdersComponent } from './orders/orders.component';
import { CustomKitComponent } from './custom-kit/custom-kit.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cart', component: ShoppingCartComponent},
  { path: 'kits', component: KitsDisplayComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'detail/:id', component: ProductDetailComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'login', component: LoginComponent},
  { path: 'admin', component: AdminComponent},
  { path: 'user', component: UserComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'orders', component: OrdersComponent },
  {path: 'custom', component: CustomKitComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
