import axios from 'axios';
import _ from 'lodash';

class UserService {

  // Pass the domain model for playlists. 
  constructor(User) {
    this.User = User;
  }

  find (id) {
    return this.User.find(id);
  }

  findAll () {
    return this.User.findAll();
  }

}

export default UserService;
