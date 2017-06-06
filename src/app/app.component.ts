import { Component } from '@angular/core';
import {AngularFireDatabase, FirebaseObjectObservable} from "angularfire2/database";
import {Catalog} from "./model/catalog";
import {Category} from "./model/category";
import {Item} from "./model/item";

import * as _ from "lodash";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "Data Calculator";

  item: FirebaseObjectObservable<any[]>;

  catalog: Catalog;

  catalogLoaded = false;

  constructor(ad: AngularFireDatabase) {
    this.item = ad.object('/catalog');
    this.item.subscribe(snapshot => this.buildCatalog(snapshot));
  }

  private buildCatalog(snapshot) {
    const categories = new Map<string, Category>();
    _.forEach(snapshot.categories, (snapshotCategory, id) => {
      categories.set(id, _.merge({ id: id }, snapshotCategory));
    });

    const items: Item[] = _.map(snapshot.items, (snapshotItem: Item, id) => {
      return _.merge({ id }, snapshotItem);
    });

    this.catalog = {
      categories: categories,
      items: items
    };

    this.catalogLoaded = true;
  }
}
