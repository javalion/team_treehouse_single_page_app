{angular.module('app',["ngRoute"])
    .controller('RecipesController', function($location, dataService) {
        var self = this;
        self.gotoAddRecipe = function() {
            $location.url("/add/");
        }

        self.deleteRecipe = function(recipeId) {
            console.log("Deleting Recipe");
            dataService.deleteRecipe(recipeId, function(response){
                dataService.getRecipes(function(response) {
                    self.recipes = response.data;
                });
            });
        };

        self.recipeCategoryFilter = function(recipe) {
            console.log("Category: " + self.selectedCategory);
            if (self.selectedCategory = "") {return true;}
            return self.selectedCategory == recipe.category;
        };

        self.categoryFilter = function(recipe) {
            if (self.selectedCategory === "ALL") {
                return true;
            } else {
                return recipe.category === self.selectedCategory;
            }
        }

        dataService.getCategories(function(response) {
            self.categories = response.data;
        });

        dataService.getRecipes(function(response) {
           self.recipes = response.data;
        });

        self.selectedCategory = "ALL";
    })
    .controller('RecipeDetailController', function($scope, $location, dataService) {
        var self = this;
        function getRecipe(id) {
            dataService.getRecipe(id, function(response){
                self.recipe = response.data;
            });
        };

        self.addRecipeIngredient = function (recipe) {
            var ingredient = {"foodItem":"","condition":"","amount":""};
            recipe.ingredients.push(ingredient);
        };

        self.addRecipeStep = function (recipe) {
            var step = {"description":""};
            recipe.steps.push(step);
        };


        self.deleteRecipeIngredient = function (recipe, ingredientName) {
          for (i = 0; i < recipe.ingredients.length; i++) {
              var ingredient = recipe.ingredients[i];
              if (ingredient.foodItem === ingredientName) {
                recipe.ingredients.splice(i, 1);
                return;
              }
          }
        };

        self.deleteRecipeStep = function (recipe, step) {
            for (i = 0; i < recipe.steps.length; i++) {
                if (recipe.steps[i] === step) {
                    recipe.steps.splice(i, 1);
                    return;
                }
            }
        };

        self.saveRecipe = function(recipe){

            if (recipe._id !== undefined){
                dataService.updateRecipe(recipe, function(response){});
            }else {
                dataService.addRecipe(recipe, function(response) {});
            }

        };


        self.gotoHome = function() {
            $location.url('/');
        };

        dataService.getFoodItems(function(response){
            self.items = response.data;
        });


        dataService.getCategories(function(response) {
            self.categories = response.data;
        });

        var recipeId = $location.url().substr($location.url().lastIndexOf('/') + 1);
        if (recipeId && recipeId !== "add") {
             getRecipe(recipeId);
         } else {
            self.recipe = {"name":"","description":"","category":{"name":""},"prepTime":0,"cookTime":0,"ingredients":[],"steps":[]}
        }
    })
    .service('dataService', function($http) {
        this.baseURL = "http://localhost:5000/";
        this.getRecipes = function(callback)
        {
            $http.get(this.baseURL + "api/recipes")
                .then(callback);
        };
        this.getCategories = function(callback) {
            $http.get(this.baseURL + "api/categories")
                .then(callback);
        };

        this.getFoodItems = function(callback)
        {
            $http.get(this.baseURL + "api/fooditems")
                .then(callback);
        };
        this.getRecipesByCategory = function(category, callback)
        {
            $http.get(this.baseURL + "api/recipes?category=" + category)
                .then(callback);
        };
        this.getRecipe = function(id, callback)
        {
            $http.get(this.baseURL + "api/recipes/" + id)
                .then(callback);
        };
        this.updateRecipe = function(recipe, callback)
        {
            $http.put(this.baseURL + "api/recipes/" + recipe._id, recipe)
                .then(callback);
        };
        this.addRecipe = function(recipe, callback)
        {
            $http.post(this.baseURL + "api/recipes", recipe)
                .then(callback);
        };
        this.deleteRecipe = function(id, callback)
        {
            $http.delete(this.baseURL + "api/recipes/" + id)
                .then(callback);
        };
    })
;};