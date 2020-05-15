
  import { race, isObservable, timer } from "rxjs";
 
  const CROS_URL = "https://cors-anywhere.herokuapp.com/";
  const BASE_URL = "https://registry.npmjs.org/";


  import { ajax } from 'rxjs/ajax';
  import {
    switchMap,
    // catchError,
    // tap,
    // repeat,
  } from "rxjs/operators";


// ajax.getJSON(url)
  const createAjax = url => race(timer(10000), ajax.getJSON(url)  );
  
  //  using cache and call ajax
  const cache = {};
  const cachePackage$ = data => { 
    let [name, version] = _extractPackageInfo(data);
    name = name.trim()
    console.log(data , `${encodeURIComponent(name)}`);
    return
    const key = name + "-" + version;
    cache[key] && cache[key].name ? 
                      cache[key] : 
                      (cache[key] = createAjax(`${CROS_URL}${BASE_URL}${encodeURIComponent(name)}
                                    /${encodeURIComponent(version)}`));
    return cache[key]
  };

  const getPackage$ = (data$) => {
    if (!isObservable(data$)) return cachePackage$(data$);
    return data$.pipe(switchMap(data => cachePackage$({ data })));
  };
  // END AJAX STAFF
  ///////////

  
  const _extractPackageInfo = data => {
    let name, version;
    if (typeof data === 'string') {
      [name, version] = data.split(' ');
    } else {
      name = data.name;
      version = data.version;
    }
    //modify for ajax
    name = name.trim();
    if (!version) {
      version = 'latest';
    } else {
      version = version.trim();
      const isSpecialSign = ver => {
          return ['@','~','\\^'].find( sign => ver.search(sign) > -1)
      }
      
      const startStrFrom = isSpecialSign(version) ?  1 : 0 // true in case there is sign
      version = version.substr(startStrFrom);
      // add 0 before '.' to make search easier
      if (version.substr(0, 1) === '.') {
        version = '0' + version;
      }
    }
  
    return [name, version];
  };

  
const PackageService = { 
  getPackage$
}
export default PackageService