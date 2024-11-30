/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { DecimalPipe, SlicePipe } from '@angular/common';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../directives/NgbdSortableHeader';

interface SearchResult {
    tableItem: any[];
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(tableItem: any[], column: SortColumn, direction: string): any[] {
    if (direction === '' || column === '') {
        return tableItem;
    } else {
        return [...tableItem].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(table: any, term: string, pipe: PipeTransform) {
    if (!term) {
        return true;  // Devuelve todos los resultados si el término de búsqueda está vacío
    }

    const cedulaMatches = typeof table.cedula === 'string' && table.cedula.toLowerCase().includes(term.toLowerCase());
    const correoMatches = typeof table.correo === 'string' && table.correo.toLowerCase().includes(term.toLowerCase());

    return cedulaMatches || correoMatches ;
}


@Injectable({ providedIn: 'root' })
export class TableService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _tableItem$ = new BehaviorSubject<any[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private userData: any[] = []; // Define un array inicial vacío para evitar undefined

    private _state: State = {
        page: 1,
        pageSize: 4,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    constructor(private pipe: DecimalPipe) {
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(100),
            switchMap(() => this._search()),
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            this._tableItem$.next(result.tableItem);
            this._total$.next(result.total);
        });

        this._search$.next();
    }

    get tableItem$() { return this._tableItem$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }

    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
    set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    setUserData(val: any[]) {
       // console.log("Datos establecidos en setUserData:", val);  // Verificar que val tenga datos válidos
        this.userData = val || []; // Asegura que userData sea un array incluso si val es null
        this._search$.next(); // Llama a _search después de actualizar userData
    }

    deleteSingleData(name: string) {
        if (!this.userData) return;

        // Filtra el usuario con el nombre especificado y actualiza el estado
        const updatedTableItem = this.userData.filter(item => item.name !== name);
        this.userData = updatedTableItem;

        this._tableItem$.next(updatedTableItem); // Actualiza el observable de items
        this._total$.next(updatedTableItem.length); // Actualiza el observable del total
    }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        // console.log("Ejecutando _search con userData:", this.userData);  // Debe mostrar los datos establecidos en setUserData
    
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;
    
        let tableItem = this.userData ? sort(this.userData, sortColumn, sortDirection) : [];
    
        // Filtrado de los elementos
        tableItem = tableItem.filter(item => matches(item, searchTerm, this.pipe));
        const total = tableItem.length;
    
        // Paginación de los elementos
        tableItem = tableItem.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    
        // console.log("Resultado después de filtrar y paginar en _search:", tableItem);
    
        return of({ tableItem, total });
    }
    
}