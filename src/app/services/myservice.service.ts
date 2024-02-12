import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RootObject } from '../interfaces/myinterface';

@Injectable({
  providedIn: 'root'
})

export class MyserviceService {

  // Atributos para generar la consulta REST
  // Están almacenados en los ficheros de la carpeta enviroments
  apiKey: string = environment.apiKey;
  apiUrl: string = environment.apiUrl;

  // Hacemos uso de BehaviorSubject tipo json (categoria y totalResults o undefined).
  // BehaviorSubject es un tipo especial de Observable que siempre tiene un valor actual y emite ese valor inmediatamente a los nuevos suscriptores.
  // En este caso, emite objetos de tipo "{ categoria: string; totalResults: number } | undefined"
  private datosSubject: BehaviorSubject<{ categoria: string; totalResults: number } | undefined> = new BehaviorSubject<{ categoria: string; totalResults: number } | undefined>(undefined);

  // Creamos el observable datos$ para gestionar los cambios que vienen desde la api.
  public datos$: Observable<{ categoria: string; totalResults: number }|undefined> = this.datosSubject.asObservable();


  constructor(private ServicioRest: HttpClient) {}


  cargarCategoria(categoria: string) {

    /* OPCION 1: USANDO FICHEROS
    if (categoria === "business") {
      let respuesta: Observable<RootObject> = this.ServicioRest.get<RootObject>("/assets/data/business.json");
      console.log("respuesta: "+respuesta);
      respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {
        //Mediante datosSubject.next, avisamos a todos los suscriptores (en este caso datos$) de que hemos recibido un nuevo valor.
        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });
      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }
      });

    } else if (categoria === "entertainment") {
      let respuesta: Observable<RootObject> = this.ServicioRest.get<RootObject>("/assets/data/entertainment.json");
      console.log("respuesta: "+respuesta);
      respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {
        //Mediante datosSubject.next, avisamos a todos los suscriptores (en este caso datos$) de que hemos recibido un nuevo valor.
        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });
      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }
      });

    } else if (categoria === "general") {
      let respuesta: Observable<RootObject> = this.ServicioRest.get<RootObject>("/assets/data/general.json");
      console.log("respuesta: "+respuesta);
      respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {
        //Mediante datosSubject.next, avisamos a todos los suscriptores (en este caso datos$) de que hemos recibido un nuevo valor.
        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });
      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }
      });

    } else if (categoria === "technology") {
      let respuesta: Observable<RootObject> = this.ServicioRest.get<RootObject>("/assets/data/technology.json");
      console.log("respuesta: "+respuesta);
      respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {
        //Mediante datosSubject.next, avisamos a todos los suscriptores (en este caso datos$) de que hemos recibido un nuevo valor.
        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });
      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }
      });

    } else if (categoria === "health") {
      let respuesta: Observable<RootObject> = this.ServicioRest.get<RootObject>("/assets/data/health.json");
      console.log("respuesta: "+respuesta);
      respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {
        //Mediante datosSubject.next, avisamos a todos los suscriptores (en este caso datos$) de que hemos recibido un nuevo valor.
        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });
      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }
      });

    } else if (categoria === "science") {
      let respuesta: Observable<RootObject> = this.ServicioRest.get<RootObject>("/assets/data/science.json");
      console.log("respuesta: "+respuesta);
      respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {
        //Mediante datosSubject.next, avisamos a todos los suscriptores (en este caso datos$) de que hemos recibido un nuevo valor.
        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });
      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }
      });

    } else if (categoria === "sports") {
      let respuesta: Observable<RootObject> = this.ServicioRest.get<RootObject>("/assets/data/sports.json");
      console.log("respuesta: "+respuesta);
      respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {
        //Mediante datosSubject.next, avisamos a todos los suscriptores (en este caso datos$) de que hemos recibido un nuevo valor.
        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });
      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }
      });

    } else {}*/

    // OPCION 2: USANDO API REST
    //Realizamos la llamada api y la recogemos en un observable de tipo RootObject
    let respuesta: Observable<RootObject> = this.ServicioRest.get<RootObject>(this.apiUrl + "/top-headlines?country=us&category=" + categoria + "&apiKey=" + this.apiKey);
    console.log("respuesta: "+respuesta);
    respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {
        //Mediante datosSubject.next, avisamos a todos los suscriptores (en este caso datos$) de que hemos recibido un nuevo valor.
        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });
      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }
    });
  }
}
