import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { Kit } from './kit';
import { KitMap } from './kit-map';
import { Observable, catchError, tap, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  // setting the header opitions and url
  private ShoppingCartURL = 'http://localhost:8080/cart';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  private getUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : 101;
  }
  
  addToShoppingCart(kitId: number, quantity: number): Observable<any> {
    const userId = this.getUserId();
    const url = `${this.ShoppingCartURL}/${userId}/add/${kitId}/${quantity}`;
    return this.http.post<any>(url, null, this.httpOptions).pipe(
      tap((response) => console.log('Item added to the shopping cart successfully:', response))
    );
  }

  removeItem(kitId: number, quantity: number): Observable<any> {
    const userId = this.getUserId();
    const url = `${this.ShoppingCartURL}/${userId}/remove/${kitId}/${quantity}`;
    return this.http.delete<any>(url, this.httpOptions).pipe(
      tap((response) => console.log('Item removed from the shopping cart', response))
    );
  }

  getShoppingCart(): Observable<KitMap[]> {
    const userId = this.getUserId();
    const url = `${this.ShoppingCartURL}/${userId}`;
    return this.http.get<KitMap[]>(url, this.httpOptions).pipe(
      tap(_ => this.log('fetched shopping cart')),
      catchError(this.handleError<KitMap[]>('getShoppingCart'))
    );
  }

  getTotalCost(): Observable<any> {
    const userId = this.getUserId();
    const url = `${this.ShoppingCartURL}/${userId}/total`;
    return this.http.get<number>(url, this.httpOptions).pipe(
      tap(_ => this.log('fetched total cost of the shopping cart')),
      catchError(this.handleError<number>('getTotalCost', 0))
    );
  }

  /** A logging helper method */
  private log(message: string) {
    this.messageService.add(`ProductService: ${message}`);
    console.log(message)
  }

  /** Error Handling helper method */
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
