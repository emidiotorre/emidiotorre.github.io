var itemsArray;

ready(function(){
   itemsArray = [].slice.call(document.getElementsByClassName('item'));
})

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function toggleVisibility (id) {
  itemsArray.filter(function(el){
    if(!el.classList.contains('invisible')){
      el.classList.add('invisible');
      return;
    }
  });
  var el = document.getElementById(id);
  el.classList.toggle('invisible');
};
