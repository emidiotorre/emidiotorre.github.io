var itemsArray;
(function(){
var timer = 0;
function load()
{
    if(document.readyState==='complete')
    {
        clearTimeout(timer);
        itemsArray = [].slice.call(document.getElementsByClassName('item'));
    }
}
timer = setTimeout(load,100);
})();

function toggleVisibility (id) {


  console.log(itemsArray);
  itemsArray.filter(function(el){
    if(!el.classList.contains('invisible')){
      el.classList.add('invisible');
      return;
    }
  });
  var el = document.getElementById(id);
  el.classList.toggle('invisible');
};
