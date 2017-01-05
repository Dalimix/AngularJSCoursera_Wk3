(function(){
'use strict';
angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('searchURL',"https://davids-restaurant.herokuapp.com/menu_items.json")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective(){
  var ddo = {
    templateUrl: 'loader/itemsloaderindicator.html',
    restrict: 'E',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: DirectiveController,
    controllerAs: 'ctrllr',
    bindToController: true
  };
  return ddo;
}
function DirectiveController() {
  var list = this;
  list.showMessage = function(){
    if( list.items.length > 0){
      return false;
    }
    else{
      return true;
    }
  }
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService){
  var ctrllr = this;

  ctrllr.found = [];
  ctrllr.narrowIt = function(){
    var promiseItems = MenuSearchService.getMatchedMenuItems(ctrllr.searchTerm);
    promiseItems.then(function(response){
        ctrllr.found = response;
        console.log(ctrllr.found);
    });
  }

  ctrllr.removeItem = function(index){
    return ctrllr.found.splice(index,1);
  }
}

MenuSearchService.$inject = ['$http','searchURL'];
function MenuSearchService ($http, searchURL){
    var searchServ = this;
    searchServ.getMatchedMenuItems = function(searchTerm){
      return $http({
        method: "GET",
        url: (searchURL),
      }).then(function (result) {
        var menuitems = result.data.menu_items;
        var foundItems = [];
        for(var dish in menuitems){
          if (menuitems[dish].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
            foundItems.push(menuitems[dish]);
          }
        }
        return foundItems;
        if(searchTerm === ""){
          foundItems = [];
        }
      });
    }
}

})();
