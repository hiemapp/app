import Model from './Model';
import { trimStart } from 'lodash';

export default class User extends Model {
  getSetting(key: string) {
    const settings = this.getProp('settings');
    if (!settings) return null;

    return this.getProp('settings')[key];
  }

  hasPermissionKey(key: string) {
    const permissions = this.getProp('permissions');

    if (permissions[key] != undefined) return permissions[key] === true;

    const parts = key.split('.');
    for (let i = parts.length; i >= 0; i--) {
      const keyWithWildcard = trimStart(parts.slice(0, i).join('.') + '.*', '.');

      if (permissions[keyWithWildcard] != undefined) return permissions[keyWithWildcard] === true;
    }

    return false;
  }

  isAuthenticated() {
    return this.props.username !== '__DEFAULT__';
  }
}
