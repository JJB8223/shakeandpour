import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Kit } from './kit';
import { Order } from './order';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { MessageService } from './message.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  ordersUrl : string = "http://localhost:8080/orders/"
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  
  getOrders(user : string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.ordersUrl}?user=${user}`)
      .pipe(
        tap(_ => this.log('fetched Orders')),
        catchError(this.handleError<Order[]>('getOrders', []))
      );
  }


  constructor(private http : HttpClient, private messageService : MessageService, private userService : UserService) { }

  createOrder(kitmap: Kit[]): Observable<Order> {
    const username = this.userService.getUsername();
    this.log(JSON.stringify(kitmap))
    const params = new HttpParams()
        .set('username', username)
        .set('kitsJson', JSON.stringify(kitmap));

    const order_url = `${this.ordersUrl}/create`;
     return this.http.post<Order>(order_url, params).pipe(
      tap(order => console.log("Order Created Successfully:", order)),
      catchError(this.handleError<Order>('createOrder'))
     );
  }



  private log(message: string) {
    this.messageService.add(`KitService: ${message}`);
  }

  getOrderById(orderId: number): Observable<Order> {
    const url = `${this.ordersUrl}getSpecific/${orderId}`;
    return this.http.get<Order>(url)
      .pipe(
        tap(_ => this.log(`fetched order with ID=${orderId}`)),
        catchError(this.handleError<Order>(`getOrderById id=${orderId}`))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
