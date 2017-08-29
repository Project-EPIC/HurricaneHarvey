var minDate = 1

const NOISE = [
  '#job',
  '#career'
]

/* https://www.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/ */
function getUniqueFeatures(array, comparatorProperty) {
  var existingFeatureKeys = {};
  // Because features come from tiled vector data, feature geometries may be split
  // or duplicated across tile boundaries and, as a result, features may appear
  // multiple times in query results.
  var uniqueFeatures = array.filter(function(el) {
      if (existingFeatureKeys[el.properties[comparatorProperty]]) {
          return false;
      } else {
          existingFeatureKeys[el.properties[comparatorProperty]] = true;
          return true;
      }
  });

  return uniqueFeatures;
}

function extractLink(text){
  if(text.search("http")>=0){
    var out = []
    text.split(" ").forEach(function(word){
      if (word.startsWith("http")){
        out.push(`<a class="link" href="${word}" target="_blank">${word}</a>`)
      }else{
        out.push(word)
      }
    })
    return out.join(" ")
  }else{
    return text
  }
}

function getFilters(){
  return ['all',['>=','timestamp',minDate]].concat(keyFilters).concat(offKeyFilters)
}

var keyFilters = [];
var offKeyFilters = [];

function initializeKeyFilter(tag){
  if (tag.checked){
    keyFilters.push(["has",tag.tag])
  }else{
    keyFilters.push(["!has", tag.tag])
  }
}

function updateOffFilters(elem){
  var current = offKeyFilters;
  var newFilters = []
  //If this filter has been turned off, then remove it
  console.log(elem)
  var found = false;
  //If this filter has been turned (back) on, then add it!
  current.forEach(function(f){
    if (f[1] === elem.dataset.hashtag){
      found = true;
      //This is our filter, it's been turned off
      if(JSON.parse(elem.dataset.on)){
        newFilters.push(["!has",elem.dataset.hashtag])
      }
    }else{
      newFilters.push(f)
    }
  });
  if (!found){
    newFilters.push(["!has", elem.dataset.hashtag])
  }
  offKeyFilters = newFilters;
  map.setFilter('tweets',getFilters())
}

function addToList(tag){
  var li = document.createElement('li');
  li.innerHTML = `<label class='checkbox-container'>
      <input type='checkbox' checked='checked'/>
      <div class='checkbox mr6'>
      <svg class='icon'><use xlink:href='#icon-check' /></svg>
      </div>${tag}
    </label>`;
  li.dataset.hashtag = tag;
  li.dataset.on = true;
  li.addEventListener('change',function(e){
    if (JSON.parse(this.dataset.on)){
      this.dataset.on = false;
    }else{
      this.dataset.on = true;
    }
    updateOffFilters(this)
  })
  document.getElementById('hashtags').appendChild(li)
  offKeyFilters.push(['!has',tag])
}


//http://jehiah.cz/a/firing-javascript-events-properly
function fireEvent(element,event){
    if (document.createEventObject){
    // dispatch for IE
    var evt = document.createEventObject();
    return element.fireEvent('on'+event,evt)
    }
    else{
    // dispatch for firefox + others
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true ); // event type,bubbling,cancelable
    return !element.dispatchEvent(evt);
    }
}
