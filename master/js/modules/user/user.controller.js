(function() {
    angular.module('user', [])
        .controller('UserController', UserController);

    UserController.$inject = ['UserProfile'];

    function UserController(UserProfile) {
        this.vm = this;

        activate();

        function activate() {
            vm.user = UserProfile.fetchUserProfile();
            console.log(vm.user.username);
        }
    }
})();