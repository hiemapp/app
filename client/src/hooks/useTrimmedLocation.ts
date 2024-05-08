import { useLocation, Location } from 'react-router';
import trim from 'lodash/trim';

function useTrimmedLocation(): Location {
  const location = useLocation();

  location.pathname = '/' + trim(location.pathname, '/');

  return location;
}

export default useTrimmedLocation;
