var app = angular.module("flapperNews", ['ui.router']);
app.controller("MainCtrl", ['$scope', 'posts', function($scope, posts){
	$scope.posts = posts.posts;

	$scope.addPost = function(){
	  if(!$scope.title || $scope.title === '') { return; }
	  posts.create({
	    title: $scope.title,
	    link: $scope.link,
	  });
	  $scope.title = '';
	  $scope.link = '';
	};
	$scope.incrementUpvotes = function(post){
		post.upvotes += 1;
	};
}]);

app.controller("PostsCtrl", ['$scope', '$stateParams', 'posts', function($scope, $stateParams, posts){
	$scope.post = posts.posts[$stateParams.id]

	$scope.addComment = function(){
		$scope.post.comments.push({
			author: 	$scope.user,
			body: 		$scope.body,
			upvotes: 	0
		})
		$scope.user = '';
		$scope.body = '';
	};

	$scope.incrementUpvotes = function(post) {
	  posts.upvote(post);
	};
}]);

app.factory("posts", ["$http", function($http){
	var o = {
		posts: []
	}
 	o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };
  o.create = function(post) {
	  return $http.post('/posts', post).success(function(data){
	    o.posts.push(data);
	  });
	};
	o.upvote = function(post) {
  	return $http.put('/posts/' + post._id + '/upvote')
	    .success(function(data){
	      post.upvotes += 1;
	    });
	};
	o.get = function(id) {
	  return $http.get('/posts/' + id).then(function(res){
	    return res.data;
	  });
	};
  return o;
}]);

app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
		  url: '/home',
		  templateUrl: '/home.html',
		  controller: 'MainCtrl',
		  resolve: {
		    postPromise: ['posts', function(posts){
		      return posts.getAll();
		    }]
		  }
		});

		.state('posts', {
		  url: '/posts/{id}',
		  templateUrl: '/posts.html',
		  controller: 'PostsCtrl',
		  resolve: {
		    post: ['$stateParams', 'posts', function($stateParams, posts) {
		      return posts.get($stateParams.id);
		    }]
		  }
		});
	$urlRouterProvider.otherwise('home');
}]);
