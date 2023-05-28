import Model from './Model';
import { trimStart } from 'lodash';

export default class User extends Model {
  getSetting(key: string) {
    const settings = this.getProp('settings');
    if (!settings) return null;

    return this.getProp('settings')[key];
  }

  hasPermission(id: string) {
    const permissions = this.getProp('permissions');

    if (permissions[id] != undefined) return permissions[id] === true;

    const parts = id.split('.');
    for (let i = parts.length; i >= 0; i--) {
      const idWithWildcard = trimStart(parts.slice(0, i).join('.') + '.*', '.');

      if (permissions[idWithWildcard] != undefined) return permissions[idWithWildcard] === true;
    }

    return false;
  }

  isAuthenticated() {
    return typeof this.id === 'number';
  }
}
