import { Component, OnInit } from '@angular/core';
import { NgxIndexedDB } from '../../node_modules/ngx-indexed-db';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userName = 'Anusha';
  title = 'Diary';
  date = null;
  notes = null;
  db = new NgxIndexedDB('myDb', 1);
  recordExists = false;
  constructor() {
    this.db.openDatabase(1, evt => {
      const objectStore = evt.currentTarget.result.createObjectStore('Diary', { keyPath: 'date', autoIncrement: false });
      objectStore.createIndex('date', 'date', { unique: true });
      objectStore.createIndex('notes', 'notes', { unique: false });

    });
  }
  onDateChange() {
    if (this.date) {
      this.db.getByIndex('Diary', 'date', this.date).then(
        data => {
          this.recordExists = true;
          this.notes = (data) ? data.notes : null;
        },
        error => {
          this.recordExists = false;
          this.notes = '';
        }
      );
    } else {
      this.notes = '';
    }
  }
  saveData = () => {
    if (this.recordExists) {
      this.db.update('Diary', { date: this.date, notes: this.notes }).then(
        () => {
          this.notes = null;
          this.date = null;
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.db.add('Diary', { date: this.date, notes: this.notes }).then(
        () => {
          this.notes = null;
          this.date = null;
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
